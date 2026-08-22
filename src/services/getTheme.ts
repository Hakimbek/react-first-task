import type { Theme } from '../components/theme/theme.ts'

export const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme | null

  if (saved) return saved

  return 'light'
}
