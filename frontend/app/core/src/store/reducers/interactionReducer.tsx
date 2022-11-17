import { createReducer } from '../../utils/createReducer';
import { InteractionState } from '../types';
import { createComponentInteraction } from '../../utils/interaction';
import {Component, Fragment} from 'react';

import {
  InteractionActions,
  RENDER_INTERACTION_COMPONENT,
} from '../actions/types';

class EmptyComponent extends Component<{}, {}, any>{
  render(){
    return Fragment;
  }
}

const initialState = {
  component: {component: EmptyComponent, props: {}}
};

const interactionReducer = {
  [RENDER_INTERACTION_COMPONENT]: (state: InteractionState, { component, props, id }) =>
    ({ ...state, component: createComponentInteraction(component, props, id) }),
};

export default (state: InteractionState = initialState, action: InteractionActions) => createReducer(interactionReducer, state, action);
