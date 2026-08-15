import { Suspense } from 'react'
import { Details } from '../../../layouts/details/Details.tsx'

export default function DetailsPage() {
  return (
    <Suspense>
      <Details />
    </Suspense>
  )
}
