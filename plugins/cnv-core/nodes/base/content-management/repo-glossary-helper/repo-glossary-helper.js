module.exports = function(RED) {
    function RepoGlossaryHelperConfig(config) {
        RED.nodes.createNode(this,config);
        
        this.img = config.img;
    }
    RED.nodes.registerType("repo-glossary-helper-config", RepoGlossaryHelperConfig);
}