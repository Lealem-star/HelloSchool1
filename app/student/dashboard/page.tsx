'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, Footer } from '@/components/site'
import { ThemeToggle } from '@/components/theme-toggle'
import { schoolConfig } from '@/lib/data'

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
  category: string
  description: string | null
  format: string | null
  level: string | null
  status: string
  price: string | null
  fileUrl: string | null
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>([])
  const [activeTab, setActiveTab] = useState<'courses' | 'batch' | 'resources' | 'tuition' | 'community'>('courses')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [resourceSearch, setResourceSearch] = useState('')

  useEffect(() => {
    fetchStudentData()
  }, [])

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

  const parseEquipment = (equipmentStr: string): string[] => {
    if (!equipmentStr) return []
    try {
      const parsed = JSON.parse(equipmentStr)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // ignore
    }
    return equipmentStr.split(',').map((s) => s.trim()).filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 animate-pulse">
            <GraduationCap className="size-8" />
          </div>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            Loading your student portal...
          </p>
        </div>
        <Footer />
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

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
        {/* ─── Top Student Profile Header Card ─── */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-blue-500/5 p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Avatar */}
              <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white font-black text-2xl shadow-lg shadow-blue-500/25">
                {student.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20">
                    Student ID: {student.studentId}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ● Active Student
                  </span>
                </div>

                <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {student.fullName}
                </h1>

                {/* Institutional Email with copy */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Portal Email:</span>
                  <span className="font-mono text-blue-600 dark:text-sky-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    {student.institutionalEmail}
                  </span>
                  <button
                    onClick={() => handleCopy(student.institutionalEmail, 'email')}
                    className="p-1 hover:text-foreground transition rounded"
                    title="Copy institutional email"
                  >
                    {copiedKey === 'email' ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle & Sign Out */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <ThemeToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl border-border/80 text-xs font-semibold hover:border-destructive hover:text-destructive gap-1.5"
              >
                <LogOut className="size-3.5" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-border/60">
            <div className="rounded-2xl border bg-muted/20 p-3.5">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
                Enrolled Tracks
              </span>
              <p className="mt-1 text-xl font-black text-foreground">
                {registrations.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3.5">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
                Admission Status
              </span>
              <p className="mt-1 text-sm font-bold text-blue-600 dark:text-sky-400">
                {latestRegistration ? latestRegistration.status : 'No Applications'}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3.5">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
                Cohort Shift
              </span>
              <p className="mt-1 text-sm font-semibold truncate text-foreground">
                {latestRegistration ? latestRegistration.shift : 'None'}
              </p>
            </div>

            <div
              onClick={() => setActiveTab('batch')}
              className="rounded-2xl border bg-muted/20 p-3.5 cursor-pointer hover:border-blue-500/40 hover:bg-muted/40 transition-all group"
            >
              <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-between">
                <span>Batch (ዙር) Intake</span>
                <ChevronRight className="size-3 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </span>
              <p className="mt-1 text-sm font-black text-blue-600 dark:text-sky-400 font-mono">
                {latestRegistration?.batch?.batchNumber || 'Batch 01'}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border bg-muted/20 p-3.5">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
                Digital Resources
              </span>
              <p className="mt-1 text-sm font-bold text-foreground">
                Unlimited Access
              </p>
            </div>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border/80 pb-3">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <BookOpen className="size-4" /> Enrolled Courses ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'batch'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Layers className="size-4" /> Academic Batch (ዙር) {latestRegistration?.batch ? `(${latestRegistration.batch.batchNumber})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Layers className="size-4" /> Course Resources & Digital Library
          </button>

          <button
            onClick={() => setActiveTab('tuition')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'tuition'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <CreditCard className="size-4" /> Tuition & Receipts
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'community'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Send className="size-4" /> Student Support & Telegram
          </button>
        </div>

        {/* ─── Tab 1: Enrolled Courses ─── */}
        {activeTab === 'courses' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {registrations.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-12 text-center">
                <BookOpen className="size-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="text-lg font-bold">No Course Registrations Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                  You haven&apos;t registered for a practical cohort yet. Browse our professional hands-on courses in mobile diagnostics, laptop hardware, and electronics repair.
                </p>
                <Link href="/register" className="mt-5 inline-block">
                  <Button className="rounded-xl">Register for a Course</Button>
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
                              ? '✓ Admission Approved'
                              : reg.status === 'Enrolled'
                              ? '✓ Cohort Intake Enrolled'
                              : '⏳ Pending Admin Verification'}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            Ref: {reg.registrationNumber}
                          </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-black text-foreground">
                          {reg.courseTitle}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="size-4 text-blue-600 dark:text-sky-400 shrink-0" />
                          <span>Cohort Shift: <strong>{reg.shift}</strong></span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {matchedCourse && (
                          <Link href={`/courses/${matchedCourse.slug}`}>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              View Full Curriculum <ExternalLink className="ml-1.5 size-3.5" />
                            </Button>
                          </Link>
                        )}
                        <a href="https://t.me/helloschool_et" target="_blank" rel="noreferrer">
                          <Button size="sm" className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">
                            <Send className="mr-1.5 size-3.5" /> Join Cohort Chat
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Progress & Highlights */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border bg-muted/20 p-4">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Intake Status
                        </span>
                        <p className="mt-1 text-sm font-bold text-foreground">
                          {isApproved ? 'Active Cohort Intake' : 'Waiting for admission review'}
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-muted/20 p-4">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Tuition Status
                        </span>
                        <p className="mt-1 text-sm font-bold text-foreground">
                          {reg.finalPrice} Birr ({reg.paymentPlan === 'full' ? 'Full Access' : 'Installment'})
                        </p>
                      </div>

                      <div className="rounded-2xl border bg-muted/20 p-4">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Tools & Instruments
                        </span>
                        <p className="mt-1 text-sm font-bold text-blue-600 dark:text-sky-400">
                          Microscope, Hot Air & Soldering Station Provided
                        </p>
                      </div>
                    </div>

                    {/* Staff Notes / Feedback */}
                    {reg.adminNotes && (
                      <div className="mt-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
                        <Sparkles className="size-4 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Admissions Office Notice:</strong>{' '}
                          {reg.adminNotes}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ─── Tab: Academic Batch (ዙር) ─── */}
        {activeTab === 'batch' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {latestRegistration ? (
              <div className="overflow-hidden rounded-3xl border border-blue-500/30 bg-card shadow-lg shadow-blue-500/5 transition-all">
                {/* Top Hero Banner with Blue Gradient */}
                <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-6 sm:p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/30">
                          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                          {latestRegistration.batch?.status || 'Open Intake'}
                        </span>
                        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white/90">
                          {latestRegistration.shift}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                          {latestRegistration.batch?.batchNumber || 'Batch 01'}
                        </h2>
                        <span className="text-lg sm:text-xl font-bold text-blue-100">
                          — {latestRegistration.batch?.title || 'Practical TVET Intake Cohort'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-blue-100/90 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Building className="size-4 text-sky-200" />
                          <strong>Campus:</strong> {latestRegistration.batch?.campus || 'Bahir Dar Campus (Main Lab)'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="size-4 text-sky-200" />
                          <strong>Enrolled Course:</strong> {latestRegistration.courseTitle}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-4 text-sky-200" />
                          <strong>Admission Status:</strong> {latestRegistration.status}
                        </span>
                      </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 px-6 py-4 text-center min-w-[160px]">
                      <Layers className="size-8 text-white mb-1.5" />
                      <span className="text-xs uppercase font-bold tracking-widest text-sky-200">
                        Academic Intake
                      </span>
                      <span className="text-lg font-black text-white font-mono">
                        {latestRegistration.batch?.batchNumber || 'Batch 01'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 space-y-6">
                  {latestRegistration.batch?.notes && (
                    <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 p-4 sm:p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
                        Batch Information & Instructions
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {latestRegistration.batch.notes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-2xl border p-4 bg-muted/20">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Shift & Schedule
                      </span>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {latestRegistration.shift}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Please arrive 10 minutes before session start.
                      </p>
                    </div>

                    <div className="rounded-2xl border p-4 bg-muted/20">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Student Registration No.
                      </span>
                      <p className="mt-1 text-sm font-mono font-bold text-blue-600 dark:text-sky-400">
                        {latestRegistration.registrationNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Official TVET cohort credential.
                      </p>
                    </div>

                    <div className="rounded-2xl border p-4 bg-muted/20">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Accreditation & COC Prep
                      </span>
                      <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        Accredited Curriculum
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Practical Level Assessment ready.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Practical Workshop Conduct & Guidelines
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">1. Practical Attendance</p>
                        <p>Maintain consistent attendance during workshop hours for COC qualification.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">2. Safety First</p>
                        <p>Follow workshop electrical safety protocols when working with hot air rework stations and DC power supplies.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">3. Support & Resources</p>
                        <p>Access reference schematics and boardview files via your Digital Library tab.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/80 bg-card p-10 text-center space-y-4">
                <div className="size-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
                  <Layers className="size-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    Batch Registration Pending
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You have not registered for any active course intake yet.
                  </p>
                </div>
                <Link href="/register">
                  <Button className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                    Register for Current Batch →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─── Tab 2: Resources & Digital Library ─── */}
        {activeTab === 'resources' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Technical Learning Materials</h3>
                <p className="text-xs text-muted-foreground">
                  Schematic diagrams, chip pinout guides, and practical repair handbooks.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search resources, topics..."
                  className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Resources Grid */}
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
                      Enrolled Free
                    </span>
                    <a
                      href={res.fileUrl || '/library'}
                      target={res.fileUrl ? '_blank' : '_self'}
                      rel="noreferrer"
                    >
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5">
                        <Download className="size-3" /> Access Material
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No resources matched your search query.
              </div>
            )}
          </div>
        )}

        {/* ─── Tab 3: Tuition & Receipts ─── */}
        {activeTab === 'tuition' && (
          <div className="mt-6 space-y-6 animate-fade-in max-w-3xl">
            <h3 className="text-lg font-bold">Tuition Statements & Bank Confirmations</h3>
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="rounded-3xl border bg-card p-6 md:p-8 shadow-md space-y-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">
                        Receipt Ref: {reg.registrationNumber}
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
                      <span className="text-muted-foreground">Payment Method:</span>
                      <p className="font-semibold text-foreground mt-0.5">{reg.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Plan:</span>
                      <p className="font-semibold text-foreground mt-0.5">
                        {reg.paymentPlan === 'full' ? 'Full Payment' : 'Two-Part Installment'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transaction Reference:</span>
                      <p className="font-mono font-semibold text-foreground mt-0.5">
                        {reg.transactionRef || 'Pending submission'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submission Date:</span>
                      <p className="font-semibold text-foreground mt-0.5">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {reg.receiptUrl && (
                    <div className="pt-3 border-t">
                      <a
                        href={reg.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
                      >
                        <ExternalLink className="size-3.5" /> View Uploaded Receipt Slip
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Tab 4: Student Support & Community ─── */}
        {activeTab === 'community' && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 animate-fade-in">
            {/* Telegram Community */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-card p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold mb-4 shadow-md shadow-blue-500/25">
                  <Send className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Hello TVET Official Telegram</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Join our active student repair community on Telegram. Get immediate batch schedule updates, diagnostic schematics, and instructor troubleshooting assistance.
                </p>
              </div>

              <div className="mt-6">
                <a href="https://t.me/helloschool_et" target="_blank" rel="noreferrer">
                  <Button className="w-full rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/25 gap-2">
                    <Send className="size-4" /> Open Telegram Channel
                  </Button>
                </a>
              </div>
            </div>

            {/* Campus & Admissions Desk */}
            <div className="rounded-3xl border bg-card p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground font-bold mb-4">
                  <Building className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Campus Admissions Desk</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Need to change your shift or have questions about your intake registration? Contact our administrative registrar directly.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-blue-600 dark:text-sky-400" />
                    <span className="font-semibold">09 47 74 70 70 / 09 82 48 43 28</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-blue-600 dark:text-sky-400" />
                    <span className="font-semibold">info@emschool.edu.et</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-blue-600 dark:text-sky-400" />
                    <span>Bahir Dar, Ethiopia (Near Commercial District)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/contact">
                  <Button variant="outline" className="w-full rounded-xl">
                    Contact Admissions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
