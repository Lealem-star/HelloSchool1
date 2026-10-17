'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { LanguageProvider } from './language-provider'
import { DialogProvider } from './ui/dialog-modal'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DialogProvider>{children}</DialogProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
