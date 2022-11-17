import { createReducer } from '../../utils/createReducer';
import { OverlayState } from '../types';
import { createComponentInteraction } from '../../utils/interaction';
import {Component, Fragment} from 'react';

import {
  OverlayActions,
  RENDER_OVERLAY_COMPONENT,
  SHOW_OVERLAY_COMPONENT,
} from '../actions/types';

class EmptyComponent extends Component<{}, {}, any>{
  render(){
    return Fragment;
  }
}

const initialState = {
  component: {component: EmptyComponent, props: {}},
  show: false
};

const overlayReducer = {
  [RENDER_OVERLAY_COMPONENT]: (state: OverlayState, { component, props, id }) =>
    ({ ...state, component: createComponentInteraction(component, props, id) }),
  [SHOW_OVERLAY_COMPONENT]: (state: OverlayState, {toggle}) => 
    ({...state, show: toggle}),
};

export default (state: OverlayState = initialState, action: OverlayActions) => createReducer(overlayReducer, state, action);
