module.exports = function (RED) {
  function SplashScreen(config) {
    RED.nodes.createNode(this, config);
    this.on("input", function (msg, send, done) {
      const { title, delay, links, textButton } = config;
      const image =  RED.nodes.getNode(config.image) ? RED.nodes.getNode(config.image).imgSrc : '';
      const props = {
        title,
        image,
        links,
        textButton,
        delay: parseInt(delay, 10)
      };

      msg.websocket.setOverlay("cnv-essentials-splashscreen", props, this.id);
      msg.websocket.readText().then(function (answer) {
        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("cnv-essentials-splashscreen", SplashScreen);
};
