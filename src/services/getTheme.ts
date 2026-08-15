import type { Theme } from '../components/theme/theme.ts'

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme') as Theme | null
  return saved ?? 'light'
}
