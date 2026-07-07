import { Component } from 'react'

export class Search extends Component {
  render() {
    return (
      <div className="container-fluid px-5 py-4 bg-light border-bottom">
        <div className="row">
          <div className="col-5">
            <form className="d-flex gap-2 w-50">
              <input id="search" type="search" className="form-control" placeholder="Search..." />
              <button className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
