import React from 'react'
import { Toolbar } from '../toolbar'
import './index.css'

export class Wrap extends React.Component<Wrap.Props, Wrap.State> {
  private container: HTMLDivElement

  constructor(props: Wrap.Props) {
    super(props)
    Wrap.restoreIframeSize()
  }

  componentDidMount() {
    this.updateIframeSize()

    if (window.ResizeObserver) {
      const ro = new window.ResizeObserver(() => {
        this.updateIframeSize()
      })
      ro.observe(this.container)
    } else {
      window.addEventListener('resize', () => this.updateIframeSize())
    }
  }

  updateIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const height = this.container.scrollHeight || this.container.clientHeight

      iframe.style.width = '100%'
      iframe.style.height = `${height + 16}px`
      iframe.style.border = '0'
      iframe.style.overflow = 'hidden'
      Wrap.saveIframeSize()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="demo-wrap" ref={this.refContainer}>
        <Toolbar />
        {this.props.children}
      </div>
    )
  }
}

export namespace Wrap {
  export interface Props {}
  export interface State {}
}

export namespace Wrap {
  const STORE_KEY = window.location.pathname
  const STORE_ROOT = 'x6-iframe-size'

  function getData() {
    const raw = localStorage.getItem(STORE_ROOT)
    let data
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch (error) {}
    } else {
      data = {}
    }
    return data
  }

  export function saveIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const style = iframe.style
      const size = { width: style.width, height: style.height }
      const data = getData()
      data[STORE_KEY] = size
      localStorage.setItem(STORE_ROOT, JSON.parse(data))
    }
  }

  export function restoreIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const data = getData()
      const size = data[STORE_KEY]
      if (size) {
        iframe.style.width = size.width || '100%'
        iframe.style.height = size.height || 'auto'
      }
    }
  }
}
