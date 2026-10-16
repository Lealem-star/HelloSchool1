'use client'

import React, { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage, type Language } from './language-provider'

interface LanguageToggleProps {
  className?: string
  size?: 'sm' | 'md'
}

export function LanguageToggle({ className = '', size = 'md' }: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`flex items-center rounded-xl border border-border/60 bg-background/50 px-2 py-1 text-xs text-muted-foreground ${className}`}
        aria-hidden="true"
      >
        <span className="size-3 animate-pulse rounded-full bg-muted" />
        <span className="ml-1.5 h-3 w-8 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label={t('languageToggle')}
      className={`inline-flex items-center rounded-xl border border-border/70 bg-card/70 p-1 shadow-sm backdrop-blur-md transition-colors hover:border-cyan-400/50 ${className}`}
    >
      <div className="flex items-center pl-1 pr-1.5 text-muted-foreground" aria-hidden="true">
        <Globe className="size-3.5" />
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setLanguage('am')}
          aria-pressed={language === 'am'}
          aria-label="Amharic / አማርኛ"
          className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all duration-200 ${
            language === 'am'
              ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }`}
        >
          አማ
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          aria-label="English"
          className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all duration-200 ${
            language === 'en'
              ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}
