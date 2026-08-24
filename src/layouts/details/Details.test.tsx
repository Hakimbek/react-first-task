import { render, screen, waitFor } from '@testing-library/react'
import { Details } from './Details'
import { getPeople } from '../../services/getPeople'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'

jest.mock('../../services/getPeople')
jest.mock('../../components/ai-explanation/AiExplanation', () => ({
  AiExplanation: () => <div data-testid="ai-explanation" />,
}))

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

const createClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderDetails = (client = createClient()) =>
  render(
    <QueryClientProvider client={client}>
      <Details />
    </QueryClientProvider>,
  )

describe('Details', () => {
  beforeEach(() => {
    mockGetPeople.mockResolvedValue(mockPerson)
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
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
    renderDetails()
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

  it('renders the AI explanation component after data loads', async () => {
    renderDetails()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    expect(screen.getByTestId('ai-explanation')).toBeInTheDocument()
  })

  it('refetches when id changes', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
    const client = createClient()
    const { rerender } = renderDetails(client)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))

    ;(useParams as jest.Mock).mockReturnValue({ id: '2' })
    rerender(
      <QueryClientProvider client={client}>
        <Details />
      </QueryClientProvider>,
    )
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(2))
    expect(mockGetPeople).toHaveBeenLastCalledWith(expect.stringContaining('/2/'))
  })
})
