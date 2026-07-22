import { Person } from '../person/Person.tsx'
import type { PersonType } from '../person/Person.tsx'

type PeopleProps = {
  people: PersonType[]
}

export const People = ({ people }: PeopleProps) => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th scope="col">Name</th>
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
              {people.map((person) => (
                <Person key={person.name} {...person} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
