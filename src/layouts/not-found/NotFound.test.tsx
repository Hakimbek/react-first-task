import { render, screen } from '@testing-library/react'
import { NotFound } from './NotFound'

const renderNotFound = () => render(<NotFound />)

describe('NotFound', () => {
  it('renders the 404 heading', () => {
    renderNotFound()
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('renders the page not found message', () => {
    renderNotFound()
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it('renders a link to the home page', () => {
    renderNotFound()
    const link = screen.getByRole('link', { name: /go back home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
