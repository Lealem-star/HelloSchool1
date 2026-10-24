'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Copy,
  LogOut,
  Sparkles,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  User,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Layers,
  Wrench,
  Search,
  Check,
  Building,
  RefreshCw,
  Video,
  Lock,
  Play,
  HelpCircle,
  ShoppingBag,
  Star,
  X,
  PhoneCall,
  CheckCircle,
  Award,
  Printer,
  Menu,
  ArrowLeft,
  BarChart3,
  ListChecks,
  Volume2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { useLanguage } from '@/components/language-provider'
import { schoolConfig } from '@/lib/data'
import { DIGITAL_CATALOG, DigitalResourceMeta, formatResourceToMeta } from '@/lib/digital-catalog'
import { SecureLearningStudio } from '@/components/secure-learning-studio'
import { OfficialReceiptModal, ReceiptData } from '@/components/official-receipt-modal'
import { StudentCertificate, CertificateData } from '@/components/student-certificate'
import { ChapaInlineModal, ChapaResourceProps } from '@/components/chapa-inline-modal'
import { DigitalPurchaseModal, PurchaseResourceData } from '@/components/digital-purchase-modal'

type StudentProfile = {
  id: string
  studentId: string
  fullName: string
  institutionalEmail: string
  personalEmail: string | null
  phone: string
  telegramUsername: string | null
  city: string | null
  status: string
  createdAt: string
}

type RegistrationItem = {
  id: string
  registrationNumber: string
  courseTitle: string
  shift: string
  status: string // 'Pending' | 'Approved' | 'Rejected' | 'Enrolled'
  paymentPlan: string
  paymentMethod: string
  finalPrice: number
  transactionRef: string | null
  receiptUrl: string | null
  createdAt: string
  approvedAt: string | null
  adminNotes: string | null
  batchId?: string | null
  batch?: {
    id: string
    batchNumber: string
    title: string
    status: string
    startDate?: string | null
    endDate?: string | null
    campus?: string | null
    notes?: string | null
  } | null
}

type CourseItem = {
  id: string
  slug: string
  title: string
  category: string
  level: string | null
  duration: string | null
  syllabus: any
  skills: any
  image: string | null
}

type LibraryResource = {
  id: string
  title: string
  subtitle?: string | null
  category: string
  description: string | null
  format: string | null
  level: string | null
  status: string
  price: string | null
  priceETB?: number | null
  pages?: string | null
  fileUrl: string | null
  thumbnailUrl?: string | null
  instructor?: string | null
  instructorRole?: string | null
  rating?: number | null
  reviewCount?: number | null
  badgeText?: string | null
  skillsLearned?: string | null
  lessons?: any
  chapters?: any
}

type DigitalPurchaseItem = {
  id: string
  resourceId: string
  resourceType: string
  title: string
  amount: number
  paymentMethod: string
  transactionRef: string | null
  status: string
  progress: number
  completedLessons: string | null
  createdAt: string
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isAm = language === 'am'
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>([])
  const [digitalPurchases, setDigitalPurchases] = useState<DigitalPurchaseItem[]>([])
  const [activeTab, setActiveTab] = useState<'overview'>('overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Studio and Digital Library Purchase Modal States
  const [activeStudioResource, setActiveStudioResource] = useState<DigitalResourceMeta | null>(null)
  const [purchasingResource, setPurchasingResource] = useState<DigitalResourceMeta | null>(null)
  const [chapaResource, setChapaResource] = useState<ChapaResourceProps | null>(null)
  const [manualPurchaseResource, setManualPurchaseResource] = useState<PurchaseResourceData | null>(null)
  const [freeUnlockLoading, setFreeUnlockLoading] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null)
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleScrollTo = (sectionId: string) => {
    if (typeof document !== 'undefined') {
      const targetId = sectionId === 'mycourses'
        ? 'enrolled-courses'
        : sectionId === 'catalog'
        ? 'courses-catalog'
        : sectionId === 'credentials'
        ? 'credentials-section'
        : sectionId
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSelectTab = (tab: string) => {
    setActiveTab('overview')
    handleScrollTo(tab)
  }

  useEffect(() => {
    fetchStudentData()

    // Sync section scroll from URL if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (tabParam) {
        setTimeout(() => handleScrollTo(tabParam), 300)
      }
    }
  }, [])

  // Synchronized Digital Resources from live MySQL database & Admin Panel (Hook must be top-level before early returns)
  const synchronizedResources: DigitalResourceMeta[] = useMemo(() => {
    if (!libraryResources || libraryResources.length === 0) {
      return Object.values(DIGITAL_CATALOG)
    }
    const mapped = libraryResources.map((res) => formatResourceToMeta(res))
    const dbIds = new Set(mapped.map((m) => m.id))
    for (const [id, meta] of Object.entries(DIGITAL_CATALOG)) {
      if (!dbIds.has(id)) {
        mapped.push(meta)
      }
    }
    return mapped
  }, [libraryResources])

  const catalogMap: Record<string, DigitalResourceMeta> = useMemo(() => {
    const dict: Record<string, DigitalResourceMeta> = {}
    for (const r of synchronizedResources) {
      dict[r.id] = r
    }
    return dict
  }, [synchronizedResources])

  const fetchStudentData = async () => {
    try {
      const res = await fetch('/api/student/me')
      if (res.status === 401) {
        router.push('/student/login')
        return
      }
      const data = await res.json()
      if (data.student) {
        setStudent(data.student)
        setRegistrations(data.registrations || [])
        setCourses(data.courses || [])
        setLibraryResources(data.libraryResources || [])
        setDigitalPurchases(data.digitalPurchases || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/student/logout', { method: 'POST' })
    router.push('/student/login')
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Digital Library Purchase Triggers
  const handleOpenChapaModal = (resource: DigitalResourceMeta) => {
    setPurchasingResource(null)
    setChapaResource({
      id: resource.id,
      title: resource.title,
      subtitle: resource.subtitle,
      format: resource.format,
      price: resource.priceDisplay,
      priceETB: resource.priceETB,
      instructor: resource.instructor,
      thumbnailUrl: resource.thumbnailUrl,
    })
  }

  const handleOpenManualModal = (resource: DigitalResourceMeta) => {
    setPurchasingResource(null)
    setManualPurchaseResource({
      id: resource.id,
      title: resource.title,
      subtitle: resource.subtitle,
      category: resource.category,
      format: resource.format,
      price: resource.priceDisplay,
      priceETB: resource.priceETB,
      instructor: resource.instructor,
    })
  }

  const handleFreeUnlock = async (resource: DigitalResourceMeta) => {
    setFreeUnlockLoading(true)
    try {
      const res = await fetch('/api/student/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          paymentMethod: 'free_grant',
          transactionRef: `FREE-${Date.now().toString().slice(-6)}`,
        }),
      })
      const result = await res.json()
      if (result.success && result.purchase) {
        setPurchasingResource(null)
        await fetchStudentData()
        setActiveStudioResource(resource)
      } else {
        alert(result.error || 'Failed to unlock material')
      }
    } catch (e: any) {
      alert(e.message || 'Error unlocking resource')
    } finally {
      setFreeUnlockLoading(false)
    }
  }

  // Handle toggling lesson progress inside Studio
  const handleToggleLessonProgress = async (lessonId: string) => {
    if (!activeStudioResource) return
    try {
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: activeStudioResource.id,
          lessonId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDigitalPurchases((prev) =>
          prev.map((p) =>
            p.resourceId === activeStudioResource.id
              ? { ...p, progress: data.progress, completedLessons: JSON.stringify(data.completed) }
              : p
          )
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  const isResourcePurchased = (resourceId: string) => {
    return digitalPurchases.some((p) => p.resourceId === resourceId && p.status === 'Active')
  }

  const getPurchaseStatus = (resourceId: string): 'Active' | 'Pending' | 'none' => {
    const item = digitalPurchases.find((p) => p.resourceId === resourceId)
    if (!item) return 'none'
    return item.status === 'Active' ? 'Active' : 'Pending'
  }

  const getCompletedLessonsForResource = (resourceId: string): string[] => {
    const item = digitalPurchases.find((p) => p.resourceId === resourceId)
    if (!item?.completedLessons) return []
    try {
      return JSON.parse(item.completedLessons)
    } catch {
      return []
    }
  }

  const latestRegistration = registrations[0]

  // Live popular master courses synced from database
  const popularMasterCourses = synchronizedResources

  // Unified list of enrolled self-paced courses (purchases + legacy registrations)
  const enrolledCourses = useMemo(() => {
    const list: Array<{
      id: string
      resourceId: string
      title: string
      subtitle?: string
      format: string
      instructor?: string
      progress: number
      completedCount: number
      totalCount: number
      status: string // 'Active' | 'Pending'
      transactionRef?: string | null
      paymentMethod?: string
      amount?: number
      createdAt: string
      meta: DigitalResourceMeta
      isFromRegistration?: boolean
      registration?: RegistrationItem
      purchase?: DigitalPurchaseItem
    }> = []

    const seenIds = new Set<string>()

    // 1. Digital Purchases
    for (const p of digitalPurchases) {
      seenIds.add(p.resourceId)
      const meta =
        catalogMap[p.resourceId] ||
        DIGITAL_CATALOG[p.resourceId] ||
        formatResourceToMeta({
          id: p.resourceId,
          title: p.title,
          priceETB: p.amount,
        })
      const isVideo = meta.format === 'Video Masterclass'
      const completedList = getCompletedLessonsForResource(meta.id)
      const totalCount = isVideo ? meta.lessons?.length || 1 : meta.chapters?.length || 1

      list.push({
        id: p.id,
        resourceId: p.resourceId,
        title: meta.title,
        subtitle: meta.subtitle,
        format: meta.format || 'Video Masterclass',
        instructor: meta.instructor,
        progress: p.progress || 0,
        completedCount: completedList.length,
        totalCount,
        status: p.status,
        transactionRef: p.transactionRef,
        paymentMethod: p.paymentMethod,
        amount: p.amount,
        createdAt: p.createdAt,
        meta,
        purchase: p,
      })
    }

    // 2. Active Registrations (if any legacy registration)
    for (const r of registrations) {
      const matchedRes = synchronizedResources.find(
        (res) =>
          res.title.toLowerCase().trim() === r.courseTitle.toLowerCase().trim() ||
          r.courseTitle.toLowerCase().includes(res.title.toLowerCase())
      )

      if (matchedRes && seenIds.has(matchedRes.id)) {
        continue
      }

      const totalCount = matchedRes
        ? (matchedRes.format === 'Video Masterclass' ? matchedRes.lessons?.length || 1 : matchedRes.chapters?.length || 1)
        : 8

      const isApproved = r.status === 'Approved' || r.status === 'Enrolled'

      list.push({
        id: `reg-${r.id}`,
        resourceId: matchedRes?.id || `course-${r.id}`,
        title: r.courseTitle,
        subtitle: isAm ? 'በራስ ፍጥነት የሚጠና የሙያ ስልጠና' : 'Self-Paced Professional Vocational Course',
        format: matchedRes?.format || 'Video Masterclass',
        instructor: matchedRes?.instructor || 'Hello Tech Master Trainers',
        progress: isApproved ? 20 : 0,
        completedCount: isApproved ? 1 : 0,
        totalCount,
        status: isApproved ? 'Active' : 'Pending',
        transactionRef: r.transactionRef || r.registrationNumber,
        paymentMethod: r.paymentMethod,
        amount: r.finalPrice,
        createdAt: r.createdAt,
        meta: matchedRes || formatResourceToMeta({
          id: `course-${r.id}`,
          title: r.courseTitle,
          priceETB: r.finalPrice,
        }),
        isFromRegistration: true,
        registration: r,
      })
    }

    return list
  }, [digitalPurchases, registrations, catalogMap, synchronizedResources, isAm])

  type NavTabId = 'overview'

  interface NavItem {
    id: NavTabId
    label: string
    shortLabel: string
    icon: React.ComponentType<{ className?: string }>
    count: number
    badge: string | null
  }

  interface NavGroup {
    label: string
    items: NavItem[]
  }

  const navGroups: NavGroup[] = [
    {
      label: isAm ? 'የትምህርት ማዕከል' : 'Learning Workspace',
      items: [
        {
          id: 'overview',
          label: isAm ? 'የተማሪ ዳሽቦርድ' : 'Student Dashboard',
          shortLabel: isAm ? 'ዳሽቦርድ' : 'Dashboard',
          icon: Sparkles,
          count: 0,
          badge: isAm ? 'ንቁ' : 'Active',
        },
      ],
    },
  ]

  const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items)
  const currentSection: NavItem | undefined = allNavItems.find((n) => n.id === activeTab) || allNavItems[0]

  const openCertificateForCourse = (courseTitle: string, refOrId?: string | null) => {
    if (!student) return
    setActiveCertificate({
      certificateNumber: `HTTC-CERT-2026-${refOrId || student.studentId}`,
      studentName: student.fullName,
      studentId: student.studentId,
      courseTitle,
      courseLevel: 'Accredited Self-Paced TVET Competency Level',
      completionDate: new Date().toISOString(),
      issueDate: new Date().toISOString(),
    })
  }

  const openReceiptForCourse = (courseTitle: string, amount: number, paymentMethod: string, txnRef?: string | null, date?: string) => {
    if (!student) return
    setActiveReceipt({
      receiptNumber: txnRef || `REC-${Date.now().toString().slice(-6)}`,
      studentName: student.fullName,
      studentId: student.studentId,
      courseTitle,
      shift: isAm ? 'በራስ ፍጥነት የሚጠና' : 'Self-Paced Online',
      amountPaid: amount,
      paymentMethod: paymentMethod || 'telebirr',
      paymentPlan: 'One-Time Lifetime Access',
      transactionRef: txnRef,
      createdAt: date || new Date().toISOString(),
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#071330] text-white">
        <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#155DFC]/20 text-[#155DFC] animate-pulse border border-[#155DFC]/30 shadow-xl shadow-blue-500/20">
            <GraduationCap className="size-9" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            {isAm ? 'ሄሎ ቴክኖሎጂ የተማሪ ፖርታል' : 'Hello Technology Student Portal'}
          </h3>
          <p className="mt-1 text-xs text-blue-200/70">
            {isAm ? 'የተማሪ መረጃዎች በመጫን ላይ...' : 'Loading your authenticated learning workspace...'}
          </p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100/90 dark:bg-card/90 backdrop-blur-xs">
      {/* ── MOBILE BACKDROP ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR (Two-Column Admin Style) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 xl:w-72 shrink-0 flex-col border-r border-blue-950/40 bg-[#0b1d47] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-blue-900/40 px-5">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/helloschool.jpg"
              alt="Hello Technology"
              className="h-10 w-auto rounded-lg object-contain bg-white/95 p-0.5 shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-white tracking-tight">
                {isAm ? 'ሄሎ ቴክኖሎጂ' : 'Hello Technology'}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-sky-400">
                {isAm ? 'የተማሪ ፖርታል' : 'Student Portal'}
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-blue-300 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-300/70">
                {group.label}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = activeTab === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          handleSelectTab(item.id)
                          setMobileSidebarOpen(false)
                        }}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#155DFC] text-white font-bold shadow-md shadow-blue-500/30'
                            : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon
                          className={`size-4 shrink-0 transition-colors ${
                            active ? 'text-white' : 'text-blue-200 group-hover:text-white'
                          }`}
                        />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge != null ? (
                          <span
                            className={`flex h-5 min-w-5 items-center justify-center px-1.5 rounded-full text-[10px] font-bold ${
                              active
                                ? 'bg-white text-[#155DFC]'
                                : 'bg-blue-500/20 text-sky-300 border border-blue-400/20'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom User Strip */}
        <div className="shrink-0 border-t border-blue-900/40 p-3 bg-[#081533]">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/10 px-2.5 py-2">
            <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 text-white font-bold text-xs shadow-sm">
              {student.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border border-[#081533]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{student.fullName}</p>
              <div className="flex items-center gap-1 text-[10px] text-blue-200">
                <span className="truncate max-w-[120px] font-mono">
                  {student.personalEmail || student.phone || student.institutionalEmail}
                </span>
                <button
                  onClick={() => handleCopy(student.personalEmail || student.phone || student.institutionalEmail, 'sidebar-email')}
                  className="hover:text-white transition"
                  title={isAm ? 'ኢሜይል/ስልክ ቅዳ' : 'Copy contact'}
                >
                  {copiedKey === 'sidebar-email' ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs text-blue-200 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-3" /> {isAm ? 'ድረ-ገጽ' : 'View site'}
            </Link>
            <ThemeToggle
              size="sm"
              className="border-blue-900/50 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
            />
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs text-blue-200 transition hover:bg-white/10 hover:text-red-300"
            >
              <LogOut className="size-3" /> {isAm ? 'ውጣ' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT COLUMN: HEADER + SCROLLABLE MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar with Segmented Tab Pills */}
        <header className="flex flex-col border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 dark:border-slate-800/80 dark:bg-slate-900/95 z-10 shrink-0">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
                aria-label="Open Sidebar"
              >
                <Menu className="size-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#155DFC] dark:bg-blue-950/50 dark:text-sky-400">
                  {currentSection && <currentSection.icon className="size-4" />}
                </span>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    <span>{currentSection?.label ?? (isAm ? 'የተማሪ ዳሽቦርድ' : 'Student Dashboard')}</span>
                  </h1>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    ID: <strong className="text-foreground">{student.studentId}</strong> • {student.fullName}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Help Dialog Trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHelpModalOpen(true)}
                className="rounded-xl border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                <HelpCircle className="size-3.5 mr-1" />
                <span>{isAm ? 'እርዳታ' : 'Help'}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-8">
          {/* ─── UNIFIED DASHBOARD HUB ─── */}
          <div className="space-y-8 animate-fade-in">
            {/* SECTION: MY ENROLLED COURSES */}
            <div id="enrolled-courses" className="space-y-4 scroll-mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
                <div>
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <BookOpen className="size-5 text-blue-600 dark:text-sky-400" />
                    <span>{isAm ? 'የእኔ የተከፈቱ ትምህርቶች' : 'My Enrolled Courses'}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isAm
                      ? 'በተማሪ አካውንትዎ የተከፈቱ ሁሉም የቪዲዮ ስልጠናዎች እና ማንዋሎች'
                      : 'Continue learning your self-paced video masterclasses and manuals'}
                  </p>
                </div>
                {enrolledCourses.length > 0 && (
                  <Link href="/library">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold text-blue-600 dark:text-sky-400 self-start sm:self-center cursor-pointer"
                    >
                      <ShoppingBag className="size-3.5 mr-1" />
                      {isAm ? 'ዲጂታል ቤተ-መጽሐፍት →' : 'Digital Library →'}
                    </Button>
                  </Link>
                )}
              </div>

                {enrolledCourses.length === 0 ? (
                  <div className="rounded-3xl border border-dashed p-10 text-center bg-card">
                    <BookOpen className="size-12 mx-auto text-muted-foreground opacity-40 mb-3" />
                    <h4 className="text-base font-bold text-foreground">
                      {isAm ? 'እስካሁን የተከፈተ ስልጠና የለም' : 'No Self-Paced Courses Unlocked Yet'}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      {isAm
                        ? 'እስካሁን ምንም አይነት የቪዲዮ ኮርስ ወይም ማንዋል አልከፈቱም። የዲጂታል ቤተ-መጽሐፍትን በመጎብኘት ይዘቶችን መክፈት ይችላሉ።'
                        : "You haven't purchased any self-paced courses or manuals yet. Browse our digital library to unlock instant 24/7 access."}
                    </p>
                    <Link href="/library" className="inline-block mt-5">
                      <Button className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer">
                        <ShoppingBag className="size-3.5 mr-1.5" />
                        {isAm ? 'ዲጂታል ቤተ-መጽሐፍትን ይመልከቱ →' : 'Explore Digital Library →'}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {enrolledCourses.map((item) => {
                      const isVideo = item.format === 'Video Masterclass'
                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-blue-500/25 bg-card p-5 sm:p-6 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="rounded-full bg-blue-500/10 px-3 py-1 font-bold text-blue-600 dark:text-sky-400">
                                {item.format}
                              </span>
                              {item.status === 'Pending' ? (
                                <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                                  <Clock className="size-3" /> {isAm ? 'ማረጋገጫ በመጠባበቅ ላይ' : 'Waiting for Admin Approval'}
                                </span>
                              ) : (
                                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                  {isAm ? '✓ ክፍት እና ንቁ' : '✓ Unlocked & Active'}
                                </span>
                              )}
                            </div>

                            <h4 className="mt-3 text-lg font-bold text-foreground">
                              {item.title}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.subtitle}
                            </p>

                            {item.status === 'Pending' ? (
                              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                                <p className="font-bold flex items-center gap-1.5">
                                  <AlertCircle className="size-3.5" /> {isAm ? 'የክፍያ ማመሳከሪያ ደርሷል' : 'Payment Reference Received'}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {isAm ? 'የግብይት ቁጥር፦' : 'Ref:'} <strong className="font-mono text-foreground">{item.transactionRef || 'N/A'}</strong>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {isAm
                                    ? 'የምዝገባ እና የፋይናንስ ክፍላችን ክፍያዎን እያረጋገጠ ነው። እንደተረጋገጠ ወዲያውኑ ይከፈታል።'
                                    : 'Our finance desk is reviewing your payment. Access will unlock immediately once approved.'}
                                </p>
                              </div>
                            ) : (
                              <div className="mt-4 space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-muted-foreground">{isAm ? 'የትምህርት ሂደት፦' : 'Learning Progress:'}</span>
                                  <span className="text-blue-600 dark:text-sky-400 font-mono">
                                    {item.progress}% ({item.completedCount} of {item.totalCount} {isVideo ? (isAm ? 'ትምህርቶች' : 'lessons') : (isAm ? 'ምዕራፎች' : 'chapters')})
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(item.progress, 5)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-2.5">
                            <span className="text-xs text-muted-foreground">
                              {isAm ? 'አሰልጣኝ፦' : 'Instructor:'} <strong>{item.instructor}</strong>
                            </span>

                            <div className="flex items-center gap-2">
                              {item.status === 'Pending' ? (
                                <Button
                                  disabled
                                  size="sm"
                                  className="rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-xs gap-1.5"
                                >
                                  <Clock className="size-3.5" /> {isAm ? 'ማረጋገጫ በመጠባበቅ ላይ' : 'Pending Approval'}
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => setActiveStudioResource(item.meta)}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
                                  >
                                    <Play className="size-3.5" /> {isAm ? 'ትምህርቱን ጀምር' : 'Resume Learning'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openCertificateForCourse(item.title, item.transactionRef)}
                                    className="rounded-xl text-xs gap-1"
                                    title={isAm ? 'ምስክር ወረቀት ይመልከቱ' : 'View Certificate'}
                                  >
                                    <Award className="size-3.5 text-amber-500" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openReceiptForCourse(item.title, item.amount || 2999, item.paymentMethod || 'telebirr', item.transactionRef, item.createdAt)}
                                    className="rounded-xl text-xs gap-1 text-muted-foreground hover:text-foreground"
                                    title={isAm ? 'ደረሰኝ ይመልከቱ' : 'View Receipt'}
                                  >
                                    <FileText className="size-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
        </main>
      </div>

      {/* ─── DIGITAL LIBRARY CHECKOUT MODAL ─── */}
      {purchasingResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setPurchasingResource(null)}
        >
          <div
            className="relative my-6 w-full max-w-xl rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl animate-scale-in flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPurchasingResource(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 pb-4 border-b pr-8">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                {purchasingResource.format.toLowerCase().includes('video') ? (
                  <Video className="size-6" />
                ) : (
                  <BookOpen className="size-6" />
                )}
              </div>
              <div>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20">
                  {purchasingResource.format}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground mt-1.5 leading-snug">
                  {purchasingResource.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isAm ? 'መምህር፦ ' : 'Instructor: '}
                  <span className="font-semibold text-foreground">{purchasingResource.instructor}</span>
                </p>
              </div>
            </div>

            {/* Price Banner */}
            <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-transparent border border-blue-500/20">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">
                  {isAm ? 'የስልጠና ዋጋ / ክፍያ፦' : 'Total Course Tuition:'}
                </span>
                <span className="text-2xl font-black text-foreground">
                  {purchasingResource.priceDisplay}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Lock className="size-3" />
                  {isAm ? 'የዕድሜ ልክ መዳረሻ' : 'Lifetime Access'}
                </span>
              </div>
            </div>

            {/* Payment Selection Options */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-bold text-foreground">
                {isAm ? 'የመክፈያ ዘዴ ይምረጡ (Choose Payment Method)፦' : 'Select Official Payment Gateway:'}
              </p>

              {purchasingResource.priceETB === 0 ? (
                <Button
                  onClick={() => handleFreeUnlock(purchasingResource)}
                  disabled={freeUnlockLoading}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20"
                >
                  {freeUnlockLoading
                    ? (isAm ? 'በመክፈት ላይ...' : 'Activating...')
                    : (isAm ? 'ነፃ ይዘቱን አሁኑኑ ክፈት →' : 'Unlock Free Resource Now →')}
                </Button>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Option 1: Chapa Instant Gateway */}
                  <div
                    onClick={() => handleOpenChapaModal(purchasingResource)}
                    className="relative group p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="size-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                          C
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                          {isAm ? 'ወዲያው የሚከፈት' : 'Instant Unlock'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-foreground">
                          Chapa Online Gateway
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          Telebirr, CBEBirr & Visa / Mastercard. Instant verification.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      {isAm ? 'በቻፓ ክፈል →' : 'Pay via Chapa →'}
                    </Button>
                  </div>

                  {/* Option 2: Manual Bank Transfer */}
                  <div
                    onClick={() => handleOpenManualModal(purchasingResource)}
                    className="relative group p-4 rounded-2xl border border-border/80 bg-muted/30 hover:bg-muted/50 hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="size-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                          <Building className="size-4" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                          {isAm ? 'ባንክ / ደረሰኝ' : 'Bank Slip'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-foreground">
                          Manual Bank Transfer
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          Direct transfer to CBE, BOA or Telebirr with receipt submission.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4 w-full rounded-xl text-xs font-bold border-blue-500/30 text-blue-600 dark:text-sky-400 hover:bg-blue-500/10"
                    >
                      {isAm ? 'በደረሰኝ አስገባ →' : 'Submit Bank Slip →'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Security watermark notice */}
              <div className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>
                  {isAm
                    ? 'ደህንነቱ የተጠበቀ ይዘት። በስምዎና በተማሪ መለያ ቁጥርዎ የሚታይ DRM ዋተርማርክ አለው።'
                    : 'DRM secured digital material. Embedded with your personalized student ID watermark.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DIGITAL LIBRARY CHAPA MODAL ─── */}
      <ChapaInlineModal
        resource={chapaResource}
        isOpen={Boolean(chapaResource)}
        onClose={() => setChapaResource(null)}
        onSuccess={async () => {
          const currentId = chapaResource?.id
          setChapaResource(null)
          await fetchStudentData()
          if (currentId) {
            const target = synchronizedResources.find((r) => r.id === currentId)
            if (target) {
              setActiveStudioResource(target)
            }
          }
        }}
      />

      {/* ─── DIGITAL LIBRARY MANUAL PURCHASE MODAL ─── */}
      <DigitalPurchaseModal
        resource={manualPurchaseResource}
        isOpen={Boolean(manualPurchaseResource)}
        onClose={() => {
          setManualPurchaseResource(null)
          fetchStudentData()
        }}
      />

      {/* ─── MODAL 2: HOW IT WORKS / FAQ MODAL ("እንዴት?") ─── */}
      {helpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setHelpModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl animate-scale-in space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                  {isAm ? 'የተማሪ መመሪያና ጥያቄዎች' : 'Student Guide & FAQs'}
                </span>
                <h3 className="text-xl font-black text-foreground mt-1">
                  {isAm ? 'የራስ አቅም ስልጠናና ፖርታል አጠቃቀም (How It Works)' : 'Self-Paced Learning & Student Portal Guide'}
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-muted/40 border">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5 mb-1">
                  <Play className="size-4 text-blue-600" /> {isAm ? '1. የቪዲዮና ማንዋል ኮርሶችን እንዴት መማር እችላለሁ?' : '1. How do I access self-paced masterclasses and manuals?'}
                </h4>
                <p>
                  {isAm
                    ? 'በፖርታልዎ ላይ የሚገኙትን የቪዲዮ ማስተርክላሶችና የጥገና ማንዋሎች ከገዙ በኋላ በቀጥታ በ"My Learning Studio" ውስጥ ማየትና መማር ይችላሉ።'
                    : 'Once unlocked or purchased, all video masterclasses and repair schematics become instantly accessible directly in your secure DRM Learning Studio.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5 mb-1">
                  <Lock className="size-4 text-emerald-600" /> {isAm ? '2. ማውረድ (Download) ወይም ስክሪንሾት ማንሳት ይቻላል?' : '2. Can I download videos or take screenshots?'}
                </h4>
                <p>
                  {isAm
                    ? 'አይቻልም። የትምህርት ይዘቶቹ የሄሎ ቴክኖሎጂ የቅጂ መብት ጥበቃ ስላላቸው (DRM) በማውረድ ወይም በስክሪንሾት እንዳይሰራጩ በስምዎና በStudent IDዎ በየስክሪኑ ላይ ተለይተው በፕላትፎርሙ ላይ ብቻ ይሰራሉ።'
                    : 'No. All learning material is protected with proprietary DRM and student watermarking to prevent illegal distribution. It can be accessed on-demand inside the portal.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5 mb-1">
                  <CheckCircle className="size-4 text-sky-600" /> {isAm ? '3. በራስ ፍጥነት የሚደረግ ትምህርት (Self-Paced) እንዴት ይሰራል?' : '3. How does self-paced education work?'}
                </h4>
                <p>
                  {isAm
                    ? 'ትምህርቱ 100% በራስ ፍጥነት የሚጠና ነው፤ የተመዘገቡበትን የቪዲዮ ማስተርክላሶች እና ማኑዋሎች በፈለጉት ሰዓት እና ቀን በኮምፒውተርዎ ወይም በስልክዎ መከታተል ይችላሉ። ምንም አይነት የፈረቃ፣ የዙር (Batch) ወይም የሰዓት ገደብ የለም።'
                    : 'All education is 100% self-paced. Once enrolled, you receive 24/7 lifetime access to watch video masterclasses and practical guides whenever fits your personal schedule. There are no fixed shifts, morning/afternoon schedules, or batch restrictions.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <Button
                onClick={() => setHelpModalOpen(false)}
                className="rounded-xl text-xs font-bold"
              >
                {isAm ? 'ገባኝ / ተረድቻለሁ' : 'Got it / Close'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECURE IN-PLATFORM LEARNING STUDIO (Player / Reader) ─── */}
      {activeStudioResource && student && (
        <SecureLearningStudio
          isOpen={true}
          resource={activeStudioResource}
          student={{
            fullName: student.fullName,
            studentId: student.studentId,
            institutionalEmail: student.institutionalEmail,
          }}
          completedLessonIds={getCompletedLessonsForResource(activeStudioResource.id)}
          onToggleLessonCompletion={handleToggleLessonProgress}
          onClose={() => setActiveStudioResource(null)}
        />
      )}

      {/* ─── OFFICIAL TUITION RECEIPT MODAL ─── */}
      {activeReceipt && (
        <OfficialReceiptModal
          isOpen={Boolean(activeReceipt)}
          onClose={() => setActiveReceipt(null)}
          data={activeReceipt}
        />
      )}

      {/* ─── OFFICIAL ACCREDITED CERTIFICATE OF COMPETENCE MODAL ─── */}
      {activeCertificate && (
        <StudentCertificate
          isOpen={Boolean(activeCertificate)}
          onClose={() => setActiveCertificate(null)}
          data={activeCertificate}
        />
      )}
    </div>
  )
}
