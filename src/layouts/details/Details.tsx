'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/navigation.ts'
import { getPeople } from '../../services/getPeople.ts'
import { API_URL } from '../home/Home.tsx'
import type { PersonType } from '../../components/person/Person.tsx'
import { useQuery } from '@tanstack/react-query'

export const Details = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const tDetails = useTranslations('details')
  const tPeople = useTranslations('people')

  const {
    data: person,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['person', id],
    queryFn: () => getPeople<PersonType>(`${API_URL}/${id}/`),
  })

  if (isLoading) return <p className="p-3">{tDetails('loading')}</p>
  if (isError) return <p className="p-3 text-danger">{tDetails('error')}</p>
  if (!person) return null

  return (
    <div className="card d-inline-block m-4 p-3">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="card-title">{person.name}</h5>
        <Link href={`/?${searchParams}`} className="btn-close" aria-label="Close" />
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">{tPeople('height')}</th>
            <th scope="col">{tPeople('mass')}</th>
            <th scope="col">{tPeople('hairColor')}</th>
            <th scope="col">{tPeople('skinColor')}</th>
            <th scope="col">{tPeople('eyeColor')}</th>
            <th scope="col">{tPeople('birthYear')}</th>
            <th scope="col">{tPeople('gender')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{person.height}</td>
            <td>{person.mass}</td>
            <td>{person.hair_color}</td>
            <td>{person.skin_color}</td>
            <td>{person.eye_color}</td>
            <td>{person.birth_year}</td>
            <td>{person.gender}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
