import { Search } from '../../components/search/Search.tsx'
import { People } from '../../components/people/People.tsx'
import { Navigation } from '../../components/navigation/Navigation.tsx'
import type { ResultType } from '../../type.ts'
import { getPeople } from '../../services/getPeople.ts'
import { useState } from 'react'
import { useSearchParams, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

export const URL = 'https://swapi.py4e.com/api/people'

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') ?? localStorage.getItem('search') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const [searchInput, setSearchInput] = useState<string>(search)

  localStorage.setItem('search', search)

  const params = new URLSearchParams({ search, page: String(page) })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['people', search, page],
    queryFn: () => getPeople<ResultType>(`${URL}/?${params}`),
  })

  if (isError) throw new Error('Something went wrong')

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

  const handleError = () => {
    throw new Error('Error')
  }

  return (
    <>
      <Search
        search={searchInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={handleSearch}
        onError={handleError}
      />
      <People people={data?.results ?? []} />
      <Outlet />
      <Navigation
        next={data?.next ?? null}
        previous={data?.previous ?? null}
        page={page}
        onNext={handleNext}
        onPrev={handlePrev}
        isLoading={isLoading}
      />
    </>
  )
}
