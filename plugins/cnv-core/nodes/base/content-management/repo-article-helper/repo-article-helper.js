module.exports = function(RED) {
    function RepoArticleHelperConfig(config) {
        RED.nodes.createNode(this,config);
    }
    RED.nodes.registerType("repo-articles-helper-config", RepoArticleHelperConfig);
}