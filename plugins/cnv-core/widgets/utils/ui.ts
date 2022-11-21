
import { action } from '@storybook/addon-actions';

export default class Ui {
    
    public renderInteractionComponent(...args) {
        action('Ui.renderInteractionComponent' )(args)
        console.log(`[info] [Ui]`, args)
    }

    public showOverlayComponent(...args) {
        action('Ui.showOverlayComponent' )(args)
        console.log(`[info] [Ui]`, args)
    }
}