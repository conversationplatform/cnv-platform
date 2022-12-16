import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import RatingStars, { RatingProps } from './RatingStars'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

import '../../../../storybook-styles/styles.scss'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Conversation React Pluggins / RatingStars',
  component: RatingStars,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    buttonLabel: {
      description: 'Message to appear on the next button.',
      required: true,
      defaultValue: 'Send Feedback',
      type: 'string'
    },
    store: {
      controll: {
        type: 'text'
      },
      description: 'store',
      defaultValue: 'rating_store',
      type: 'string'
    }
  }
} as ComponentMeta<typeof RatingStars>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RatingStars> = (
  props: RatingProps
) => (
  <div className='wrapper'>
    <div className='showcase'>
      <div className='interaction'>
        <RatingStars {...props} />
      </div>
    </div>
  </div>
)

export const RatingStarsExample = Template.bind({})

RatingStarsExample.args = {
  store: 'ratingstore',
  buttonLabel: 'Send Feeback',
  connection: new Connection(),
  ui: new Ui()
}
