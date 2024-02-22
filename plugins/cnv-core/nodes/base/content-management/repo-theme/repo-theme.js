module.exports = function (RED) {
  function RepoThemeConfig(config) {
    RED.nodes.createNode(this, config);
    var globalContext = this.context().global;

    if (globalContext[this.type] == null) {
      globalContext[this.type] = [];
    }

    let store = globalContext[this.type];

    let currentStoreValue = store.filter((data) => data.id == config.id);

    if (currentStoreValue.length > 0) {
      store.splice(store.indexOf(currentStoreValue[0]), 1);
    }

    store.push(config);
    const customCSSVars = [];

    Object.keys(config)
      .filter(
        (k) => k.includes('conversation-app') && !k.includes('custom-css')
      )
      .forEach((key) => {
        customCSSVars.push(`--${key}: ${config[key]};`);
      })

    if (RED.nodes.getNode(config['image'])) {
      const imgSrc = RED.nodes.getNode(config['image']).imgSrc || '';
      customCSSVars.push(`--conversation-app-background-image: url(${imgSrc})`);
    }

    const customCSS = ['.App {', ...customCSSVars, '}'];
    customCSS.push(config['conversation-app-custom-css']);

    this.customCSS = customCSS.join('\n');
  }
  RED.nodes.registerType('repo-theme-config', RepoThemeConfig)
}
