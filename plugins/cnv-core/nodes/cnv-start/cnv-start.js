const WebSocket = require("ws");
const Rx = require("rxjs");
const Utils = require("./utils");
const { MessageFactoryBuilder } = require("./utils");

const websocketHandler = function (wss, node, RED, globalContext, config) {
    wss.on("connection", function (ws) {
        ws.$handlerMessage = new Rx.Subject();
        let msg = MessageFactoryBuilder(ws);
        msg.websocket.sendStart(node.id);
        Rx.fromEvent(ws, "message").subscribe((res) => {
            Utils.handleMessageEvent(RED, globalContext, ws, res);
        });

        node.send(msg);
    });
};

const startServer = function (node, registry) {
    node.log("Starting Server on port 8080");
    const http = require("http");
    const url = require("url");

    const requestListener = function (req, res) {
        res.writeHead(200);
        res.end("Good Bye");
    };

    const server = http.createServer(requestListener);
    server.listen(8080);

    server.on("upgrade", function upgrade(request, socket, head) {
        const pathname = url.parse(request.url).pathname;
        if (registry[pathname]) {
            registry[pathname].wss.handleUpgrade(request, socket, head, function done(ws) {
                setTimeout(() => {
                    registry[pathname].wss.emit("connection", ws);
                }, 500);
            });
        } else {
            socket.destroy();
        }
    });

    return server;
};

module.exports = function (RED) {
    function ConversationInit(config) {
        RED.nodes.createNode(this, config);

        RED.httpAdmin.get("/current_flows", RED.auth.needsPermission("flows.read"), async (req, res) => {
            res.json(Object.keys(globalContext.registry));
        });

        RED.httpAdmin.get("/getTheme", RED.auth.needsPermission("flows.read"), async (req, res) => {
            const flowId = req.query.flowId;
            const theme = globalContext.registry[flowId]?.theme;
            if (flowId && theme) {
                const theme = RED.nodes.getNode(globalContext.registry[flowId].theme);
                let props = {};
                Object.keys(theme)
                    .filter((key) => key.indexOf("conversation-app") > -1)
                    .forEach((key) => (props[`--${key}`] = theme[key]));

                res.json(props);
            } else {
                res.json({});
            }
        });

        RED.httpAdmin.get("/getPrivacyPolicy", RED.auth.needsPermission("flows.read"), async (req, res) => {
            const flowId = req.query.flowId;
            const privacyPolicy = globalContext.registry[flowId]?.privacyPolicy;
            if(privacyPolicy) {
              const pp = RED.nodes.getNode(privacyPolicy);
              if(pp) {
                res.json({
                  welcome: pp.welcome,
                  privacyPolicy: pp.privacyPolicy
                });
                return;
              }

            }
            res.send(404, 'not found')
        });

        var node = this;
        var path = config.path;
        var globalContext = node.context().global;

        node.log(`Starting instance: ${config.path}`);

        if (!globalContext.server) {
            globalContext.registry = {};
            globalContext.server = startServer(node, globalContext.registry);
        }
        var wss = new WebSocket.Server({ noServer: true });
        globalContext.registry[path] = { wss, theme: config.theme, privacyPolicy: config.privacyPolicy };
        websocketHandler(wss, node, RED, globalContext, config);
    }

    RED.nodes.registerType("cnv-start", ConversationInit);
};
