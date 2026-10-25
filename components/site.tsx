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
  Bell,
  ShoppingCart,
  Award,
  LogOut,
  CheckCheck,
  Compass,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { schoolConfig } from '@/lib/data'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'

const iconMap = { Smartphone, Laptop, Zap, Monitor, GraduationCap, Wrench, Cpu, Briefcase, CircuitBoard, Sparkles, ShieldCheck, BookOpen }

export function Icon({ name, className }: { name: keyof typeof iconMap | string; className?: string }) {
  const Component = (iconMap as any)[name] || CircuitBoard
  return <Component className={className} aria-hidden="true" />
}

export function Logo() {
  const { language } = useLanguage()

  return (
    <Link href="/" className="flex items-center gap-3" aria-label="ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል">
      <img
        src="/images/helloschool.jpg"
        alt="ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል"
        className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
      />
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-sm sm:text-base leading-tight tracking-tight">
          ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል
        </span>
        <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline-block">
          {language === 'am'
            ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል · ባሕር ዳር'
            : 'Hello Technology Training Center'}
        </span>
      </div>
    </Link>
  )
}

const navItems = [
  { href: '/', labelEn: 'Home', labelAm: 'መነሻ' },
  { href: '/courses', labelEn: 'Courses', labelAm: 'ስልጠናዎች' },
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
        className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.8)] transition-all duration-150 ease-out"
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
      className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-[#155DFC] text-white shadow-xl shadow-blue-500/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#0D4ECC] hover:shadow-blue-500/40 animate-fade-in"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [student, setStudent] = useState<any>({ fullName: 'Mekonen Alemayehu', studentId: 'STU-26-8921' })
  const [cartCount, setCartCount] = useState(1)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: '🎉 2+1 በነፃ ልዩ ማበረታቻ!',
      titleEn: '🎉 Special Promotion: 2+1 Free!',
      desc: 'ከሁለት ስልጠናዎች በላይ ለሚመዘገቡ አንድ ስልጠና በነፃ ተጨምሯል።',
      descEn: 'Register for 2+ courses and get 1 completely free this month.',
      time: '10m ago',
      unread: true,
      link: '/courses',
    },
    {
      id: '2',
      title: '🚀 አዲስ የተግባር ባች ተከፍቷል',
      titleEn: '🚀 Practical TVET Cohort Intake Open',
      desc: 'የጥቅምት 2026 የተግባር ስልጠና ምዝገባ ክፍት ነው።',
      descEn: 'Morning and evening practical TVET workshop slots now available.',
      time: '2h ago',
      unread: true,
      link: '/register',
    },
    {
      id: '3',
      title: '🏆 ሰርተፊኬቶች ዝግጁ ናቸው',
      titleEn: '🏆 Accredited Certificates Ready',
      desc: 'በAchievements ገፅ ላይ የተጠናቀቁ ሰርተፊኬቶችን ያረጋግጡ።',
      descEn: 'View and download accredited TVET certificates in Achievements.',
      time: '1d ago',
      unread: false,
      link: '/achievements',
    },
  ])
  const pathname = usePathname()
  const { language, t } = useLanguage()
  const isAm = language === 'am'

  // Student portal check: Notifications, Cart, and Profile are ONLY present on student portal
  const isStudentPortal = Boolean(
    pathname &&
      (pathname.startsWith('/profile') ||
        (pathname.startsWith('/student') && pathname !== '/student/login') ||
        pathname.startsWith('/achievements') ||
        pathname.startsWith('/certificates') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/learn') ||
        pathname.startsWith('/cart'))
  )

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sync auth, profile avatar & cart
  useEffect(() => {
    let isMounted = true

    // Check localStorage immediately for cached student profile/avatar
    try {
      const cachedAvatar = localStorage.getItem('hellotvet_student_avatar')
      const cachedName = localStorage.getItem('hellotvet_student_name')
      if (cachedAvatar || cachedName) {
        setStudent((prev: any) => ({
          ...prev,
          ...(cachedName ? { fullName: cachedName } : {}),
          ...(cachedAvatar ? { avatarUrl: cachedAvatar } : {}),
        }))
      }
    } catch {}

    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.student) {
          setStudent((prev: any) => {
            const cachedAvatar = typeof window !== 'undefined' ? localStorage.getItem('hellotvet_student_avatar') : null
            const cachedName = typeof window !== 'undefined' ? localStorage.getItem('hellotvet_student_name') : null
            return {
              ...prev,
              ...data.student,
              fullName: cachedName || data.student.fullName || prev?.fullName || 'Mekonen Alemayehu',
              avatarUrl: cachedAvatar || data.student.avatarUrl || prev?.avatarUrl || null,
            }
          })
        }
      })
      .catch(() => {})

    // Check cart storage
    try {
      const savedCourse = localStorage.getItem('hellotvet_cart_course')
      const savedCart = localStorage.getItem('hellotvet_cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartCount(parsed.length)
        }
      } else if (savedCourse) {
        setCartCount(1)
      } else {
        setCartCount(1) // match screenshot default
      }
    } catch {
      setCartCount(1)
    }

    // Real-time listener for profile avatar/name updates
    const handleAvatarUpdate = (e: any) => {
      try {
        const newAvatar = e?.detail?.avatarUrl || localStorage.getItem('hellotvet_student_avatar')
        const newName = e?.detail?.fullName || localStorage.getItem('hellotvet_student_name')
        setStudent((prev: any) => ({
          ...prev,
          ...(newName ? { fullName: newName } : {}),
          ...(newAvatar ? { avatarUrl: newAvatar } : {}),
        }))
      } catch {}
    }

    window.addEventListener('storage', handleAvatarUpdate)
    window.addEventListener('student-avatar-updated', handleAvatarUpdate as EventListener)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleAvatarUpdate)
      window.removeEventListener('student-avatar-updated', handleAvatarUpdate as EventListener)
    }
  }, [])

  // Close menus on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-profile-menu]') && !target.closest('[data-profile-trigger]')) {
        setProfileOpen(false)
      }
      if (!target.closest('[data-notifications-menu]') && !target.closest('[data-notifications-trigger]')) {
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('click', handleOutside)
    return () => window.removeEventListener('click', handleOutside)
  }, [])

  async function handleSignOut(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    try {
      await fetch('/api/student/logout', { method: 'POST' })
    } catch {}
    setProfileOpen(false)
    setStudent(null)
    window.location.replace('/')
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-50">
      {/* ── Main Glassmorphism Navbar ── */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-border/80 bg-background/90 shadow-md shadow-black/5 backdrop-blur-lg dark:shadow-blue-950/20'
            : 'border-border/50 bg-background/80 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto flex h-[62px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />

          {/* Public Nav Links (Hidden on Student Portal) */}
          {!isStudentPortal && (
            <nav className="hidden items-center gap-6 xl:gap-7 lg:flex" aria-label="Main navigation">
              {navItems.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                const label = isAm ? item.labelAm : item.labelEn
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors py-1 ${
                      active
                        ? 'text-foreground font-semibold after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-600 dark:after:bg-sky-400 after:shadow-[0_0_8px_rgba(37,99,235,0.8)]'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* ── Right-End Controls: Student Portal vs Public Site ── */}
          {isStudentPortal ? (
            /* ── STUDENT PORTAL CONTROLS (Notification + Cart + Profile Dropdown + Language + Theme) ── */
            <div className="hidden items-center gap-3 lg:flex">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  data-notifications-trigger
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setProfileOpen(false)
                  }}
                  aria-label="Notifications"
                  className="relative flex size-9 items-center justify-center rounded-xl text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                  )}
                </button>

                {/* Notification Popover */}
                {notificationsOpen && (
                  <div
                    data-notifications-menu
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl animate-fade-in z-50 text-foreground"
                  >
                    <div className="flex items-center justify-between px-2 pb-2 pt-1 border-b">
                      <span className="font-bold text-sm">
                        {isAm ? 'ማስታወቂያዎች' : 'Notifications'}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="size-3" />
                          {isAm ? 'ሁሉንም አንብብ' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                    <div className="mt-2 divide-y divide-border/40 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link}
                          onClick={() => setNotificationsOpen(false)}
                          className={`block p-2.5 rounded-xl transition hover:bg-muted/80 ${
                            n.unread ? 'bg-blue-50/60 dark:bg-sky-950/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold leading-tight text-foreground">
                              {isAm ? n.title : n.titleEn}
                            </p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {isAm ? n.desc : n.descEn}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative flex size-9 items-center justify-center rounded-xl text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors"
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar + Name Button */}
              <div className="relative">
                <button
                  data-profile-trigger
                  onClick={() => {
                    setProfileOpen(!profileOpen)
                    setNotificationsOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-xl px-2 py-1 transition-all hover:bg-sky-50 dark:hover:bg-sky-950/40"
                >
                  <div className="size-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-xs overflow-hidden shrink-0">
                    {student?.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName || 'User Profile'}
                        className="size-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <span className="font-semibold text-sm text-[#0284c7] dark:text-sky-400 hover:underline">
                    {student?.fullName || 'Mekonen Alemayehu'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div
                    data-profile-menu
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/80 bg-card p-2 shadow-2xl backdrop-blur-xl animate-fade-in z-50 text-foreground"
                  >
                    <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border/60 mb-1.5">
                      <div className="size-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-xs overflow-hidden shrink-0">
                        {student?.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.fullName || 'User Profile'}
                            className="size-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-foreground truncate">
                          {student?.fullName || 'Mekonen Alemayehu'}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {student?.studentId || 'STU-26-8921'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/learn"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <Monitor className="size-4 text-slate-500 dark:text-slate-400" />
                      <span>{isAm ? 'የእኔ ስልጠናዎች' : 'My Courses'}</span>
                    </Link>

                    <Link
                      href="/achievements"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <Award className="size-4 text-slate-500 dark:text-slate-400" />
                      <span>{isAm ? 'ሰርተፊኬቶች' : 'Certificates'}</span>
                    </Link>

                    <Link
                      href="/profile/account"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <User className="size-4 text-slate-500 dark:text-slate-400" />
                      <span>{isAm ? 'መለያ' : 'Account'}</span>
                    </Link>

                    <div className="my-1.5 h-px bg-border/60" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="size-4 text-rose-500" />
                      <span>{isAm ? 'ውጣ' : 'Sign out'}</span>
                    </button>
                  </div>
                )}
              </div>

              <LanguageToggle />
              <ThemeToggle />
            </div>
          ) : (
            /* ── PUBLIC SITE CONTROLS (Language + Theme + Log In + Register CTA) ── */
            <div className="hidden items-center gap-2.5 lg:flex">
              <LanguageToggle />
              <ThemeToggle />
              <Link href="/student/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 px-3.5 py-2 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:text-sky-400 gap-1.5 transition"
                >
                  <User className="size-3.5 text-blue-600 dark:text-sky-400" />
                  {isAm ? 'መግቢያ' : 'Log In'}
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-xl px-4 py-2 font-semibold bg-blue-600 text-white transition duration-300 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/25 hover:scale-[1.02]"
                >
                  {t('registerNow')} <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            </div>
          )}

          {/* ── Mobile Right Controls: Student Portal vs Public Site ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {isStudentPortal && (
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative flex size-8 items-center justify-center rounded-lg text-sky-500"
              >
                <ShoppingCart className="size-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
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
            {isStudentPortal ? (
              <>
                {/* Student quick profile in mobile menu */}
                <div className="my-3 flex items-center justify-between p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/50">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-800 flex items-center justify-center text-sky-600 overflow-hidden shrink-0">
                      {student?.avatarUrl ? (
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName || 'User Profile'}
                          className="size-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-foreground">{student?.fullName || 'Mekonen Alemayehu'}</p>
                      <p className="text-[10px] text-muted-foreground">{student?.studentId || 'STU-26-8921'}</p>
                    </div>
                  </div>
                  <Link href="/profile/dashboard" onClick={() => setOpen(false)}>
                    <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
                      {isAm ? 'ዳሽቦርድ' : 'Dashboard'}
                    </span>
                  </Link>
                </div>

                {/* Student Portal Mobile Navigation */}
                <nav className="flex flex-col gap-1 pt-1" aria-label="Student Mobile navigation">
                  <Link
                    href="/profile/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Compass className="size-4 text-sky-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/learn"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Monitor className="size-4 text-sky-500" />
                    <span>{isAm ? 'የእኔ ስልጠናዎች (My Courses)' : 'My Courses'}</span>
                  </Link>
                  <Link
                    href="/achievements"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Award className="size-4 text-sky-500" />
                    <span>{isAm ? 'ሰርተፊኬቶች (Certificates)' : 'Certificates'}</span>
                  </Link>
                  <Link
                    href="/profile/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <User className="size-4 text-sky-500" />
                    <span>{isAm ? 'መለያ (Account)' : 'Account'}</span>
                  </Link>
                  <Link
                    href="/profile/purchase"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <ShoppingBag className="size-4 text-sky-500" />
                    <span>{isAm ? 'የግዢ ታሪክ' : 'Purchase History'}</span>
                  </Link>
                  <Link
                    href="/profile/security"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <ShieldCheck className="size-4 text-sky-500" />
                    <span>{isAm ? 'ደህንነት' : 'Security'}</span>
                  </Link>

                  <div className="mt-2 pt-2 border-t flex flex-col gap-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50"
                    >
                      <LogOut className="size-3.5" />
                      {isAm ? 'ውጣ (Sign out)' : 'Sign out'}
                    </button>
                  </div>
                </nav>
              </>
            ) : (
              <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                  const label = isAm ? item.labelAm : item.labelEn
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                        active
                          ? 'bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
                <div className="mt-4 pt-3 border-t flex flex-col gap-2">
                  <Link href="/student/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl justify-center gap-2 border-blue-500/30 text-blue-600 dark:text-sky-400">
                      <User className="size-4" />
                      {isAm ? 'መግቢያ (Log In)' : 'Log In'}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-xl justify-center bg-blue-600 text-white hover:bg-blue-700">
                      {t('registerNow')} <ArrowRight data-icon="inline-end" />
                    </Button>
                  </Link>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-blue-900/40 bg-[#0b1d47] text-slate-200">
      <div className="container mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <img
              src="/images/helloschool.jpg"
              alt="ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል (Hello Technology Training Center)"
              className="h-11 sm:h-12 w-auto rounded-lg object-contain bg-white p-1 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-tight">ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል</span>
              <span className="text-xs text-blue-200">
                {language === 'am' ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል · ባሕር ዳር' : 'Hello Technology Training Center'}
              </span>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-blue-100">
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
              className="rounded-lg border border-blue-800/80 bg-blue-950/40 px-3 py-2 text-xs font-semibold text-white hover:border-[#155DFC] hover:bg-[#155DFC] transition-all"
            >
              Telegram
            </a>
            <a
              href={`https://wa.me/${schoolConfig.whatsappPhone}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg border border-blue-800/80 bg-blue-950/40 px-3 py-2 text-xs font-semibold text-white hover:border-[#155DFC] hover:bg-[#155DFC] transition-all"
            >
              WhatsApp
            </a>
            <a
              href={schoolConfig.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-lg border border-blue-800/80 bg-blue-950/40 px-3 py-2 text-xs font-semibold text-white hover:border-[#155DFC] hover:bg-[#155DFC] transition-all"
            >
              Facebook
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-lg border border-blue-800/80 bg-blue-950/40 px-3 py-2 text-xs font-semibold text-white hover:border-[#155DFC] hover:bg-[#155DFC] transition-all"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">
            {language === 'am' ? 'አስስ' : 'Explore'}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-blue-100">
            <Link href="/courses" className="hover:text-white transition-colors">
              {language === 'am' ? 'ስልጠናዎቻችን' : 'Our Courses'}
            </Link>
            <Link href="/library" className="hover:text-white transition-colors">
              {language === 'am' ? 'ዲጂታል ቤተ-መጽሐፍት' : 'Digital Library'}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {language === 'am' ? 'ስለ እኛ' : 'About Us'}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {language === 'am' ? 'አግኙን' : 'Contact Us'}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">
            {language === 'am' ? 'ፖሊሲዎችና ደንቦች' : 'Policies & Rules'}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-blue-100">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {language === 'am' ? 'የግል መረጃ ጥበቃ (Privacy)' : 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {language === 'am' ? 'የስልጠና ደንቦች (Terms)' : 'Terms of Training'}
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              {language === 'am' ? 'ተመላሽና ዝውውር (Refunds)' : 'Refund & Postponement'}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">
            {language === 'am' ? 'አድራሻና ግንኙነት' : 'Contact & Location'}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-blue-100">
            <span className="flex gap-2"><Phone className="size-4 shrink-0 text-sky-300" />{schoolConfig.phone} / {schoolConfig.alternatePhone}</span>
            <span className="flex gap-2"><Mail className="size-4 shrink-0 text-sky-300" />{schoolConfig.email}</span>
            <span className="flex gap-2"><MapPin className="size-4 shrink-0 text-sky-300" />{schoolConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-blue-900/60 bg-[#081533]">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-blue-200 lg:flex-row lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል (Hello Technology Training Center). {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'}
            </span>
            <span className="hidden sm:inline text-blue-400">·</span>
            <span>
              {language === 'am' ? 'ባሕር ዳር፣ ኢትዮጵያ' : 'Bahir Dar, Ethiopia'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-blue-300">
            <Link href="/privacy" className="hover:text-white underline-offset-4 hover:underline transition-colors">
              {language === 'am' ? 'የግል መረጃ ጥበቃ' : 'Privacy'}
            </Link>
            <span className="text-blue-500">·</span>
            <Link href="/terms" className="hover:text-white underline-offset-4 hover:underline transition-colors">
              {language === 'am' ? 'የስልጠና ደንቦች' : 'Terms'}
            </Link>
            <span className="text-blue-500">·</span>
            <Link href="/refund-policy" className="hover:text-white underline-offset-4 hover:underline transition-colors">
              {language === 'am' ? 'የክፍያ ተመላሽና ዝውውር' : 'Refunds'}
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-200 font-medium">
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
    <section className="relative overflow-hidden border-b bg-muted/30 px-5 py-8 lg:px-8 lg:py-12 tech-dot-bg">
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
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <div className="border-y border-border bg-muted/20 py-8 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">1,200+</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {isAm ? 'የሰለጠኑ ቴክኒሻኖች' : 'Technicians Mentored'}
            </p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
              <Wrench className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">98%</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {isAm ? 'የተግባር ላብራቶሪ ስልጠና' : 'Practical Lab Training'}
            </p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {isAm ? '4 ራሳቸውን የቻሉ' : '4 Dedicated'}
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {isAm ? 'የሃርድዌር ጥገና ላብራቶሪዎች' : 'Hardware Repair Labs'}
            </p>
          </div>
          <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm card-hover-lift">
            <span className="flex size-12 items-center justify-center rounded-xl bg-sky-400/15 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="size-6" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">100%</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {isAm ? 'እውነተኛ የመመርመሪያ እቃዎች' : 'Real Diagnostic Tools'}
            </p>
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
  const { language } = useLanguage()
  const isAm = language === 'am'
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
      setError(
        isAm
          ? 'እባክዎ ሙሉ ስምዎን፣ ስልክ ቁጥርዎን እና የስምምነት ማረጋገጫውን ይሙሉ/ይምረጡ።'
          : 'Please complete your name, phone number, and consent before sending.'
      )
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
      setError(
        e.message ||
          (isAm
            ? 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ ወይም በቀጥታ በስልክ ይደውሉልን።'
            : 'Something went wrong. Please try again or call us directly.')
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted)
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center animate-fade-in">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check />
        </span>
        <h3 className="mt-4 text-xl font-bold">
          {isAm ? 'ጥያቄዎ በተሳካ ሁኔታ ተልኳል!' : 'Inquiry sent successfully!'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {isAm
            ? 'እናመሰግናለን! መረጃዎ ተመዝግቧል። የማዕከሉ የቅበላ ክፍል በሰጡን አድራሻ በቅርቡ ያነጋግርዎታል።'
            : 'Thank you! Your inquiry has been saved. The school will contact you shortly using the details you provided.'}
        </p>
        <Button variant="outline" className="mt-5 rounded-xl" onClick={() => setSubmitted(false)}>
          {isAm ? 'ሌላ ጥያቄ ይላኩ' : 'Send another inquiry'}
        </Button>
      </div>
    )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          {isAm ? 'ሙሉ ስም *' : 'Full name *'}
          <input
            name="name"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            placeholder={isAm ? 'የእርስዎን ሙሉ ስም ያስገቡ' : 'Your full name'}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          {isAm ? 'ስልክ ቁጥር *' : 'Phone number *'}
          <input
            name="phone"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            placeholder="+251 9..."
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          {isAm ? 'ኢሜይል (አማራጭ)' : 'Email'}
          <input
            name="email"
            type="email"
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          {isAm ? 'የሚመርጡት ስልጠና' : 'Preferred course'}
          <select
            name="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={loading}
            className="h-11 rounded-xl border border-input bg-background/90 px-3.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 cursor-pointer"
          >
            <option value="">{isAm ? 'ስልጠና ይምረጡ' : 'Select a course'}</option>
            {courseOptions.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium">
        {isAm ? 'መልዕክት' : 'Message'}
        <textarea
          name="message"
          rows={4}
          disabled={loading}
          className="rounded-xl border border-input bg-background/90 p-3.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
          placeholder={isAm ? 'ምን መማር እንደሚፈልጉ ወይም ጥያቄዎን ይንገሩን...' : 'Tell us what you would like to learn...'}
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
        <input
          name="consent"
          type="checkbox"
          disabled={loading}
          className="mt-0.5 size-4 rounded accent-blue-600 cursor-pointer"
        />
        {isAm
          ? 'ማዕከሉ ለጥያቄዬ ምላሽ ለመስጠት በዚህ መረጃዬ እንዲጠቀም እስማማለሁ።'
          : 'I consent to the school using this information to respond to my inquiry.'}
      </label>
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-fit rounded-xl px-6 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
      >
        {loading
          ? (isAm ? 'በመላክ ላይ...' : 'Sending...')
          : (isAm ? 'ጥያቄ ይላኩ' : 'Send inquiry')}
        {!loading && <Send data-icon="inline-end" />}
      </Button>
    </form>
  )
}

export function CourseIcon({ name, className }: { name: keyof typeof iconMap | string; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-105',
        className
      )}
    >
      <Icon name={name} />
    </span>
  )
}

export function WhatsAppButton() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <a
      href={`https://wa.me/${schoolConfig.whatsappPhone}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/20 hover:shadow-md"
    >
      <MessageCircle className="size-4" /> {isAm ? 'በWhatsApp ይጠይቁ' : 'Ask on WhatsApp'}
    </a>
  )
}

export function TelegramButton() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <a
      href={schoolConfig.telegram}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-600 dark:text-sky-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-500/20 hover:shadow-md"
    >
      <Send className="size-4" /> {isAm ? 'በTelegram ያግኙን' : 'Chat on Telegram'}
    </a>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const { language } = useLanguage()
  const isAm = language === 'am'
  const defaultPlaceholder = isAm ? 'ይፈልጉ...' : 'Search...'

  return (
    <div className="relative group">
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-sky-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}

export function CTASection() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="container relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-400/30 bg-[#0d2a75] bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] px-8 py-12 text-white shadow-2xl md:px-14 md:py-16">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <CircuitBoard className="size-3.5" />
              {isAm ? 'ቀጣዩ የሙያ እርምጃዎ' : 'Your Next Career Step'}
            </span>
            <h2 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {isAm ? 'ተግባራዊ የጥገና ክህሎትን ለማዳበር ዝግጁ ኖት?' : 'Ready to build practical repair skills?'}
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-blue-100">
              {isAm
                ? 'ስልጠናዎቻችንን ያስሱ ወይም ጥያቄዎን ይላኩልን። ለእርስዎ ግብ የሚስማማውን የቴክኒክ ስልጠና መንገድ እንዲመርጡ እናግዝዎታለን።'
                : 'Explore our courses or send an inquiry. We will help you find the right technical training path for your goals.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses">
              <Button className="rounded-xl bg-white px-6 font-bold text-[#155DFC] transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]">
                {isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore courses'} <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="rounded-xl border-white/50 bg-white/10 px-6 font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/20 hover:text-white"
              >
                {isAm ? 'ያግኙን' : 'Contact us'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}


export { ChevronRight, ChevronDown, Clock3, Play, Phone, Mail, MapPin }

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudentPortal = Boolean(
    pathname &&
      (pathname.startsWith('/profile') ||
        (pathname.startsWith('/student') && pathname !== '/student/login') ||
        pathname.startsWith('/achievements') ||
        pathname.startsWith('/certificates') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/learn') ||
        pathname.startsWith('/cart'))
  )

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground selection:bg-blue-600 selection:text-white">
      <ScrollProgressBar />
      <Header />
      <div className="flex-1 animate-fade-in">{children}</div>
      <BackToTopButton />
      {!isStudentPortal && <Footer />}
    </div>
  )
}

export default SiteShell

export { cn, ThemeToggle, LanguageToggle }
export { useTheme } from '@/components/theme-provider'
export { useLanguage } from '@/components/language-provider'

