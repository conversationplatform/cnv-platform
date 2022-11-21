import React from 'react'
import parse from 'html-react-parser'
import { AiFillCloseCircle } from 'react-icons/ai'
import Ui from '../../../utils/ui'
import './Glossary.scss'

import md from 'markdown-it';
const markdown = md();
export interface GlossaryProps {
  image: string
  title: string
  text: string
  ui: Ui
}

interface GlossaryState {
  scrollValue: number
}

export default class Glossary extends React.Component<
  GlossaryProps,
  GlossaryState
> {
  constructor(props: GlossaryProps) {
    super(props)
    this.state = {
      scrollValue: 0
    }
  }

  handleOnClose = () => {
    const { ui } = this.props
    ui.showOverlayComponent(false)
  }

  handleOnScroll = (e) => {
    const { scrollValue } = this.state
    const value = e.target.scrollTop
    if (value < 150) this.setState({ scrollValue: e.target.scrollTop })
    else if (value >= 150 && scrollValue !== 150)
      this.setState({ scrollValue: 150 })
  }

  render() {
    const { text, image, title } = this.props
    const { scrollValue } = this.state

    const renderedText = markdown.render(text)

    return (
      <div className='glossary-wrapper'>
        <AiFillCloseCircle className='icon' onClick={this.handleOnClose} />
        <div
          id='cnv-glossary-icon-bg-id'
          className='iconBG'
          style={{ top: `calc(${scrollValue}px - 175px)` }}
        />
        <div className='parallax-wrapper' onScroll={this.handleOnScroll}>
          <div className='image-wrapper'>
            {image && <img className='image' src={image} alt={image.toString()} />}
            {!image && <div className='no-image'/>}
          </div>
          <div className='content-wrapper'>
            <div className='title'>{title.toUpperCase()}</div>
            <div className='text'>{parse(renderedText)}</div>
          </div>
        </div>
      </div>
    )
  }
}
