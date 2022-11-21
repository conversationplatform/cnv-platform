import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Splash, { SplashProps } from './Splash'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / Splash',
  component: Splash,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    title: {
      control: {
        type: 'text'
      },
      description: 'title to appear.',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    image: {
      control: {
        type: 'text'
      },
      description: 'background image to appear',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    textButton: {
      control: {
        type: 'text'
      },
      description: 'text inside button',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    links: {
      control: {
        type: 'array'
      },
      description: 'links list, rendered outside',
      required: true,
      defaultValue: '',
      type: 'string'
    }
  }
} as ComponentMeta<typeof Splash>

const Template: ComponentStory<typeof Splash> = (props: SplashProps) => (
  <div className='wrapper'>
    <div className='showcase'>
      <Splash {...props} />
    </div>
  </div>
)
export const Cover = Template.bind({})

Cover.args = {
  title: 'this is a test **Title**',
  image: '',
  textButton: 'im a button',
  links: [
    {
      linkName: `i'm a link`,
      link: 'https://www.google.pt'
    },
    {
      linkName: `i'm other link`,
      link: 'https://www.google.pt'
    }
  ]
}
