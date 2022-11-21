import React from 'react'
import CustomButton from '../../../components/CustomButton'
import Ui from '../../../utils/ui'
import Connection from '../../../utils/connection'
import './Splash.scss'

export interface Links {
  linkName: string
  link: string
}
export interface SplashProps {
  title: string
  image: string
  textButton: string
  links: Links[]
  connection: Connection
  ui: Ui
}
export default class Splash extends React.Component<SplashProps> {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='splash-wrapper'>
        {this.renderBackground()}
        {this.renderTitle()}
        <div className='button-wrapper'>{this.renderInteractiveButton()}</div>
        <div className='footer-wrapper'>{this.renderHyperLinks()}</div>
      </div>
    )
  }
  private renderTitle() {
    if (this.props.title) {
      return <h1 className='title'>{this.props.title.toUpperCase()}</h1>
    }
  }

  private renderBackground() {
    if (this.props.image) {
      return (
        <div className={'image'}>
          <img src={this.props.image} alt='splashBackground' />
        </div>
      )
    }
  }
  private renderInteractiveButton() {
    return (
      <CustomButton
        sendValueOnClick={() => {
          this.props.connection.send('')
          this.props.ui.showOverlayComponent(false)
        }}
        text={this.props.textButton}
        customWidth='60%'
      />
    )
  }

  private renderHyperLinks() {
    if (this.props.links) {
      return this.props.links.map((item, index) => {
        return (
          <div key={index} className='links'>
            <div onClick={() => this.openLinkInNewTab(item.link)}>
              {item.linkName.toUpperCase()}
            </div>
          </div>
        )
      })
    }
  }
  private openLinkInNewTab(url: string) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
}
