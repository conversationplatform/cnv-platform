module.exports = function(RED) {
    function TrackService(config) {
        RED.nodes.createNode(this,config);
        
        this.on("input", function (msg, send, done) {
            let store = msg[config.store];

            let tmpStore = {}

            if(Array.isArray(store)) {
                store.forEach(s => {
                    tmpStore[s.store] = true;
                })
            }
            msg[config.store] = store = tmpStore;
            
            if(config.storeTrackDisableMandatoryOption && !store[config.storeTrackDisableOption]){
                msg.websocket.sendDisableTrackService("");
            }

            if(config.storeMatomoDisableMandatoryOption && !store[config.storeMatomoDisableOption]) {
                msg.websocket.sendDisableTrackMatomoService("");
            }
           
            send(msg);
            done()
        });
    }
    RED.nodes.registerType("track-service",TrackService);
}