import React from 'react'
import { AiOutlineCheck } from "react-icons/ai";
import './CustomSelect.scss'
import Connection from '../..//utils/connection'

export interface CustomSelectProps {
  name: string
  value: string
  selected: boolean
  connection: Connection, 
  nodeId: string, 
  widgetName: string,
  onSelectValueChange: (name: string, value: boolean) => void
}



function CustomSelect(props: CustomSelectProps) {
  const { selected } = props

  const onSelectChange = (name, value) => {
    props.onSelectValueChange && props.onSelectValueChange(name, value)
    props.connection.sendEvent(props.nodeId, props.widgetName, selected ? `deselected ${name}` : `selected ${name}`);
  }

  return (
    <div
      onClick={() => onSelectChange(props.name, !selected)}
      className={`custom-select-wrapper${selected ? ' selected': ''} `}
    >
      {selected && <AiOutlineCheck className="iconHidden" />}
      <div className="name">{props.name}</div>
      {selected && <AiOutlineCheck className="icon" />}
    </div>
  )
}

export default CustomSelect
