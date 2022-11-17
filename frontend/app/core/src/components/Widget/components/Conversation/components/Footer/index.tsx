import React, { Component,} from 'react';
import { useSelector } from 'react-redux';

import { GlobalState } from 'src/store/types';

import './style.scss';

type FooterState = {
    child: Component
}

function Footer() {
    const { component } = useSelector((state: GlobalState) => ({
      component: state.footer.component
    }));
    const ComponentToRender = component.component;

    return <div className="rcw-footer"><ComponentToRender {...component.props}/></div>
}

export default Footer;
