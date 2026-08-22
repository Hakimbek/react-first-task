import { useTheme } from '../theme/ThemeContext.tsx'

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} className="btn border-0">
      {theme === 'dark' ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
    </button>
  )
}
