module.exports = function (RED) {
  function SendText(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      let data = {
        text: config.text,
        video: config.video,
        delay: parseInt(config.delay, 10),
        animation: RED.nodes.getNode(config.animation) ? RED.nodes.getNode(config.animation).animation : '',
        isDisclaimer: config.isDisclaimer,
        disclaimerLink: config.disclaimerLink
      };
      if(config.useOptionsFromMessage){
        data.text = msg.options;
      }
      msg.websocket.sendText("cnv-essentials-sendtext", data, this.id);
      send(msg);
      done();
    });
  }
  RED.nodes.registerType("cnv-essentials-sendtext", SendText);
};
