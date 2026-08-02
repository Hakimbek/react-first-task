import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useTheme } from '../theme/ThemeContext.tsx'

jest.mock('../theme/ThemeContext.tsx', () => ({
  useTheme: jest.fn(),
}))

const mockUseTheme = useTheme as jest.Mock

describe('ThemeSwitcher', () => {
  const toggleTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the moon icon when theme is light', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme })

    render(<ThemeSwitcher />)

    const icon = screen.getByRole('button').querySelector('i')
    expect(icon).toHaveClass('bi-moon')
    expect(icon).not.toHaveClass('bi-sun')
  })

  it('renders the sun icon when theme is dark', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme })

    render(<ThemeSwitcher />)

    const icon = screen.getByRole('button').querySelector('i')
    expect(icon).toHaveClass('bi-sun')
    expect(icon).not.toHaveClass('bi-moon')
  })

  it('applies the expected button classes', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme })

    render(<ThemeSwitcher />)

    expect(screen.getByRole('button')).toHaveClass('btn', 'border-0')
  })

  it('calls toggleTheme when clicked', async () => {
    const user = userEvent.setup()
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme })

    render(<ThemeSwitcher />)

    await user.click(screen.getByRole('button'))

    expect(toggleTheme).toHaveBeenCalledTimes(1)
  })

  it('calls toggleTheme on each click, independent of theme state', async () => {
    const user = userEvent.setup()
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme })

    render(<ThemeSwitcher />)

    const button = screen.getByRole('button')
    await user.click(button)
    await user.click(button)

    expect(toggleTheme).toHaveBeenCalledTimes(2)
  })
})
