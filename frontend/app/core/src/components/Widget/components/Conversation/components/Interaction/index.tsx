import React, { Component,} from 'react';
import { useSelector } from 'react-redux';

import { GlobalState } from 'src/store/types';

import './style.scss';

type InteractionState = {
    child: Component
}

function Interaction() {
    const { component } = useSelector((state: GlobalState) => ({
      component: state.interaction.component
    }));
    const ComponentToRender = component.component;

    return <div className="rcw-interaction"><ComponentToRender {...component.props}/></div>
}

export default Interaction;
