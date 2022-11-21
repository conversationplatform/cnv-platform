const { parseJson } = require('./jsonUtils')
const { msgWebsocket } = require('./msgUtils');

const MessageFactoryBuilder = (ws) => {
    const msg = {
        websocket: msgWebsocket(ws),
        store: {},
        setStore: (name, data) => {
            msg.store[name] = data;
            msg.websocket.saveStore(msg.store)
        },
        getStore: (name) => {
            return msg.store[name] || null;
        }
    };
    return msg;
}

const handleTheme = (RED, node, config, ws) => {
    let props = {};
    if (config.theme && RED.nodes.getNode(config.theme)) {
        const theme = RED.nodes.getNode(config.theme);
        Object.keys(theme).filter(key => key.indexOf('conversation-app') > -1).forEach(key => props[`--${key}`] = theme[key]);
        ws.send(JSON.stringify({
            type: 'themeOptions',
            props
        }));
    } else {
        node.log("no theme provided")
    }
}

const handleMessageEvent = (RED, globalContext, ws, res) => {
    let jsonData = parseJson(res.data);

    switch (jsonData.type) {
        case 'glossary':
            let glossary;
            if (globalContext['repo-article-config']?.length) {
                glossary = globalContext['repo-article-config'].filter((g => g.name == jsonData.name));
            }

            if (glossary && glossary.length > 0) {
                const { title, text, image } = glossary[0];
                ws.send(JSON.stringify({
                    type: 'overlay',
                    name: 'glossary',
                    props: {
                        image: RED.nodes.getNode(image) ? RED.nodes.getNode(image).imgSrc || '' : '',
                        title: title,
                        text: text
                    }
                }));
            }
            break;
        case 'cnv-image':
            let img;
            if (globalContext['repo-image-config']?.length) {
                img = globalContext['repo-image-config'].filter(i => {

                    return i.name == jsonData.name.split('cnv-image/')[1]
                });
            }
            if (img && img.length > 0) {
                const { type, name, description, imgSrc } = img[0];

                ws.send(JSON.stringify({
                    type: 'cnv-image',
                    name: jsonData.name,
                    props: {
                        imgSrc: imgSrc,
                        name: name,
                        type: type,
                        description: description,
                    }
                }));

            }
            break;

        case 'cookie':
            if (!msg.cookie)
                msg.cookie = {}
            msg.cookie = { ...msg.cookie, ...jsonData.props };
            break;
        default:
            ws.$handlerMessage.next(res);

    }
}

module.exports = {
    parseJson,
    MessageFactoryBuilder,
    handleTheme,
    handleMessageEvent
}