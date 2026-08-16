import { Suspense } from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Home, API_URL } from '../../layouts/home/Home.tsx'
import { getPeople } from '../../services/getPeople.ts'
import type { ResultType } from '../../type.ts'

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function Page({ searchParams }: Props) {
  const { search = '', page = '1' } = await searchParams
  const pageNum = Number(page)

  const queryClient = new QueryClient()
  const params = new URLSearchParams({ search, page })

  await queryClient.prefetchQuery({
    queryKey: ['people', search, pageNum],
    queryFn: () => getPeople<ResultType>(`${API_URL}/?${params}`),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Home />
      </Suspense>
    </HydrationBoundary>
  )
}
