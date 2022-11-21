module.exports = function (RED) {
  function SingleSelect(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      const node = this;
      const { delay, store, buttonLabel, useOptionsFromMessage, hasQuestion, question } = config;
      let options = [];
      options = useOptionsFromMessage ? msg.options : config.options;

      const props = {
        options,
        delay,
        store,
        buttonLabel
      };

      if (hasQuestion && question) {
        const data = {
          text: question,
          delay: parseInt(delay, 10) < 1 ? 1 : parseInt(delay, 10),
          animation: '',
          isFirst: false,
          isDisclaimer: false,
          disclaimerLink: ""
        };

        msg.websocket.sendText("text", data, node.id);
        msg.websocket.sendQuestion("cnv-essentials-singleselect", question, node.id);
      }

      msg.websocket.setInteraction("cnv-essentials-singleselect", props, this.id);

      msg.websocket.readText().then(function (answer) {

        const parsed = JSON.parse(answer);
        const value = parsed.value;

        msg.store[store] = value;
        msg.websocket.saveStore(msg.store)
        msg.websocket.sendUserMessage(value, this.id);
        msg.websocket.sendAnswer("cnv-essentials-singleselect", value, node.id);

        send(msg);
        done();
      });


    });
  }
  RED.nodes.registerType("cnv-essentials-singleselect", SingleSelect);
};
