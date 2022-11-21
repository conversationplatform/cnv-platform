module.exports = function(RED) {
    function RepoThemeConfig(config) {
        RED.nodes.createNode(this,config);
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
        this['conversation-app-primary-color'] = config['conversation-app-primary-color'];
        this['conversation-app-primary-speech-bubble-color'] = config['conversation-app-primary-speech-bubble-color'];
        this['conversation-app-secondary-speech-bubble-color'] = config['conversation-app-secondary-speech-bubble-color'];
        this['conversation-app-primary-text-color'] = config['conversation-app-primary-text-color'];
        this['conversation-app-scroll-color'] = config['conversation-app-scroll-color'];
        this['conversation-app-rating-color'] = config['conversation-app-rating-color'];
        this['conversation-app-select-color'] = config['conversation-app-select-color'];
        this['conversation-app-gradient-color-1'] = config['conversation-app-gradient-color-1'];
        this['conversation-app-gradient-color-2'] = config['conversation-app-gradient-color-2'];
        this['conversation-app-font-family'] = config['conversation-app-font-family'];
        this['conversation-app-background-color'] = config['conversation-app-background-color'];
        this['conversation-app-button-color'] = config['conversation-app-button-color'];

        if(RED.nodes.getNode(config['image'])) {
            this['conversation-app-background-image'] = `url(${RED.nodes.getNode(config['image']).imgSrc || ''})`;
        } else {
            this['conversation-app-background-image'] = '';
        }
    }
    RED.nodes.registerType("repo-theme-config",RepoThemeConfig);
}