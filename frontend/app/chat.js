import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Widget,
  addUserMessage,
  renderCustomComponent,
  renderInteractionComponent,
  renderOverlayComponent,
  showOverlayComponent,
  renderFooterComponent,
  toggleWidget
} from "./core";

let ui = {
  Widget,
  addUserMessage,
  renderCustomComponent,
  renderInteractionComponent,
  renderOverlayComponent,
  showOverlayComponent,
  renderFooterComponent,
  toggleWidget
};

import defaultBackground from "./img/bg.png";

import { scrollToBottom } from "./utils/scrollToBottom";

import { ConnectionHandler } from "./utils/connectionHandler";
import { Tasker } from "./utils/tasker";

import { handleOverlayNavbar } from "./utils/overlayHandler";
import ErrorBoundary from "./widgets/components/ErrorBoundary";

import "./core/src/components/Widget/style.scss";

import "./chat.scss";
import Empty from "./components/Empty";
import Logger from "./components/Logger";
import Restart from "./components/Restart";
import Cookie from "./components/Cookie";

import Cookies from "universal-cookie";
import { openWidget } from "./core/src/store/dispatcher";

const cookies = new Cookies();

window.React$4 = React;


export default class ConversationApp extends HTMLElement {
  host;
  flowId;
  widthThreshold;
  isOpen = true;
  top;
  bottom;
  left;
  right;
  connection;
  tasker;
  cookieSIDName;
  widgets = [];
  customCSS;

  constructor() {
    super();

    this.setAttribute("id", "dialog");

    this.flowId = this.getAttribute("flow-id");

    this.host = this.getAttribute("host");

    this.widthThreshold = +this.getAttribute("width-threshold");

    
    this.top = this.getAttribute("top");
    this.bottom = this.getAttribute("bottom");
    this.left = this.getAttribute("left");
    this.right = this.getAttribute("right");

    this.isOpen = this.getAttribute("isOpen") ? this.getAttribute("isOpen") == 'true' : true;

    if (
      this.host &&
      this.host.length > 0 &&
      this.flowId &&
      this.flowId.length > 0
    ) {
      this.start();
    }
  }

  handleCMSImages(connection) {
    document.querySelectorAll('img[src^="cnv-image/"]').forEach((img) => {
      connection.send(
        JSON.stringify({
          type: "cnv-image",
          name: img.src,
        })
      );
    });
  }

  scheduleTask(data) {
    if (data.type === "cnv-image") {
      // needs to be executed immediately
      document
        .querySelectorAll(`img[src^="cnv-image/${data.props.name}"]`)
        .forEach((img) => {
          img.src = data.props.imgSrc;
        });
      return;
    }
    
    this.tasker.scheduleTask(data);
  }

  getWidget(name) {
    const widget = this.widgets[name];
    if (!widget) {
      const props = {
        error: `Widget ${name} not found`,
        message: "Ensure this widget is imported into your application.",
      };
      return (data) => Logger(props);
    }
    return widget;
  }

  async start(host = this.host, flowId = this.flowId, isOpen = this.isOpen, widthThreshold = this.widthThreshold ) {
    if(this.widthThreshold && window.innerWidth < this.widthThreshold) {
      this.isOpen = false;
    }
    this.setRenderPosition();

    this.connection = new ConnectionHandler(
      host,
      flowId,
      (data) => {
        this.scheduleTask(data);
      },
      true
    );

    this.connection
      .getTheme()
      .then((customCSS) => {
        this.customCSS = customCSS;
      })
      .catch((error) => console.error(error));

    const interactionType = {
      text: ({ type, name, props }) => {
        renderCustomComponent(this.getWidget(name), props, true);
        this.handleCMSImages(this.connection);
        scrollToBottom();
      },
      interaction: ({ type, name, props }) => {
        showOverlayComponent(false);
        renderInteractionComponent(this.getWidget(name), props);
        scrollToBottom();
      },
      usermessage: ({ type, name, props }) => {
        addUserMessage(props.text);
        scrollToBottom();
      },
      overlay: ({ type, name, props }) => {
        showOverlayComponent(true);
        renderOverlayComponent(this.getWidget(name), props);
        handleOverlayNavbar(name);
      },
      footer: ({ type, name, props }) => {
        renderFooterComponent(this.getWidget(name), props);
      },
      disableTrackService: ({ type, name, props }) => {
        connection.disableTracking();
      }
    };

    this.tasker = new Tasker(this.connection, interactionType, (data) =>
      this.tasker.scheduleTask({
        type: "text",
        name: "logger",
        props: {
          error: data,
          message: "Please contact support.",
          delay: 0,
        },
      })
    );

    this.widgets = {
      logger: (props) => {
        return <Logger {...props} connection={this.connection} />;
      },
      empty: (props) => {
        return <Empty {...props} connection={this.connection} />;
      },
      text: (props) => {
        return <h1>{props.text}</h1>;
      },
      restart: (props) => {
        return <Restart {...props} connection={this.connection} />;
      },
    };

    let plugins = await this.connection.getWidgetProviders();

    if (plugins.length > 0) {
      for (let plugin of plugins) {
        if (plugin && plugin.widgetsProvider) {
          this.widgets = Object.assign(
            this.widgets,
            plugin.widgetsProvider(this.connection, ui)
          );
        } else {
          console.error(
            `plugin ${plugin} is not available or doesn't export widgetProvider`
          );
        }
      }
    }

    const acceptedCookies = cookies.get(process.env.COOKIE_ACCEPTS_NAME);
    const privacyPolicy = await this.connection.getPrivacyPolicy();
    
    if (privacyPolicy && acceptedCookies !== "true") {
      showOverlayComponent(true);
      renderOverlayComponent((props) => {
        return (
          <Cookie
            {...privacyPolicy}
            alreadyRejected={acceptedCookies === "false"}
            onAccept={async () => {
              cookies.set(process.env.COOKIE_ACCEPTS_NAME, true);

              showOverlayComponent(false);
              await this.connection.fetchSessionAndConnect(true);
            }}
            onReject={() => {
              cookies.set(process.env.COOKIE_ACCEPTS_NAME, false);
              this.connection.fetchSessionAndConnect(false);
            }}
          />
        );
      }, {});
    } else {
      await this.connection.fetchSessionAndConnect(true);
    }

    function App(props) {
      const handleNewUserMessage = function (newMessage) {
        props.connection.send(newMessage);
      };

      const interceptClickEvent = (e) => {
        let href;
        const target = e.target || e.srcElement;
        if (target.tagName === "A") {
          e.preventDefault();
          href = target.getAttribute("href");
          target.target = "_blank";

          if (href.indexOf("http") > -1) {
            window.open(href, target.target);
            return;
          } else {
            e.preventDefault();
            props.connection.send(
              JSON.stringify({
                type: "glossary",
                name: href,
              })
            );
          }
        }
      };

      useEffect(() => {
        if(props.isOpen) {
          openWidget();
        }
      }, []);

      return (
        <div className="App" onClick={interceptClickEvent}>
          <style>
            {props.customCSS}
          </style>
          <ErrorBoundary>
            <Widget
              handleNewUserMessage={handleNewUserMessage}
              title=""
              subtitle=""
              showInteraction={true}
              showSender={false}
              showTimeStamp={false}
              showFooter={true}
            />
          </ErrorBoundary>
        </div>
      );
    }

    ReactDOM.render(
      <App connection={this.connection} isOpen={this.isOpen} customCSS={this.customCSS}/>,
      document.querySelector("conversation-app#dialog")
    );
  }


  setRenderPosition() {
    if(this.top) {
      this.setDialogCssProperty('top', this.top);
    }
    if(this.bottom) {
      this.setDialogCssProperty('bottom', this.bottom);
    }
    if(this.left) {
      this.setDialogCssProperty('left', this.left);
    }
    if(this.right) {
      this.setDialogCssProperty('right', this.right);
    }
  }

  setDialogCssProperty(key, value) {
    document
        .querySelector("conversation-app#dialog")
        .style.setProperty(key, value)
  }
}

customElements.define("conversation-app", ConversationApp);
