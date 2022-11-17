import { ElementType } from 'react';

import { OverlayComponent } from '../store/types';

export function createComponentInteraction(component: ElementType, props: any, id?: string): OverlayComponent {
  return {
    component,
    props,
    customId: id,
  };
}