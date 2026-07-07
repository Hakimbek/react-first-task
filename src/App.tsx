import { Search } from './components/Search.tsx'
import { Component } from 'react'

type State = {
  search: string
}

class App extends Component {
  state: State = {
    search: '',
  }

  handleSearch = (search: string) => this.setState({ search })

  render() {
    return (
      <>
        <Search search={this.state.search} onChange={this.handleSearch} />
      </>
    )
  }
}

export default App
