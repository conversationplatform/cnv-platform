module.exports = function (RED) {
  function Carousel(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      let { buttontext, buttonType, slides } = JSON.parse(JSON.stringify(config));

      switch (config.inputType) {
        case "STATIC":

          for (let slide of slides) {
            slide["carouselType"] = slide.isProduct;
            if (slide.isProduct === "PRODUCT") {
              slide["items"] = slide.text
                ? slide.text.split(/\r?\n/).filter(item => item.trim())
                : [];
            }
          }
          break;
        case "SORTED":
          slides =
            msg.selectedOptions && msg.selectedOptions.length > 0
              ? msg.selectedOptions.map((item) => {
                  const foundSlide = config.slides.find(
                    (slide) => slide.name === item.name
                  );

                  if (!foundSlide) {
                    return;
                  }
                  return {
                    name: item.name,
                    headline: foundSlide.headline || item.name,
                    title: foundSlide.title || item.name,
                    text: foundSlide.text || item.name,
                    badge: foundSlide.badge || "",
                    image: foundSlide.image || "",
                    isProduct: "NORMAL",
                    carouselType: "NORMAL",
                    continueUrl: foundSlide.continueUrl
                  };
                })
              : [];
          break;
        default:
          slides = [];
          break;
      }

      slides = slides.map(slide => {

        if(slide.image && RED.nodes.getNode(slide.image) && RED.nodes.getNode(slide.image).imgSrc) {
          slide.image = RED.nodes.getNode(slide.image).imgSrc;
        } else {
          slide.image = '';
        }

        if(slide.badge && RED.nodes.getNode(slide.badge) && RED.nodes.getNode(slide.badge).imgSrc) {
          slide.badge = RED.nodes.getNode(slide.badge).imgSrc;
        } else {
          slide.badge = '';
        }
        return slide;
      })

      const props = {
        slides,
        buttonText: buttontext,
        buttonType,
        delay: parseInt(config.delay, 10),
      };

      msg.websocket.setInteraction("cnv-essentials-carousel", props, this.id);
      msg.websocket.readText().then(function (answer) {
        msg.answer = answer;

        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("cnv-essentials-carousel", Carousel);
};
