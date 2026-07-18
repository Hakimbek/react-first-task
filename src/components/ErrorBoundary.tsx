import { Component, type ReactNode } from 'react'
import { Error } from './error/Error.tsx'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <Error />
    }

    return this.props.children
  }
}
