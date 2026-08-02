import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext.tsx'
import { getInitialTheme } from '../../services/getTheme.ts'

jest.mock('../../services/getTheme.ts', () => ({
  getInitialTheme: jest.fn(),
}))

const mockGetInitialTheme = getInitialTheme as jest.Mock

const ThemeConsumer = () => {
  const { theme, toggleTheme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('light')}>set-light</button>
    </div>
  )
}

describe('ThemeProvider / useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetInitialTheme.mockReturnValue('light')

    jest.spyOn(Storage.prototype, 'setItem')
    jest.spyOn(document.documentElement, 'setAttribute')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    document.documentElement.removeAttribute('data-bs-theme')
  })

  it('initializes theme using getInitialTheme', () => {
    mockGetInitialTheme.mockReturnValue('dark')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(mockGetInitialTheme).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })

  it('sets localStorage and data-bs-theme attribute on mount', () => {
    mockGetInitialTheme.mockReturnValue('light')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'light')
  })

  it('toggleTheme flips between light and dark', async () => {
    const user = userEvent.setup()
    mockGetInitialTheme.mockReturnValue('light')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')

    await user.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(localStorage.setItem).toHaveBeenLastCalledWith('theme', 'dark')
    expect(document.documentElement.setAttribute).toHaveBeenLastCalledWith('data-bs-theme', 'dark')

    await user.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('setTheme sets an explicit theme value', async () => {
    const user = userEvent.setup()
    mockGetInitialTheme.mockReturnValue('light')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    await user.click(screen.getByText('set-dark'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')

    await user.click(screen.getByText('set-light'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">hello</div>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('child')).toHaveTextContent('hello')
  })

  it('useTheme throws when used outside a ThemeProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const BadConsumer = () => {
      useTheme()
      return null
    }

    expect(() => render(<BadConsumer />)).toThrow('useTheme must be used within a ThemeProvider')

    consoleErrorSpy.mockRestore()
  })
})
