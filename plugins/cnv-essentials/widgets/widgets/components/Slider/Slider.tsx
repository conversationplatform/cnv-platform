import React from 'react'
import CustomRange from '../../../components/CustomRange/CustomRange'
import CustomSlider from '../../../components/CustomSlider/CustomSlider'
import CustomButton from '../../../components/CustomButton'
import Empty from '../../../components/Empty/Empty'
import Connection from '../../../utils/connection'
import Ui from '../../../utils/ui'
import './Slider.scss'

enum SliderType {
  NORMAL = 'NORMAL',
  RANGE = 'RANGE'
}

export interface NumericSlider {
  isTooltip: boolean
  headline: string
  type: SliderType
  store: string
  min: number
  max: number
  simbol: string
  displayLabels: boolean
}

export interface SliderProps {
  sliders: NumericSlider[]
  button: string //change on NodeRed
  image: string
  connection: Connection
  nodeId: string 
  widgetName: string
  ui: Ui
}
interface SliderState {
  values: string[]
}
export default class Slider extends React.Component<SliderProps, SliderState> {
  constructor(props: SliderProps) {
    super(props)
    this.state = {
      values: props.sliders?.length > 0 ? props.sliders.map(() => '0') : []
    }
  }
  setValue(value: string, index: number, type: string) {
      const { values } = this.state
      values.splice(index, 1, value)
      this.setState({ values: values })
  }

  render() {
    return (
      <div className='slider-wrapper'>
        {this.renderImage()}
        {this.renderSliders()}
        {this.renderButton()}
      </div>
    )
  }

  private renderImage() {
    const { image } = this.props
    if (image) {
      return (
        <div className='image-wrapper'>
          <img className='image' width='210px' src={image} alt='image' />
        </div>
      )
    }
  }

  private renderSliders() {
    const { values } = this.state
    return this.props.sliders.map((item: NumericSlider, index: number) => {
      return (
        <div className='sliders-wrapper' key={index}>
          {item.type === SliderType.NORMAL && ( 
             <CustomSlider
               value={values[index]}
               min={item.min}
               max={item.max}
               isTooltip={item.isTooltip}
               displayLabels={item.displayLabels}
               headline={item.headline}
               symbol={item.simbol}
               onValueChange={(value: string) => this.setValue(value, index, item.type)}
             />
           )}
          {item.type === SliderType.RANGE && (
            <CustomRange
              value={values[index]}
              min={item.min}
              max={item.max}
              isTooltip={item.isTooltip}
              displayLabels={item.displayLabels}
              headline={item.headline}
              symbol={item.simbol}
              onValueChange={(value: string) => this.setValue(value, index, item.type)}
              tipFormatter={item.isTooltip ? this.formater : null}
            />
          )}
        </div>
      )
    })
  }
  private renderButton() {
    const { values } = this.state
    const { connection, ui, button, nodeId, widgetName } = this.props
    return (
      <div className='button-wrapper'>
        <CustomButton
          sendValueOnClick={async () => {
            connection.sendEvent(nodeId, widgetName, `user sent value ${values}`);
            connection.sendEvent(nodeId, widgetName, "pressed button to continue flow");
            connection.send(
              JSON.stringify({
                values
              })
            )
            ui.renderInteractionComponent(Empty, {})
          }}
          text={button}
        ></CustomButton>
      </div>
    )
  }

  private formater(value: number, symbol: string) {
    return `${value}${symbol}`
  }
}
