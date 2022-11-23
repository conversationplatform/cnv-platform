module.exports = function (RED) {
  function MultiSelect(config) {
    RED.nodes.createNode(this, config);
    this.on("input", function (msg, send, done) {
      const { options, delay, store, buttonLabel, hasQuestion, question} = config;
      const props = {
        options,
        delay,
        store,
        buttonLabel
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

        msg.websocket.sendText("cnv-essentials-sendtext", data, this.id);
        msg.websocket.sendQuestion("cnv-essentials-multiselect", question, this.id);
      }

      msg.websocket.setInteraction("cnv-essentials-multiselect", props, this.id);
      msg.websocket.readText().then(function (answer) {

        const parsed = JSON.parse(answer);
        const values = parsed.values.sort();
        msg.store[store] = values;
        msg.websocket.saveStore(msg.store)
        msg.websocket.sendUserMessage(values.sort().reduce((a,b) => `${a}, ${b}`), this.id);

        const userAnswer = values.sort().reduce((a,b) => `${a}, ${b}`);
        msg.websocket.sendAnswer("cnv-essentials-multiselect", userAnswer, this.id);

        msg.selectedOptions = values;

        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("cnv-essentials-multiselect", MultiSelect);
};
