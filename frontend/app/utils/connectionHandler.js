import io from "socket.io-client";
import axios from "axios";

const RECONNECT_TIMEOUT = 120000;
class ConnectionHandler {
  client;
  path;
  host;
  useCredentials;
  onmessagecb; // cb
  history;
  reconnectTimeout;
  constructor(host, path, onmessagecb) {
    console.log("connection handler");

    if (!onmessagecb) {
      console.warn("please define onmessagecb");
    }

    this.path = path;
    this.host = host;
    this.useCredentials = true;
    this.onmessagecb = onmessagecb;
    this.onmessagecb.bind(this);
    this.history = [];
    this.reconnectTimeout = null;
  }

  async fetchSessionAndConnect(allowTracking = true) {
    const proceed = await axios.get(`${this.host}/api/v1/session/activate`, {
      withCredentials: this.useCredentials,
      params: {
        flowId: this.path,
      },
    });
    this.handleConnect(proceed.data.tid);
    if (!allowTracking) {
      this.disableTracking();
    }
  }

  async getTheme() {
    const flowIdPath = this.path.replace("/", "%2F");
    const theme = await axios.get(
      `${this.host}/api/v1/nodered/theme/${flowIdPath}`,
      {
        withCredentials: this.useCredentials,
      }
    );
    return theme.data;
  }

  async getWidgetProviders() {
    const { data } = await axios.get(
      `${this.host}/api/v1/nodered/widgetProviders`
    );
    if (data.widgets.length == 0) {
      return [];
    }
    return Promise.all(
      data.widgets.map((widget) => this.loadWidgetProvider(data.version, widget))
    );
  }

  async loadWidgetProvider(version, widget) {
    return new Promise((resolve) => {
        console.log("loading widget", widget);
        const script = document.createElement("script");
        script.type = "module";
        script.async = false;
        script.src = `${this.host}/api/v1/nodered/widgetProvider/${version}?widget=${widget}`;
        document.head.append(script);
        script.addEventListener('load', () => {
            resolve(window[widget])
        })
    })
    
  }

  async getPrivacyPolicy() {
    const flowIdPath = this.path.replace("/", "%2F");
    const privacypolicy = await axios.get(
      `${this.host}/api/v1/nodered/privacypolicy/${flowIdPath}`,
      {
        withCredentials: this.useCredentials,
      }
    );
    return privacypolicy.data;
  }

  async disableTracking() {
    const proceed = await axios.get(`${this.host}/api/v1/session/deactivate`, {
      withCredentials: this.useCredentials,
    });
  }

  handleConnect(tid) {
    const _this = this;
    const path = `${this.host}${this.path}`;

    this.client = io(path, {
      transports: ["websocket", "polling"],
      query: {
        tid,
      },
    });

    this.client.on("connect", () => {
      clearTimeout(this.reconnectTimeout);

      if (this.history.length > 0) {
        this.history.forEach(function (data, idx, arr) {
          _this.client.send(data);
          if (idx == arr.length - 1) {
            _this.history = [];
          }
        });
      }
    });

    this.client.on("disconnect", () => {
      this.reconnectTimeout = setTimeout(() => {
        this.client.disconnect();
        this.onmessagecb({
          type: "text",
          name: "logger",
          props: {
            error: "Disconnected",
            message:
              "You have been disconnected due to network issues or inactivity",
            delay: 0,
          },
        });
        this.onmessagecb({
          type: "interaction",
          name: "restart",
          props: {
            delay: 0,
          },
        });
      }, RECONNECT_TIMEOUT);
    });
    this.client.on("error", (err) => {
      console.log("err", err); // false
    });

    this.client.on("connect_error", (err) => {
      console.warn(`...connect_error due to ${err}`, err);
    });

    this.client.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        _this.onmessagecb(data);
      } catch (e) {
        console.error(e);
      }
    });
  }

  restart() {
    this.onmessagecb({
      type: "interaction",
      name: "empty",
      props: {
        delay: 0,
      },
    });

    this.fetchSessionAndConnect();
  }

  send(data) {
    if (this.client && this.client.connected) {
      this.client.send(data);
    } else {
      this.history.push(data);
    }
  }

  sendEvent(nodeId, widgetName, description) {
    this.send(
      JSON.stringify({
        type: "event",
        nodeId: nodeId,
        nodeName: widgetName,
        value: description,
      })
    );
  }
}

export { ConnectionHandler };
