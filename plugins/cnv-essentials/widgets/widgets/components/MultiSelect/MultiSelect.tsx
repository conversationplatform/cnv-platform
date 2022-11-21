import React from 'react'
import Empty from '../../../components/Empty'
import CustomSelect from '../../../components/CustomSelect'
import CustomButton from '../../../components/CustomButton'
import { CustomSelectProps } from '../../../components/CustomSelect/CustomSelect'

import Ui from '../../../utils/ui'
import Connection from '../../../utils/connection'

import './MultiSelect.scss'
export interface MultiSelectProps {
  options: CustomSelectProps[]
  store: string
  buttonLabel: string
  connection: Connection
  nodeId: string 
  widgetName: string
  ui: Ui
}

interface IMultiSelectState {
  values: string[]
  disabled: boolean
}

export default class MultiSelect extends React.Component<
  MultiSelectProps,
  IMultiSelectState
> {
  constructor(props: MultiSelectProps) {
    super(props)
    this.state = {
      values: [],
      disabled: true
    }
  }

  setValue(name: string, value: boolean) {
    const { values } = this.state
    const idx = values.indexOf(name)
    if (value && idx == -1) {
      values.push(name)
    } else {
      values.splice(idx, 1)
    }
    const disabled = values.length == 0
    this.setState({ values: values, disabled: disabled })
  }

  render() {
    const { options, store, buttonLabel, ui, connection, nodeId, widgetName } = this.props
    const { values, disabled } = this.state

    return (
      <div className='multi-select-wrapper'>
        <div className='select-elements-wrapper'>
          {options.map(({ name }, key) => {
            return (
              <CustomSelect
                key={key}
                name={name}
                selected={values.indexOf(name) > -1}
                connection={connection}
                nodeId={nodeId}
                widgetName={widgetName}
                onSelectValueChange={(currName: string, value: boolean) => {
                  this.setValue(currName, value)
                }}
              />
            )
          })}
        </div>
        <div className='button-wrapper'>
          <CustomButton
            sendValueOnClick={async () => {
              connection.sendEvent(nodeId, widgetName, "pressed button to continue flow");
              connection.send(
                JSON.stringify({
                  store,
                  values
                })
              )
              ui.renderInteractionComponent(Empty, {})
            }}
            text={buttonLabel}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
}
