module.exports = function(RED) {
    function PrivacyPolicyConfig(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name;
        this.welcome = config.welcome;
        this.privacyPolicy = config.privacyPolicy;

        const globalContext = this.context().global;

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
    RED.nodes.registerType("repo-privacy-policy-config", PrivacyPolicyConfig);
}
