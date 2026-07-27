import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { About } from './About'

const renderAbout = () => render(<About />, { wrapper: MemoryRouter })

describe('About', () => {
  it('renders the name heading', () => {
    renderAbout()
    expect(screen.getByRole('heading', { name: /khakim bakhramov/i })).toBeInTheDocument()
  })

  it('renders the bio paragraph', () => {
    renderAbout()
    expect(screen.getByText(/frontend developer from uzbekistan/i)).toBeInTheDocument()
  })

  it('renders the RS School link with correct href', () => {
    renderAbout()
    const link = screen.getByRole('link', { name: /rs school/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://rs.school/')
  })

  it('renders the RS School link with target _blank', () => {
    renderAbout()
    const link = screen.getByRole('link', { name: /rs school/i })
    expect(link).toHaveAttribute('target', '_blank')
  })
})
