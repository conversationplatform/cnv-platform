import React from 'react'
import classnames from 'classnames'
import './CustomRange.scss'

export interface CustomRangeProps {
  value: string
  min: number
  max: number
  isTooltip: boolean
  displayLabels: boolean
  headline: string
  symbol: string
  onValueChange: (value: string) => void
  tipFormatter: (value: number, simbol: string) => string
}
export interface RangeProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}
interface RangeState {
  minVal: number
  maxVal: number
}

export default class Range extends React.Component<
  CustomRangeProps,
  RangeState
> {
  constructor(props) {
    super(props)
    this.state = {
      minVal: this.props.min,
      maxVal: this.props.max
    }
  }

  private setMinVal(value: number) {
    this.setState({ minVal: value })
  }
  private setMaxVal(value: number) {
    this.setState({ maxVal: value })
  }


  render() {
    const { min, max, displayLabels, headline, symbol } = this.props
    const { minVal, maxVal } = this.state

    const getPercentage = (value: number, currMin: number, currMax: number) => {
      return Math.round(((value - currMin) / (currMax - currMin)) * 100)
    }

    const minPercent = getPercentage(minVal, min, max)
    const maxPercent = getPercentage(maxVal, min, max)

    const offsetMin = Number((minPercent * (12 - 38)) / 100 - 12)
    const offsetMax = Number((maxPercent * (12 - 38)) / 100 - 12)

    const tooltipPercentageMin =
      minPercent <= maxPercent - 18 ? minPercent : maxPercent - 18
    const tooltipOffsetMin =
      minPercent <= maxPercent - 18 ? offsetMin : offsetMax + 4

    return (
      <div className='custom-range-wrapper'>
        {headline && <div className='headline'>{headline} </div>}
        <div className='range-implementation-wrapper'>
          <input
            className={classnames('thumb thumb--zindex-3', {
              'thumb--zindex-5': minVal > max - 100
            })}
            type='range'
            min={min}
            max={max}
            value={minVal}
            onChange={(event) => {
              const value = Math.min(+event.target.value, maxVal)
              this.setMinVal(value)
              this.props.onValueChange(`${minVal}-${maxVal}`);
              event.target.value = value.toString()
            }}
          />
          {this.props.tipFormatter && (
            <div
              style={{
                left: `calc(${tooltipPercentageMin}% + ${tooltipOffsetMin}px)`
              }}
              className='tooltip'
            >
              {this.props.tipFormatter(minVal, symbol)}
            </div>
          )}
          <input
            type='range'
            className='thumb thumb--zindex-4'
            min={min}
            max={max}
            value={maxVal}
            onChange={(event) => {
              const value = Math.max(+event.target.value, minVal)
              this.setMaxVal(value)
              this.props.onValueChange(`${minVal}-${maxVal}`);
              event.target.value = value.toString()
            }}
          />
          {this.props.tipFormatter && (
            <div
              style={{ left: `calc(${maxPercent}% + ${offsetMax}px)` }}
              className='tooltip'
            >
              {this.props.tipFormatter(maxVal, symbol)}
            </div>
          )}
          <div className='slider'>
            <div className='slider__track'></div>
            <div
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
              className='slider__range'
            ></div>
          </div>
        </div>

        {this.renderDisplayLabels(displayLabels, min, max)}
      </div>
    )
  }

  private renderDisplayLabels(
    displayLabels: boolean,
    min: number,
    max: number
  ) {
    if (displayLabels) {
      return (
        <div className='positions'>
          <span className='text'>{min}</span>
          <span className='text'>{max}</span>
        </div>
      )
    }
  }
}
