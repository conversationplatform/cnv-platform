import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Slider, { SliderProps } from './Slider'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

export default {
  title: 'Conversation React Pluggins / Slider',
  component: Slider,
  argTypes: {
    image: {
      control: {
        type: 'text'
      },
      description: 'background image to appear',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    button: {
      control: {
        type: 'text'
      },
      description: 'text inside button',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    sliders: {
      control: {
        type: 'array'
      },
      description: 'links list, rendered outside',
      required: true,
      defaultValue: '',
      type: 'string'
    }
  }
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = (props: SliderProps) => (
  <div className='wrapper'>
    <div className='showcase'>
      <div className='interaction'>
        <Slider {...props} />
      </div>
    </div>
  </div>
)
export const NumericSlider = Template.bind({})
export const RangeSlider = Template.bind({})
NumericSlider.args = {
  image: '',
  button: 'im a button',
  connection: new Connection(),
  ui: new Ui(),
  sliders: [
    {
      headline: `i'm a headline`,
      min: 0,
      max: 100,
      simbol: '',
      type: 'NORMAL',
      isTooltip: true,
      displayLabels: true
    },
    {
      headline: `i'm a headline`,
      min: 0,
      max: 100,
      simbol: '',
      type: 'NORMAL',
      isTooltip: true,
      displayLabels: true
    }
  ]
}
RangeSlider.args = {
  image: '',
  button: 'im a button',
  connection: new Connection(),
  ui: new Ui(),
  sliders: [
    {
      headline: `i'm a headline`,
      min: 0,
      max: 100,
      simbol: '',
      type: 'RANGE',
      isTooltip: true,
      displayLabels: true
    },
    {
      headline: `i'm a headline`,
      min: 0,
      max: 100,
      simbol: '',
      type: 'RANGE',
      isTooltip: true,
      displayLabels: true
    }
  ]
}
