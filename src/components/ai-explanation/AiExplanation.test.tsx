import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AiExplanation } from './AiExplanation'

// Use a factory so Jest never loads the real action module (which would trigger
// the @google/genai ESM import chain even though it's auto-mocked).
jest.mock('../../app/actions/explain', () => ({
  explainPersonAction: jest.fn(),
}))

// Import AFTER mock registration — gets the jest.fn() from the factory above.
import { explainPersonAction } from '../../app/actions/explain'

const mockExplainPersonAction = explainPersonAction as jest.Mock

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

describe('AiExplanation', () => {
  beforeEach(() => {
    mockExplainPersonAction.mockClear()
  })

  it('renders the explain button initially', () => {
    render(<AiExplanation person={mockPerson} />)
    expect(screen.getByRole('button', { name: /explain this item with ai/i })).toBeInTheDocument()
  })

  it('disables the button and shows loading text while the request is pending', async () => {
    mockExplainPersonAction.mockImplementation(() => new Promise(() => {}))
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    const button = screen.getByRole('button', { name: /generating/i })
    expect(button).toBeDisabled()
  })

  it('displays the explanation and AI disclaimer on success', async () => {
    mockExplainPersonAction.mockResolvedValue({ explanation: 'Luke is a heroic Jedi.' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => expect(screen.getByText('Luke is a heroic Jedi.')).toBeInTheDocument())
    expect(screen.getByText(/ai-generated content may be inaccurate/i)).toBeInTheDocument()
  })

  it('changes button label to "Regenerate" after a successful explanation', async () => {
    mockExplainPersonAction.mockResolvedValue({ explanation: 'Luke is a heroic Jedi.' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument(),
    )
  })

  it('displays a localized error message and retry button on failure', async () => {
    mockExplainPersonAction.mockResolvedValue({ errorCode: 'unknown' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() =>
      expect(screen.getByText(/failed to generate explanation/i)).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows a quota-specific error message for quota_exceeded', async () => {
    mockExplainPersonAction.mockResolvedValue({ errorCode: 'quota_exceeded' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => expect(screen.getByText(/quota exceeded/i)).toBeInTheDocument())
  })

  it('does not call the action again on a plain re-render after success', async () => {
    mockExplainPersonAction.mockResolvedValue({ explanation: 'Luke is a heroic Jedi.' })
    const { rerender } = render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => expect(screen.getByText('Luke is a heroic Jedi.')).toBeInTheDocument())

    rerender(<AiExplanation person={mockPerson} />)
    expect(mockExplainPersonAction).toHaveBeenCalledTimes(1)
  })

  it('does not send the url field to the action', async () => {
    mockExplainPersonAction.mockResolvedValue({ explanation: 'Luke is a heroic Jedi.' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => expect(mockExplainPersonAction).toHaveBeenCalled())
    const [personArg] = mockExplainPersonAction.mock.calls[0] as [Record<string, unknown>]
    expect(personArg).not.toHaveProperty('url')
  })

  it('calls the action a second time when the user clicks Regenerate', async () => {
    mockExplainPersonAction.mockResolvedValue({ explanation: 'Luke is a heroic Jedi.' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => screen.getByRole('button', { name: /regenerate/i }))

    mockExplainPersonAction.mockResolvedValue({ explanation: 'New explanation.' })
    await userEvent.click(screen.getByRole('button', { name: /regenerate/i }))
    await waitFor(() => expect(screen.getByText('New explanation.')).toBeInTheDocument())
    expect(mockExplainPersonAction).toHaveBeenCalledTimes(2)
  })

  it('calls the action again when the user clicks Retry after an error', async () => {
    mockExplainPersonAction.mockResolvedValue({ errorCode: 'unknown' })
    render(<AiExplanation person={mockPerson} />)
    await userEvent.click(screen.getByRole('button', { name: /explain/i }))
    await waitFor(() => screen.getByRole('button', { name: /try again/i }))

    mockExplainPersonAction.mockResolvedValue({ explanation: 'Recovered explanation.' })
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    await waitFor(() => expect(screen.getByText('Recovered explanation.')).toBeInTheDocument())
    expect(mockExplainPersonAction).toHaveBeenCalledTimes(2)
  })
})
