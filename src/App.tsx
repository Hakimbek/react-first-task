import { Search } from './components/Search.tsx'
import { People } from './components/People.tsx'
import type { PersonType } from './components/Person.tsx'
import type { ResultType } from './type.ts'
import { Component } from 'react'
import { getPeople } from './serices/getPeople.ts'

export const URL = 'https://swapi.dev/api/people'

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

  componentDidMount = async () => {
    this.fetchPeople()
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.fetchPeople()
  }

  handleSearch = (search: string) => this.setState({ search })

  fetchPeople = async () => {
    this.setState({ loading: true, error: null })
    try {
      const params = new URLSearchParams({ search: this.state.search })
      const { results } = await getPeople<ResultType>(`${URL}/?${params}`)
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
          onSubmit={this.handleSubmit}
        />
        <People people={this.state.people} />
      </>
    )
  }
}

export default App
