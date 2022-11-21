import React from "react";
import Empty from '../../../components/Empty'
import CustomButton from '../../../components/CustomButton'
import CustomTextArea from '../../../components/CustomTextArea'
import Ui from '../../../utils/ui'
import Connection from '../../../utils/connection'
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

function RatingStars({ store, feedbackCheckbox, buttonLabel, textLabel, connection, nodeId, widgetName, ui }: RatingProps) {
  const values = {}

  const handleOnChange = (key: string, value: string) => {
    values[key] = value
  }

  

  const handleOnRatingChange = (e) => {
    let value = e.target.value;
    values["rating"] = value;
  }
  

  return (

    <div className='interact-wrapper'>

    <div className="rating">
        <input type="radio" id="star1" name="rating" value="5" onChange={handleOnRatingChange}/><label className = "full" htmlFor="star1"></label>
        <input type="radio" id="star2" name="rating" value="4" onChange={handleOnRatingChange}/><label className = "full" htmlFor="star2"></label>
        <input type="radio" id="star3" name="rating" value="3" onChange={handleOnRatingChange}/><label className = "full" htmlFor="star3"></label>
        <input type="radio" id="star4" name="rating" value="2" onChange={handleOnRatingChange}/><label className = "full" htmlFor="star4"></label>
        <input type="radio" id="star5" name="rating" value="1" onChange={handleOnRatingChange}/><label className = "full" htmlFor="star5"></label>
    </div>
    {feedbackCheckbox && <div className='inputs-wrapper'>
          <div className='input-wrapper'>
          <CustomTextArea 
              keyValue={textLabel}
              label={textLabel}
              onChange={handleOnChange}
                />
          </div>
      </div>}
      <div className='buttons-wrapper'>
          <div className='button-wrapper'>
            <CustomButton
              text={buttonLabel}
              buttonType={"PRIMARY"}
              sendValueOnClick={() => {
                ui.renderInteractionComponent(Empty, {})
                connection.sendEvent(nodeId, widgetName, `user sent rating with value ${values["rating"]}`);
                if(feedbackCheckbox){
                  connection.sendEvent(nodeId, widgetName, `user sent feedback with text ${values[textLabel]}`);
                }
                connection.sendEvent(nodeId, widgetName, "pressed button to continue flow");
                connection.send(
                  JSON.stringify({
                    store,
                    values
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
