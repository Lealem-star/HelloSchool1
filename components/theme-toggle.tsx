'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { useLanguage } from './language-provider'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md'
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { language, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'
  const titleText = isDark ? t('switchToLight') : t('switchToDark')

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground ${
          size === 'sm' ? 'size-8' : 'size-9'
        } ${className}`}
        aria-hidden="true"
      >
        <span className="size-4 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={titleText}
      title={titleText}
      className={`group relative flex items-center justify-center rounded-xl border border-border/70 bg-card/70 text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/60 hover:bg-muted/70 hover:shadow-blue-500/15 active:scale-95 ${
        size === 'sm' ? 'size-8' : 'size-9'
      } ${className}`}
    >
      <div className="relative size-4 sm:size-4.5">
        <Sun
          className={`absolute inset-0 size-full text-amber-500 transition-all duration-300 ${
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 size-full text-sky-400 transition-all duration-300 ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
        />
      </div>
      <span className="sr-only">{titleText}</span>
    </button>
  )
}
