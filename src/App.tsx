import { Search } from './components/search/Search.tsx'
import { People } from './components/people/People.tsx'
import type { PersonType } from './components/person/Person.tsx'
import { Navigation } from './components/navigation/Navigation.tsx'
import type { ResultType } from './type.ts'
import { getPeople } from './services/getPeople.ts'
import { useState, useEffect } from 'react'

export const URL = 'https://swapi.dev/api/people'

const savedSearch = localStorage.getItem('search') ?? ''

type Query = {
  search: string
  page: number
}

export const App = () => {
  const [searchInput, setSearchInput] = useState<string>(savedSearch)
  const [query, setQuery] = useState<Query>({ search: savedSearch, page: 1 })
  const [people, setPeople] = useState<PersonType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<null | string>(null)
  const [next, setNext] = useState<null | string>(null)
  const [previous, setPrevious] = useState<null | string>(null)

  useEffect(() => {
    const fetchPeople = async (search: string, page: number) => {
      setLoading(true)
      setError(null)

      localStorage.setItem('search', search)

      try {
        const params = new URLSearchParams({
          search,
          page: String(page),
        })
        const { results, next, previous } = await getPeople<ResultType>(`${URL}/?${params}`)
        setPeople(results)
        setNext(next)
        setPrevious(previous)
      } catch {
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchPeople(query.search, query.page)
  }, [query])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput === query.search) return

    setQuery({ search: searchInput, page: 1 })
  }

  const handleSearch = (search: string) => setSearchInput(search.trim())

  const handleNext = () => {
    setQuery((q) => ({ ...q, page: q.page + 1 }))
  }

  const handlePrev = () => {
    setQuery((q) => ({ ...q, page: q.page - 1 }))
  }

  const handleError = () => setError('Error')

  if (error) throw new Error(error)

  return (
    <>
      <Search
        search={searchInput}
        isLoading={loading}
        onSubmit={handleSubmit}
        onChange={handleSearch}
        onError={handleError}
      />
      <People people={people} />
      <Navigation
        next={next}
        previous={previous}
        page={query.page}
        onNext={handleNext}
        onPrev={handlePrev}
        isLoading={loading}
      />
    </>
  )
}

export default App
