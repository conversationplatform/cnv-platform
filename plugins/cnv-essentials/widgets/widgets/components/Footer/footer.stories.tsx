import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Footer, { FooterProps } from './Footer'
import Text from '../Text'

import '../../../../storybook-styles/styles.scss'

const animation = require('../../../../animations/robot.json') || ''

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / Footer',
  component: Footer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    logo: {
      control: {
        type: 'text'
      },
      description: 'logo in the menu (side nav). png or svg',
      required: true,
      defaultValue: '',
      type: 'string'
    },
    articles: {
      control: {
        type: 'array'
      },
      description: 'article list, rendered inside',
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
} as ComponentMeta<typeof Footer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Footer> = (props: FooterProps) => (
  <div className='wrapper'>
    <div className='showcase'>
      <Text
        text='Hi! This is the side menu demo'
        animation={JSON.stringify(animation)}
      />
      <Footer {...props} />
    </div>
  </div>
)

export const footer = Template.bind({})

footer.args = {
  image: 'logo.png',
  articles: [
    {
      url: '#',
      name: 'this is a internal link'
    },
    {
      url: '#',
      name: 'this is another internal link'
    }
  ],
  links: [
    {
      url: '#',
      name: 'this is an external link'
    },
    {
      url: '#',
      name: 'this is another external link'
    }
  ]
}
