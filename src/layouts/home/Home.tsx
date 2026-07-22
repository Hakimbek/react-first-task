import { Search } from '../../components/search/Search.tsx'
import { People } from '../../components/people/People.tsx'
import type { PersonType } from '../../components/person/Person.tsx'
import { Navigation } from '../../components/navigation/Navigation.tsx'
import type { ResultType } from '../../type.ts'
import { getPeople } from '../../services/getPeople.ts'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const URL = 'https://swapi.dev/api/people'

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') ?? localStorage.getItem('search') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const [searchInput, setSearchInput] = useState<string>(search)
  const [people, setPeople] = useState<PersonType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<null | string>(null)
  const [next, setNext] = useState<null | string>(null)
  const [previous, setPrevious] = useState<null | string>(null)

  useEffect(() => {
    const fetchPeople = async () => {
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

    fetchPeople()
  }, [search, page])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchInput === search) return

    setSearchParams({ search: searchInput, page: '1' })
  }

  const handleSearch = (value: string) => setSearchInput(value.trim())

  const handleNext = () => {
    setSearchParams({ search, page: String(page + 1) })
  }

  const handlePrev = () => {
    setSearchParams({ search, page: String(page - 1) })
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
        page={page}
        onNext={handleNext}
        onPrev={handlePrev}
        isLoading={loading}
      />
    </>
  )
}
