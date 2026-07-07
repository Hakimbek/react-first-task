import { Component } from 'react'

type NavigationProps = {
  next: null | string
  previous: null | string
  page: number
  onNext: () => void
  onPrev: () => void
  isLoading: boolean
}

export class Navigation extends Component<NavigationProps> {
  render() {
    return (
      <div className="container-fluid d-flex gap-3 justify-content-center position-absolute bottom-0 py-3 bg-light border-top">
        <button
          disabled={!this.props.previous || this.props.isLoading}
          className="btn btn-primary"
          onClick={() => this.props.onPrev()}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <p className="p-0 m-0 fw-bold d-flex align-items-center">{this.props.page}</p>
        <button
          disabled={!this.props.next || this.props.isLoading}
          className="btn btn-primary"
          onClick={() => this.props.onNext()}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    )
  }
}
