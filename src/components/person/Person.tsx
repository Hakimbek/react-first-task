export type PersonType = {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
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
}: PersonType) => {
  return (
    <tr>
      <th>{name}</th>
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
