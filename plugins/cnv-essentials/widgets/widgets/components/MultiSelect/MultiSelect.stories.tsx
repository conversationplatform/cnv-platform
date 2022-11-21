import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import MultiSelect, { MultiSelectProps } from './MultiSelect'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

import '../../../storybook-styles/styles.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / MultiSelect',
  component: MultiSelect,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    options: {
      description: 'message to appear. Supports markdown',
      required: true
    },
    buttonLabel: {
      control: {
        type: 'text'
      },
      description: 'message to appear on the next button.',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    store: {
      controll: {
        type: 'text'
      },
      description: 'store',
      defaultValue: 'multiselect_store',
      type: 'string'
    }
  }
} as ComponentMeta<typeof MultiSelect>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MultiSelect> = (
  props: MultiSelectProps
) => (
  <div className='wrapper'>
    <div className='showcase'>
      <div className='interaction'>
        <MultiSelect {...props} />
      </div>
    </div>
  </div>
)

export const MultiSelectExample = Template.bind({})

MultiSelectExample.args = {
  options: [
    {
      name: 'option 1'
    },
    {
      name: 'option 2'
    },
    {
      name: 'option 3'
    }
  ],
  store: 'multiselect_store',
  buttonLabel: 'Continue',
  connection: new Connection(),
  ui: new Ui()
}
