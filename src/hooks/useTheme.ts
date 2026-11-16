import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_COLORS: Record<Theme, string> = { light: '#f5efe3', dark: '#141518' }

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

/** Theme state synced with <html data-theme> (initialised in index.html). */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* storage unavailable — theme still applies for this visit */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
