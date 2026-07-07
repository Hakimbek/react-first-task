import { Component } from 'react'

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

export class Person extends Component<PersonType> {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.height}</td>
        <td>{this.props.mass}</td>
        <td>{this.props.hair_color}</td>
        <td>{this.props.skin_color}</td>
        <td>{this.props.eye_color}</td>
        <td>{this.props.birth_year}</td>
        <td>{this.props.gender}</td>
      </tr>
    )
  }
}
