module.exports = function(RED) {
    function LottieHelperConfig(config) {
        RED.nodes.createNode(this,config);
        
    }
    RED.nodes.registerType("lottie-helper-config", LottieHelperConfig);
}