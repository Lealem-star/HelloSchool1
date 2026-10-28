'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SiteShell } from '@/components/site'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import {
  Compass,
  User,
  ShoppingBag,
  Shield,
  PanelLeft,
  ArrowLeft,
  Scan,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  Upload,
  AlertCircle,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Play,
  Clock,
  Sparkles,
  Receipt,
  Calendar,
  CreditCard,
  ExternalLink,
} from 'lucide-react'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export type TabType = 'dashboard' | 'account' | 'purchase' | 'security'

interface ProfileDashboardClientProps {
  initialTab?: TabType
}

export function ProfileDashboardClient({ initialTab = 'dashboard' }: ProfileDashboardClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [libraryResources, setLibraryResources] = useState<any[]>([])
  const [showBrowseMore, setShowBrowseMore] = useState(false)
  const [browseFilter, setBrowseFilter] = useState<'all' | 'video' | 'manual'>('all')
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const browseCatalogRef = useRef<HTMLDivElement>(null)

  // Account Form State (Screenshots 1 & 2)
  const [fullName, setFullName] = useState('Mekonen Alemayehu')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+251934551781')
  const [birthDate, setBirthDate] = useState('')
  const [calendarType, setCalendarType] = useState<'EC' | 'GC'>('EC')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('Ethiopia')
  const [city, setCity] = useState('Bahir Dar')
  const [address, setAddress] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('Amharic')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Security Expandable Cards State (Screenshots 4 & 5)
  const [expandedCard, setExpandedCard] = useState<'password' | 'phone' | 'email' | null>(null)
  const [oldPassword, setOldPassword] = useState('0934551781')
  const [newPassword, setNewPassword] = useState('ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [currentPhone, setCurrentPhone] = useState('+251934551781')
  const [newPhone, setNewPhone] = useState('0934551781')

  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null)

  // Fetch student info
  useEffect(() => {
    try {
      const cachedAvatar = localStorage.getItem('hellotvet_student_avatar')
      if (cachedAvatar) setAvatarPreview(cachedAvatar)
      const cachedName = localStorage.getItem('hellotvet_student_name')
      if (cachedName) setFullName(cachedName)
    } catch {}

    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          setStudent(data.student)
          if (data.student.fullName) setFullName(data.student.fullName)
          if (data.student.personalEmail || data.student.institutionalEmail) {
            setEmail(data.student.personalEmail || data.student.institutionalEmail)
          }
          if (data.student.phone) {
            const rawPhone = data.student.phone
            const validPhone = rawPhone.includes('@') ? '+251934551781' : rawPhone
            setPhone(validPhone)
            setCurrentPhone(validPhone)
            setOldPassword(validPhone.replace(/[^0-9]/g, ''))
          }
          if (data.student.city) setCity(data.student.city)
          if (data.student.avatarUrl) {
            setAvatarPreview(data.student.avatarUrl)
            try {
              localStorage.setItem('hellotvet_student_avatar', data.student.avatarUrl)
            } catch {}
          }
        }

        // Combine server digital purchases with any locally saved purchases
        let combinedPurchases: any[] = []
        if (Array.isArray(data.digitalPurchases)) {
          combinedPurchases = [...data.digitalPurchases]
        }
        try {
          const local = localStorage.getItem('hellotvet_student_purchases')
          if (local) {
            const parsed = JSON.parse(local)
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                if (!combinedPurchases.some((p) => p.resourceId === item.resourceId || p.id === item.id)) {
                  combinedPurchases.unshift(item)
                }
              }
            }
          }
        } catch {}

        setPurchases(combinedPurchases)
        if (Array.isArray(data.registrations)) setRegistrations(data.registrations)
        if (Array.isArray(data.courses)) setCourses(data.courses)
        if (Array.isArray(data.libraryResources) && data.libraryResources.length > 0) {
          setLibraryResources(data.libraryResources)
        } else {
          setLibraryResources(Object.values(DIGITAL_CATALOG))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleEnrollFree = async (resource: any) => {
    try {
      setEnrollingId(resource.id)
      const res = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id, amount: 0 }),
      })
      const data = await res.json()
      if (data.success || data.isFree) {
        const isVideo = (resource.format || '').toLowerCase().includes('video')
        const newPurchase = data.purchase || {
          id: `DP-${Date.now()}`,
          studentId: student?.id,
          resourceId: resource.id,
          resourceType: isVideo ? 'video_course' : 'manual',
          title: resource.title,
          amount: 0,
          paymentMethod: 'Free Enrollment',
          status: 'Active',
          progress: 0,
          thumbnailUrl: resource.thumbnailUrl,
          createdAt: new Date().toISOString(),
        }
        setPurchases((prev) => {
          const filtered = prev.filter((p) => p.resourceId !== resource.id)
          return [newPurchase, ...filtered]
        })
        try {
          const existing = JSON.parse(localStorage.getItem('hellotvet_student_purchases') || '[]')
          const filtered = existing.filter((p: any) => p.resourceId !== resource.id)
          filtered.unshift(newPurchase)
          localStorage.setItem('hellotvet_student_purchases', JSON.stringify(filtered))
        } catch {}
      }
    } catch (e) {
      console.error('Free enrollment failed:', e)
    } finally {
      setEnrollingId(null)
    }
  }

  const filteredBrowseResources = React.useMemo(() => {
    let list = libraryResources.length > 0 ? libraryResources : Object.values(DIGITAL_CATALOG)
    if (browseFilter === 'video') {
      list = list.filter((r) => (r.format || '').toLowerCase().includes('video'))
    } else if (browseFilter === 'manual') {
      list = list.filter((r) => !(r.format || '').toLowerCase().includes('video'))
    }
    return list
  }, [libraryResources, browseFilter])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const targetUrl = `/profile/${tab}`
      window.history.pushState(null, '', targetUrl)
    }
  }

  const compressImage = (file: File, maxDim = 400, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(e.target?.result as string)
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await compressImage(file)
        if (dataUrl) {
          setAvatarPreview(dataUrl)
          try {
            localStorage.setItem('hellotvet_student_avatar', dataUrl)
            window.dispatchEvent(new Event('storage'))
            window.dispatchEvent(
              new CustomEvent('student-avatar-updated', {
                detail: { avatarUrl: dataUrl, fullName },
              })
            )
          } catch (err) {
            console.error('Failed to save avatar to localStorage:', err)
          }

          // Also asynchronously save to backend if user is authenticated
          fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarUrl: dataUrl }),
          }).catch(() => {})
        }
      } catch (err) {
        console.error('Image compression failed:', err)
      }
    }
  }

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let cleanPhone = phone.trim()
      let cleanEmail = email.trim()
      if (cleanPhone.includes('@')) {
        if (!cleanEmail) cleanEmail = cleanPhone
        cleanPhone = '+251934551781'
        setPhone(cleanPhone)
      }

      if (fullName) {
        localStorage.setItem('hellotvet_student_name', fullName)
      }
      if (avatarPreview) {
        localStorage.setItem('hellotvet_student_avatar', avatarPreview)
      }
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(
        new CustomEvent('student-avatar-updated', {
          detail: { avatarUrl: avatarPreview, fullName },
        })
      )

      await fetch('/api/student/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          personalEmail: cleanEmail,
          phone: cleanPhone,
          city,
          avatarUrl: avatarPreview,
        }),
      }).catch(() => {})
    } catch {}

    setSaveSuccessMsg(isAm ? 'ßêÿßê¿ßîâßïÄ ßëáßë░ßê│ßè½ ßêüßèößë│ ßë░ßëÇßê¥ßîºßêì!' : 'Your profile has been saved successfully!')
    setTimeout(() => setSaveSuccessMsg(null), 4000)
  }

  const handleSaveSecurity = async (section: 'Password' | 'Phone Number' | 'Email Address') => {
    try {
      if (section === 'Password') {
        if (newPassword && newPassword !== 'ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó') {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword }),
          })
        }
      } else if (section === 'Phone Number') {
        if (newPhone) {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: newPhone }),
          })
          setCurrentPhone(newPhone)
          setPhone(newPhone)
        }
      } else if (section === 'Email Address') {
        if (newEmail) {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ personalEmail: newEmail }),
          })
          setCurrentEmail(newEmail)
          setEmail(newEmail)
        }
      }
    } catch (err) {
      console.error('Error saving security setting:', err)
    }

    setSecuritySuccessMsg(
      isAm ? `${section} ßëáßë░ßê│ßè½ ßêüßèößë│ ßë░ßëÇßï¡ßê»ßêì!` : `${section} updated successfully!`
    )
    setTimeout(() => setSecuritySuccessMsg(null), 4000)
    setExpandedCard(null)
  }

  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ΓöÇΓöÇ Left Sidebar: Menu (matching all screenshots) ΓöÇΓöÇ */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* ΓöÇΓöÇ Left Sidebar Menu ΓöÇΓöÇ */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-card p-4 shadow-sm">
              {/* Header: Menu + Sidebar Collapse Icon */}
              <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-base text-foreground tracking-tight">
                  {isAm ? 'ßê£ßèæ (Menu)' : 'Menu'}
                </span>
                <PanelLeft className="size-4 text-sky-500" />
              </div>

              {/* Navigation Items (Student Left Side Tabs with rich blue color) */}
              <nav className="mt-3 flex flex-col gap-1.5" aria-label="Profile navigation">
                {[
                  { id: 'dashboard' as TabType, label: isAm ? 'ßï│ßê╜ßëªßê¡ßï╡' : 'Dashboard', icon: Compass },
                  { id: 'account' as TabType, label: isAm ? 'ßèáßè½ßïìßèòßë╡' : 'Account', icon: User },
                  { id: 'purchase' as TabType, label: isAm ? 'ßï¿ßîìßïó ßë│ßê¬ßè¡' : 'Purchase History', icon: ShoppingBag },
                  { id: 'security' as TabType, label: isAm ? 'ßï░ßêàßèòßèÉßë╡' : 'Security', icon: Shield },
                ].map((item) => {
                  const isActive = activeTab === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`group relative flex items-center gap-3 w-full rounded-xl px-3.5 py-3 text-sm font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-500'
                          : 'bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 border border-sky-100/80 dark:border-sky-900/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 hover:text-sky-950 dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-white shadow-xs" />
                      )}
                      <Icon
                        className={`size-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* ΓöÇΓöÇ Right Content Area ΓöÇΓöÇ */}
          <div className="flex-1 w-full">
            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                TAB 1: DASHBOARD
                ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {activeTab === 'dashboard' && (
              purchases.length === 0 && registrations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-10 md:p-16 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xs animate-fade-in">
                  <div className="size-20 rounded-full bg-[#e0f2fe] dark:bg-sky-950/70 flex items-center justify-center">
                    <span className="text-[#38bdf8] font-bold text-4xl select-none leading-none">!</span>
                  </div>
                  <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                    {isAm ? 'ምንም የተመዘገበ ኮርስ የለም' : 'No Data Available'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    {isAm
                      ? 'እስካሁን የተመዘገቡበት ኮርስ የለም። ከታች ያሉትን ስልጠናዎች ይመልከቱ።'
                      : 'There is no data available for user dashboard. Explore courses below.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBrowseMore(true)
                      setTimeout(() => {
                        browseCatalogRef.current?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-6 py-2.5 font-semibold text-sm transition"
                  >
                    <span>{isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Browse Courses'}</span>
                    <ChevronDown className="size-4" />
                  </button>

                  {/* Inline Browse Catalog in Empty State */}
                  {showBrowseMore && (
                    <div ref={browseCatalogRef} className="mt-10 pt-8 border-t border-border/70 w-full text-left">
                      <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-1">
                          <Sparkles className="size-3" /> {isAm ? 'የስልጠና ካታሎግ' : 'Course Catalog'}
                        </span>
                        <h3 className="text-xl font-bold text-foreground">
                          {isAm ? 'የተግባር ስልጠናዎችና ማቴሪያሎች' : 'Available Courses & Masterclasses'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBrowseResources.map((res: any) => {
                          const isFree =
                            res.priceETB === 0 ||
                            res.price === 'Free' ||
                            res.price === '0 ETB' ||
                            Boolean(res.isFreeForTVET) ||
                            Boolean(res.priceDisplay && res.priceDisplay.toLowerCase().includes('free'))

                          const isVideo = (res.format || '').toLowerCase().includes('video')

                          return (
                            <div
                              key={res.id}
                              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition"
                            >
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                <img
                                  src={res.thumbnailUrl || (isVideo ? '/images/course-preview-hero.jpg' : '/images/manual-book-cover.jpg')}
                                  alt={res.title}
                                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <span className="absolute top-2 left-2 z-10 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                                  {res.category}
                                </span>
                              </div>
                              <div className="p-4 flex flex-1 flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                                    {res.title}
                                  </h4>
                                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                    {res.subtitle || res.description}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                                  <span className="text-xs font-bold text-foreground">
                                    {isFree ? (isAm ? 'በነጻ' : 'Free') : (res.priceDisplay || `${res.priceETB || 850} ETB`)}
                                  </span>
                                  {isFree ? (
                                    <Button
                                      size="sm"
                                      disabled={enrollingId === res.id}
                                      onClick={() => handleEnrollFree(res)}
                                      className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                    >
                                      {enrollingId === res.id ? '...' : (isAm ? 'በነጻ ይመዝገቡ' : 'Enroll Free')}
                                    </Button>
                                  ) : (
                                    <Link href={`/cart?course=${res.id}`}>
                                      <Button size="sm" className="h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold">
                                        {isAm ? 'ይመዝገቡ' : 'Enroll'}
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in text-left">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {isAm ? 'የተመዘገቡ ኮርሶች' : 'Enrolled Courses'}
                        </span>
                        <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                          <BookOpen className="size-4" />
                        </div>
                      </div>
                      <p className="mt-3 text-3xl font-extrabold text-foreground">
                        {purchases.length + registrations.length}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {isAm ? 'ንቁ የስልጠና መርሃግብሮች' : 'Active Learning Tracks'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {isAm ? 'የተከፈቱ ማቴሪያሎች' : 'Unlocked Materials'}
                        </span>
                        <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="size-4" />
                        </div>
                      </div>
                      <p className="mt-3 text-3xl font-extrabold text-foreground">
                        {purchases.filter((p) => p.status === 'Active').length || purchases.length}
                      </p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {isAm ? 'ሙሉ ተደራሽነት ያለው' : '100% Unlocked Access'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {isAm ? 'የትምህርት ሁኔታ' : 'Learning Status'}
                        </span>
                        <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <GraduationCap className="size-4" />
                        </div>
                      </div>
                      <p className="mt-3 text-2xl font-extrabold text-foreground">
                        {isAm ? 'በሂደት ላይ' : 'In Progress'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {isAm ? 'የላብራቶሪና ቪዲዮ ልምምድ' : 'Hands-on Lab Practice'}
                      </p>
                    </div>
                  </div>

                  {/* Enrolled Courses Header & Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">
                        {isAm ? 'የተመዘገቡባቸው ኮርሶችና ማቴሪያሎች' : 'My Enrolled Courses & Study Materials'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !showBrowseMore
                          setShowBrowseMore(next)
                          if (next) {
                            setTimeout(() => {
                              browseCatalogRef.current?.scrollIntoView({ behavior: 'smooth' })
                            }, 100)
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 hover:border-sky-500/50 bg-muted/40 hover:bg-muted/80 px-3 py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition shadow-2xs"
                      >
                        <span>
                          {showBrowseMore
                            ? (isAm ? 'ካታሎጉን ሰብስብ' : 'Hide Catalog')
                            : (isAm ? 'ተጨማሪ ይመልከቱ' : 'Browse More')}
                        </span>
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${
                            showBrowseMore ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchases.map((item) => (
                        <div
                          key={item.id || item.resourceId}
                          className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                        >
                          <div className="flex gap-4">
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-border/60 relative">
                              <img
                                src={item.thumbnailUrl || '/images/course-preview-hero.jpg'}
                                alt={item.title}
                                className="size-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                  <CheckCircle2 className="size-3" /> {item.status || 'Active'}
                                </span>
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                  {item.resourceType === 'manual' ? 'Repair Manual' : 'Video Masterclass'}
                                </span>
                              </div>
                              <h4 className="mt-1.5 font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-snug">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs text-muted-foreground font-medium">
                                {item.paymentMethod === 'free_grant' || item.paymentMethod === 'Free Enrollment' || item.amount === 0
                                  ? (isAm ? 'በነጻ የተከፈተ' : 'Free Access')
                                  : `${item.amount} ETB`}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3">
                            <span className="text-xs text-muted-foreground">
                              {isAm ? 'ግስጋሴ፦ ' : 'Progress: '}<strong className="text-foreground">{item.progress || 0}%</strong>
                            </span>
                            <Link
                              href={`/library/${item.resourceId || item.id}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition"
                            >
                              <span>{isAm ? 'ወደ ትምህርት ሂድ' : 'Start Learning'}</span>
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* In-person batch registrations */}
                      {registrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase">
                                {reg.status || 'Enrolled'}
                              </span>
                              {reg.batch?.batchNumber && (
                                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                                  {reg.batch.batchNumber}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-2 font-bold text-base text-foreground line-clamp-2">
                              {reg.courseTitle || reg.courseName || 'Practical Hardware Training'}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Reg Number: <span className="font-mono font-semibold text-foreground">{reg.registrationNumber}</span>
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Campus: <strong className="text-foreground">Signal Mall, Bahir Dar</strong>
                            </span>
                            <Link
                              href="/#courses"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-border hover:bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground transition"
                            >
                              <span>{isAm ? 'ካሪኩለም ይመልከቱ' : 'View Syllabus'}</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ────────────────────────────────────────────────────────
                      INLINE BROWSE CATALOG: EXPLORE MORE COURSES BELOW
                      ──────────────────────────────────────────────────────── */}
                  {showBrowseMore && (
                    <div
                      ref={browseCatalogRef}
                      className="mt-10 pt-8 border-t border-border/70 space-y-5 animate-fade-in"
                    >
                      {/* Section Heading & Filter Tabs */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-1">
                            <Sparkles className="size-3" />
                            {isAm ? 'ተጨማሪ ስልጠናዎችና ማቴሪያሎች' : 'Course & Masterclass Catalog'}
                          </div>
                          <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isAm ? 'እዚህ ገጽ ላይ ይምረጡና ይማሩ' : 'Explore & Enroll in More Courses'}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {isAm
                              ? 'በነጻ የተከፈቱትን በቅጽበት ይጀምሩ፤ ወይም ሌሎች ኮርሶችን በቴሌብር ይክፈቱ።'
                              : 'Select any course below to study instantly or register directly.'}
                          </p>
                        </div>

                        {/* Format Filters */}
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setBrowseFilter('all')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                              browseFilter === 'all'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {isAm ? 'ሁሉም' : 'All'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrowseFilter('video')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                              browseFilter === 'video'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {isAm ? 'ቪዲዮ' : 'Videos'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrowseFilter('manual')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                              browseFilter === 'manual'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {isAm ? 'ማንዋል' : 'Manuals'}
                          </button>
                        </div>
                      </div>

                      {/* Browse Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBrowseResources.map((res: any) => {
                          const isAlreadyEnrolled = purchases.some(
                            (p) => p.resourceId === res.id || p.id === res.id
                          )
                          const isFree =
                            res.priceETB === 0 ||
                            res.price === 'Free' ||
                            res.price === '0 ETB' ||
                            Boolean(res.isFreeForTVET) ||
                            Boolean(res.priceDisplay && res.priceDisplay.toLowerCase().includes('free'))

                          const isVideo = (res.format || '').toLowerCase().includes('video')

                          return (
                            <div
                              key={res.id}
                              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-sky-500/40 transition-all duration-200"
                            >
                              {/* Thumbnail */}
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                <img
                                  src={
                                    res.thumbnailUrl ||
                                    (isVideo ? '/images/course-preview-hero.jpg' : '/images/manual-book-cover.jpg')
                                  }
                                  alt={res.title}
                                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                                <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                                  {res.category}
                                </span>

                                <span className="absolute bottom-2 left-2.5 z-10 flex items-center gap-1 text-[11px] font-semibold text-sky-200">
                                  {isVideo ? <Play className="size-3 text-sky-400" /> : <BookOpen className="size-3 text-sky-400" />}
                                  {isVideo ? (isAm ? 'የቪዲዮ ስልጠና' : 'Video Masterclass') : (isAm ? 'የጥገና ማንዋል' : 'Repair Manual')}
                                </span>
                              </div>

                              {/* Card Content */}
                              <div className="p-4 flex flex-1 flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {res.title}
                                  </h4>
                                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {res.subtitle || res.description}
                                  </p>
                                </div>

                                {/* Price & Action Footer */}
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                                  <div>
                                    {isFree ? (
                                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                        {isAm ? 'በነጻ (Free)' : 'Free Access'}
                                      </span>
                                    ) : (
                                      <span className="text-sm font-black text-foreground">
                                        {res.priceDisplay || `${res.priceETB || 850} ETB`}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {isAlreadyEnrolled ? (
                                      <Link href={`/library/${res.id}`}>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20"
                                        >
                                          <CheckCircle2 className="size-3 mr-1" />
                                          {isAm ? 'ተከፍቷል' : 'Open'}
                                        </Button>
                                      </Link>
                                    ) : isFree ? (
                                      <Button
                                        size="sm"
                                        disabled={enrollingId === res.id}
                                        onClick={() => handleEnrollFree(res)}
                                        className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                                      >
                                        {enrollingId === res.id ? (
                                          <span className="flex items-center gap-1">
                                            <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>...</span>
                                          </span>
                                        ) : (
                                          <>
                                            {isAm ? 'በነጻ ይመዝገቡ' : 'Enroll Free'}
                                            <ArrowRight className="size-3 ml-1" />
                                          </>
                                        )}
                                      </Button>
                                    ) : (
                                      <Link href={`/cart?course=${res.id}`}>
                                        <Button
                                          size="sm"
                                          className="h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs"
                                        >
                                          {isAm ? 'ይመዝገቡ' : 'Enroll'}
                                          <ArrowRight className="size-3 ml-1" />
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                TAB 2: ACCOUNT (matching Screenshots 1 & 2)
                ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {activeTab === 'account' && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-6 md:p-8 shadow-2xs animate-fade-in text-left">
                {/* Header: <- Your Profile */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="flex items-center gap-2 text-sky-500 hover:text-sky-600 font-bold text-base transition-colors"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Your Profile</span>
                  </button>
                  {saveSuccessMsg && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full animate-fade-in">
                      <CheckCircle2 className="size-3.5" />
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveAccount} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (Inputs) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Full Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                        />
                        <Scan className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-sky-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Email
                        </label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="-"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251934551781"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                    </div>

                    {/* Birth Date & Gender Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Birth Date
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="flex-1 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                          />
                          {/* Calendar Type Pill Buttons: E.C & G.C (matching Screenshot 1) */}
                          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shrink-0 bg-muted/40">
                            <button
                              type="button"
                              onClick={() => setCalendarType('EC')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                calendarType === 'EC'
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-foreground'
                              }`}
                            >
                              E.C
                            </button>
                            <button
                              type="button"
                              onClick={() => setCalendarType('GC')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                calendarType === 'GC'
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-foreground'
                              }`}
                            >
                              G.C
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full h-11 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 transition"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Country & City Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Country"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                    </div>

                    {/* Address * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your residential / work address"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background p-3 text-sm text-foreground outline-none focus:border-sky-500 transition"
                      />
                    </div>

                    {/* Preferred Language * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Language <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={preferredLanguage}
                          onChange={(e) => setPreferredLanguage(e.target.value)}
                          className="w-full h-11 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        >
                          <option value="Amharic">Amharic (ßèáßê¢ßê¡ßè¢)</option>
                          <option value="English">English</option>
                          <option value="Afaan Oromoo">Afaan Oromoo</option>
                          <option value="Tigrinya">Tigrinya (ßë╡ßîìßê¡ßè¢)</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Save Button (Screenshot 2) */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-7 py-2.5 font-semibold text-sm transition shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Avatar Upload (Screenshots 1 & 2) */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <span className="self-start text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Avatar
                    </span>

                    {/* Circular Upload Box matching Screenshot 1 */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="size-44 md:size-52 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="size-full object-cover rounded-full"
                        />
                      ) : (
                        <>
                          <User className="size-16 text-sky-400 stroke-1 mb-2" />
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[120px] leading-tight">
                            Click here or drag image to add
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                            className="mt-3 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-3.5 py-1 text-xs font-semibold transition"
                          >
                            Select File
                          </button>
                        </>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                TAB 3: PURCHASE HISTORY (matching Screenshot 3)
                ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {activeTab === 'purchase' && (
              purchases.length === 0 && registrations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-10 md:p-16 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xs animate-fade-in">
                  <div className="size-20 rounded-full bg-[#e0f2fe] dark:bg-sky-950/70 flex items-center justify-center">
                    <span className="text-[#38bdf8] font-bold text-4xl select-none leading-none">!</span>
                  </div>

                  <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                    {isAm ? 'ምንም የግዢ ታሪክ የለም' : 'No Data Available'}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    {isAm
                      ? 'እስካሁን የተገዛ ወይም የተመዘገበ ኮርስ የለም።'
                      : 'There is no data available for purchased courses.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('dashboard')
                      setShowBrowseMore(true)
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-6 py-2.5 font-semibold text-sm transition"
                  >
                    <span>{isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Start Purchasing'}</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in text-left">
                  {/* Purchase History Header & Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1">
                        <Receipt className="size-3" />
                        {isAm ? 'የክፍያና ምዝገባ ታሪክ' : 'Verified Purchases'}
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {isAm ? 'የተከፈቱ ስልጠናዎችና ማቴሪያሎች' : 'Purchase & Enrollment History'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAm
                          ? 'የተሳኩ ክፍያዎች፣ ነፃ ስጦታዎችና የተከፈቱ ኮርሶች ዝርዝር።'
                          : 'Overview of all your unlocked digital courses, manuals, and cohort enrollments.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-2 text-right">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {isAm ? 'ጠቅላላ ትዕዛዞች' : 'Total Items'}
                        </span>
                        <span className="text-lg font-extrabold text-foreground">
                          {purchases.length + registrations.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchases & Registrations List */}
                  <div className="space-y-3">
                    {/* Digital course purchases */}
                    {purchases.map((item) => {
                      const isFree =
                        item.paymentMethod === 'free_grant' ||
                        item.paymentMethod === 'Free Enrollment' ||
                        item.amount === 0 ||
                        item.amount === '0'

                      const formattedDate = item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent'

                      return (
                        <div
                          key={item.id || item.resourceId}
                          className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-border/60 relative">
                              <img
                                src={item.thumbnailUrl || '/images/course-preview-hero.jpg'}
                                alt={item.title}
                                className="size-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                  <CheckCircle2 className="size-3" />
                                  {item.status || 'Active'}
                                </span>
                                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                                  {item.resourceType === 'manual' ? 'Manual' : 'Masterclass'}
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  {formattedDate}
                                </span>
                              </div>
                              <h4 className="mt-1.5 font-bold text-sm sm:text-base text-foreground line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                                REF: <span className="text-foreground">{item.chapaRef || item.id?.slice(0, 12) || 'FREE-UNLOCK'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-border/60">
                            <div className="text-left md:text-right">
                              <span className="block text-xs font-bold text-foreground">
                                {isFree ? (isAm ? 'በነጻ (Free)' : 'Free Grant') : `${item.amount} ${item.currency || 'ETB'}`}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {isFree ? (isAm ? 'ያለክፍያ የተከፈተ' : '100% Scholarship') : (item.paymentMethod || 'Chapa Telebirr')}
                              </span>
                            </div>

                            <Link
                              href={`/library/${item.resourceId || item.id}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 text-xs font-bold shadow-xs transition shrink-0"
                            >
                              <span>{isAm ? 'ትምህርት ጀምር' : 'Access Course'}</span>
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      )
                    })}

                    {/* TVET In-Person Cohort Registrations */}
                    {registrations.map((reg) => {
                      const formattedDate = reg.createdAt
                        ? new Date(reg.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent'

                      return (
                        <div
                          key={reg.id}
                          className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-sky-400">
                              <GraduationCap className="size-8" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase">
                                  {reg.status || 'Enrolled'}
                                </span>
                                {reg.batch?.batchNumber && (
                                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                                    {reg.batch.batchNumber}
                                  </span>
                                )}
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  {formattedDate}
                                </span>
                              </div>
                              <h4 className="mt-1.5 font-bold text-sm sm:text-base text-foreground line-clamp-1">
                                {reg.courseTitle || reg.courseName || 'Practical Hardware Training'}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                                REG: <span className="text-foreground">{reg.registrationNumber}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-border/60">
                            <div className="text-left md:text-right">
                              <span className="block text-xs font-bold text-foreground">
                                {reg.paidAmount ? `${reg.paidAmount} ETB` : (isAm ? 'የተመዘገበ' : 'Registered')}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                Signal Mall Campus
                              </span>
                            </div>

                            <Link
                              href="/#courses"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-border hover:bg-muted px-4 py-2 text-xs font-semibold text-foreground transition shrink-0"
                            >
                              <span>{isAm ? 'ካሪኩለም ይመልከቱ' : 'View Syllabus'}</span>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            )}

            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
                TAB 4: SECURITY (matching Screenshots 4 & 5)
                ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-fade-in text-left">
                {securitySuccessMsg && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    {securitySuccessMsg}
                  </div>
                )}

                {/* Card 1: Change Password (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Change Password
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'password' ? null : 'password')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'password' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content (Screenshot 5) */}
                  {expandedCard === 'password' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Old password
                        </label>
                        <input
                          type="text"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="0934551781"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 pr-10 text-xs text-foreground outline-none focus:border-sky-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Password')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Card 2: Change Your Phone Number (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Change Your Phone Number
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'phone' ? null : 'phone')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'phone' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content (Screenshot 5) */}
                  {expandedCard === 'phone' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Current Phone Number
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentPhone}
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-muted/40 px-3 text-xs text-muted-foreground outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New Phone Number
                        </label>
                        <input
                          type="text"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="0934551781"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Phone Number')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Card 3: Add Your Email Address (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Add Your Email Address
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'email' ? null : 'email')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'email' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedCard === 'email' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Email Address')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
