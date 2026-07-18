import { render, screen } from '@testing-library/react'
import { Person, type PersonType } from './Person'

const mockPerson: PersonType = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
}

const renderPerson = (props: PersonType) =>
  render(
    <table>
      <tbody>
        <Person {...props} />
      </tbody>
    </table>,
  )

describe('Person', () => {
  it('renders all person fields', () => {
    renderPerson(mockPerson)
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('172')).toBeInTheDocument()
    expect(screen.getByText('77')).toBeInTheDocument()
    expect(screen.getByText('blond')).toBeInTheDocument()
    expect(screen.getByText('fair')).toBeInTheDocument()
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
  })

  it('renders name in a header cell', () => {
    renderPerson(mockPerson)
    expect(screen.getByRole('columnheader', { name: 'Luke Skywalker' })).toBeInTheDocument()
  })
})
