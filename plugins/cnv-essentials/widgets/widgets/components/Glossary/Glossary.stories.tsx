import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Glossary, { GlossaryProps } from './Glossary'
import Ui from '../../../utils/ui'

import '../../../../storybook-styles/styles.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / Glossary',
  component: Glossary,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    image: {
      description: 'Image of the glossary'
    },
    title: {
      description: 'Title of the glossary.',
      type: 'string'
    },
    text: {
      description: 'Text of the glossary.',
      type: 'string'
    }
  }
} as ComponentMeta<typeof Glossary>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Glossary> = (props: GlossaryProps) => (
  <div className='wrapper'>
    <div className='showcase'>
      <Glossary {...props} />
    </div>
  </div>
)

export const GlossaryExample = Template.bind({})

GlossaryExample.args = {
  image: '',
  title: 'Example',
  text: 'This is an example text',
  ui: new Ui()
}
