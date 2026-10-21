'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Cookie, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function CookieBanner() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    setMounted(true)
    try {
      const consent = localStorage.getItem('hellotvet_cookie_consent')
      if (!consent) {
        // Small delay so it transitions in smoothly
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // LocalStorage access restricted in private mode
    }
  }, [])

  const acceptConsent = () => {
    try {
      localStorage.setItem('hellotvet_cookie_consent', 'accepted')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <aside
      aria-label="Cookie and Privacy Notice"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-900/90 dark:bg-slate-950/90 text-white p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        {/* Subtle accent glow */}
        <div className="pointer-events-none absolute -top-12 -left-12 size-36 rounded-full bg-blue-600/20 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 mt-0.5">
              <Cookie className="size-5" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span>{language === 'am' ? 'የግል መረጃና አስፈላጊ ኩኪዎች' : 'Essential Cookies & Privacy'}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="size-3" /> No Ad Tracking
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-[13px]">
                {language === 'am' ? (
                  <>
                    ሄሎ TVET ለተማሪ ፖርታል መግቢያ፣ ለቋንቋ እና ለገጽታ ምርጫዎች አስፈላጊ የሆኑ መረጃዎችን ብቻ ይጠቀማል። ለሶስተኛ ወገን የማስታወቂያ ኩኪዎች አንጠቀምም።{' '}
                    <Link href="/privacy" className="underline font-medium text-sky-400 hover:text-sky-300 transition-colors">
                      የግል መረጃ ጥበቃ ፖሊሲ
                    </Link>{' '}
                    እና{' '}
                    <Link href="/terms" className="underline font-medium text-sky-400 hover:text-sky-300 transition-colors">
                      የስልጠና ደንቦችን
                    </Link>{' '}
                    ይመልከቱ።
                  </>
                ) : (
                  <>
                    Hello Technology Training Center uses essential local storage strictly for student portal sessions and your theme/language preferences. We do not use third-party tracking or advertising cookies.{' '}
                    <Link href="/privacy" className="underline font-medium text-sky-400 hover:text-sky-300 transition-colors">
                      Privacy Policy
                    </Link>{' '}
                    &amp;{' '}
                    <Link href="/terms" className="underline font-medium text-sky-400 hover:text-sky-300 transition-colors">
                      Terms of Training
                    </Link>.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <Link
              href="/privacy"
              className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              {language === 'am' ? 'ዝርዝር መረጃ' : 'Learn More'}
            </Link>
            <button
              onClick={acceptConsent}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#155DFC] hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {language === 'am' ? 'እስማማለሁ / ተቀብያለሁ' : 'Accept & Continue'}
            </button>
            <button
              onClick={acceptConsent}
              type="button"
              aria-label="Dismiss cookie notice"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
