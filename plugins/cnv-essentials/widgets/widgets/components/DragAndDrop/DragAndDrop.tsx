import React, { useState } from 'react'
import Empty from '../../../components/Empty'
import CustomButton from '../../../components/CustomButton'
import CustomDragAndDrop, {
  DraggableItem
} from '../../../components/CustomDragAndDrop'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'
import './DragAndDrop.scss'

interface DragAndDropProps {
  options: DraggableItem[]
  buttonLabel: string // change on NodeRed
  image: string
  connection: Connection
  nodeId: string
  widgetName: string
  ui: Ui
}

const DragAndDrop = ({
  connection,
  buttonLabel,
  ui,
  options,
  nodeId,
  widgetName
}: DragAndDropProps) => {
  const [values, setValues] = useState(options.map((el) => el.name))

  const saveItemsOnChange = (itemValues: string[]): void => {
    setValues(itemValues)
  }

  return (
    <div className='drag-and-drop-wrapper'>
      <CustomDragAndDrop items={options} saveOnChange={saveItemsOnChange} />
      <div className='divider' />
      <div className='button-wrapper'>
        <CustomButton
          sendValueOnClick={async () => {
            const valuesOrderedStr = values.map((val, idx) => `${idx + 1}. ${val}`).join(',')
            connection.sendEvent(nodeId, widgetName, `user sent value ${valuesOrderedStr}`);
            connection.sendEvent(nodeId, widgetName, "pressed button to continue flow");
            connection.send(JSON.stringify(values))
            ui.renderInteractionComponent(Empty, {})
          }}
          text={buttonLabel}
        />
      </div>
    </div>
  )
}

export default DragAndDrop
