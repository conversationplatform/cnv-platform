import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import SingleSelect, { SingleSelectProps } from './SingleSelect'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

import '../../../storybook-styles/styles.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / SingleSelect',
  component: SingleSelect,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    options: {
      description: 'message to appear. Supports markdown',
      required: true
    },
    buttonLabel: {
      description: 'Message to appear on the next button.',
      required: true,
      defaultValue: 'Continue',
      type: 'string'
    },
    store: {
      controll: {
        type: 'text'
      },
      description: 'store',
      defaultValue: 'singleselect_store',
      type: 'string'
    }
  }
} as ComponentMeta<typeof SingleSelect>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SingleSelect> = (
  props: SingleSelectProps
) => (
  <div className='wrapper'>
    <div className='showcase'>
      <div className='interaction'>
        <SingleSelect {...props} />
      </div>
    </div>
  </div>
)

export const SingleSelectExample = Template.bind({})

SingleSelectExample.args = {
  options: [
    {
      name: 'option 1'
    },
    {
      name: 'option 2'
    }
  ],
  buttonLabel: 'Continue',
  connection: new Connection(),
  ui: new Ui()
}
