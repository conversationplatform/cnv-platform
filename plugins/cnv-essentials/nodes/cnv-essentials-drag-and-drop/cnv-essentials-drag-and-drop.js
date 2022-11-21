module.exports = function (RED) {
  function DragAndDrop(config) {
    RED.nodes.createNode(this, config);

    this.on('input', function (msg, send, done) {
      const { options, delay, store, buttonLabel, hasQuestion, question, inputType} = config;
      const props = {
        options,
        delay,
        store,
        buttonLabel
      };

      let items = options

      switch (inputType) {
        case 'STATIC':
          items = items.map(item => {
            if (item && item.icon && RED.nodes.getNode(item.icon) && RED.nodes.getNode(item.icon).imgSrc) {
              item.icon = RED.nodes.getNode(item.icon).imgSrc;
            } else {
              item.icon = '';
            }
            return item;
          });
          break;
        case 'MULTISELECT':
          items = msg.selectedOptions && msg.selectedOptions.length > 0 ?
              msg.selectedOptions.map(option => { return { name: option }; }) :
              [];
          break;
        default:
          items = [];
          break;
      }

      props.options = items

      if (items.length === 1) {
        const json = items[0].name;

        msg.store[store] = [json];
        msg.websocket.saveStore(msg.store)

        send(msg);
        done();
        return;
      }

      if (hasQuestion && question) {
        const data = {
          text: question,
          delay: parseInt(config.delay, 10) < 1 ? 1 : parseInt(config.delay, 10),
          animation: '',
          isFirst: false,
          isDisclaimer: false,
          disclaimerLink: ''
        };

        msg.websocket.sendText('text', data, this.id);
        msg.websocket.sendQuestion('cnv-essentials-drag-and-drop', question, this.id);
      }

      msg.websocket.setInteraction('cnv-essentials-drag-and-drop', props, this.id);
      msg.websocket.readText().then(function (answer) {
        const parsed = JSON.parse(answer);
        if (inputType === 'MULTISELECT') msg.selectedOptions = parsed;

        const userMessageText = parsed.map((el, i) => `+ ${i + 1}. ${el}`);

        msg.websocket.sendUserMessage(userMessageText.join('\n'), this.id);
        msg.websocket.sendAnswer('cnv-essentials-drag-and-drop', parsed.values, this.id);

        msg.store[store] = parsed.values;
        msg.websocket.saveStore(msg.store)

        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType('cnv-essentials-drag-and-drop', DragAndDrop);
};
