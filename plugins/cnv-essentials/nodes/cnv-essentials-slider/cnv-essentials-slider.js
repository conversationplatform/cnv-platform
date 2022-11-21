module.exports = function (RED) {
  function Slider(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      const node = this;
      let { sliders, button, image, store, hasQuestion, question } = JSON.parse(JSON.stringify(config));

      if (image && RED.nodes.getNode(image) && RED.nodes.getNode(image).imgSrc) {
        image = RED.nodes.getNode(image).imgSrc;
      } else {
        image = '';
      }

      const props = {
        image,
        sliders,
        button,
        store
      };

      if (hasQuestion && question) {
        const data = {
          text: question,
          delay: parseInt(config.delay, 10) < 1 ? 1 : parseInt(config.delay, 10),
          animation: '',
          isFirst: false,
          isDisclaimer: false,
          disclaimerLink: ""
        };

        msg.websocket.sendText("text", data, node.id);
        msg.websocket.sendQuestion("cnv-essentials-slider", question, node.id);
      }

      msg.websocket.setInteraction("cnv-essentials-slider", props, this.id);
      msg.websocket.readText().then(function (answer) {

        const obj = JSON.parse(answer);
        let userMessageText = []
        let storeValues = {};
        for (var i = 0; sliders.length - 1 >= i; i++) {
          userMessageText[i] = `+ ${sliders[i].headline}: ${obj.values[i]}${sliders[i].simbol} `

          storeValues[`slider${i+1}`] = obj.values[i];
        }

        msg.store[store] = storeValues;
        msg.websocket.saveStore(msg.store)
        msg.websocket.sendUserMessage(userMessageText.join('\n'), this.id);
        msg.websocket.sendAnswer("cnv-essentials-slider", userMessageText, node.id);

        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("cnv-essentials-slider", Slider);
};
