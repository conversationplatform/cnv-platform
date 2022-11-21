import React from 'react'
import { CgMenu } from 'react-icons/cg'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import './Footer.scss'

export interface Article {
  url: string
  name: string
}

export interface Link {
  url: string
  name: string
}
export interface FooterProps {
  image: string
  articles: Article[]
  links: Link[]
}

interface IShowFooterState {
  open: boolean
}

export default class Footer extends React.Component<
  FooterProps,
  IShowFooterState
> {
  constructor(props: FooterProps) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    const { open } = this.state

    return (
      <div className='footer-sidebar-wrapper'>
        <div className='footer-wrapper'>
          <CgMenu
            className='icon'
            onClick={() => this.handleToggleSideBar(true)}
          />
        </div>
        <div className={open ? 'sidebar-wrapper open' : 'sidebar-wrapper'}>
          <AiOutlineCloseCircle
            className='icon'
            onClick={() => this.handleToggleSideBar(false)}
          />
          <div className='sidebar'>
            {this.renderLogo()}
            {this.renderArticles()}
            {this.renderLinks()}
          </div>
        </div>
      </div>
    )
  }

  private handleToggleSideBar(value: boolean) {
    this.setState({ open: value })
  }

  private renderArticles() {
    if (!this.props.articles) return

    return this.props.articles.map((item: Article, index: number) => {
      return (
        <a
          key={index}
          className='article'
          href={item.url}
          target='_blank'
          onClick={() => this.handleToggleSideBar(false)}
        >
          {item.name}
        </a>
      )
    })
  }
  private renderLinks() {
    if (!this.props.links) return

    return this.props.links.map((item: Link, index: number) => {
      return (
        <a key={index} className='link' href={item.url} target='_blank'>
          {item.name}
        </a>
      )
    })
  }

  private renderLogo() {
    if (this.props.image) {
      return (
        <img
          className='logo'
          src={this.props.image}
          alt='menuLogo'
          height='24px'
          width='24px'
        />
      )
    } else return <div className='image-wrapper' />
  }
}
