import { ElementType } from 'react';

import { InteractionComponent } from '../store/types';

export function createComponentInteraction(component: ElementType, props: any, id?: string): InteractionComponent {
  return {
    component,
    props,
    customId: id,
  };
}