import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getPeople } from '../../services/getPeople.ts'
import { URL } from '../home/Home.tsx'
import type { PersonType } from '../../components/person/Person.tsx'
import { useQuery } from '@tanstack/react-query'

export const Details = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const { data: person, isLoading } = useQuery({
    queryKey: ['person', id],
    queryFn: () => getPeople<PersonType>(`${URL}/${id}/`),
  })

  if (isLoading) return <p className="p-3">Loading...</p>
  if (!person) return null

  return (
    <div className="card d-inline-block m-4 p-3">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="card-title">{person.name}</h5>
        <Link to={`/?${searchParams}`} className="btn-close" aria-label="Close" />
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Height</th>
            <th scope="col">Mass</th>
            <th scope="col">Hair color</th>
            <th scope="col">Skin color</th>
            <th scope="col">Eye color</th>
            <th scope="col">Birth year</th>
            <th scope="col">Gender</th>
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
