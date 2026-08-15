import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home.tsx'
import { getPeople } from '../../services/getPeople'
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('../../services/getPeople')

const mockGetPeople = getPeople as jest.MockedFunction<typeof getPeople>

const mockResponse = {
  count: 2,
  results: [
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      url: 'https://swapi.dev/api/people/1/',
    },
    {
      name: 'Darth Vader',
      height: '202',
      mass: '136',
      hair_color: 'none',
      skin_color: 'white',
      eye_color: 'yellow',
      birth_year: '41.9BBY',
      gender: 'male',
      url: 'https://swapi.dev/api/people/4/',
    },
  ],
  next: 'https://swapi.dev/api/people/?page=2',
  previous: null,
}

const createClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderHome = (ui = <Home />) =>
  render(<QueryClientProvider client={createClient()}>{ui}</QueryClientProvider>)

const renderHomeWithBoundary = () =>
  render(
    <QueryClientProvider client={createClient()}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </QueryClientProvider>,
  )

describe('App', () => {
  beforeEach(() => {
    mockGetPeople.mockResolvedValue(mockResponse)
    localStorage.clear()
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input, table, and navigation on mount', async () => {
    renderHome()
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('fetches people on mount', async () => {
    renderHome()
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    expect(mockGetPeople).toHaveBeenCalledWith(expect.stringContaining('swapi.py4e.com'))
  })

  it('renders fetched people in the table', async () => {
    renderHome()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()
  })

  it('disables submit and navigation buttons while loading', () => {
    mockGetPeople.mockImplementation(() => new Promise(() => {}))
    renderHome()
    const [submitButton, , , prevButton, nextButton] = screen.getAllByRole('button')
    expect(submitButton).toBeDisabled()
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('enables next button when next page is available', async () => {
    renderHome()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).not.toBeDisabled()
  })

  it('calls router.push with page=2 when next is clicked', async () => {
    const push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })
    renderHome()
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    await userEvent.click(screen.getAllByRole('button').at(-1)!)
    expect(push).toHaveBeenCalledWith(expect.stringContaining('page=2'))
  })

  it('does not refetch when submitting the same search', async () => {
    renderHome()
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    const [submitButton] = screen.getAllByRole('button')
    await userEvent.click(submitButton)
    expect(mockGetPeople).toHaveBeenCalledTimes(1)
  })

  it('calls router.push with search term when submitting a new search', async () => {
    const push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })
    renderHome()
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    await userEvent.type(screen.getByRole('searchbox'), 'yoda')
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(push).toHaveBeenCalledWith(expect.stringContaining('search=yoda'))
  })

  it('saves search to localStorage on fetch', async () => {
    renderHome()
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    expect(localStorage.getItem('search')).toBe('')
  })

  it('shows error UI when fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockGetPeople.mockRejectedValue(new Error('Network error'))
    renderHomeWithBoundary()
    await waitFor(() => expect(screen.getByText('Something went wrong')).toBeInTheDocument())
    jest.restoreAllMocks()
  })

  it('shows error UI when Test Error button is clicked', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    renderHomeWithBoundary()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /test error/i })).toBeInTheDocument(),
    )
    await userEvent.click(screen.getByRole('button', { name: /test error/i }))
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    jest.restoreAllMocks()
  })
})
