module.exports = function (RED) {
  function Interact(config) {
    RED.nodes.createNode(this, config);
    this.on("input", function (msg, send, done) {
      const node = this;
      const { buttons, store, delay,userInputs, hasQuestion, question } = config;
      const props = {
        buttons,
        userInputs,
        store,
        delay: parseInt(delay, 10)
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

        msg.websocket.sendText("cnv-essentials-sendtext", data, node.id);
        msg.websocket.sendQuestion("cnv-essentials-interact", question, node.id);
      }

      msg.websocket.setInteraction("cnv-essentials-interact", props, this.id);
      msg.websocket.readText().then(function (answer) {
        var parsed = JSON.parse(answer);
        const values = parsed.values;

        msg.store[store] = values;
        msg.websocket.saveStore(msg.store)


        const inputs = Object.keys(values).filter(key => { return key != 'button'});
        if(inputs.length > 0) {
          let out = '';
          inputs.forEach(key => {
            out += `* **${key}**: ${values[key]}
`
          })
          msg.websocket.sendUserMessage(out, node.id);
          msg.websocket.sendAnswer('cnv-essentials-interact', out, node.id)
        }
        else {
          msg.websocket.sendUserMessage(values.button, node.id);
          msg.websocket.sendAnswer('cnv-essentials-interact', values.button, node.id)
        }
        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("cnv-essentials-interact", Interact);
};

