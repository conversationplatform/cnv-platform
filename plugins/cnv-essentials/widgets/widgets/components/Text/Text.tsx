import React from 'react'
import lottie from 'lottie-web'
import ReactPlayer from 'react-player'
import parse from 'html-react-parser'
import { BiInfoCircle } from 'react-icons/bi'
import './Text.scss'

import md from 'markdown-it';
const markdown = md();


export type TextProps = {
  text: string
  animation: Object
  video: string
  isDisclaimer: boolean
  disclaimerLink: string
}
export default class Text extends React.Component<TextProps> {
  private animation: Object
  private firstCSS: Object = {}
  private animationRef: any

  constructor(props) {
    super(props)
    this.animationRef = React.createRef()
    this.firstCSS['--first'] = '' // why?

    if (this.props.animation && typeof this.props.animation == 'string') {
      try {
        this.animation = JSON.parse(this.props.animation)
        this.firstCSS['--first'] = "' '" // why?
      } catch (e) {
        console.error(e, this.props.animation)
        this.animation = null
      }
    }
  }

  componentDidMount(): void {
    if (this.animationRef && this.animationRef.current) {
      lottie.loadAnimation({
        container: this.animationRef.current,
        loop: false,
        autoplay: true,
        animationData: this.animation
      })
    }
  }

  render() {
    return (
      <div className='texts'>
        <div className='main'>
          {this.renderAnimation()}
          {this.renderContent()}
        </div>
      </div>
    )
  }

  private handleOnDisclaimerClick(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  private renderAnimation() {
    if (this.animation) {
      return (
        <div className='animation'>
          <div id='app-animation-container' ref={this.animationRef} />
        </div>
      )
    }
  }

  private renderContent() {
    if (this.props.isDisclaimer) {
      return (
        <div className='disclaimer' style={this.firstCSS}>
          <div
            className='disclaimerLink'
            onClick={() =>
              this.handleOnDisclaimerClick(this.props.disclaimerLink)
            }
          >
            <BiInfoCircle className='infoIcon' />
          </div>

          {this.renderText()}
          {this.renderVideo()}
        </div>
      )
    } else {
      return (
        <div className='text' style={this.firstCSS}>
          {this.renderText()}
          {this.renderVideo()}
        </div>
      )
    }
  }

  private renderText() {
    return <>{parse(markdown.render(this.props.text || ''))}</>
  }

  private renderVideo() {
    if (this.props.video) {
      return (
        <ReactPlayer width='250px' height='166.5px' url={this.props.video} />
      )
    }
  }
}
