import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './Navigation'

const defaultProps = {
  next: 'https://swapi.dev/api/people/?page=3',
  previous: 'https://swapi.dev/api/people/?page=1',
  page: 2,
  onNext: jest.fn(),
  onPrev: jest.fn(),
  isLoading: false,
}

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders current page number', () => {
    render(<Navigation {...defaultProps} page={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onNext when next button is clicked', async () => {
    const onNext = jest.fn()
    render(<Navigation {...defaultProps} onNext={onNext} />)
    const [, nextButton] = screen.getAllByRole('button')
    await userEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when previous button is clicked', async () => {
    const onPrev = jest.fn()
    render(<Navigation {...defaultProps} onPrev={onPrev} />)
    const [prevButton] = screen.getAllByRole('button')
    await userEvent.click(prevButton)
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('disables previous button when previous is null', () => {
    render(<Navigation {...defaultProps} previous={null} />)
    const [prevButton] = screen.getAllByRole('button')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button when next is null', () => {
    render(<Navigation {...defaultProps} next={null} />)
    const [, nextButton] = screen.getAllByRole('button')
    expect(nextButton).toBeDisabled()
  })

  it('disables both buttons when isLoading is true', () => {
    render(<Navigation {...defaultProps} isLoading={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => expect(button).toBeDisabled())
  })

  it('enables both buttons when isLoading is false and urls are provided', () => {
    render(<Navigation {...defaultProps} isLoading={false} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => expect(button).not.toBeDisabled())
  })
})
