module.exports = function (RED) {
    function RatingStars(config) {
      RED.nodes.createNode(this, config);
      this.on("input", function (msg, send, done) {
        const { feedbackCheckbox, buttonLabel, textLabel, store, delay } = config;
        const props = {
          feedbackCheckbox,
          buttonLabel,
          textLabel,
          store,
          delay: parseInt(delay, 10)
        };

        msg.websocket.setInteraction("cnv-essentials-ratingstars", props, this.id);
        msg.websocket.readText().then(function (answer) {
          var parsed = JSON.parse(answer);
          const values = parsed.values;

          msg.store[store] = values;
          msg.websocket.saveStore(msg.store)

          msg.websocket.sendUserMessage("Rating: " + values.rating, this.id);
          if(values[textLabel]){
            msg.websocket.sendUserMessage(textLabel + ": " + values[textLabel], this.id);
          }

          send(msg);
          done();
        });
      });
    }
    RED.nodes.registerType("cnv-essentials-ratingstars", RatingStars);
  };

