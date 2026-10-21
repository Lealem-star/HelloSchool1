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
  const [activeTab, setActiveTab] = useState<'overview' | 'selflearning' | 'courses' | 'batch' | 'resources' | 'tuition' | 'community'>('overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [resourceSearch, setResourceSearch] = useState('')

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

  const handleSelectTab = (tab: 'overview' | 'selflearning' | 'courses' | 'batch' | 'resources' | 'tuition' | 'community') => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', tab)
      window.history.replaceState({}, '', url.toString())
    }
  }

  useEffect(() => {
    fetchStudentData()

    // Sync tab from URL if present (e.g. ?tab=selflearning or ?tab=courses)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      const validTabs = ['overview', 'selflearning', 'courses', 'batch', 'resources', 'tuition', 'community']
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam as any)
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
          setActiveTab('selflearning')
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

  const latestRegistration = registrations[0]

  const filteredResources = libraryResources.filter((res) => {
    const q = resourceSearch.toLowerCase()
    return (
      res.title.toLowerCase().includes(q) ||
      res.category.toLowerCase().includes(q) ||
      (res.description && res.description.toLowerCase().includes(q))
    )
  })

  // Live popular master courses synced from database
  const popularMasterCourses = synchronizedResources

  type NavTabId = 'overview' | 'selflearning' | 'courses' | 'batch' | 'resources' | 'tuition' | 'community'

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
      label: isAm ? 'የእኔ ትምህርት እና ስቱዲዮ' : 'My Studies & Learning',
      items: [
        {
          id: 'overview',
          label: isAm ? 'የተማሪ ዳሽቦርድ ማጠቃለያ' : 'Dashboard Overview',
          shortLabel: isAm ? 'አጠቃላይ' : 'My Overview',
          icon: Sparkles,
          count: 0,
          badge: latestRegistration?.status === 'Approved' ? (isAm ? 'ንቁ' : 'Active') : null,
        },
        {
          id: 'selflearning',
          label: isAm ? 'የእኔ ዲጂታል ስቱዲዮ (DRM)' : 'My DRM Studio & Courses',
          shortLabel: isAm ? 'DRM ስቱዲዮ' : 'DRM Studio',
          icon: Video,
          count: digitalPurchases.length,
          badge: digitalPurchases.length > 0 ? `${digitalPurchases.length}` : null,
        },
        {
          id: 'courses',
          label: isAm ? 'የተመዘገቡባቸው ስልጠናዎች' : 'Enrolled TVET Tracks',
          shortLabel: isAm ? 'ስልጠናዎች' : 'Enrolled Tracks',
          icon: BookOpen,
          count: registrations.length,
          badge: registrations.length > 0 ? `${registrations.length}` : null,
        },
        {
          id: 'batch',
          label: isAm ? 'የስልጠና ዙር እና ፕሮግራም' : 'Cohort Batch & Schedule',
          shortLabel: isAm ? 'የስልጠና ዙር' : 'Batch Schedule',
          icon: Layers,
          count: 0,
          badge: latestRegistration?.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01'),
        },
      ],
    },
    {
      label: isAm ? 'ላይብረሪ እና መመሪያዎች' : 'Technical Library',
      items: [
        {
          id: 'resources',
          label: isAm ? 'የቴክኒክ ላይብረሪ & ማኑዋሎች' : 'Technical Library & Schematics',
          shortLabel: isAm ? 'ላይብረሪ' : 'Library',
          icon: FileText,
          count: libraryResources.length,
          badge: null,
        },
      ],
    },
    {
      label: isAm ? 'ክፍያ እና ማህበረሰብ' : 'Tuition & Support',
      items: [
        {
          id: 'tuition',
          label: isAm ? 'ክፍያዎች & ደረሰኞች' : 'Tuition & Receipts',
          shortLabel: isAm ? 'ደረሰኞች' : 'Tuition',
          icon: CreditCard,
          count: registrations.length,
          badge: null,
        },
        {
          id: 'community',
          label: isAm ? 'ማህበረሰብ & እገዛ' : 'Help Desk & Support',
          shortLabel: isAm ? 'እገዛ' : 'Help Desk',
          icon: Send,
          count: 0,
          badge: null,
        },
      ],
    },
  ]

  const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items)
  const currentSection: NavItem | undefined = allNavItems.find((n) => n.id === activeTab) || allNavItems[0]

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

          {/* Trainee Quick Status Card in Sidebar */}
          <div className="rounded-2xl border border-blue-900/50 bg-white/5 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
                {isAm ? 'የተማሪ ሁኔታ' : 'Trainee Status'}
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
                <span>{isAm ? 'ፈረቃ' : 'Shift'}:</span>
                <span className="font-medium text-white truncate max-w-[110px]">
                  {latestRegistration?.shift || (isAm ? 'የቀን ፈረቃ' : 'Morning Shift')}
                </span>
              </div>
              <div className="flex justify-between items-center text-blue-200/80">
                <span>{isAm ? 'ዙር (Batch)' : 'Batch'}:</span>
                <span className="font-mono font-bold text-sky-300">
                  {latestRegistration?.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01')}
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
                <span className="truncate max-w-[120px] font-mono">{student.institutionalEmail}</span>
                <button
                  onClick={() => handleCopy(student.institutionalEmail, 'sidebar-email')}
                  className="hover:text-white transition"
                  title={isAm ? 'ኢሜይል ቅዳ' : 'Copy email'}
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
            {/* Card 1: Enrolled Tracks */}
            <div
              onClick={() => handleSelectTab('courses')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                activeTab === 'courses'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                  : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isAm ? 'የተግባር ስልጠናዎች' : 'Enrolled TVET Tracks'}
                </span>
                <BookOpen className="size-4 text-blue-600 dark:text-sky-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-foreground">
                {registrations.length}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {registrations.length > 0
                  ? (isAm ? 'ንቁ የተግባር ምዝገባ' : 'Active lab registration')
                  : (isAm ? 'ምንም ምዝገባ የለም' : 'No active track')}
              </p>
            </div>

            {/* Card 2: Self-Paced Courses */}
            <div
              onClick={() => handleSelectTab('selflearning')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                activeTab === 'selflearning'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                  : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                  {isAm ? 'የዲጂታል ትምህርቶች' : 'Self-Paced Courses'}
                </span>
                <Video className="size-4 text-blue-600 dark:text-sky-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-blue-600 dark:text-sky-400">
                {digitalPurchases.length} {isAm ? 'ተከፍቷል' : 'Unlocked'}
              </p>
              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" /> {isAm ? 'በDRM ስቱዲዮ የተጠበቀ' : 'Zero Download DRM'}
              </p>
            </div>

            {/* Card 3: Cohort Shift */}
            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isAm ? 'የስልጠና ፈረቃ' : 'Cohort Shift'}
                </span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <p className="mt-2 text-base font-bold text-foreground truncate">
                {latestRegistration ? latestRegistration.shift : (isAm ? 'አልተመደበም' : 'Morning Shift')}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {isAm ? 'ባህር ዳር ዋና ካምፓስ' : 'Bahir Dar Main Campus'}
              </p>
            </div>

            {/* Card 4: Academic Batch Intake */}
            <div
              onClick={() => handleSelectTab('batch')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all group ${
                activeTab === 'batch'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                  : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>{isAm ? 'የአካዳሚክ ዙር' : 'Batch Intake'}</span>
                </span>
                <Layers className="size-4 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="mt-2 text-base font-black text-blue-600 dark:text-sky-400 font-mono">
                {latestRegistration?.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01')}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                <span>{isAm ? 'የዙር መርሃግብር ይመልከቱ' : 'View intake timetable'}</span>
                <ChevronRight className="size-3 text-muted-foreground group-hover:text-blue-500" />
              </p>
            </div>
          </div>

          {/* ── COMPACT NOTICE STRIP ── */}
          {digitalPurchases.length > 0 ? (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/40 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white font-bold text-xs shadow-xs">
                  ℹ
                </span>
                <div>
                  <span className="font-bold text-blue-700 dark:text-sky-300">
                    {isAm ? 'ንቁ የዲጂታል ትዕዛዞች፦' : 'Active Digital Library:'}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {isAm
                      ? `${digitalPurchases.length} የዲጂታል ማስተር ትምህርቶች ተከፍተው በDRM ስቱዲዮ ውስጥ ለመማር ዝግጁ ናቸው።`
                      : `You have ${digitalPurchases.length} Self-Paced Master Resource(s) unlocked and ready in your DRM studio.`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('selflearning')}
                className="shrink-0 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline underline-offset-4 self-end sm:self-center"
              >
                {isAm ? 'ወደ DRM ስቱዲዮ ሂድ →' : 'Launch DRM Studio →'}
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
                    {isAm ? 'የቦታ ማስያዣ ሁኔታ፦' : 'Reservations:'}
                  </span>{' '}
                  <span>
                    {latestRegistration
                      ? (isAm
                          ? `ንቁ የስልጠና ዙር — ${latestRegistration.courseTitle} (${latestRegistration.shift}) በ${latestRegistration.batch?.batchNumber || 'ዙር 01'} ተመድበዋል።`
                          : `Active Batch Cohort — ${latestRegistration.courseTitle} (${latestRegistration.shift}) allocated to ${latestRegistration.batch?.batchNumber || 'Batch 01'}.`)
                      : (isAm
                          ? 'እስካሁን ምንም ንቁ ምዝገባ የለም... በባህር ዳር ለሚጀመሩ የተግባር ስልጠናዎች መቀመጫዎን ያስይዙ።'
                          : 'No active TVET registration yet. Reserve your hands-on hardware workbench in Bahir Dar.')}
                  </span>
                </div>
              </div>
              <Link
                href="/register"
                className="shrink-0 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline underline-offset-4 self-end sm:self-center"
              >
                {latestRegistration
                  ? (isAm ? 'የዙር መረጃ ይመልከቱ →' : 'View Batch Info →')
                  : (isAm ? 'የላብ መቀመጫ ያስይዙ →' : 'Reserve Bench Seat →')}
              </Link>
            </div>
          )}

        {/* ─── TAB: OVERVIEW / STUDENT HUB & MASTER COURSES ─── */}
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
                    ? `በሄሎ ቴክኖሎጂ ተማሪ ፖርታል አማካኝነት የተከፈቱ የቪዲዮ ትምህርቶችዎን በDRM ስቱዲዮ መከታተል፣ የተመደቡበትን የስልጠና ዙር ማየት እና ይፋዊ ደረሰኞችዎን ማውረድ ይችላሉ።`
                    : `Monitor your hands-on TVET intake schedule, study unlocked course manuals in the zero-download DRM Studio, and access official tuition receipts.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button
                  onClick={() => handleSelectTab('selflearning')}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-4 shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  <Video className="size-3.5 mr-1.5" />
                  {isAm ? 'ወደ DRM ስቱዲዮ ሂድ' : 'My DRM Studio'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSelectTab('tuition')}
                  className="rounded-xl text-xs font-semibold h-10 px-4 cursor-pointer"
                >
                  <CreditCard className="size-3.5 mr-1.5 text-blue-600 dark:text-sky-400" />
                  {isAm ? 'ደረሰኞች ይመልከቱ' : 'View Receipts'}
                </Button>
              </div>
            </div>

            {/* Header matching 'Our Master Courses' */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400">
                {isAm ? 'ተወዳጅ የቪዲዮ ትምህርቶች እና መጻሕፍት' : 'Featured Video Masterclasses & Manuals'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {isAm ? 'ተወዳጅ የሄሎ ቴክኖሎጂ ስልጠናዎች' : 'Popular Hello Technology Courses & Books'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAm
                  ? 'አንዴ በመክፈል በተማሪ ፖርታልዎ ላይ በራስዎ ፍጥነት ይማሩ። ጥራት ያላቸው የቪዲዮ ትምህርቶች እና የተግባር የጥገና ማንዋሎች በልዩ የደህንነት ጥበቃ የተዘጋጁ።'
                  : 'Purchase once and study at your self-learning pace directly on your student portal. High-definition recorded masterclasses and technical repair manuals protected with dynamic student watermarking.'}
              </p>
            </div>

            {/* Grid of Master Courses */}
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
                          <Lock className="size-3" /> {isAm ? 'በፖርታሉ ላይ ብቻ' : 'In-Platform DRM'}
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
                          <Play className="size-4" /> {isAm ? 'ትምህርቱን ጀምር (ስቱዲዮ ክፈት)' : 'Study on Platform (Open Studio)'}
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

        {/* ─── TAB: MY SELF-PACED LEARNING & DRM STUDIO ─── */}
        {activeTab === 'selflearning' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-black text-foreground">
                  {isAm ? 'የእኔ የተከፈቱ ትምህርቶች (DRM ስቱዲዮ)' : 'My Unlocked Learning Studio'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isAm
                    ? 'በተማሪ አካውንትዎ የተከፈቱ ሁሉም የቪዲዮ ማስተርክላሶች እና የጥገና ማንዋሎች።'
                    : 'All self-paced video masterclasses and repair manuals unlocked on your institutional account.'}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="size-4" /> {isAm ? 'ደህንነቱ የተጠበቀ DRM ማጫወቻ ንቁ ነው' : 'Protected DRM Player Active'}
              </div>
            </div>

            {digitalPurchases.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
                <ShoppingBag className="size-12 mx-auto text-muted-foreground opacity-40 mb-3" />
                <h3 className="text-lg font-bold">
                  {isAm ? 'እስካሁን የተከፈተ የቪዲዮ ትምህርት የለም' : 'No Self-Paced Courses Unlocked Yet'}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  {isAm
                    ? 'እስካሁን ምንም አይነት የቪዲዮ ኮርስ ወይም ማንዋል አልከፈቱም። ፈጣን መዳረሻ ለማግኘት ተወዳጅ ስልጠናዎቻችንን ይመልከቱ።'
                    : "You haven't purchased any self-paced courses or digital manuals yet. Browse our popular masterclasses to unlock instant access."}
                </p>
                <Button
                  onClick={() => setActiveTab('overview')}
                  className="mt-6 rounded-xl bg-blue-600 text-white font-bold"
                >
                  {isAm ? 'ተወዳጅ ስልጠናዎችን ይመልከቱ →' : 'Browse Popular Master Courses →'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {digitalPurchases.map((purchase) => {
                  const meta =
                    catalogMap[purchase.resourceId] ||
                    DIGITAL_CATALOG[purchase.resourceId] ||
                    formatResourceToMeta({
                      id: purchase.resourceId,
                      title: purchase.title,
                      priceETB: purchase.amount,
                    })

                  const isVideo = meta.format === 'Video Masterclass'
                  const completedLessons = getCompletedLessonsForResource(meta.id)
                  const totalCount = isVideo ? meta.lessons?.length || 1 : meta.chapters?.length || 1

                  return (
                    <div
                      key={purchase.id}
                      className="rounded-3xl border border-blue-500/30 bg-card p-6 sm:p-7 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-bold text-blue-600 dark:text-sky-400">
                            {meta.format}
                          </span>
                          {purchase.status === 'Pending' ? (
                            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                              <Clock className="size-3" /> {isAm ? 'ማረጋገጫ በመጠባበቅ ላይ' : 'Waiting for Admin Approval'}
                            </span>
                          ) : (
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                              {isAm ? '✓ ክፍት እና ፈቃድ ያለው' : '✓ Unlocked & Licensed'}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-foreground">
                          {meta.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {meta.subtitle}
                        </p>

                        {purchase.status === 'Pending' ? (
                          <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                              <AlertCircle className="size-3.5" /> {isAm ? 'የክፍያ ማመሳከሪያ ቁጥር ደርሷል' : 'Payment Reference Received'}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {isAm ? 'የግብይት ቁጥር፦' : 'Transaction Ref:'} <strong className="font-mono text-foreground">{purchase.transactionRef || 'N/A'}</strong> ({purchase.paymentMethod?.toUpperCase()})
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {isAm
                                ? 'የምዝገባ እና የፋይናንስ ክፍላችን ክፍያዎን እያረጋገጠ ነው። እንደተረጋገጠ ወዲያውኑ የDRM ስቱዲዮ መዳረሻዎ ይከፈታል።'
                                : 'Our admission & financial verification desk is reviewing your payment. Your DRM Studio access will unlock immediately once approved.'}
                            </p>
                          </div>
                        ) : (
                          /* Progress Bar */
                          <div className="mt-5 space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-muted-foreground">{isAm ? 'የትምህርት ሂደት፦' : 'Learning Progress:'}</span>
                              <span className="text-blue-600 dark:text-sky-400 font-mono">
                                {purchase.progress}% ({completedLessons.length} of {totalCount} {isVideo ? (isAm ? 'ትምህርቶች' : 'lessons') : (isAm ? 'ምዕራፎች' : 'chapters')})
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${purchase.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {isAm ? 'አሰልጣኝ፦' : 'Instructor:'} <strong>{meta.instructor}</strong>
                        </span>

                        {purchase.status === 'Pending' ? (
                          <Button
                            disabled
                            className="rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-xs gap-1.5"
                          >
                            <Clock className="size-3.5" /> {isAm ? 'ማረጋገጫ በመጠባበቅ ላይ' : 'Pending Approval'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setActiveStudioResource(meta)}
                            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
                          >
                            <Play className="size-3.5" /> {isAm ? 'ትምህርቱን ቀጥል (ስቱዲዮ)' : 'Resume Study in Studio'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: ENROLLED COURSES ─── */}
        {activeTab === 'courses' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {registrations.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
                <BookOpen className="size-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="text-lg font-bold">
                  {isAm ? 'እስካሁን ምንም የተመዘገቡበት ስልጠና የለም' : 'No Course Registrations Yet'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                  {isAm
                    ? 'እስካሁን ለተግባር ስልጠና አልተመዘገቡም። በሞባይል ጥገና፣ በኮምፒውተር ጥገና እና ኤሌክትሮኒክስ ዕውቅና ያላቸውን ስልጠናዎቻችንን ይመልከቱ።'
                    : "You haven't registered for a practical cohort yet. Browse our accredited vocational courses in mobile diagnostics, computer maintenance, and electronics."}
                </p>
                <Link href="/register" className="mt-5 inline-block">
                  <Button className="rounded-xl">
                    {isAm ? 'ለስልጠና ይመዝገቡ' : 'Register for a Course'}
                  </Button>
                </Link>
              </div>
            ) : (
              registrations.map((reg) => {
                const matchedCourse = courses.find((c) => c.title === reg.courseTitle)
                const isApproved = reg.status === 'Approved' || reg.status === 'Enrolled'

                return (
                  <div
                    key={reg.id}
                    className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-md transition-all hover:border-blue-500/40"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                              isApproved
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : reg.status === 'Rejected'
                                ? 'bg-red-500/10 text-red-600 border-red-500/30'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {reg.status === 'Approved'
                              ? (isAm ? '✓ ምዝገባዎ ጸድቋል' : '✓ Admission Approved')
                              : reg.status === 'Enrolled'
                              ? (isAm ? '✓ በስልጠና ዙር ተመድበዋል' : '✓ Cohort Intake Enrolled')
                              : (isAm ? '⏳ ማረጋገጫ በመጠባበቅ ላይ' : '⏳ Pending Admin Verification')}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {isAm ? 'ማመሳከሪያ፦' : 'Ref:'} {reg.registrationNumber}
                          </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-black text-foreground">
                          {reg.courseTitle}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="size-4 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span>{isAm ? 'የስልጠና ፈረቃ፦' : 'Cohort Shift:'} <strong>{reg.shift}</strong></span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isApproved && (
                          <Button
                            size="sm"
                            onClick={() =>
                              setActiveCertificate({
                                certificateNumber: `HTTC-CERT-2026-${reg.registrationNumber || reg.id.slice(-4).toUpperCase()}`,
                                studentName: student.fullName,
                                studentId: student.studentId,
                                courseTitle: reg.courseTitle,
                                courseLevel: 'Accredited TVET Practical Competency Level',
                                batchNumber: reg.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01'),
                                completionDate: reg.createdAt,
                                issueDate: reg.approvedAt || reg.createdAt,
                              })
                            }
                            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-amber-600/20 gap-1.5"
                          >
                            <Award className="size-3.5" />
                            {isAm ? 'የብቃት ምስክር ወረቀት' : 'View Certificate'}
                          </Button>
                        )}
                        {matchedCourse && (
                          <Link href={`/courses/${matchedCourse.slug}`}>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              {isAm ? 'ሙሉ ካሪኩለም ይመልከቱ' : 'View Full Curriculum'} <ExternalLink className="ml-1.5 size-3.5" />
                            </Button>
                          </Link>
                        )}
                        <a href={schoolConfig.telegram} target="_blank" rel="noreferrer">
                          <Button size="sm" className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">
                            <Send className="mr-1.5 size-3.5" /> {isAm ? 'የቴሌግራም ግሩፕ ይቀላቀሉ' : 'Join Cohort Chat'}
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3 text-xs">
                      <div className="rounded-2xl border p-4 bg-muted/20">
                        <span className="font-semibold text-muted-foreground uppercase">{isAm ? 'ፈረቃ' : 'Shift'}</span>
                        <p className="mt-1 text-sm font-bold text-foreground">{reg.shift}</p>
                      </div>
                      <div className="rounded-2xl border p-4 bg-muted/20">
                        <span className="font-semibold text-muted-foreground uppercase">{isAm ? 'የአካዳሚክ ዙር' : 'Academic Batch'}</span>
                        <p className="mt-1 text-sm font-bold text-blue-600 dark:text-sky-400">{reg.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01')}</p>
                      </div>
                      <div className="rounded-2xl border p-4 bg-muted/20">
                        <span className="font-semibold text-muted-foreground uppercase">{isAm ? 'የስልጠና ክፍያ' : 'Tuition'}</span>
                        <p className="mt-1 text-sm font-bold text-foreground">{reg.finalPrice} Birr</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ─── TAB: BATCH DETAILS ─── */}
        {activeTab === 'batch' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {latestRegistration ? (
              <div className="rounded-3xl border border-blue-500/30 bg-card overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-6 sm:p-8 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                    {isAm ? 'ንቁ የስልጠና ዙር' : 'Active Intake Cohort'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">
                    {latestRegistration.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01')} — {latestRegistration.batch?.title || (isAm ? 'የጥቅምት 2026 ተግባር ስልጠና' : 'October 2026 Practical Cohort')}
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 mt-2">
                    {isAm ? 'ካምፓስ፦' : 'Campus:'} {latestRegistration.batch?.campus || (isAm ? schoolConfig.address : schoolConfig.englishAddress)}
                  </p>
                </div>
                <div className="p-6 sm:p-8 grid gap-4 sm:grid-cols-3 text-xs">
                  <div className="p-4 rounded-2xl border bg-muted/20">
                    <span className="text-muted-foreground font-semibold">{isAm ? 'የእርስዎ ፈረቃ፦' : 'Your Shift:'}</span>
                    <p className="mt-1 text-sm font-bold text-foreground">{latestRegistration.shift}</p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-muted/20">
                    <span className="text-muted-foreground font-semibold">{isAm ? 'የምዝገባ ማመሳከሪያ፦' : 'Registration Ref:'}</span>
                    <p className="mt-1 text-sm font-bold font-mono text-blue-600 dark:text-sky-400">{latestRegistration.registrationNumber}</p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-muted/20">
                    <span className="text-muted-foreground font-semibold">{isAm ? 'የCOC ማረጋገጫ ደረጃ፦' : 'COC Certification Track:'}</span>
                    <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {isAm ? 'ዕውቅና ያለው የቴክኒክና ሙያ ደረጃ' : 'Accredited TVET Level'}
                    </p>
                  </div>
                </div>

                {/* Graduation Certificate Preview Card */}
                <div className="p-6 sm:p-8 pt-0">
                  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-blue-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                        <Award className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-foreground">
                          {isAm ? 'የቴክኒክና ሙያ ብቃት ማረጋገጫ የምስክር ወረቀት' : 'Accredited Certificate of Competence'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isAm
                            ? 'የተግባር ስልጠናውንና የላብራቶሪ ምዘናውን ሲያጠናቅቁ ይፋዊ የምስክር ወረቀት በኦንላይን QR ማረጋገጫ ይዘጋጅልዎታል።'
                            : 'Upon successful completion of all practical lab milestones and COC assessment, your accredited certificate is generated.'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        setActiveCertificate({
                          certificateNumber: `HTTC-CERT-2026-${latestRegistration.registrationNumber || latestRegistration.id.slice(-4).toUpperCase()}`,
                          studentName: student.fullName,
                          studentId: student.studentId,
                          courseTitle: latestRegistration.courseTitle,
                          courseLevel: 'Accredited TVET Practical Competency Level',
                          batchNumber: latestRegistration.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01'),
                          completionDate: latestRegistration.createdAt,
                          issueDate: latestRegistration.approvedAt || latestRegistration.createdAt,
                        })
                      }
                      className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-amber-600/20 shrink-0"
                    >
                      <Award className="size-3.5" />
                      {isAm ? 'ምስክር ወረቀት ቅድመ-ዕይታ' : 'Preview Certificate'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
                <Layers className="size-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="text-lg font-bold">{isAm ? 'ንቁ የዙር ምደባ የለም' : 'No Active Batch Intake'}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isAm ? 'በአሁኑ የስልጠና ዙር ውስጥ ለመመደብ በኦንላይን ይመዝገቡ።' : 'Register online to be placed into the active TVET batch.'}
                </p>
                <Link href="/register" className="mt-4 inline-block">
                  <Button className="rounded-xl">{isAm ? 'ለስልጠናው ይመዝገቡ →' : 'Register for Batch →'}</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: GENERAL TECHNICAL LIBRARY ─── */}
        {activeTab === 'resources' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  {isAm ? 'አጠቃላይ የጥገና መመሪያዎችና ንድፎች' : 'General Repair Guides & Schematics'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAm
                    ? 'ለተማሪዎች የተዘጋጁ የቺፕ ፒን እና የሰርኪውት መረጃዎች።'
                    : 'Reference chip pinouts and circuit sheets included for students.'}
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder={isAm ? 'ግብዓቶችን፣ ርዕሶችን ይፈልጉ...' : 'Search resources, topics...'}
                  className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600 dark:text-sky-400">
                        {res.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {res.format || 'PDF Guide'}
                      </span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm line-clamp-2">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {isAm ? 'ለሁሉም ተማሪ ነፃ' : 'Enrolled Free'}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const matched = catalogMap[res.id] || DIGITAL_CATALOG[res.id] || formatResourceToMeta(res)
                        setActiveStudioResource(matched)
                      }}
                      className="h-8 rounded-lg text-xs gap-1.5"
                    >
                      <Play className="size-3 text-blue-600" /> {isAm ? 'በDRM ስቱዲዮ አጥና' : 'Study in DRM Studio'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: TUITION & STATEMENTS ─── */}
        {activeTab === 'tuition' && (
          <div className="mt-6 space-y-6 animate-fade-in max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
              <div>
                <h3 className="text-lg font-bold">
                  {isAm ? 'የክፍያ መግለጫዎች እና የባንክ ማረጋገጫዎች' : 'Tuition Statements & Bank Confirmations'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAm
                    ? 'የተከፈሉ የስልጠና ክፍያዎች ዝርዝር እና ይፋዊ የትምህርት ማዕከሉ ደረሰኞች።'
                    : 'Verified tuition settlement statements and official printable institutional receipts.'}
                </p>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
                <CreditCard className="size-12 mx-auto text-muted-foreground opacity-40 mb-3" />
                <h4 className="text-base font-bold text-foreground">
                  {isAm ? 'ምንም የተመዘገበ ክፍያ የለም' : 'No Tuition Statements Yet'}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  {isAm
                    ? 'ለስልጠና ሲመዘገቡ ይፋዊ የክፍያ ደረሰኝዎ እዚህ ይቀመጣል።'
                    : 'Once you enroll in a vocational cohort, your verified tuition statements and official printable receipts will appear here.'}
                </p>
                <Link href="/register" className="mt-4 inline-block">
                  <Button className="rounded-xl text-xs">
                    {isAm ? 'ለስልጠና ይመዝገቡ' : 'Enroll Now'}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-md space-y-4 hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {isAm ? 'የደረሰኝ ማመሳከሪያ፦' : 'Receipt Ref:'} {reg.registrationNumber}
                        </span>
                        <h4 className="font-bold text-base text-foreground mt-0.5">
                          {reg.courseTitle}
                        </h4>
                      </div>
                      <span className="text-lg font-black text-blue-600 dark:text-sky-400">
                        {reg.finalPrice} Birr
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">{isAm ? 'የክፍያ ዘዴ፦' : 'Payment Method:'}</span>
                        <p className="font-semibold text-foreground mt-0.5">{reg.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isAm ? 'የክፍያ ዕቅድ፦' : 'Payment Plan:'}</span>
                        <p className="font-semibold text-foreground mt-0.5">{reg.paymentPlan}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isAm ? 'የግብይት ማመሳከሪያ፦' : 'Transaction Reference:'}</span>
                        <p className="font-mono font-semibold text-foreground mt-0.5">{reg.transactionRef || (isAm ? 'የተረጋገጠ' : 'Verified')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isAm ? 'ቀን፦' : 'Date:'}</span>
                        <p className="font-semibold text-foreground mt-0.5">{new Date(reg.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Official Receipt Action Footer */}
                    <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setActiveReceipt({
                            receiptNumber: reg.registrationNumber,
                            studentName: student.fullName,
                            studentId: student.studentId,
                            courseTitle: reg.courseTitle,
                            shift: reg.shift,
                            batchNumber: reg.batch?.batchNumber || (isAm ? 'ዙር 01' : 'Batch 01'),
                            amountPaid: reg.finalPrice,
                            paymentMethod: reg.paymentMethod,
                            paymentPlan: reg.paymentPlan,
                            transactionRef: reg.transactionRef,
                            receiptUrl: reg.receiptUrl,
                            createdAt: reg.createdAt,
                          })
                        }
                        className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-sm shadow-blue-500/20"
                      >
                        <Printer className="size-3.5" />
                        {isAm ? 'ይፋዊ ደረሰኝ አትም / አውርድ' : 'View & Print Official Receipt'}
                      </Button>

                      {reg.receiptUrl && (
                        <a href={reg.receiptUrl} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                            <ExternalLink className="size-3.5" />
                            {isAm ? 'የባንክ ደረሰኝ ቅጅ' : 'View Uploaded Slip'}
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: COMMUNITY & HELP ─── */}
        {activeTab === 'community' && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 animate-fade-in">
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-card p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold mb-4 shadow-md shadow-blue-500/25">
                  <Send className="size-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {isAm ? 'የሄሎ ቴክኖሎጂ ይፋዊ ቴሌግራም' : 'Hello Technology Official Telegram'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {isAm
                    ? 'ንቁ የተማሪዎች የጥገና ማህበረሰባችንን በቴሌግራም ይቀላቀሉ። የዙር ፕሮግራሞችን፣ የዲያግኖስቲክስ ንድፎችን እና የአሰልጣኞች ድጋፍ ያግኙ።'
                    : 'Join our active student repair community on Telegram. Get batch schedules, diagnostic schematics, and instructor support.'}
                </p>
              </div>
              <div className="mt-6">
                <a href={schoolConfig.telegram} target="_blank" rel="noreferrer">
                  <Button className="w-full rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 gap-2">
                    <Send className="size-4" /> {isAm ? 'ቴሌግራም ቻናል ክፈት' : 'Open Telegram Channel'}
                  </Button>
                </a>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground font-bold mb-4">
                  <PhoneCall className="size-6 text-blue-600 dark:text-sky-400" />
                </div>
                <h3 className="text-xl font-bold">
                  {isAm ? 'የተማሪዎች ሬጅስትራር ቢሮ' : 'Student Registrar Desk'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {isAm
                    ? 'ስለ ስልጠና ዙርዎ ወይም ክፍያ ጥያቄ አለዎት? ባህር ዳር የሚገኘውን ቢሮአችንን ያነጋግሩ።'
                    : 'Questions regarding your intake batch or tuition? Contact our office in Bahir Dar.'}
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <p><strong>{isAm ? 'ስልክ፦' : 'Phone:'}</strong> {schoolConfig.phone} / {schoolConfig.alternatePhone}</p>
                  <p><strong>{isAm ? 'ኢሜይል፦' : 'Email:'}</strong> {schoolConfig.email}</p>
                  <p><strong>{isAm ? 'አድራሻ፦' : 'Location:'}</strong> {isAm ? schoolConfig.address : schoolConfig.englishAddress}</p>
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
                    ? 'ወዲያውኑ በተማሪ ፖርታልዎ ላይ ይሰራል · ደህንነቱ የተጠበቀ DRM ስቱዲዮ መዳረሻ'
                    : 'Instant activation to your student dashboard · Protected DRM Studio access'}
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
                  <CheckCircle className="size-4 text-sky-600" /> {isAm ? '3. የተግባር ላብራቶሪ ዙሮች (Batches) እንዴት ይሰራሉ?' : '3. How do practical TVET batch allocations work?'}
                </h4>
                <p>
                  {isAm
                    ? 'በኦንላይን የተመዘገቡ ተማሪዎች በቀጥታ ወደሚቀጥለው ክፍት ዙር (Batch) ይመደባሉ፤ የፈረቃ ለውጥ ወይም የዙር ማዘዋወር በነፃ ይፈጸማል።'
                    : 'Enrolled students are assigned to the upcoming cohort batch in Bahir Dar. Shift changes or batch transfers can be requested through the registrar desk.'}
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

      {/* ─── SECURE IN-PLATFORM DRM STUDIO (Player / Reader) ─── */}
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
