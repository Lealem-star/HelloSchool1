'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'am' | 'en'

export const translations = {
  en: {
    // Navigation
    navHome: 'Home',
    navCourses: 'Courses',
    navTraining: 'Practical Training',
    navLibrary: 'Digital Library',
    navAbout: 'About',
    navContact: 'Contact',
    registerNow: 'Register Now',

    // Announcement Ticker
    tickerIntake: 'Upcoming Intakes:',
    tickerMessage: 'Bahir Dar Practical Batch Intake Enrollment · All Courses Open',
    tickerAction: 'Enroll in Batch →',
    tickerOpeningSoon: 'Opening Soon',
    tickerOpeningSoonMessage: 'Bahir Dar Practical Vocational Training · Next Batch Opening Soon',

    // Theme tooltips
    switchToDark: 'Switch to Dark Mode',
    switchToLight: 'Switch to Light Mode',
    languageToggle: 'Change Language',

    // Branding
    schoolTitle: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ',
    schoolSubtitle: 'Hello TVET · Technical & Vocational Training',
    
    // Quick Actions
    exploreCourses: 'Explore Courses',
    contactUs: 'Contact Us',
    reserveBench: 'Enroll Now',
  },
  am: {
    // Navigation
    navHome: 'መነሻ',
    navCourses: 'ስልጠናዎች',
    navTraining: 'ተግባራዊ ስልጠና',
    navLibrary: 'ዲጂታል ቤተ-መጽሐፍት',
    navAbout: 'ስለ እኛ',
    navContact: 'አግኙን',
    registerNow: 'አሁኑኑ ይመዝገቡ',

    // Announcement Ticker
    tickerIntake: 'ቀጣይ ዙር ምዝገባ፡',
    tickerMessage: 'የባህር ዳር ተግባራዊ ስልጠና ዙር ምዝገባ ተጀምሯል · ሁሉም የትምህርት ክፍሎች ክፍት ናቸው',
    tickerAction: 'ይመዝገቡ →',
    tickerOpeningSoon: 'በቅርቡ ይከፈታል',
    tickerOpeningSoonMessage: 'የባህር ዳር ተግባራዊ ስልጠና ክፍለ-ጊዜዎች · ቀጣይ ዙር በቅርቡ ይከፈታል',

    // Theme tooltips
    switchToDark: 'ወደ ጨለማ ገጽታ ቀይር',
    switchToLight: 'ወደ ብርሃን ገጽታ ቀይር',
    languageToggle: 'ቋንቋ ይምረጡ',

    // Branding
    schoolTitle: 'ሄሎ የቴክኒክና ሙያ ማሰልጠኛ',
    schoolSubtitle: 'ሄሎ ቴክኒክና ሙያ ማሰልጠኛ · ባሕር ዳር',

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
