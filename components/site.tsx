'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Cpu,
  Mail,
  Menu,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  Smartphone,
  Sparkles,
  Wrench,
  X,
  Zap,
  Laptop,
  GraduationCap,
  Briefcase,
  Play,
  Send,
  MapPin,
  ShieldCheck,
  BookOpen,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { schoolConfig } from '@/lib/data'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'

const iconMap = { Smartphone, Laptop, Zap, Monitor, GraduationCap, Wrench, Cpu, Briefcase, CircuitBoard }

export function Icon({ name, className }: { name: keyof typeof iconMap; className?: string }) {
  const Component = iconMap[name] || CircuitBoard
  return <Component className={className} aria-hidden="true" />
}

export function Logo() {
  const { language } = useLanguage()

  return (
    <Link href="/" className="flex items-center gap-3" aria-label="ሄሎ የቴክኒክና ሙያ ማሰልጠኛ">
      <img
        src="/images/helloschool.jpg"
        alt="ሄሎ የቴክኒክና ሙያ ማሰልጠኛ"
        className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
      />
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-sm sm:text-base leading-tight tracking-tight">
          ሄሎ የቴክኒክና ሙያ ማሰልጠኛ
        </span>
        <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline-block">
          {language === 'am'
            ? 'ሄሎ ቴክኒክና ሙያ ማሰልጠኛ · ባሕር ዳር'
            : 'Hello TVET · Technical & Vocational Training'}
        </span>
      </div>
    </Link>
  )
}

const navItems = [
  { href: '/', labelEn: 'Home', labelAm: 'መነሻ' },
  { href: '/courses', labelEn: 'Courses', labelAm: 'ስልጠናዎች' },
  { href: '/training', labelEn: 'Practical Training', labelAm: 'ተግባራዊ ስልጠና' },
  { href: '/library', labelEn: 'Digital Library', labelAm: 'ዲጂታል ቤተ-መጽሐፍት' },
  { href: '/about', labelEn: 'About', labelAm: 'ስለ እኛ' },
  { href: '/contact', labelEn: 'Contact', labelAm: 'አግኙን' },
]

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return setProgress(0)
      const current = window.scrollY
      setProgress(Math.min(100, Math.max(0, (current / total) * 100)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function checkScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-2xl border border-cyan-400/40 bg-slate-900/90 text-cyan-400 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-slate-900 hover:text-cyan-300 hover:shadow-cyan-500/20 animate-fade-in"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { language, t } = useLanguage()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* ── Top Announcement Ticker ── */}
      <div className="border-b border-cyan-500/15 bg-slate-950 px-4 py-2 text-center text-xs text-slate-300">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 max-w-7xl">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-cyan-400"></span>
          </span>
          <span className="font-semibold text-white">{t('tickerIntake')}</span>
          <span className="text-slate-400">{t('tickerMessage')}</span>
          <Link href="/register" className="ml-1.5 font-bold text-cyan-300 transition-colors hover:text-cyan-200 hover:underline">
            {t('tickerAction')}
          </Link>
        </div>
      </div>

      {/* ── Main Glassmorphism Navbar ── */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-border/80 bg-background/90 shadow-md shadow-black/5 backdrop-blur-lg dark:shadow-cyan-950/20'
            : 'border-border/50 bg-background/80 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const label = language === 'am' ? item.labelAm : item.labelEn
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors py-1 ${
                    active
                      ? 'text-foreground font-semibold after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-cyan-500 after:shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Right-End Controls: Language + Light/Dark Theme + Log In + Register CTA ── */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/student/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/80 px-3.5 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400 gap-1.5 transition"
              >
                <User className="size-3.5 text-cyan-500" />
                {language === 'am' ? 'መግቢያ' : 'Log In'}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-xl px-4 py-2 font-semibold transition duration-300 hover:shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02]"
              >
                {t('registerNow')} <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>

          {/* ── Mobile Right Controls: Language + Theme + Hamburger ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <LanguageToggle size="sm" />
            <ThemeToggle size="sm" />
            <button
              className="rounded-xl p-2 transition hover:bg-muted text-foreground"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {open && (
          <div className="border-t bg-background/95 px-5 pb-6 backdrop-blur-lg lg:hidden animate-fade-in-up">
            <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                const label = language === 'am' ? item.labelAm : item.labelEn
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                      active
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
              <div className="mt-4 pt-3 border-t flex flex-col gap-2">
                <Link href="/student/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl justify-center gap-2 border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                    <User className="size-4" />
                    {language === 'am' ? 'መግቢያ (Log In)' : 'Log In'}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-xl justify-center">
                    {t('registerNow')} <ArrowRight data-icon="inline-end" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="container mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <img
              src="/images/helloschool.jpg"
              alt="ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)"
              className="h-11 sm:h-12 w-auto rounded-lg object-contain bg-white/95 p-1 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-tight">ሄሎ የቴክኒክና ሙያ ማሰልጠኛ</span>
              <span className="text-xs text-slate-400">
                {language === 'am' ? 'ሄሎ ቴክኒክና ሙያ ማሰልጠኛ · ባሕር ዳር' : 'Hello TVET · Technical and Vocational Training'}
              </span>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            {language === 'am'
              ? 'በኢትዮጵያ ለቀጣዩ ትውልድ የኤሌክትሮኒክስ፣ የስማርትፎን እና የኮምፒውተር ጥገና ባለሙያዎች የተዘጋጀ ተግባራዊ የቴክኒክ ስልጠና።'
              : 'Practical technical education for the next generation of electronics, smartphone, and computer repair professionals in Ethiopia.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href={schoolConfig.telegram}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
            >
              Telegram
            </a>
            <a
              href={`https://wa.me/${schoolConfig.whatsappPhone}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
            >
              WhatsApp
            </a>
            <a
              href={schoolConfig.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
            >
              Facebook
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            {language === 'am' ? 'አስስ' : 'Explore'}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/courses" className="hover:text-cyan-400">
              {language === 'am' ? 'ስልጠናዎቻችን' : 'Our Courses'}
            </Link>
            <Link href="/training" className="hover:text-cyan-400">
              {language === 'am' ? 'ተግባራዊ ስልጠና' : 'Practical Training'}
            </Link>
            <Link href="/library" className="hover:text-cyan-400">
              {language === 'am' ? 'ዲጂታል ቤተ-መጽሐፍት' : 'Digital Library'}
            </Link>
            <Link href="/about" className="hover:text-cyan-400">
              {language === 'am' ? 'ስለ እኛ' : 'About Us'}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            {language === 'am' ? 'አድራሻና ግንኙነት' : 'Contact & Location'}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <span className="flex gap-2"><Phone className="size-4 shrink-0 text-cyan-400" />{schoolConfig.phone} / {schoolConfig.alternatePhone}</span>
            <span className="flex gap-2"><Mail className="size-4 shrink-0 text-cyan-400" />{schoolConfig.email}</span>
            <span className="flex gap-2"><MapPin className="size-4 shrink-0 text-cyan-400" />{schoolConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/80 bg-slate-950/70">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-slate-400 sm:flex-row lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET). {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'}
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span>
              {language === 'am' ? 'ባሕር ዳር፣ ኢትዮጵያ' : 'Bahir Dar, Ethiopia'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'am' ? 'ያበለጸገው፡' : 'Built by'}
            </span>
            <a
              href="https://enqopa.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Enqopa Technologies PLC — enqopa.com"
              aria-label="Enqopa Technologies PLC (enqopa.com)"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-white/95 px-3 py-1 shadow-sm transition-all duration-300 hover:border-amber-400 hover:bg-white hover:scale-[1.03] hover:shadow-md hover:shadow-amber-500/20"
            >
              <img
                src="/images/enqopa-logo.png"
                alt="Enqopa Technologies PLC"
                className="h-4 sm:h-4.5 w-auto object-contain"
              />
              <span className="text-[11px] font-semibold text-slate-700 transition-colors group-hover:text-amber-700">
                enqopa.com
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b bg-muted/30 px-5 py-16 lg:px-8 lg:py-20 tech-dot-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
      <div className="container relative mx-auto max-w-7xl animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 shadow-sm">
          <Sparkles className="size-3.5 text-primary" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return (
    <div className={cn('mb-10', align === 'center' && 'mx-auto max-w-2xl text-center')}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>}
    </div>
  )
}

export function StatStrip() {
  return (
    <div className="border-y border-border bg-muted/20 py-8 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">1,200+</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Technicians Mentored</p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
              <Wrench className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">98%</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Practical Bench Time</p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">4 Dedicated</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Hardware Repair Labs</p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-sky-400/15 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">100%</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Real Diagnostic Tools</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InquiryForm({
  courseName,
  coursesList,
}: {
  courseName?: string
  coursesList?: string[]
}) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const defaultCourseOptions: string[] = [
    'የሞባይል ጥገና ስልጠና (Mobile Maintenance Training)',
    'የቴሌቪዥንና ሌሎችም ጥገና ስልጠና (TV and Other Maintenance Training)',
    'የኮምፒውተርና የላፕቶፕ ጥገና ስልጠና (Computer and Laptop Maintenance Training)',
    'የፍሪጅ ጥገና ስልጠና (Refrigerator Maintenance Training)',
    'የህንፃዎች/የኤሌክትሪክ መስመር ዝርጋታ (Buildings / Electrical Line Installation)',
    'የኔትወርክ ዝርጋታ (Network Installation)',
    'የዲሽ ተከላና ጥገና (Dish Installation and Maintenance)',
    'የቪዲዮ ኤዲቲንግ (Video Editing)',
    'አኒሜሽን አሰራር (Animation Making)',
    'የኮዲንግና ሶፍትዌር ፕሮግራሚንግ (Coding and Software Programming)',
    'መሰረታዊ የኮምፒውተር (Basic Computer)',
    'የኢንዱስትሪ ዕቃዎች ጥገና ስልጠና (Industrial Equipment Maintenance Training)',
  ]

  const rawList: string[] = coursesList && coursesList.length > 0 ? coursesList : defaultCourseOptions
  const courseOptions: string[] = useMemo(() => {
    if (courseName && !rawList.includes(courseName)) {
      return [courseName, ...rawList]
    }
    return rawList
  }, [courseName, rawList])

  const [selectedCourse, setSelectedCourse] = useState(courseName || '')

  useEffect(() => {
    if (courseName) {
      setSelectedCourse(courseName)
    }
  }, [courseName])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const form = event.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const phone = data.get('phone') as string
    const consent = data.get('consent') as string | null

    if (!name?.trim() || !phone?.trim() || !consent) {
      setError('Please complete your name, phone number, and consent before sending.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: (data.get('email') as string)?.trim() || undefined,
          course: (data.get('course') as string)?.trim() || undefined,
          preferredContact: (data.get('preferredContact') as string)?.trim() || undefined,
          experience: (data.get('experience') as string)?.trim() || undefined,
          message: (data.get('message') as string)?.trim() || undefined,
          consent: !!consent,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({} as any))
        throw new Error(errData.error || `Failed to submit (HTTP ${res.status})`)
      }

      setSubmitted(true)
      form.reset()
      setSelectedCourse(courseName || '')
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted)
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check />
        </span>
        <h3 className="mt-4 text-xl font-bold">Inquiry sent successfully!</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thank you! Your inquiry has been saved. The school will contact you shortly using the details you provided.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>
          Send another inquiry
        </Button>
      </div>
    )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Full name *
          <input
            name="name"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
            placeholder="Your full name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Phone number *
          <input
            name="phone"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
            placeholder="+251 ..."
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Preferred course
          <select
            name="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60 cursor-pointer"
          >
            <option value="">Select a course</option>
            {courseOptions.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Message
        <textarea
          name="message"
          rows={4}
          disabled={loading}
          className="rounded-xl border border-input bg-background/90 p-3.5 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
          placeholder="Tell us what you would like to learn..."
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          disabled={loading}
          className="mt-0.5 size-4 rounded accent-cyan-500 cursor-pointer"
        />
        I consent to the school using this information to respond to my inquiry.
      </label>
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-fit rounded-xl px-6 transition duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02]"
      >
        {loading ? 'Sending...' : 'Send inquiry'}
        {!loading && <Send data-icon="inline-end" />}
      </Button>
    </form>
  )
}

export function CourseIcon({ name }: { name: keyof typeof iconMap }) {
  return (
    <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-105">
      <Icon name={name} />
    </span>
  )
}

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${schoolConfig.whatsappPhone}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/20 hover:shadow-md"
    >
      <MessageCircle className="size-4" /> Ask on WhatsApp
    </a>
  )
}

export function TelegramButton() {
  return (
    <a
      href={schoolConfig.telegram}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-600 dark:text-sky-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-500/20 hover:shadow-md"
    >
      <Send className="size-4" /> Chat on Telegram
    </a>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative group">
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-cyan-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  )
}

export function CTASection() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="container relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 px-8 py-12 text-white shadow-2xl md:px-14 md:py-16">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              <CircuitBoard className="size-3.5" /> Your Next Career Step
            </span>
            <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to build practical repair skills?
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-slate-300">
              Explore our courses or send an inquiry. We will help you find the right technical workbench path for your goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses">
              <Button className="rounded-xl bg-cyan-400 px-6 font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]">
                Explore courses <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="rounded-xl border-slate-700 bg-transparent px-6 font-semibold text-white transition-all duration-300 hover:border-slate-400 hover:bg-white/10 hover:text-white"
              >
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function GalleryCard({
  title,
  description,
  image,
  className,
}: {
  title: string
  description?: string | null
  image: string
  className?: string
}) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/10',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        <img
          src={image}
          alt={title}
          className="size-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </article>
  )
}

export { ChevronRight, ChevronDown, Clock3, Play, Phone, Mail, MapPin }

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-cyan-400 selection:text-slate-950">
      <ScrollProgressBar />
      <Header />
      <div className="flex-1 animate-fade-in">{children}</div>
      <BackToTopButton />
      <Footer />
    </div>
  )
}

export default SiteShell

export { cn, ThemeToggle, LanguageToggle }
export { useTheme } from '@/components/theme-provider'
export { useLanguage } from '@/components/language-provider'

