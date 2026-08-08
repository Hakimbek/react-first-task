import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from './Search'

const defaultProps = {
  search: '',
  isLoading: false,
  onChange: jest.fn(),
  onSubmit: jest.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault()),
  onError: jest.fn(),
  onInvalidate: jest.fn(),
}

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with correct value', () => {
    render(<Search {...defaultProps} search="Darth Vader" />)
    expect(screen.getByRole('searchbox')).toHaveValue('Darth Vader')
  })

  it('renders search input with placeholder', () => {
    render(<Search {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls onChange for each character typed', async () => {
    const onChange = jest.fn()
    render(<Search {...defaultProps} onChange={onChange} />)
    await userEvent.type(screen.getByRole('searchbox'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenNthCalledWith(1, 'a')
    expect(onChange).toHaveBeenNthCalledWith(2, 'b')
    expect(onChange).toHaveBeenNthCalledWith(3, 'c')
  })

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(<Search {...defaultProps} onSubmit={onSubmit} />)
    const [submitButton] = screen.getAllByRole('button')
    await userEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when isLoading is true', () => {
    render(<Search {...defaultProps} isLoading={true} />)
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
  })

  it('enables submit button when isLoading is false', () => {
    render(<Search {...defaultProps} isLoading={false} />)
    const [submitButton] = screen.getAllByRole('button')
    expect(submitButton).not.toBeDisabled()
  })

  it('shows spinner when isLoading is true', () => {
    render(<Search {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('calls onError when Test Error button is clicked', async () => {
    const onError = jest.fn()
    render(<Search {...defaultProps} onError={onError} />)
    await userEvent.click(screen.getByRole('button', { name: /test error/i }))
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('calls onInvalidate when Invalidate Cache button is clicked', async () => {
    const onInvalidate = jest.fn()
    render(<Search {...defaultProps} onInvalidate={onInvalidate} />)
    await userEvent.click(screen.getByRole('button', { name: /invalidate cache/i }))
    expect(onInvalidate).toHaveBeenCalledTimes(1)
  })
})
