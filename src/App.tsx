import { Search } from './components/search/Search.tsx'
import { People } from './components/People.tsx'
import type { PersonType } from './components/person/Person.tsx'
import { Navigation } from './components/navigation/Navigation.tsx'
import type { ResultType } from './type.ts'
import { Component } from 'react'
import { getPeople } from './services/getPeople.ts'

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

const savedSearch = localStorage.getItem('search') ?? ''

class App extends Component {
  lastSearch: string = savedSearch

  state: State = {
    search: savedSearch,
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

  componentDidUpdate = (_prevProps: unknown, prevState: State) => {
    if (prevState.page !== this.state.page) {
      this.fetchPeople()
    }
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (this.state.search === this.lastSearch) return

    this.lastSearch = this.state.search

    if (this.state.page === 1) {
      this.fetchPeople()
    } else {
      this.setState({ page: 1 })
    }
  }

  handleSearch = (search: string) => this.setState({ search: search.trim() })

  handleNext = async () => {
    this.setState({ page: this.state.page + 1 })
  }

  handlePrev = async () => {
    this.setState({ page: this.state.page - 1 })
  }

  handleError = () => this.setState({ error: 'Error' })

  fetchPeople = async () => {
    this.setState({ loading: true, error: null })
    localStorage.setItem('search', this.state.search)
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
    if (this.state.error) throw new Error(this.state.error)

    return (
      <>
        <Search
          search={this.state.search}
          isLoading={this.state.loading}
          onSubmit={this.handleSubmit}
          onChange={this.handleSearch}
          onError={this.handleError}
        />
        <People people={this.state.people} />
        <Navigation
          next={this.state.next}
          previous={this.state.previous}
          page={this.state.page}
          onNext={this.handleNext}
          onPrev={this.handlePrev}
          isLoading={this.state.loading}
        />
      </>
    )
  }
}

export default App
