'use client'

import { Search } from '../../components/search/Search.tsx'
import { People } from '../../components/people/People.tsx'
import { Navigation } from '../../components/navigation/Navigation.tsx'
import type { ResultType } from '../../type.ts'
import { getPeople } from '../../services/getPeople.ts'
import { useState, useEffect, type FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const API_URL = 'https://swapi.py4e.com/api/people'

export const Home = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const search = searchParams.get('search') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState<string>(search)
  const [manualError, setManualError] = useState(false)

  useEffect(() => {
    localStorage.setItem('search', search)
  }, [search])

  if (manualError) throw new Error('Error')

  const params = new URLSearchParams({ search, page: String(page) })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['people', search, page],
    queryFn: () => getPeople<ResultType>(`${API_URL}/?${params}`),
  })

  if (isError) throw new Error('Something went wrong')

  const go = (p: Record<string, string>) => router.push(`/?${new URLSearchParams(p)}`)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = searchInput.trim()
    if (trimmed === search) return
    go({ search: trimmed, page: '1' })
  }

  return (
    <>
      <Search
        search={searchInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={setSearchInput}
        onError={() => setManualError(true)}
        onInvalidate={() => queryClient.invalidateQueries({ queryKey: ['people'] })}
      />
      <People people={data?.results ?? []} />
      <Navigation
        next={data?.next ?? null}
        previous={data?.previous ?? null}
        page={page}
        onNext={() => go({ search, page: String(page + 1) })}
        onPrev={() => go({ search, page: String(page - 1) })}
        isLoading={isLoading}
      />
    </>
  )
}
