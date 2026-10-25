'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'am' | 'en'

export const translations = {
  en: {
    // Navigation
    navHome: 'Home',
    navCourses: 'Courses',
    navLibrary: 'Online Courses',
    navAbout: 'About',
    navContact: 'Contact',
    registerNow: 'Create Account',

    // Announcement Ticker
    tickerIntake: 'Digital Academy:',
    tickerMessage: 'Online Video Masterclasses & Technical Schematics Available',
    tickerAction: 'Explore Courses →',
    tickerOpeningSoon: 'Digital Academy',
    tickerOpeningSoonMessage: 'Online Video Masterclasses & Technical Schematics Available',

    // Theme tooltips
    switchToDark: 'Switch to Dark Mode',
    switchToLight: 'Switch to Light Mode',
    languageToggle: 'Change Language',

    // Branding
    schoolTitle: 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል',
    schoolSubtitle: 'Hello Technology Training Center',
    
    // Quick Actions
    exploreCourses: 'Explore Courses',
    contactUs: 'Contact Us',
    reserveBench: 'Enroll Now',
  },
  am: {
    // Navigation
    navHome: 'መነሻ',
    navCourses: 'ስልጠናዎች',
    navLibrary: 'ኦንላይን ኮርሶች',
    navAbout: 'ስለ እኛ',
    navContact: 'አግኙን',
    registerNow: 'አካውንት ይክፈቱ',

    // Announcement Ticker
    tickerIntake: 'ዲጂታል አካዳሚ፡',
    tickerMessage: 'የቪዲዮ ኮርሶች እና ቴክኒካል ማኑዋሎች በኦንላይን ይገኛሉ',
    tickerAction: 'ኮርሶችን ይመልከቱ →',
    tickerOpeningSoon: 'ዲጂታል አካዳሚ',
    tickerOpeningSoonMessage: 'የቪዲዮ ኮርሶች እና ቴክኒካል ማኑዋሎች በኦንላይን ይገኛሉ',

    // Theme tooltips
    switchToDark: 'ወደ ጨለማ ገጽታ ቀይር',
    switchToLight: 'ወደ ብርሃን ገጽታ ቀይር',
    languageToggle: 'ቋንቋ ይምረጡ',

    // Branding
    schoolTitle: 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል',
    schoolSubtitle: 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል · ባሕር ዳር',

    // Quick Actions
    exploreCourses: 'ስልጠናዎችን ይመልከቱ',
    contactUs: 'ያግኙን',
    reserveBench: 'ይመዝገቡ',
  },
} as const

export type TranslationKey = keyof typeof translations.en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'hellotvet_lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('am') // Default to Amharic (or English as chosen)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored === 'am' || stored === 'en') {
      setLanguageState(stored)
      document.documentElement.lang = stored
    } else {
      // Default initial preference to Amharic for Ethiopian audience, or 'am'
      setLanguageState('am')
      document.documentElement.lang = 'am'
    }
  }, [])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }

  function toggleLanguage() {
    const next = language === 'en' ? 'am' : 'en'
    setLanguage(next)
  }

  function t(key: TranslationKey, fallback?: string): string {
    const dict = translations[language] || translations.en
    return dict[key] || fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
