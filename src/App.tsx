import { Search } from './components/Search.tsx'
import { People } from './components/People.tsx'
import type { PersonType } from './components/Person.tsx'
import { Navigation } from './components/Navigation.tsx'
import type { ResultType } from './type.ts'
import { Component } from 'react'
import { getPeople } from './serices/getPeople.ts'

export const URL = 'https://swapi.dev/api/people'

type State = {
  search: string
  people: PersonType[]
  loading: boolean
  error: null | string
  next: null | string
  previous: null | string
  page: number
}

class App extends Component {
  state: State = {
    search: '',
    people: [],
    loading: true,
    error: null,
    next: null,
    previous: null,
    page: 1,
  }

  componentDidMount = async () => {
    this.fetchPeople()
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.fetchPeople()
  }

  handleSearch = (search: string) => this.setState({ search })

  handleNext = async () => {
    this.setState({ page: this.state.page + 1 })
  }

  handlePrev = async () => {
    this.setState({ page: this.state.page - 1 })
  }

  fetchPeople = async () => {
    this.setState({ loading: true, error: null })
    try {
      const params = new URLSearchParams({
        search: this.state.search,
        page: String(this.state.page),
      })
      const { results, next, previous } = await getPeople<ResultType>(`${URL}/?${params}`)
      this.setState({ people: results, loading: false, next, previous })
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
        <Navigation
          next={this.state.next}
          previous={this.state.previous}
          page={this.state.page}
          onNext={this.handleNext}
          onPrev={this.handlePrev}
        />
      </>
    )
  }
}

export default App
