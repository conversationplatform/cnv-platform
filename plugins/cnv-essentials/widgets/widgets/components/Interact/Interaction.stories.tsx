import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Interact, { InteractProps } from './Interact'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

import '../../../../storybook-styles/styles.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / Interact',
  component: Interact,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    userInputs: {
      description: 'Inputs to be inserted by user',
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
      defaultValue: 'interact_store',
      type: 'string'
    }
  }
} as ComponentMeta<typeof Interact>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Interact> = (
  props: InteractProps
) => (
  <div className='wrapper'>
    <div className='showcase'>
      <div className='interaction'>
        <Interact {...props} />
      </div>
    </div>
  </div>
)

export const InteractExample = Template.bind({})

InteractExample.args = {
  store: 'interact',
  userInputs: [
    {
      keyValue: "inputWeight",
      label: "Weight"
    },
    {
      keyValue: "inputHeight",
      label: "Height"
    }
  ],
  buttons: [
    {
      value: 'Continue',
      label: 'Continue',
      buttonType: 'PRIMARY'
    }
  ],
  buttonLabel: 'Continue',
  connection: new Connection(),
  ui: new Ui()
}
