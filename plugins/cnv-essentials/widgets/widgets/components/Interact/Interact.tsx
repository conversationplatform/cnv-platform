import React from 'react'
import Empty from '../../../components/Empty'
import CustomButton from '../../../components/CustomButton'
import CustomInput from '../../../components/CustomInput'
import Ui from '../../../utils/ui'
import Connection from '../../../utils/connection'
import './Interact.scss'

interface UserInputsProps {
  keyValue: string
  label: string
}

export interface ButtonsProps {
  value: string
  label: string
  buttonType: string
}
export interface InteractProps {
  store: string
  userInputs: UserInputsProps[]
  buttons: ButtonsProps[]
  connection: Connection
  nodeId: string
  widgetName: string
  ui: Ui
}

function Interact({
  store,
  userInputs,
  buttons,
  connection,
  nodeId,
  widgetName,
  ui
}: InteractProps) {
  const values = {}

  const handleOnChange = (key: string, value: string) => {
    values[key] = value
  }

  return (
    <div className='interact-wrapper'>
      <div className='inputs-wrapper'>
        {userInputs.map(
          ({ keyValue, label }: UserInputsProps, index: number) => {
            return (
              <div key={index} className='input-wrapper'>
                <CustomInput
                  keyValue={label}
                  label={label}
                  onChange={handleOnChange}
                />
              </div>
            )
          }
        )}
      </div>
      <div className='buttons-wrapper'>
        {buttons.map(({ value, label, buttonType }: ButtonsProps) => {
          return (
            <div key={value} className='button-wrapper'>
              <CustomButton
                text={label}
                buttonType={buttonType}
                sendValueOnClick={() => {
                  values['button'] = label
                  ui.renderInteractionComponent(Empty, {})
                  for (const [key, inputValue] of Object.entries(values)) {
                    connection.sendEvent(
                      nodeId,
                      widgetName,
                      `user sent value ${inputValue} on input ${key}`
                    )
                  }
                  connection.sendEvent(
                    nodeId,
                    widgetName,
                    `pressed button ${values['button']} to continue flow`
                  )
                  connection.send(
                    JSON.stringify({
                      store,
                      values
                    })
                  )
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Interact
