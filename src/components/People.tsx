import { Component } from 'react'
import { Person } from './person/Person.tsx'
import type { PersonType } from './person/Person.tsx'

type PeopleProps = {
  people: PersonType[]
}

export class People extends Component<PeopleProps> {
  render() {
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
                {this.props.people.map(
                  ({
                    name,
                    height,
                    mass,
                    hair_color,
                    skin_color,
                    eye_color,
                    birth_year,
                    gender,
                  }) => (
                    <Person
                      key={name}
                      name={name}
                      height={height}
                      mass={mass}
                      hair_color={hair_color}
                      skin_color={skin_color}
                      eye_color={eye_color}
                      birth_year={birth_year}
                      gender={gender}
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
