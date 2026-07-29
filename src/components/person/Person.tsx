import { Link, useSearchParams } from 'react-router-dom'

export type PersonType = {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  url: string
}

export const Person = ({
  name,
  height,
  mass,
  hair_color,
  skin_color,
  eye_color,
  birth_year,
  gender,
  url,
}: PersonType) => {
  const [searchParams] = useSearchParams()
  const id = url.split('/').filter(Boolean).pop()

  return (
    <tr>
      <td scope="col">
        <div className="d-flex justify-content-center">
          <input className="form-check-input" type="checkbox" />
        </div>
      </td>
      <th>
        <Link to={`/details/${id}?${searchParams}`}>{name}</Link>
      </th>
      <td>{height}</td>
      <td>{mass}</td>
      <td>{hair_color}</td>
      <td>{skin_color}</td>
      <td>{eye_color}</td>
      <td>{birth_year}</td>
      <td>{gender}</td>
    </tr>
  )
}
