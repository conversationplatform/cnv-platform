module.exports = function(RED) {
    function RepoArticleConfig(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name;
        this.title = config.title;
        this.text = config.text;
        this.image = config.image;
        this.showAsGlossary = config.showAsGlossary;
        this.showAsMenu = config.showAsMenu;
        this.showAsOverlay = config.showAsOverlay;

        var globalContext = this.context().global;

        if(globalContext[this.type] == null) {
            globalContext[this.type] = [];
        }

        let store = globalContext[this.type];

        let currentStoreValue = store.filter((data) => data.id == config.id);
        
        if(currentStoreValue.length > 0) {
            store.splice(store.indexOf(currentStoreValue[0]), 1);
        }
        
        store.push(config);
    }
    RED.nodes.registerType("repo-article-config", RepoArticleConfig);
}