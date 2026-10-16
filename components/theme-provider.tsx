'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'hellotvet_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initialTheme = stored || (localStorage.getItem('theme') as Theme | null) || 'system'
    setThemeState(initialTheme)

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialResolved = initialTheme === 'system' ? (systemDark ? 'dark' : 'light') : initialTheme
    setResolvedTheme(initialResolved)

    applyTheme(initialResolved)
  }, [])

  // Listen for system theme changes if theme is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const next = e.matches ? 'dark' : 'light'
        setResolvedTheme(next)
        applyTheme(next)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  function applyTheme(resolved: 'light' | 'dark') {
    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    localStorage.setItem('theme', newTheme)

    let resolved: 'light' | 'dark'
    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = newTheme
    }

    setResolvedTheme(resolved)
    applyTheme(resolved)
  }

  function toggleTheme() {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
