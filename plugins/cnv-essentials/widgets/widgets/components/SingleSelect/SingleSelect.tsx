import React from 'react'
import Empty from '../../../components/Empty'
import CustomSelect from '../../../components/CustomSelect'
import CustomButton from '../../../components/CustomButton'
import { CustomSelectProps } from '../../../components/CustomSelect/CustomSelect'

import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'

import './SingleSelect.scss'

export interface SingleSelectProps {
  options: CustomSelectProps[]
  store: string
  buttonLabel: string
  connection: Connection
  nodeId: string
  widgetName: string
  ui: Ui
}

interface SingleSelectState {
  value: string | null
}

export default class SingleSelect extends React.Component<
  SingleSelectProps,
  SingleSelectState
> {
  constructor(props) {
    super(props)

    this.state = {
      value: null
    }
  }

  setValue(name: string, value: boolean) {
    let curVal = this.state.value;

    if(value) {
      curVal = name;
      
    } else {
      if(curVal == name) {
        curVal = null;
      } 
    }
    
    this.setState({
      value: curVal
    })
  }


  render() {
    const { options, store, buttonLabel, ui, connection, nodeId, widgetName } = this.props
    const { value } = this.state;

    return (
      <div className='single-select-wrapper'>
        <div className='select-elements-wrapper'>
          {options.map(({ name }, key) => {
            return (
              <CustomSelect
                key={key}
                name={name}
                selected={name === value}
                connection={connection}
                nodeId={nodeId}
                widgetName={widgetName}
                onSelectValueChange={(currName: string, currValue: boolean) =>
                  this.setValue(currName, currValue)
                }
              />
            )
          })}
        </div>
        <div className='button-wrapper'>
          <CustomButton
            sendValueOnClick={() => {
              connection.sendEvent(nodeId, widgetName, "pressed button to continue flow");
              connection.send(JSON.stringify({
                store,
                value
              }))
              ui.renderInteractionComponent(Empty, {})
            }}
            text={buttonLabel}
            disabled={value === null}
          />
        </div>
      </div>
    )
  }
}
