import { createStore, combineReducers, compose } from 'redux';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import quickButtons from './reducers/quickButtonsReducer';
import preview from './reducers/fullscreenPreviewReducer';
import interaction from './reducers/interactionReducer';
import overlay from './reducers/overlayReducer';
import footer from './reducers/footerReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =   (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const reducer = combineReducers({ behavior, messages, quickButtons, preview, interaction, footer, overlay });

export default createStore(reducer, composeEnhancers());
