import { createReducer } from '../../utils/createReducer';
import { FooterState } from '../types';
import { createComponentFooter } from '../../utils/footer';
import {Component, Fragment} from 'react';

import {
  FooterActions,
  RENDER_FOOTER_COMPONENT,
} from '../actions/types';

class EmptyComponent extends Component<{}, {}, any>{
  render(){
    return Fragment;
  }
}

const initialState = {
  component: {component: EmptyComponent, props: {}}
};

const footerReducer = {
  [RENDER_FOOTER_COMPONENT]: (state: FooterState, { component, props, id }) =>
    ({ ...state, component: createComponentFooter(component, props, id) }),
};

export default (state: FooterState = initialState, action: FooterActions) => createReducer(footerReducer, state, action);
