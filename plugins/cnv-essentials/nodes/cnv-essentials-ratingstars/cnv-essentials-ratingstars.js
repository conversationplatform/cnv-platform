module.exports = function (RED) {
    function RatingStars(config) {
      RED.nodes.createNode(this, config);
      this.on("input", function (msg, send, done) {
        const { feedbackCheckbox, buttonLabel, textLabel, store, delay } = config;
        const props = {
          feedbackCheckbox,
          buttonLabel,
          textLabel,
          delay: parseInt(delay, 10)
        };

        msg.websocket.setInteraction("cnv-essentials-ratingstars", props, this.id);
        msg.websocket.readText().then(function (answer) {
          const { rating, feedback } = JSON.parse(answer);

          msg.store[store] = {
            rating,
            feedback
          };
          msg.websocket.saveStore(msg.store)

          msg.websocket.sendUserMessage("Rating: " + rating, this.id);

          if(feedback){
            msg.websocket.sendUserMessage(textLabel + ": " + feedback, this.id);
          }

          send(msg);
          done();
        });
      });
    }
    RED.nodes.registerType("cnv-essentials-ratingstars", RatingStars);
  };

