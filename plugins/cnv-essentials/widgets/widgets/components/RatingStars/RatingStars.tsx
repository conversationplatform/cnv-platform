import React, { useState } from 'react'
import { GiRoundStar } from 'react-icons/gi'
import CustomButton from '../../../components/CustomButton'
import CustomTextArea from '../../../components/CustomTextArea'
import Empty from '../../../components/Empty'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'
import './RatingStars.scss'

export interface RatingProps {
  store: string
  buttonLabel: string
  feedbackCheckbox: boolean
  textLabel: string
  connection: Connection
  nodeId: string
  widgetName: string
  ui: Ui
}

function RatingStars({
  feedbackCheckbox,
  buttonLabel,
  textLabel,
  connection,
  nodeId,
  widgetName,
  ui
}: RatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const stars = [1, 2, 3, 4, 5]

  const isActive = (idx) => {
    if (hoverRating > 0) {
      return hoverRating >= idx
    } else {
      return rating >= idx
    }
  }

  return (
    <div className='interact-wrapper'>
      <div className='rating' onMouseLeave={() => setHoverRating(-1)}>
        {stars.map((star) => {
          return (
            <GiRoundStar
              className={isActive(star) ? 'active' : ''}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
            />
          )
        })}
      </div>

      {feedbackCheckbox && (
        <div className='inputs-wrapper'>
          <div className='input-wrapper'>
            <CustomTextArea
              keyValue={textLabel}
              label={textLabel}
              onChange={(_, value) => setFeedback(value)}
            />
          </div>
        </div>
      )}
      <div className='buttons-wrapper'>
        <div className='button-wrapper'>
          <CustomButton
            text={buttonLabel}
            buttonType={'PRIMARY'}
            sendValueOnClick={() => {
              ui.renderInteractionComponent(Empty, {})
              connection.sendEvent(
                nodeId,
                widgetName,
                `user sent rating with value ${rating}`
              )
              if (feedbackCheckbox) {
                connection.sendEvent(
                  nodeId,
                  widgetName,
                  `user sent feedback with text ${feedback}`
                )
              }
              connection.sendEvent(
                nodeId,
                widgetName,
                'pressed button to continue flow'
              )
              connection.send(
                JSON.stringify({
                  feedback,
                  rating
                })
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default RatingStars
