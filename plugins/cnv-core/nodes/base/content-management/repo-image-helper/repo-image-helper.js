module.exports = function(RED) {
    function RepoImageHelperConfig(config) {
        RED.nodes.createNode(this,config);
        
        this.img = config.img;
    }
    RED.nodes.registerType("repo-image-helper-config", RepoImageHelperConfig);
}