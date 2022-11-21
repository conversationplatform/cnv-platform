module.exports = function (RED) {
    function footer(config) {
      RED.nodes.createNode(this, config);
      var node = this;
      this.on("input", function (msg, send, done) {
        let {links,articles,image} = JSON.parse(JSON.stringify(config));
        if(image && RED.nodes.getNode(image) && RED.nodes.getNode(image).imgSrc) {
          image = RED.nodes.getNode(image).imgSrc;
        } else {
          image = '';
        }
        const props = {
            image,
            links,
            articles
          };

        msg.websocket.setFooter("cnv-essentials-footer", props, node.id);
        send(msg);
        done();
      });
    }
    RED.nodes.registerType("cnv-essentials-footer", footer);
  };
