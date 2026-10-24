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
  const [activeTab, setActiveTab] = useState<'overview' | 'mycourses' | 'catalog' | 'credentials'>('overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Studio and Purchase Modal States
  const [activeStudioResource, setActiveStudioResource] = useState<DigitalResourceMeta | null>(null)
  const [purchasingResource, setPurchasingResource] = useState<DigitalResourceMeta | null>(null)
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState<'telebirr' | 'cbe' | 'tvet_enrolled'>('telebirr')
  const [purchaseTxnRef, setPurchaseTxnRef] = useState('')
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null)
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleSelectTab = (tab: 'overview' | 'mycourses' | 'catalog' | 'credentials') => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', tab)
      window.history.replaceState({}, '', url.toString())
    }
  }

  useEffect(() => {
    fetchStudentData()

    // Sync tab from URL if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      const validTabs = ['overview', 'mycourses', 'catalog', 'credentials']
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam as any)
      } else if (tabParam === 'selflearning' || tabParam === 'courses') {
        setActiveTab('mycourses')
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

  // Handle purchasing / unlocking a digital resource
  const handleConfirmPurchase = async () => {
    if (!purchasingResource) return
    setPurchaseLoading(true)
    try {
      const res = await fetch('/api/student/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: purchasingResource.id,
          paymentMethod: purchasePaymentMethod,
          transactionRef: purchaseTxnRef || `TXN-${Date.now().toString().slice(-6)}`,
        }),
      })
      const result = await res.json()
      if (result.success && result.purchase) {
        // Update local list
        setDigitalPurchases((prev) => {
          const filtered = prev.filter((p) => p.resourceId !== purchasingResource.id)
          return [result.purchase, ...filtered]
        })
        const purchasedItem = purchasingResource
        const isApproved = result.purchase.status === 'Active'
        setPurchasingResource(null)
        setPurchaseTxnRef('')
        if (isApproved) {
          setActiveStudioResource(purchasedItem)
        } else {
          setActiveTab('mycourses')
        }
      } else {
        alert(result.error || 'Failed to complete transaction')
      }
    } catch (e: any) {
      alert(e.message || 'Error unlocking resource')
    } finally {
      setPurchaseLoading(false)
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

  const totalEnrolledCount = enrolledCourses.filter((c) => c.status === 'Active').length
  const totalCompletedLessons = enrolledCourses.reduce((sum, c) => sum + c.completedCount, 0)

  type NavTabId = 'overview' | 'mycourses' | 'catalog' | 'credentials'

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
          label: isAm ? 'የተማሪ ዳሽቦርድ ማጠቃለያ' : 'Dashboard Overview',
          shortLabel: isAm ? 'አጠቃላይ' : 'Overview',
          icon: Sparkles,
          count: 0,
          badge: isAm ? 'ንቁ' : 'Active',
        },
        {
          id: 'mycourses',
          label: isAm ? 'የእኔ ትምህርቶች' : 'My Enrolled Courses',
          shortLabel: isAm ? 'ትምህርቶች' : 'My Courses',
          icon: BookOpen,
          count: totalEnrolledCount,
          badge: totalEnrolledCount > 0 ? `${totalEnrolledCount}` : null,
        },
        {
          id: 'catalog',
          label: isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore All Courses',
          shortLabel: isAm ? 'ካታሎግ' : 'Browse Courses',
          icon: ShoppingBag,
          count: popularMasterCourses.length,
          badge: null,
        },
        {
          id: 'credentials',
          label: isAm ? 'የምስክር ወረቀት እና ደረሰኝ' : 'Certificates & Receipts',
          shortLabel: isAm ? 'ሰነዶች' : 'Credentials',
          icon: Award,
          count: 0,
          badge: null,
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

          {/* Student Status Card in Sidebar */}
          <div className="rounded-2xl border border-blue-900/50 bg-white/5 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
                {isAm ? 'የተማሪ ሁኔታ' : 'Student Status'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isAm ? 'ንቁ' : 'Active'}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-blue-200/80">
                <span>{isAm ? 'መለያ ቁጥር' : 'Student ID'}:</span>
                <span className="font-mono font-bold text-white">{student.studentId}</span>
              </div>
              <div className="flex justify-between items-center text-blue-200/80">
                <span>{isAm ? 'የትምህርት አይነት' : 'Learning Mode'}:</span>
                <span className="font-medium text-white truncate max-w-[130px]">
                  {isAm ? 'በራስ ፍጥነት' : '100% Self-Paced'}
                </span>
              </div>
              <div className="flex justify-between items-center text-blue-200/80">
                <span>{isAm ? 'መዳረሻ' : 'Access'}:</span>
                <span className="font-bold text-emerald-400">
                  {isAm ? 'ቋሚ (Lifetime)' : 'Lifetime Access'}
                </span>
              </div>
            </div>
          </div>
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
              {/* Direct Telegram Link */}
              <a
                href={schoolConfig.telegram}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-sky-200/80 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition"
                title="Hello Technology Telegram"
              >
                <Send className="size-3.5" />
                <span>Telegram</span>
              </a>

              {/* Direct Call Link */}
              <a
                href={`tel:+251${schoolConfig.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                title="Call Registrar Desk"
              >
                <Phone className="size-3.5" />
                <span>{schoolConfig.phone}</span>
              </a>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Help Dialog Trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHelpModalOpen(true)}
                className="rounded-xl border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 gap-1.5 text-xs font-semibold hover:border-blue-500 cursor-pointer"
              >
                <HelpCircle className="size-3.5 text-blue-600 dark:text-sky-400" />
                <span className="hidden sm:inline">{isAm ? 'እገዛ' : 'Help Desk'}</span>
              </Button>
            </div>
          </div>

          {/* Clean Segmented Quick-Tabs Bar */}
          <div className="flex items-center gap-1.5 pb-2.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60 pt-2">
            {allNavItems.map((item) => {
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="size-3.5 shrink-0" />
                  <span>{item.shortLabel}</span>
                  {item.badge ? (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      active ? 'bg-white text-blue-700' : 'bg-blue-500/15 text-blue-600 dark:text-sky-300'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* ── TOP COMPACT 4-CARD METRIC STRIP ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Enrolled Courses */}
            <div
              onClick={() => handleSelectTab('mycourses')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                activeTab === 'mycourses'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                  : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                  {isAm ? 'የተከፈቱ ስልጠናዎች' : 'Enrolled Courses'}
                </span>
                <BookOpen className="size-4 text-blue-600 dark:text-sky-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">
                {totalEnrolledCount}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {totalEnrolledCount > 0
                  ? (isAm ? 'ቋሚ መዳረሻ አለዎት' : 'Lifetime access active')
                  : (isAm ? 'ምንም ስልጠና አልተከፈተም' : 'No courses unlocked yet')}
              </p>
            </div>

            {/* Card 2: Completed Lessons */}
            <div
              onClick={() => handleSelectTab('mycourses')}
              className="rounded-2xl border border-border/80 bg-card p-4 hover:border-blue-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isAm ? 'የተጠናቀቁ ክፍሎች' : 'Completed Lessons'}
                </span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">
                {totalCompletedLessons}
              </p>
              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="size-3" /> {isAm ? 'በራስዎ ፍጥነት ይማሩ' : 'Self-Paced Progress'}
              </p>
            </div>

            {/* Card 3: Learning Mode */}
            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isAm ? 'የትምህርት ዘይቤ' : 'Learning Mode'}
                </span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <p className="mt-2 text-base font-bold text-foreground truncate">
                {isAm ? '100% በራስ ፍጥነት' : '100% Self-Paced'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {isAm ? 'በማንኛውም ሰዓትና ቦታ' : '24/7 on-demand access'}
              </p>
            </div>

            {/* Card 4: Credentials */}
            <div
              onClick={() => handleSelectTab('credentials')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all group ${
                activeTab === 'credentials'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                  : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>{isAm ? 'ይፋዊ ሰነዶች' : 'Credentials'}</span>
                </span>
                <Award className="size-4 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="mt-2 text-base font-black text-blue-600 dark:text-sky-400">
                {isAm ? 'ዕውቅና ያለው' : 'Accredited'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                <span>{isAm ? 'ምስክር ወረቀት እና ደረሰኝ' : 'Certificates & receipts'}</span>
                <ChevronRight className="size-3 text-muted-foreground group-hover:text-blue-500" />
              </p>
            </div>
          </div>

          {/* ── NOTICE STRIP ── */}
          {totalEnrolledCount > 0 ? (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/40 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white font-bold text-xs shadow-xs">
                  ℹ
                </span>
                <div>
                  <span className="font-bold text-blue-700 dark:text-sky-300">
                    {isAm ? 'የእርስዎ ትምህርት ቤት፦' : 'Your Learning Workspace:'}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {isAm
                      ? `በራስዎ ፍጥነት የሚማሩባቸው ${totalEnrolledCount} ስልጠናዎች ዝግጁ ናቸው። በፈለጉት ሰዓት መማር መቀጠል ይችላሉ።`
                      : `You have ${totalEnrolledCount} self-paced course(s) unlocked on your account with 24/7 lifetime access.`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('mycourses')}
                className="shrink-0 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline underline-offset-4 self-end sm:self-center cursor-pointer"
              >
                {isAm ? 'ወደ ትምህርቶቼ ሂድ →' : 'Go to My Courses →'}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground font-bold text-xs">
                  ℹ
                </span>
                <div>
                  <span className="font-bold text-foreground">
                    {isAm ? 'በራስ ፍጥነት የሚሰጥ ትምህርት፦' : 'Self-Paced Learning:'}
                  </span>{' '}
                  <span>
                    {isAm
                      ? 'እንኳን ወደ ሄሎ ቴክኖሎጂ ተማሪ ፖርታል በደህና መጡ! የሚፈልጉትን የቪዲዮ ኮርስ ወይም ማኑዋል በመክፈት ትምህርትዎን አሁኑኑ በራስዎ ፍጥነት ይጀምሩ።'
                      : 'Welcome to Hello Technology Student Portal! Browse our self-paced mastercourses below to unlock instant 24/7 access.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('catalog')}
                className="shrink-0 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline underline-offset-4 self-end sm:self-center cursor-pointer"
              >
                {isAm ? 'ስልጠናዎችን ይመልከቱ →' : 'Browse Courses →'}
              </button>
            </div>
          )}

          {/* ─── TAB 1: OVERVIEW / DASHBOARD HUB ─── */}
          {activeTab === 'overview' && (
            <div className="mt-4 space-y-8 animate-fade-in">
              {/* Student Welcome & Quick Actions Hero */}
              <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-transparent p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isAm ? 'ንቁ የተማሪ አካውንት' : 'Authenticated Student Workspace'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[11px] font-mono font-bold text-blue-700 dark:text-sky-300">
                      {student.studentId}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    {isAm ? `እንኳን ደህና መጡ፣ ${student.fullName}!` : `Welcome back, ${student.fullName}!`}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                    {isAm
                      ? `በሄሎ ቴክኖሎጂ ተማሪ ፖርታል አማካኝነት በራስዎ ፍጥነት የተዘጋጁ የቪዲዮ ማስተርክላሶችን እና የቴክኒክ ጥገና ማንዋሎችን በማንኛውም ሰዓት ይከታተሉ።`
                      : `Study high-definition video masterclasses and practical technical repair manuals at your own pace with 24/7 on-demand access.`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Button
                    onClick={() => handleSelectTab('mycourses')}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-4 shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    <BookOpen className="size-3.5 mr-1.5" />
                    {isAm ? 'የእኔ ትምህርቶች' : 'My Enrolled Courses'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelectTab('catalog')}
                    className="rounded-xl text-xs font-semibold h-10 px-4 cursor-pointer"
                  >
                    <ShoppingBag className="size-3.5 mr-1.5 text-blue-600 dark:text-sky-400" />
                    {isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore Courses'}
                  </Button>
                </div>
              </div>

              {/* SECTION: MY ENROLLED COURSES */}
              <div className="space-y-4">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectTab('mycourses')}
                      className="text-xs font-semibold text-blue-600 dark:text-sky-400 self-start sm:self-center"
                    >
                      {isAm ? 'ሁሉንም ይመልከቱ →' : 'View All →'}
                    </Button>
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
                        ? 'እስካሁን ምንም አይነት የቪዲዮ ኮርስ ወይም ማንዋል አልከፈቱም። ፈጣን መዳረሻ ለማግኘት ተወዳጅ ስልጠናዎቻችንን ይመልከቱ።'
                        : "You haven't purchased any self-paced courses or manuals yet. Browse our masterclasses below to unlock instant 24/7 access."}
                    </p>
                    <Button
                      onClick={() => handleSelectTab('catalog')}
                      className="mt-5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      {isAm ? 'ስልጠናዎችን ይመልከቱ →' : 'Browse Master Courses →'}
                    </Button>
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

              {/* SECTION: POPULAR MASTER COURSES */}
              <div className="space-y-4 pt-6 border-t">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400">
                    {isAm ? 'ተወዳጅ የቪዲዮ ትምህርቶች እና መጻሕፍት' : 'Featured Video Masterclasses & Manuals'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {isAm ? 'ተወዳጅ የሄሎ ቴክኖሎጂ ስልጠናዎች' : 'Popular Hello Technology Courses & Books'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAm
                      ? 'አንዴ በመክፈል በተማሪ ፖርታልዎ ላይ በራስዎ ፍጥነት ይማሩ። ጥራት ያላቸው የቪዲዮ ትምህርቶች እና የተግባር የጥገና ማንዋሎች በልዩ የደህንነት ጥበቃ የተዘጋጁ።'
                      : 'Purchase once and study at your self-learning pace directly on your student portal. High-definition recorded masterclasses and technical repair manuals protected with dynamic student watermarking.'}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {popularMasterCourses.map((item) => {
                    const unlocked = isResourcePurchased(item.id)
                    const isVideo = item.format === 'Video Masterclass'

                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md card-hover-lift hover:border-blue-500/50 transition-all"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                              {isVideo ? <Video className="size-5" /> : <BookOpen className="size-5" />}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                {item.rating} ({item.reviewCount})
                              </span>
                              <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-extrabold text-blue-600 dark:text-sky-400">
                                {item.priceDisplay}
                              </span>
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <span className="mt-5 block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                            {item.category}
                          </span>
                          <h4 className="mt-1 text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground font-medium">
                            {item.subtitle}
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                            {item.description}
                          </p>

                          {/* Content Specs */}
                          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5 text-blue-500" />
                              {isVideo
                                ? `${item.lessons?.length || 0} ${isAm ? 'ትምህርቶች' : 'Lessons'}`
                                : `${item.chapters?.length || 0} ${isAm ? 'ምዕራፎች' : 'Chapters'}`}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Lock className="size-3" /> {isAm ? 'በራስ ፍጥነት የሚጠና' : '100% Self-Paced'}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6 pt-4 border-t border-border/60">
                          {unlocked ? (
                            <Button
                              onClick={() => setActiveStudioResource(item)}
                              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <Play className="size-4" /> {isAm ? 'ትምህርቱን ጀምር' : 'Study on Platform'}
                            </Button>
                          ) : getPurchaseStatus(item.id) === 'Pending' ? (
                            <Button
                              disabled
                              className="w-full rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs gap-1.5 cursor-not-allowed"
                            >
                              <Clock className="size-4" /> {isAm ? 'የአስተዳዳሪ ማረጋገጫ በመጠባበቅ ላይ' : 'Waiting for Admin Approval'}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setPurchasingResource(item)}
                              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-600/20 hover:scale-[1.02] transition-all"
                            >
                              <ShoppingBag className="size-4" /> {isAm ? `ይዘቱን ይክፈቱ (${item.priceDisplay})` : `Purchase & Unlock (${item.priceDisplay})`}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SECTION: CREDENTIALS QUICK CARD */}
              <div className="pt-6 border-t">
                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-blue-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                      <Award className="size-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-foreground">
                        {isAm ? 'ይፋዊ የሙያ ብቃት ማረጋገጫ የምስክር ወረቀት' : 'Accredited Certificate of Competence'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAm
                          ? 'የቪዲዮ ማስተርክላሶችን ሲያጠናቅቁ ይፋዊ የምስክር ወረቀት በኦንላይን QR ማረጋገጫ ይዘጋጅልዎታል።'
                          : 'Upon completing self-paced milestones, your verified accredited certificate with online QR code is instantly accessible.'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSelectTab('credentials')}
                    className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-amber-600/20 shrink-0"
                  >
                    <Award className="size-3.5" />
                    {isAm ? 'ሰነዶችን ይመልከቱ' : 'View Credentials'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: MY COURSES DEDICATED VIEW ─── */}
          {activeTab === 'mycourses' && (
            <div className="mt-4 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-black text-foreground">
                    {isAm ? 'የእኔ የተከፈቱ ትምህርቶች' : 'My Enrolled Courses'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isAm
                      ? 'በራስዎ ፍጥነት የሚማሩባቸው ሁሉም የቪዲዮ ማስተርክላሶች እና የጥገና ማንዋሎች።'
                      : 'All self-paced video masterclasses and repair manuals unlocked on your student account.'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="size-4" /> {isAm ? '100% በራስ ፍጥነት · ቋሚ መዳረሻ' : '100% Self-Paced · Lifetime Access'}
                </div>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
                  <BookOpen className="size-12 mx-auto text-muted-foreground opacity-40 mb-3" />
                  <h3 className="text-lg font-bold">
                    {isAm ? 'እስካሁን የተከፈተ የቪዲዮ ትምህርት የለም' : 'No Self-Paced Courses Unlocked Yet'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    {isAm
                      ? 'እስካሁን ምንም አይነት የቪዲዮ ኮርስ ወይም ማንዋል አልከፈቱም። ፈጣን መዳረሻ ለማግኘት ተወዳጅ ስልጠናዎቻችንን ይመልከቱ።'
                      : "You haven't enrolled in any self-paced courses yet. Browse our masterclasses to unlock instant lifetime access."}
                  </p>
                  <Button
                    onClick={() => handleSelectTab('catalog')}
                    className="mt-6 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    {isAm ? 'ስልጠናዎችን ይመልከቱ →' : 'Browse Courses →'}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {enrolledCourses.map((item) => {
                    const isVideo = item.format === 'Video Masterclass'
                    return (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-blue-500/30 bg-card p-6 sm:p-7 shadow-lg flex flex-col justify-between"
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
                                {isAm ? '✓ ክፍት እና ንቁ' : '✓ Unlocked & Licensed'}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.subtitle}
                          </p>

                          {item.status === 'Pending' ? (
                            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                              <p className="font-bold flex items-center gap-1.5">
                                <AlertCircle className="size-3.5" /> {isAm ? 'የክፍያ ማመሳከሪያ ደርሷል' : 'Payment Reference Received'}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {isAm ? 'የግብይት ቁጥር፦' : 'Transaction Ref:'} <strong className="font-mono text-foreground">{item.transactionRef || 'N/A'}</strong> ({item.paymentMethod?.toUpperCase()})
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {isAm
                                  ? 'የምዝገባ እና የፋይናንስ ክፍላችን ክፍያዎን እያረጋገጠ ነው። እንደተረጋገጠ ወዲያውኑ መዳረሻዎ ይከፈታል።'
                                  : 'Our financial desk is reviewing your payment. Access will unlock immediately once approved.'}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-5 space-y-1.5">
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

                        <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">
                            {isAm ? 'አሰልጣኝ፦' : 'Instructor:'} <strong>{item.instructor}</strong>
                          </span>

                          <div className="flex items-center gap-2">
                            {item.status === 'Pending' ? (
                              <Button
                                disabled
                                className="rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-xs gap-1.5"
                              >
                                <Clock className="size-3.5" /> {isAm ? 'ማረጋገጫ በመጠባበቅ ላይ' : 'Pending Approval'}
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => setActiveStudioResource(item.meta)}
                                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
                                >
                                  <Play className="size-3.5" /> {isAm ? 'ትምህርቱን ጀምር' : 'Resume Learning'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openCertificateForCourse(item.title, item.transactionRef)}
                                  className="rounded-xl text-xs gap-1"
                                >
                                  <Award className="size-3.5 text-amber-500" />
                                  <span>{isAm ? 'ምስክር ወረቀት' : 'Certificate'}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openReceiptForCourse(item.title, item.amount || 2999, item.paymentMethod || 'telebirr', item.transactionRef, item.createdAt)}
                                  className="rounded-xl text-xs gap-1 text-muted-foreground hover:text-foreground"
                                >
                                  <FileText className="size-3.5" />
                                  <span>{isAm ? 'ደረሰኝ' : 'Receipt'}</span>
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
          )}

          {/* ─── TAB 3: EXPLORE ALL COURSES CATALOG ─── */}
          {activeTab === 'catalog' && (
            <div className="mt-4 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-black text-foreground">
                    {isAm ? 'ሁሉንም ስልጠናዎች ይመልከቱ' : 'Explore All Self-Paced Courses'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isAm
                      ? 'አንዴ በመክፈል በማንኛውም ሰዓት በራስዎ ፍጥነት የሚማሩባቸው የቪዲዮ ማስተርክላሶች እና የጥገና ማንዋሎች።'
                      : 'High-definition video courses and technical repair manuals with lifetime on-demand access.'}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {popularMasterCourses.length} {isAm ? 'ስልጠናዎች ይገኛሉ' : 'Courses Available'}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {popularMasterCourses.map((item) => {
                  const unlocked = isResourcePurchased(item.id)
                  const isVideo = item.format === 'Video Masterclass'

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md card-hover-lift hover:border-blue-500/50 transition-all"
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                            {isVideo ? <Video className="size-5" /> : <BookOpen className="size-5" />}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {item.rating} ({item.reviewCount})
                            </span>
                            <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-extrabold text-blue-600 dark:text-sky-400">
                              {item.priceDisplay}
                            </span>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <span className="mt-5 block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                          {item.category}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground font-medium">
                          {item.subtitle}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>

                        {/* Content Specs */}
                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5 text-blue-500" />
                            {isVideo
                              ? `${item.lessons?.length || 0} ${isAm ? 'ትምህርቶች' : 'Lessons'}`
                              : `${item.chapters?.length || 0} ${isAm ? 'ምዕራፎች' : 'Chapters'}`}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Lock className="size-3" /> {isAm ? 'በራስ ፍጥነት የሚጠና' : '100% Self-Paced'}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 pt-4 border-t border-border/60">
                        {unlocked ? (
                          <Button
                            onClick={() => setActiveStudioResource(item)}
                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <Play className="size-4" /> {isAm ? 'ትምህርቱን ጀምር' : 'Study on Platform'}
                          </Button>
                        ) : getPurchaseStatus(item.id) === 'Pending' ? (
                          <Button
                            disabled
                            className="w-full rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs gap-1.5 cursor-not-allowed"
                          >
                            <Clock className="size-4" /> {isAm ? 'የአስተዳዳሪ ማረጋገጫ በመጠባበቅ ላይ' : 'Waiting for Admin Approval'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setPurchasingResource(item)}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-600/20 hover:scale-[1.02] transition-all"
                          >
                            <ShoppingBag className="size-4" /> {isAm ? `ይዘቱን ይክፈቱ (${item.priceDisplay})` : `Purchase & Unlock (${item.priceDisplay})`}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── TAB 4: CREDENTIALS & OFFICIAL RECORDS ─── */}
          {activeTab === 'credentials' && (
            <div className="mt-4 space-y-6 animate-fade-in">
              <div className="pb-4 border-b">
                <h2 className="text-2xl font-black text-foreground">
                  {isAm ? 'ይፋዊ የምስክር ወረቀቶች እና ደረሰኞች' : 'Official Certificates & Tuition Receipts'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isAm
                    ? 'በሄሎ ቴክኖሎጂ የሙያ ማሰልጠኛ ማዕከል የተዘጋጁ የብቃት ማረጋገጫ የምስክር ወረቀቶች እና ይፋዊ የክፍያ ደረሰኞች።'
                    : 'Accredited certificates of practical competence and computer-generated tuition receipts.'}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Certificate Card */}
                <div className="rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-7 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-4">
                      <Award className="size-8" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {isAm ? 'የሙያ ብቃት ማረጋገጫ' : 'Accredited TVET Credential'}
                    </span>
                    <h3 className="mt-1 text-xl font-black text-foreground">
                      {isAm ? 'የሙያ ብቃት ማረጋገጫ የምስክር ወረቀት' : 'Certificate of Practical Competence'}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {isAm
                        ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተዘጋጁትን የቪዲዮ ትምህርቶችና የተግባር ሙያዊ መስፈርቶች በማጠናቀቅ የሚሰጥ ይፋዊ የምስክር ወረቀት። በኦንላይን QR ማረጋገጫ የተደገፈ።'
                        : 'Official TVET accredited certificate issued upon completing self-paced masterclasses and practical diagnostic competencies. Verified by online QR code.'}
                    </p>

                    <div className="mt-5 p-4 rounded-2xl bg-muted/30 border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'ተማሪ፦' : 'Student:'}</span>
                        <strong className="text-foreground">{student.fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'መለያ ቁጥር፦' : 'Student ID:'}</span>
                        <strong className="font-mono text-blue-600 dark:text-sky-400">{student.studentId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'የትምህርት አይነት፦' : 'Learning Mode:'}</span>
                        <strong className="text-foreground">{isAm ? 'በራስ ፍጥነት የሚጠና' : '100% Self-Paced'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={() =>
                        openCertificateForCourse(
                          enrolledCourses[0]?.title || 'Professional Hardware & Electronics Mastery',
                          enrolledCourses[0]?.transactionRef
                        )
                      }
                      className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-amber-600/20"
                    >
                      <Award className="size-4" />
                      {isAm ? 'ምስክር ወረቀት ቅድመ-ዕይታ እና ማተም' : 'Preview & Print Certificate'}
                    </Button>
                  </div>
                </div>

                {/* Tuition Receipt Card */}
                <div className="rounded-3xl border border-blue-500/30 bg-card p-6 sm:p-7 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-600 dark:text-sky-400 border border-blue-500/30 mb-4">
                      <FileText className="size-8" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                      {isAm ? 'ይፋዊ ደረሰኝ' : 'Official Tuition Receipt'}
                    </span>
                    <h3 className="mt-1 text-xl font-black text-foreground">
                      {isAm ? 'የትምህርት ክፍያ ይፋዊ ደረሰኝ' : 'Official Payment Receipt'}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {isAm
                        ? 'በሄሎ ቴክኖሎጂ የሙያ ማሰልጠኛ ማዕከል የተከፈለውን የትምህርት ክፍያ የሚያረጋግጥ በኮምፒውተር የተዘጋጀ ይፋዊ የክፍያ ሰነድ።'
                        : 'Computer-generated official receipt proving fee settlement and enrollment in Hello Technology self-paced technical courses.'}
                    </p>

                    <div className="mt-5 p-4 rounded-2xl bg-muted/30 border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'ተማሪ፦' : 'Student:'}</span>
                        <strong className="text-foreground">{student.fullName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'ሁኔታ፦' : 'Status:'}</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{isAm ? 'ተረጋግጧል (Settled)' : 'Verified & Settled'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAm ? 'የክፍያ አይነት፦' : 'Payment Mode:'}</span>
                        <strong className="text-foreground">{isAm ? 'ቋሚ መዳረሻ (One-Time)' : 'Lifetime Access'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <Button
                      onClick={() =>
                        openReceiptForCourse(
                          enrolledCourses[0]?.title || 'Hello Technology Self-Paced Course',
                          enrolledCourses[0]?.amount || 2999,
                          enrolledCourses[0]?.paymentMethod || 'telebirr',
                          enrolledCourses[0]?.transactionRef,
                          enrolledCourses[0]?.createdAt
                        )
                      }
                      variant="outline"
                      className="w-full rounded-xl font-bold text-xs gap-1.5 border-blue-500/30 text-blue-600 dark:text-sky-400 hover:bg-blue-500/10"
                    >
                      <FileText className="size-4" />
                      {isAm ? 'ይፋዊ ደረሰኝ ይመልከቱ እና ያትሙ' : 'View & Print Receipt'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL 1: PURCHASE & UNLOCK MODAL ─── */}
      {purchasingResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setPurchasingResource(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-sky-400">
                  {purchasingResource.format}
                </span>
                <h3 className="text-xl font-black text-foreground mt-2">
                  {isAm ? `${purchasingResource.title} ክፈት` : `Unlock ${purchasingResource.title}`}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isAm
                    ? 'ወዲያውኑ በተማሪ ፖርታልዎ ላይ ይሰራል · 24/7 የዕድሜ ልክ የመማሪያ መዳረሻ'
                    : 'Instant activation to your student dashboard · 24/7 Lifetime access'}
                </p>
              </div>
              <button
                onClick={() => setPurchasingResource(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Price card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs font-semibold text-muted-foreground">
                  {isAm ? 'የኮርስ ክፍያ፦' : 'Tuition Fee:'}
                </span>
                <span className="text-2xl font-black text-blue-600 dark:text-sky-400">
                  {purchasingResource.priceDisplay}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  {isAm ? 'የመክፈያ ዘዴ ይምረጡ፦' : 'Select Unlocking Method:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPurchasePaymentMethod('telebirr')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      purchasePaymentMethod === 'telebirr'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-border/80 bg-muted/30 hover:border-blue-500/40 text-foreground'
                    }`}
                  >
                    <p>Telebirr</p>
                    <p className="text-[10px] opacity-80 mt-0.5">{schoolConfig.phone}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchasePaymentMethod('cbe')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      purchasePaymentMethod === 'cbe'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-border/80 bg-muted/30 hover:border-blue-500/40 text-foreground'
                    }`}
                  >
                    <p>CBE Birr / Bank</p>
                    <p className="text-[10px] opacity-80 mt-0.5">100047747070</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchasePaymentMethod('tvet_enrolled')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      purchasePaymentMethod === 'tvet_enrolled'
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-border/80 bg-muted/30 hover:border-emerald-500/40 text-foreground'
                    }`}
                  >
                    <p>{isAm ? 'የቴክኒክና ሙያ ተማሪ' : 'TVET Student'}</p>
                    <p className="text-[10px] opacity-80 mt-0.5">{isAm ? 'የተመዘገበ ተማሪ ቅናሽ' : 'Enrolled Benefit'}</p>
                  </button>
                </div>
              </div>

              {/* Transaction Ref input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {isAm ? 'የግብይት መለያ (Transaction ID)፦' : 'Transaction ID / Reference:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPurchaseTxnRef(`TLB-${Date.now().toString().slice(-6)}`)}
                    className="text-blue-600 dark:text-sky-400 font-bold hover:underline"
                  >
                    {isAm ? 'የሙከራ ቁጥር ፍጠር' : 'Generate Test ID'}
                  </button>
                </div>
                <input
                  type="text"
                  value={purchaseTxnRef}
                  onChange={(e) => setPurchaseTxnRef(e.target.value)}
                  placeholder={isAm ? 'ምሳሌ፦ TLB89218491 ወይም የደረሰኝ ቁጥር' : 'e.g. TLB89218491 or Slip number'}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-mono outline-none focus:border-blue-500"
                />
              </div>

              {/* Anti-piracy disclaimer */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
                <Lock className="size-4 text-emerald-500 shrink-0" />
                <span>
                  {isAm
                    ? 'ሊወርድ የማይችል የDRM ይዘት። በስምዎና መለያዎ በሚታይ ዋተርማርክ በቀጥታ በስቱዲዮዎ ውስጥ ይገኛል።'
                    : 'Non-downloadable DRM material. Available directly inside your student studio with personalized watermark.'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPurchasingResource(null)}
                className="rounded-xl text-xs"
              >
                {isAm ? 'ተመለስ' : 'Cancel'}
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmPurchase}
                disabled={purchaseLoading}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
              >
                {purchaseLoading
                  ? (isAm ? 'በማረጋገጥ ላይ...' : 'Activating...')
                  : (isAm ? 'አረጋግጥ እና ስቱዲዮውን ክፈት →' : 'Confirm & Launch Studio →')}
              </Button>
            </div>
          </div>
        </div>
      )}

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
