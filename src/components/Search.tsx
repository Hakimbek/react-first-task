import { Component } from 'react'
import { Spinner } from './Spinner.tsx'

type SearchProps = {
  search: string
  onChange: (search: string) => void
  isLoading: boolean
}

export class Search extends Component<SearchProps> {
  render() {
    return (
      <div className="container-fluid py-4 bg-light border-bottom">
        <div className="row">
          <div className="col-5">
            <form className="d-flex gap-2 w-50">
              <input
                id="search"
                type="search"
                onChange={(e) => this.props.onChange(e.target.value)}
                value={this.props.search}
                className="form-control"
                placeholder="Search..."
              />
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={this.props.isLoading}
              >
                {this.props.isLoading ? <Spinner /> : <i className="bi bi-search"></i>}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
