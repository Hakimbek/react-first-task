import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { getPeople } from './services/getPeople'
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary'

jest.mock('./services/getPeople')

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
    },
  ],
  next: 'https://swapi.dev/api/people/?page=2',
  previous: null,
}

describe('App', () => {
  beforeEach(() => {
    mockGetPeople.mockResolvedValue(mockResponse)
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input, table, and navigation on mount', async () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('fetches people on mount', async () => {
    render(<App />)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    expect(mockGetPeople).toHaveBeenCalledWith(expect.stringContaining('swapi.py4e.com'))
  })

  it('renders fetched people in the table', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()
  })

  it('disables submit and navigation buttons while loading', () => {
    mockGetPeople.mockImplementation(() => new Promise(() => {}))
    render(<App />)
    const [submitButton, , prevButton, nextButton] = screen.getAllByRole('button')
    expect(submitButton).toBeDisabled()
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('enables next button when next page is available', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).not.toBeDisabled()
  })

  it('increments page and refetches when next is clicked', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Luke Skywalker')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[buttons.length - 1])
    expect(screen.getByText('2')).toBeInTheDocument()
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(2))
  })

  it('does not refetch when submitting the same search', async () => {
    render(<App />)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    const [submitButton] = screen.getAllByRole('button')
    await userEvent.click(submitButton)
    expect(mockGetPeople).toHaveBeenCalledTimes(1)
  })

  it('refetches when submitting a new search', async () => {
    render(<App />)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    await userEvent.type(screen.getByRole('searchbox'), 'yoda')
    const [submitButton] = screen.getAllByRole('button')
    await userEvent.click(submitButton)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(2))
    expect(mockGetPeople).toHaveBeenLastCalledWith(expect.stringContaining('yoda'))
  })

  it('saves search to localStorage on fetch', async () => {
    render(<App />)
    await waitFor(() => expect(mockGetPeople).toHaveBeenCalledTimes(1))
    expect(localStorage.getItem('search')).toBe('')
  })

  it('shows error UI when fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockGetPeople.mockRejectedValue(new Error('Network error'))
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    )
    await waitFor(() => expect(screen.getByText('Something went wrong')).toBeInTheDocument())
    jest.restoreAllMocks()
  })

  it('shows error UI when Test Error button is clicked', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /test error/i })).toBeInTheDocument(),
    )
    await userEvent.click(screen.getByRole('button', { name: /test error/i }))
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    jest.restoreAllMocks()
  })
})
