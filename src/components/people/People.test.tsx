import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
    url: '',
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
    url: '',
  },
]

describe('People', () => {
  it('renders all column headers', () => {
    render(
      <MemoryRouter>
        <People people={[]} />
      </MemoryRouter>,
    )
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
    render(
      <MemoryRouter>
        <People people={mockPeople} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Leia Organa')).toBeInTheDocument()
  })

  it('renders an empty table body when people list is empty', () => {
    render(
      <MemoryRouter>
        <People people={[]} />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
