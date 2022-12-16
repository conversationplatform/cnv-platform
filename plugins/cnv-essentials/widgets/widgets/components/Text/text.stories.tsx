import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Text, { TextProps } from './Text'
import '../../../../storybook-styles/styles.scss'

const animation = require('../../../../animations/robot.json') || ''

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / Text',
  component: Text,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    text: {
      control: {
        type: 'text'
      },
      description: 'message to appear. Supports markdown',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    isFirst: {
      control: {
        type: 'boolean'
      },
      description: 'If true, the animation and a little triangle will appear'
    },
    isDisclaimer: {
      control: {
        type: 'boolean'
      },
      description:
        'If true, the appearance of the bubble is changed, and a disclaimer link will appear'
    },
    animation: {
      control: {
        type: 'text'
      },
      description: 'lottie json animation',
      defaultValue: ''
    },
    disclaimerLink: {
      control: {
        type: 'text'
      },
      description: 'Disclaimer url'
    }
  }
} as ComponentMeta<typeof Text>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Text> = (props: TextProps) => (
  <div className='wrapper'>
    <div className='showcase'>
      <Text {...props} />
    </div>
  </div>
)

export const Message = Template.bind({})
export const MessageDisclaimer = Template.bind({})
export const MessageWithAnimation = Template.bind({})
export const MessageDisclaimerWithAnimation = Template.bind({})

export const MessageVideo = Template.bind({})
export const MessageVideoDisclaimer = Template.bind({})
export const MessageVideoWithAnimation = Template.bind({})
export const MessageVideoDisclaimerWithAnimation = Template.bind({})

Message.args = {
  text: 'this is a test **message**',
  animation: '',
  video: '',
  isDisclaimer: false,
  disclaimerLink: null
}

MessageDisclaimer.args = {
  text: 'this is a test **message**',
  animation: '',
  video: '',
  isDisclaimer: true,
  disclaimerLink: 'https://google.com'
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
MessageWithAnimation.args = {
  text: 'this is a test **message**',
  animation: JSON.stringify(animation),
  video: '',
  isDisclaimer: false,
  disclaimerLink: null
}

MessageDisclaimerWithAnimation.args = {
  text: 'this is a test **message**',
  animation: JSON.stringify(animation),
  video: '',
  isDisclaimer: true,
  disclaimerLink: 'https://google.com'
}

MessageVideo.args = {
  text: 'this is a test **message**',
  animation: '',
  video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  isDisclaimer: false,
  disclaimerLink: null
}

MessageVideoDisclaimer.args = {
  text: 'this is a test **message**',
  animation: '',
  video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  isDisclaimer: true,
  disclaimerLink: 'https://google.com'
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
MessageVideoWithAnimation.args = {
  text: 'this is a test **message**',
  animation: JSON.stringify(animation),
  video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  isDisclaimer: false,
  disclaimerLink: null
}

MessageVideoDisclaimerWithAnimation.args = {
  text: 'this is a test **message**',
  animation: JSON.stringify(animation),
  video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  isDisclaimer: true,
  disclaimerLink: 'https://google.com'
}
