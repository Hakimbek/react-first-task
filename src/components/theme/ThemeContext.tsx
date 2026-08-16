'use client'

import type { ThemeContextType, Theme } from './theme.ts'
import { createContext, useState, useEffect, useContext } from 'react'
import { getInitialTheme } from '../../services/getTheme.ts'

type ThemeProviderProps = {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))

  const setTheme = (newTheme: Theme) => setThemeState(newTheme)

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
