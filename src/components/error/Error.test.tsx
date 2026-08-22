import { render, screen } from '@testing-library/react'
import { Error } from './Error'

describe('Error', () => {
  it('renders error message', () => {
    render(<Error />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders error message as a heading', () => {
    render(<Error />)
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()
  })
})
