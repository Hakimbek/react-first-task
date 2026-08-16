import { Suspense } from 'react'
import { Home } from '../../layouts/home/Home.tsx'

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}
