import { Search } from './components/Search.tsx'
import { People } from './components/People.tsx'
import type { PersonType } from './components/Person.tsx'
import type { ResultType } from './type.ts'
import { Component } from 'react'

const URL = 'https://swapi.dev/api/people'

type State = {
  search: string
  people: PersonType[]
  loading: boolean
  error: null | string
}

class App extends Component {
  state: State = {
    search: '',
    people: [],
    loading: true,
    error: null,
  }

  handleSearch = (search: string) => this.setState({ search })

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const response = await fetch(URL)
      const { results }: ResultType = await response.json()
      this.setState({ people: results, loading: false })
    } catch {
      this.setState({ error: 'Something went wrong', loading: false })
    }
  }

  render() {
    return (
      <>
        <Search
          search={this.state.search}
          onChange={this.handleSearch}
          isLoading={this.state.loading}
        />
        <People people={this.state.people} />
      </>
    )
  }
}

export default App
