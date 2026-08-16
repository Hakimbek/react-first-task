'use client'

import { useSearchParams } from 'next/navigation'
import { Link } from '../../i18n/navigation.ts'
import { useSelectionStore } from '../../services/useSelectionStore.ts'

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

export const Person = (person: PersonType) => {
  const { name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, url } = person
  const searchParams = useSearchParams()
  const id = url.split('/').filter(Boolean).pop()

  const selected = useSelectionStore((state) => state.selected.has(url))
  const toggle = useSelectionStore((state) => state.toggle)

  return (
    <tr>
      <td scope="col">
        <div className="d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            checked={selected}
            onChange={() => toggle(person)}
          />
        </div>
      </td>
      <th>
        <Link href={`/details/${id}?${searchParams}`}>{name}</Link>
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
