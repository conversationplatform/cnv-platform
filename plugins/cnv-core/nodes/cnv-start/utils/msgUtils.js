const createPromise = (ws) => {
    return new Promise((resolve, reject) => {
        const subscription = ws.$handlerMessage.subscribe(
            res => {
                subscription.unsubscribe();
                resolve(res.data);

            },
            err => {
                subscription.unsubscribe();
                reject(err.data);
            }
        );

    });
};

const checkForVariables = function (text) {
    let result;
    do {
        result = (new RegExp(/[$]{.+?}/g)).exec(text);

        if (result) {
            text = text.replace(result[0], eval(result[0].substring(2, result[0].length - 1)));
        }
    } while (result)
    return text;
}

const msgWebsocket = (ws) => {
    return {
        setFooter: function (name, props, nodeId) {
            ws.send(
                JSON.stringify({
                    nodeId,
                    type: "footer",
                    name: name,
                    props: props,
                })
            );
        },
        sendText: function (name, props, nodeId) {
            props.text = checkForVariables(props.text);
            ws.send(
                JSON.stringify({
                    nodeId,
                    type: "text",
                    props,
                    name,
                })
            );
        },
        sendQuestion: function (nodeName, value, nodeId) {
            ws.send(
                JSON.stringify({
                    type: "question",
                    nodeId,
                    nodeName,
                    value
                })
            );
        },
        sendAnswer: function (nodeName, value, nodeId) {
            ws.send(
                JSON.stringify({
                    type: "answer",
                    nodeId,
                    nodeName,
                    value
                })
            );
        },
        setInteraction: function (name, props, nodeId) {
            ws.send(
                JSON.stringify({
                    nodeId,
                    type: "interaction",
                    name: name,
                    props: props,
                })
            );
        },
        sendUserMessage: function (text, nodeId) {
            ws.send(
                JSON.stringify({
                    nodeId,
                    type: "usermessage",
                    props: {
                        text,
                        delay: 0,
                    },
                })
            );
        },
        sendDisableTrackService: function (text) {
            ws.send(
                JSON.stringify({
                    type: "disableTrackService",
                    props: {
                        text,
                        delay: 0,
                    },
                })
            );
        },
        sendDisableTrackMatomoService: function (text) {
            ws.send(
                JSON.stringify({
                    type: "disableTrackMatomoService",
                    props: {
                        text,
                        delay: 0,
                    },
                })
            );
        },
        sendStart: function (nodeId) {
            ws.send(
              JSON.stringify({
                nodeId,
                type: "startNode"
              })
            );
          },
        sendEnd: function (nodeId) {
            ws.send(
              JSON.stringify({
                nodeId,
                type: "endNode"
              })
            );
          },
        setOverlay: function (name, props, nodeId) {
            ws.send(
                JSON.stringify({
                    nodeId,
                    type: "overlay",
                    name: name,
                    props: props,
                })
            );
        },
        readText: function () {
            return createPromise(ws);
        },
        readComponent: function () {
            return createPromise(ws);
        },
        saveStore: function (data) {
            const command = JSON.stringify({
                type: "store",
                data
            })
            ws.send(
                command
            );
        }
    }
}

module.exports = {
    msgWebsocket
}
