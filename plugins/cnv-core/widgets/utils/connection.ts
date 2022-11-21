import { action } from '@storybook/addon-actions';


export default class Connection {
    
    public send(text:string) {
        action('Connection.send')(text);
        console.log(`[info] [Connection]`, text);
    }

    public sendEvent(nodeId:string, widgetName:string, description:string) {
        action('Connection.sendEvent')(nodeId, widgetName, description);
        console.log(`[info] [Connection]`, nodeId, widgetName, description);
    }
}