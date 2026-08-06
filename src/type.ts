import type { PersonType } from './components/Person.tsx'

export type ResultType = {
  count: number
  results: PersonType[]
  next: null | string
  previous: null | string
}
