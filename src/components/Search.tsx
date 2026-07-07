import { Component } from 'react'

type SearchProps = {
  search: string
  onChange: (search: string) => void
}

export class Search extends Component<SearchProps> {
  render() {
    return (
      <div className="container-fluid px-5 py-4 bg-light border-bottom">
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
              <button className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
