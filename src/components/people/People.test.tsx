import { render, screen } from '@testing-library/react'
import { People } from './People'
import type { PersonType } from '../person/Person'

const mockPeople: PersonType[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
  },
  {
    name: 'Leia Organa',
    height: '150',
    mass: '49',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    birth_year: '19BBY',
    gender: 'female',
  },
]

describe('People', () => {
  it('renders all column headers', () => {
    render(<People people={[]} />)
    const headers = [
      'Name',
      'Height',
      'Mass',
      'Hair color',
      'Skin color',
      'Eye color',
      'Birth year',
      'Gender',
    ]
    headers.forEach((header) =>
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument(),
    )
  })

  it('renders each person name', () => {
    render(<People people={mockPeople} />)
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Leia Organa')).toBeInTheDocument()
  })

  it('renders an empty table body when people list is empty', () => {
    render(<People people={[]} />)
    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
