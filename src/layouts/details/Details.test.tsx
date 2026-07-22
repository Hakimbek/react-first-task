import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { Details } from './Details'
import { getPeople } from '../../services/getPeople'

jest.mock('../../services/getPeople')

const mockGetPeople = getPeople as jest.MockedFunction<typeof getPeople>

const mockPerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.dev/api/people/1/',
}

const renderDetails = (id = '1') =>
  render(
    <MemoryRouter initialEntries={[`/details/${id}`]}>
      <Routes>
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </MemoryRouter>,
  )

describe('Details', () => {
  beforeEach(() => {
    mockGetPeople.mockResolvedValue(mockPerson)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetPeople.mockImplementation(() => new Promise(() => {}))
    renderDetails()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('fetches person by id on mount', async () => {
    renderDetails('1')
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    expect(mockGetPeople).toHaveBeenCalledWith(expect.stringContaining('/1/'))
  })

  it('renders person name and all fields after fetch', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    expect(screen.getByText('172')).toBeInTheDocument()
    expect(screen.getByText('77')).toBeInTheDocument()
    expect(screen.getByText('blond')).toBeInTheDocument()
    expect(screen.getByText('fair')).toBeInTheDocument()
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
  })

  it('renders all column headers', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    const headers = [
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

  it('renders a close link', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /close/i })).toBeInTheDocument()
  })

  it('refetches when id changes', async () => {
    const NavButton = () => {
      const navigate = useNavigate()
      return <button onClick={() => navigate('/details/2')}>Go to 2</button>
    }

    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <NavButton />
        <Routes>
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))

    await userEvent.click(screen.getByRole('button', { name: 'Go to 2' }))
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(2))
    expect(mockGetPeople).toHaveBeenLastCalledWith(expect.stringContaining('/2/'))
  })
})
