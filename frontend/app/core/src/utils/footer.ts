import { ElementType } from 'react';

import { FooterComponent } from '../store/types';

export function createComponentFooter(component: ElementType, props: any, id?: string): FooterComponent {
  return {
    component,
    props,
    customId: id,
  };
}