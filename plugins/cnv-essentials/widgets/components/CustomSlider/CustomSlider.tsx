import React from 'react'
import './CustomSlider.scss'

export interface CustomSliderProps {
  value: string
  min: number
  max: number
  isTooltip: boolean
  displayLabels: boolean
  headline: string
  symbol: string
  onValueChange: (value: string) => void
}

export interface SliderProps {
  min: number
  max: number
  value: string
  onChange: (value: string) => void
  tipFormatter: (value: number) => string
}

function Slider({ min, max, value, onChange, tipFormatter }: SliderProps) {
  const newVal = Number(((Number(value) - min) * 100) / (max - min))
  const newPer = Number((newVal * (12 - 38)) / 100 - 12)
  return (
    <div className='slider-implementation-wrapper'>
      <input
        type='range'
        min={min}
        max={max}
        defaultValue={value}
        className='slider'
        onChange={(event) => {
          const currValue = event.target.value
          onChange && onChange(currValue)
        }}
      />
      {tipFormatter && (
        <div
          style={{ left: `calc(${newVal}% + ${newPer}px)` }}
          className='tooltip'
        >
          {tipFormatter(Number(value))}
        </div>
      )}
    </div>
  )
}

function CustomSlider({
  value,
  min,
  max,
  isTooltip,
  displayLabels,
  headline,
  symbol,
  onValueChange
}: CustomSliderProps) {
  
  const onSliderChange = (currValue: string) => {
    onValueChange && onValueChange(currValue)
  }

  const formatter = (currValue: number) => {
    return `${currValue}${symbol}`
  }
  const renderDisplayLabels = () => {
    if (displayLabels) {
      return (
        <div className='positions'>
          <span className='text'>{min}</span>
          <span className='text'>{max}</span>
        </div>
      )
    }
  }

  return (
    <div className='custom-slider-wrapper'>
      {headline && <div className='headline'>{headline} </div>}
      <Slider
        tipFormatter={isTooltip ? formatter : null}
        min={Number(min)}
        max={Number(max)}
        value={value}
        onChange={onSliderChange}
      />
      {renderDisplayLabels()}
    </div>
  )
}

export default CustomSlider
