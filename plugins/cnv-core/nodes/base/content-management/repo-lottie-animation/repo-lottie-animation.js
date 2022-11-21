module.exports = function(RED) {
    function LottieAnimationConfig(config) {
        RED.nodes.createNode(this,config);

        this.animation = config.animation; 

    }
    RED.nodes.registerType("lottie-animation-config",LottieAnimationConfig);
}