'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Trash2,
  Search,
  Loader2,
  Plus,
  Pencil,
  X,
  BookOpen,
  Folder,
  Users,
  User as UserIcon,
  UserCog,
  ExternalLink,
  Check,
  KeyRound,
  Camera,
  Lock,
  Sparkles,
  Shield,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Eye,
  Phone,
  Mail,
  GraduationCap,
  Archive,
  CheckSquare,
  Square,
  CheckCheck,
  Send,
  Calendar,
  Layers,
  ChevronUp,
  ChevronDown,
  Beaker,
  Wrench,
  Cpu,
  Share2,
  Upload,
  FileText,
  Building2,
  Video,
  Play,
  DollarSign,
  Star,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/ui/dialog-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { CourseSeoPreviewModal } from '@/components/seo-preview-modal'
import {
  InstructorsView,
  InstructorModal,
  FacilitiesView,
  FacilityModal,
  ProjectsView,
  ProjectModal,
  AdminInstructor,
  AdminFacility,
  AdminStudentProject,
} from '@/components/admin-extra-views'
import {
  RegistrationsView,
  AdminRegistration,
  RegistrationOverview,
} from '@/components/admin-registration-view'
import {
  CompanyInquiriesView,
  TrustedPartnersView,
  AdminCompanyInquiry,
  CompanyOverview,
  AdminTrustedPartner,
} from '@/components/admin-company-views'
import { AdminLibraryView } from '@/components/admin-library-view'
import {
  AdminInquiriesNotification,
  AdminInquiryReaderModal,
  UnifiedInquiry,
} from '@/components/admin-inquiries-notification'
import { AdminDashboardView } from '@/components/admin-dashboard-view'

/* ──────────────────────────────────────────────────────────────
   Shared types
   ────────────────────────────────────────────────────────────── */
type SyllabusModule = {
  title: string
  duration?: string
  description?: string
  lessons: string[]
  labMilestone?: string
}

type Inquiry = {
  id: string
  studentName: string
  email: string | null
  phone: string
  course: string | null
  preferredContact: string | null
  experience: string | null
  message: string | null
  status: string
  createdAt: string
  updatedAt?: string
}
type Course = {
  id: string
  slug: string
  title: string
  category: string
  level: string | null
  description: string | null
  icon: string | null
  audience: string | null
  prerequisites: string | null
  duration: string | null
  price: string | null
  image: string | null
  skills: string[]
  syllabus?: SyllabusModule[]
  published: boolean
  sortOrder: number
}
type LibraryItem = {
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
  pages: string | null
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
  published: boolean
  sortOrder: number
}
type User = {
  id: string
  email: string
  role: string
  name: string | null
  avatarUrl?: string | null
}

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  Contacted: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  Enrolled: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  Converted: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  Archived: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
}

const LIBRARY_STATUS = ['Coming Soon', 'Available', 'Draft']
const INQUIRY_STATUS = ['New', 'Contacted', 'Enrolled', 'Archived']

/* ──────────────────────────────────────────────────────────────
   Modal component (shared)
   ────────────────────────────────────────────────────────────── */
function Modal({
  open,
  onClose,
  title,
  children,
  width = 'max-w-3xl',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${width} my-8 rounded-3xl border bg-card shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary'
const textareaCls =
  'rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary'

/* ──────────────────────────────────────────────────────────────
   Main page
   ────────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const { confirm, alert } = useConfirm()
  const [user, setUser] = useState<User | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<
    | 'dashboard'
    | 'registrations'
    | 'trusted-partners'
    | 'courses'
    | 'library'
    | 'instructors'
    | 'facilities'
    | 'projects'
    | 'profile'
  >('dashboard')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Profile dropdown menu states
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false)
  const [headerProfileOpen, setHeaderProfileOpen] = useState(false)
  const sidebarProfileRef = useRef<HTMLDivElement>(null)
  const headerProfileRef = useRef<HTMLDivElement>(null)

  // Selected Inquiry for Detailed Reader Modal
  const [readerInquiry, setReaderInquiry] = useState<UnifiedInquiry | null>(null)

  // Company Inquiries state
  const [companyInquiries, setCompanyInquiries] = useState<AdminCompanyInquiry[]>([])
  const [companyOverview, setCompanyOverview] = useState<CompanyOverview>({
    total: 0,
    new: 0,
    contacted: 0,
    proposalSent: 0,
    inDiscussion: 0,
    converted: 0,
    archived: 0,
  })
  const [companyStatusFilter, setCompanyStatusFilter] = useState('All')

  // Trusted Partners state
  const [trustedPartners, setTrustedPartners] = useState<AdminTrustedPartner[]>([])

  // Registrations state
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([])
  const [regOverview, setRegOverview] = useState<RegistrationOverview>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0,
  })
  const [regStatusFilter, setRegStatusFilter] = useState('All')

  // Instructors state
  const [instructors, setInstructors] = useState<AdminInstructor[]>([])
  const [instructorOpen, setInstructorOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<AdminInstructor | null>(null)

  // Facilities state
  const [facilities, setFacilities] = useState<AdminFacility[]>([])
  const [facilityOpen, setFacilityOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<AdminFacility | null>(null)

  // Projects state
  const [projects, setProjects] = useState<AdminStudentProject[]>([])
  const [projectOpen, setProjectOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<AdminStudentProject | null>(null)

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [overview, setOverview] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    enrolled: 0,
    converted: 0,
    archived: 0,
  })
  const [statusFilter, setStatusFilter] = useState('All')

  // Courses state
  const [courses, setCourses] = useState<Course[]>([])
  const [courseOpen, setCourseOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [seoPreviewCourse, setSeoPreviewCourse] = useState<Course | null>(null)

  // Library state
  const [library, setLibrary] = useState<LibraryItem[]>([])
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [editingLibrary, setEditingLibrary] = useState<LibraryItem | null>(null)


  /* ─── Session check ─── */
  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((d) => d.user && setUser(d.user))
      .catch(() => {})
  }, [])

  /* ─── Close profile dropdowns on click outside ─── */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (sidebarProfileRef.current && !sidebarProfileRef.current.contains(target)) {
        setSidebarProfileOpen(false)
      }
      if (headerProfileRef.current && !headerProfileRef.current.contains(target)) {
        setHeaderProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* ─── Load data on tab change ─── */
  useEffect(() => {
    if (!user) return
    loadRegistrations()
    loadInquiries()
    loadCompanyInquiries()
    loadTrustedPartners()
    if (tab === 'registrations') loadRegistrations()
    if (tab === 'trusted-partners') loadTrustedPartners()
    if (tab === 'courses') loadCourses()
    if (tab === 'library') loadLibrary()
    if (tab === 'instructors') loadInstructors()
    if (tab === 'facilities') loadFacilities()
    if (tab === 'projects') loadProjects()
  }, [user, tab, statusFilter, regStatusFilter, companyStatusFilter])

  /* ─── Loaders ─── */
  async function loadRegistrations() {
    setLoading(true)
    try {
      const url =
        regStatusFilter !== 'All'
          ? `/api/admin/registrations?status=${regStatusFilter}`
          : `/api/admin/registrations`
      const res = await fetch(url)
      const d = await res.json()
      if (res.ok) {
        setRegistrations(d.items || [])
        setRegOverview(
          d.overview || {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            enrolled: 0,
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }
  async function loadInquiries() {
    setLoading(true)
    try {
      const url =
        statusFilter !== 'All'
          ? `/api/admin/inquiries?status=${statusFilter}`
          : `/api/admin/inquiries`
      const res = await fetch(url)
      const d = await res.json()
      if (res.ok) {
        setInquiries(d.items || [])
        setOverview(
          d.overview || {
            total: 0,
            new: 0,
            contacted: 0,
            enrolled: 0,
            converted: 0,
            archived: 0,
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }
  async function loadCourses() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const d = await res.json()
      if (res.ok) setCourses(d.items || [])
    } finally {
      setLoading(false)
    }
  }
  async function loadLibrary() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/library')
      const d = await res.json()
      if (res.ok) setLibrary(d.items || [])
    } finally {
      setLoading(false)
    }
  }
  async function loadInstructors() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/instructors')
      const d = await res.json()
      if (res.ok) setInstructors(d.items || [])
    } finally {
      setLoading(false)
    }
  }
  async function loadFacilities() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/facilities')
      const d = await res.json()
      if (res.ok) setFacilities(d.items || [])
    } finally {
      setLoading(false)
    }
  }
  async function loadProjects() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      const d = await res.json()
      if (res.ok) setProjects(d.items || [])
    } finally {
      setLoading(false)
    }
  }

  /* ─── Auth ─── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Login failed')
      setUser(d.user)
    } catch (err: any) {
      setLoginError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }
  async function handleLogout() {
    fetch('/api/admin/logout', { method: 'POST' }).then(() => {
      setUser(null)
      setEmail('')
      setPassword('')
    })
  }

  /* ─── Registration operations ─── */
  async function updateRegistrationStatus(id: string, status: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Status update failed')
      }
      setRegistrations((p) => p.map((r) => (r.id === id ? { ...r, status } : r)))
      loadRegistrations()
    } catch (e: any) {
      await alert({
        title: 'Status Update Failed',
        message: e.message || 'Failed to update registration status',
        variant: 'danger',
      })
    } finally {
      setSavingId(null)
    }
  }

  async function bulkUpdateRegistrationStatus(ids: string[], status: string) {
    if (ids.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Bulk update failed')
      }
      setRegistrations((p) =>
        p.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
      )
      loadRegistrations()
    } catch (e: any) {
      await alert({
        title: 'Bulk Update Failed',
        message: e.message || 'Failed to update registrations',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteRegistration(id: string) {
    const ok = await confirm({
      title: 'Delete Registration',
      message: 'Are you sure you want to permanently delete this registration record?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Delete failed')
      }
      setRegistrations((p) => p.filter((r) => r.id !== id))
      loadRegistrations()
    } catch (e: any) {
      await alert({
        title: 'Delete Failed',
        message: e.message || 'Failed to delete registration',
        variant: 'danger',
      })
    } finally {
      setSavingId(null)
    }
  }

  async function bulkDeleteRegistrations(ids: string[]) {
    if (ids.length === 0) return
    const ok = await confirm({
      title: 'Bulk Delete Registrations',
      message: `Are you sure you want to permanently delete ${ids.length} selected registration(s)?`,
      confirmText: 'Delete All',
      variant: 'danger',
    })
    if (!ok) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/registrations?ids=${ids.join(',')}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Bulk delete failed')
      }
      setRegistrations((p) => p.filter((r) => !ids.includes(r.id)))
      loadRegistrations()
    } catch (e: any) {
      await alert({
        title: 'Bulk Delete Failed',
        message: e.message || 'Failed to delete registrations',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  async function saveRegistrationNotes(id: string, adminNotes: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNotes }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save staff notes')
      }
      setRegistrations((p) => p.map((r) => (r.id === id ? { ...r, adminNotes } : r)))
    } catch (e: any) {
      await alert({
        title: 'Error Saving Notes',
        message: e.message || 'Failed to save staff notes',
        variant: 'danger',
      })
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Inquiry operations ─── */
  async function updateInquiryStatus(id: string, status: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Status update failed')
      setInquiries((p) => p.map((i) => (i.id === id ? { ...i, status } : i)))
      loadInquiries()
    } catch (e: any) {
      await alert({
        title: 'Status Update Failed',
        message: e.message || 'Failed to update inquiry status',
        variant: 'danger',
      })
    } finally {
      setSavingId(null)
    }
  }

  async function bulkUpdateInquiryStatus(ids: string[], status: string) {
    if (ids.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      if (!res.ok) throw new Error('Bulk update failed')
      setInquiries((p) =>
        p.map((i) => (ids.includes(i.id) ? { ...i, status } : i))
      )
      loadInquiries()
    } catch (e: any) {
      await alert({
        title: 'Bulk Update Failed',
        message: e.message || 'Failed to update inquiries',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteInquiry(id: string) {
    const ok = await confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this student inquiry?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setInquiries((p) => p.filter((i) => i.id !== id))
      loadInquiries()
    } catch (e: any) {
      await alert({
        title: 'Delete Failed',
        message: e.message || 'Failed to delete inquiry',
        variant: 'danger',
      })
    } finally {
      setSavingId(null)
    }
  }

  async function bulkDeleteInquiries(ids: string[]) {
    if (ids.length === 0) return
    const ok = await confirm({
      title: 'Bulk Delete Inquiries',
      message: `Are you sure you want to delete ${ids.length} inquiries?`,
      confirmText: 'Delete All',
      variant: 'danger',
    })
    if (!ok) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/inquiries?ids=${ids.join(',')}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Bulk delete failed')
      setInquiries((p) => p.filter((i) => !ids.includes(i.id)))
      loadInquiries()
    } catch (e: any) {
      await alert({
        title: 'Bulk Delete Failed',
        message: e.message || 'Failed to delete inquiries',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  /* ─── Course operations ─── */
  function openNewCourse() {
    setEditingCourse({
      id: '',
      slug: '',
      title: '',
      category: 'General',
      level: null,
      description: null,
      icon: null,
      audience: null,
      prerequisites: null,
      duration: null,
      price: null,
      image: null,
      skills: [],
      published: true,
      sortOrder: courses.length,
    })
    setCourseOpen(true)
  }
  function openEditCourse(c: Course) {
    setEditingCourse({ ...c, skills: [...c.skills] })
    setCourseOpen(true)
  }
  async function saveCourse(formData: Course) {
    setSavingId('course')
    try {
      const isNew = !editingCourse?.id
      const body = isNew
        ? { ...formData }
        : { ...formData, id: editingCourse!.id }
      const res = await fetch('/api/admin/courses', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        await alert({
          title: 'Save Failed',
          message: d.error || 'Failed to save course',
          variant: 'danger',
        })
        return
      }
      setCourseOpen(false)
      setEditingCourse(null)
      loadCourses()
    } finally {
      setSavingId(null)
    }
  }
  async function deleteCourse(id: string) {
    const ok = await confirm({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
      loadCourses()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Library operations ─── */
  function openNewLibrary() {
    setEditingLibrary({
      id: '',
      title: '',
      subtitle: '',
      category: 'General',
      description: null,
      format: 'Technical Repair Manual',
      level: 'All Skill Levels',
      status: 'Available',
      price: '450 ETB',
      priceETB: 450,
      pages: '85 Pages',
      fileUrl: null,
      thumbnailUrl: null,
      instructor: 'Hello Technology Faculty',
      instructorRole: 'Technical Instructor',
      rating: 4.9,
      reviewCount: 95,
      badgeText: 'Popular',
      skillsLearned: 'Schematic tracing, Multimeter diagnosis, Board repair',
      lessons: [],
      chapters: [],
      published: true,
      sortOrder: library.length,
    })
    setLibraryOpen(true)
  }
  function openEditLibrary(l: LibraryItem) {
    const pETB = typeof l.priceETB === 'number'
      ? l.priceETB
      : parseInt(String(l.price || '').replace(/[^0-9]/g, ''), 10) || 0
    let parsedLessons = []
    try {
      parsedLessons = typeof l.lessons === 'string' ? JSON.parse(l.lessons) : (l.lessons || [])
    } catch {}
    let parsedChapters = []
    try {
      parsedChapters = typeof l.chapters === 'string' ? JSON.parse(l.chapters) : (l.chapters || [])
    } catch {}

    setEditingLibrary({
      ...l,
      priceETB: pETB,
      price: l.price || (pETB === 0 ? 'Free' : `${pETB} ETB`),
      subtitle: l.subtitle || '',
      instructor: l.instructor || 'Hello Technology Faculty',
      instructorRole: l.instructorRole || 'Technical Instructor',
      rating: l.rating ?? 4.9,
      reviewCount: l.reviewCount ?? 100,
      badgeText: l.badgeText || (pETB === 0 ? 'Free' : 'Popular'),
      lessons: parsedLessons,
      chapters: parsedChapters,
    })
    setLibraryOpen(true)
  }
  async function saveLibrary(formData: LibraryItem) {
    setSavingId('library')
    try {
      const isNew = !editingLibrary?.id
      const body = isNew ? { ...formData } : { ...formData, id: editingLibrary!.id }
      const res = await fetch('/api/admin/library', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        await alert({
          title: 'Save Failed',
          message: d.error || 'Failed to save library resource',
          variant: 'danger',
        })
        return
      }
      setLibraryOpen(false)
      setEditingLibrary(null)
      loadLibrary()
    } finally {
      setSavingId(null)
    }
  }
  async function deleteLibrary(id: string) {
    const ok = await confirm({
      title: 'Delete Library Resource',
      message: 'Are you sure you want to delete this library resource?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/library?id=${id}`, { method: 'DELETE' })
      loadLibrary()
    } finally {
      setSavingId(null)
    }
  }


  /* ─── Extra Operations ─── */
  async function saveInstructor(data: Partial<AdminInstructor>) {
    const isEdit = Boolean(data.id)
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/instructors', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || 'Failed to save instructor')
    loadInstructors()
  }
  async function deleteInstructor(id: string) {
    const ok = await confirm({
      title: 'Delete Instructor',
      message: 'Are you sure you want to delete this instructor?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/instructors?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      loadInstructors()
    } finally {
      setSavingId(null)
    }
  }

  async function saveFacility(data: Partial<AdminFacility>) {
    const isEdit = Boolean(data.id)
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/facilities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || 'Failed to save facility')
    loadFacilities()
  }
  async function deleteFacility(id: string) {
    const ok = await confirm({
      title: 'Delete Workshop Facility',
      message: 'Are you sure you want to delete this facility?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/facilities?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      loadFacilities()
    } finally {
      setSavingId(null)
    }
  }

  async function saveProject(data: Partial<AdminStudentProject>) {
    const isEdit = Boolean(data.id)
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/projects', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || 'Failed to save project')
    loadProjects()
  }
  async function deleteProject(id: string) {
    const ok = await confirm({
      title: 'Delete Student Project',
      message: 'Are you sure you want to delete this student project?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      loadProjects()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Company Inquiries operations ─── */
  async function loadCompanyInquiries() {
    setLoading(true)
    try {
      const url =
        companyStatusFilter !== 'All'
          ? `/api/admin/company-inquiries?status=${encodeURIComponent(companyStatusFilter)}`
          : `/api/admin/company-inquiries`
      const res = await fetch(url)
      const d = await res.json()
      if (res.ok) {
        setCompanyInquiries(d.items || [])
        setCompanyOverview(
          d.overview || {
            total: 0,
            new: 0,
            contacted: 0,
            proposalSent: 0,
            inDiscussion: 0,
            converted: 0,
            archived: 0,
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateCompanyInquiryStatus(id: string, status: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/company-inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setCompanyInquiries((p) => p.map((i) => (i.id === id ? { ...i, status } : i)))
        loadCompanyInquiries()
      }
    } finally {
      setSavingId(null)
    }
  }

  async function updateCompanyInquiryNotes(id: string, adminNotes: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/company-inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNotes }),
      })
      if (res.ok) {
        setCompanyInquiries((p) => p.map((i) => (i.id === id ? { ...i, adminNotes } : i)))
      }
    } finally {
      setSavingId(null)
    }
  }

  async function deleteCompanyInquiry(id: string) {
    const ok = await confirm({
      title: 'Delete Company Inquiry',
      message: 'Are you sure you want to delete this company inquiry?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/company-inquiries?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setCompanyInquiries((p) => p.filter((i) => i.id !== id))
        loadCompanyInquiries()
      }
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Unified Inquiries helpers for Notification Bell & Reader Modal ─── */
  const allUnifiedInquiries: UnifiedInquiry[] = useMemo(() => {
    const list: UnifiedInquiry[] = []
    for (const item of inquiries) {
      list.push({
        kind: 'student',
        id: item.id,
        title: item.studentName,
        subtitle: item.course || 'General Technical Training',
        contactPhone: item.phone,
        contactEmail: item.email,
        message: item.message,
        status: item.status,
        createdAt: item.createdAt,
        data: item,
      })
    }
    for (const item of companyInquiries) {
      list.push({
        kind: 'company',
        id: item.id,
        title: item.companyName,
        subtitle: `${item.contactPerson}${item.jobTitle ? ` (${item.jobTitle})` : ''} · ${item.trainingFocus || item.institutionType}`,
        contactPhone: item.phone,
        contactEmail: item.email,
        message: item.message,
        status: item.status,
        createdAt: item.createdAt,
        data: item,
      })
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [inquiries, companyInquiries])

  async function handleReaderUpdateStatus(id: string, kind: 'student' | 'company', status: string) {
    if (kind === 'student') {
      await updateInquiryStatus(id, status)
      setReaderInquiry((prev) =>
        prev && prev.kind === 'student' && prev.id === id
          ? { ...prev, status, data: { ...prev.data, status } }
          : prev
      )
    } else {
      await updateCompanyInquiryStatus(id, status)
      setReaderInquiry((prev) =>
        prev && prev.kind === 'company' && prev.id === id
          ? { ...prev, status, data: { ...prev.data, status } }
          : prev
      )
    }
  }

  async function handleReaderDelete(id: string, kind: 'student' | 'company') {
    if (kind === 'student') {
      await deleteInquiry(id)
    } else {
      await deleteCompanyInquiry(id)
    }
  }

  async function markAllInquiriesAsRead() {
    const unreadStudentIds = inquiries.filter((i) => i.status === 'New').map((i) => i.id)
    const unreadCompanyIds = companyInquiries.filter((i) => i.status === 'New').map((i) => i.id)
    if (unreadStudentIds.length > 0) {
      await bulkUpdateInquiryStatus(unreadStudentIds, 'Contacted')
    }
    if (unreadCompanyIds.length > 0) {
      await fetch('/api/admin/company-inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadCompanyIds, status: 'Contacted' }),
      })
      loadCompanyInquiries()
    }
  }

  /* ─── Trusted Partners operations ─── */
  async function loadTrustedPartners() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/partners')
      const d = await res.json()
      if (res.ok) {
        setTrustedPartners(Array.isArray(d) ? d : [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function savePartner(data: Partial<AdminTrustedPartner>) {
    const isEdit = Boolean(data.id)
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/partners', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || 'Failed to save partner')
    loadTrustedPartners()
  }

  async function deletePartner(id: string) {
    const ok = await confirm({
      title: 'Delete Trusted Partner',
      message: 'Are you sure you want to delete this partner?',
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      loadTrustedPartners()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Shared refresh per tab ─── */
  function refreshCurrent() {
    loadInquiries()
    loadCompanyInquiries()
    if (tab === 'registrations') loadRegistrations()
    if (tab === 'trusted-partners') loadTrustedPartners()
    if (tab === 'courses') loadCourses()
    if (tab === 'library') loadLibrary()
    if (tab === 'instructors') loadInstructors()
    if (tab === 'facilities') loadFacilities()
    if (tab === 'projects') loadProjects()
  }

  /* ──────────────────────────────────────────────────────────
     LOGIN SCREEN
     ────────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] flex flex-col items-center justify-center px-5">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20" />
        </div>
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/images/helloschool.jpg"
            alt="Hello Technology Training Center"
            className="h-16 w-auto rounded-2xl object-contain bg-white p-1.5 shadow-xl"
          />
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Hello Technology · Admin Portal</p>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white p-8 shadow-2xl text-slate-900">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#155DFC] shadow-xs">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-4 text-xl font-extrabold text-slate-900">Staff Login</h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to manage self-paced learners, enrollments, and curriculum.
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                placeholder="admin@example.com"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                required
              />
            </Field>
            {loginError && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 font-medium">{loginError}</p>
            )}
            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-xl bg-[#155DFC] text-white hover:bg-blue-700 font-bold shadow-md shadow-blue-500/25 transition-all duration-200"
            >
              {loggingIn ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Signing in...</>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  /* ──────────────────────────────────────────────────────────
     DASHBOARD (Grouped Navigation)
     ────────────────────────────────────────────────────────── */
  type AdminTabId =
    | 'dashboard'
    | 'registrations'
    | 'trusted-partners'
    | 'courses'
    | 'library'
    | 'instructors'
    | 'facilities'
    | 'projects'
    | 'profile'

  interface AdminNavItem {
    id: AdminTabId
    label: string
    shortLabel: string
    icon: React.ComponentType<{ className?: string }>
    count: number
    badge: string | number | null
  }

  interface AdminNavGroup {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    items: AdminNavItem[]
  }

  const adminNavGroups: AdminNavGroup[] = [
    {
      id: 'analytics',
      title: 'Executive Intelligence',
      icon: LayoutDashboard,
      items: [
        {
          id: 'dashboard',
          label: 'Executive Dashboard',
          shortLabel: 'Dashboard',
          icon: LayoutDashboard,
          count: 0,
          badge: 'Live',
        },
      ],
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: BookOpen,
      items: [
        { id: 'courses', label: 'Courses (What You Can Learn)', shortLabel: 'Courses', icon: BookOpen, count: courses.length, badge: null },
        { id: 'library', label: 'Online Courses & Resources', shortLabel: 'Online Courses', icon: Folder, count: library.length, badge: null },
      ],
    },
    {
      id: 'campus',
      title: 'Campus & Academics',
      icon: GraduationCap,
      items: [
        { id: 'instructors', label: 'Instructors', shortLabel: 'Instructors', icon: GraduationCap, count: instructors.length, badge: null },
        { id: 'facilities', label: 'Workshop Facilities', shortLabel: 'Facilities', icon: Wrench, count: facilities.length, badge: null },
        { id: 'projects', label: 'Student Projects', shortLabel: 'Projects', icon: Cpu, count: projects.length, badge: null },
      ],
    },
    {
      id: 'corporate',
      title: 'Corporate & Partners',
      icon: Building2,
      items: [
        { id: 'trusted-partners', label: 'Trusted Partners', shortLabel: 'Partners', icon: ShieldCheck, count: trustedPartners.length, badge: null },
      ],
    },
  ]

  const profileItem = {
    id: 'profile' as const,
    label: 'My Admin Profile',
    shortLabel: 'Profile',
    icon: UserCog,
    count: 0,
    badge: null,
  }
  const profileGroup = {
    id: 'settings',
    title: 'Account & Settings',
    icon: UserCog,
    items: [profileItem],
  }

  const allNavItems = adminNavGroups.flatMap((g) => g.items)
  const currentItem =
    tab === 'profile'
      ? profileItem
      : allNavItems.find((n) => n.id === tab) || allNavItems[0]
  const currentGroup =
    tab === 'profile'
      ? profileGroup
      : adminNavGroups.find((g) => g.items.some((i) => i.id === tab)) || adminNavGroups[0]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100/90 dark:bg-card/90 backdrop-blur-xs">

      {/* ── SIDEBAR ── */}
      <aside className="flex w-64 xl:w-72 shrink-0 flex-col overflow-y-auto border-r border-blue-950/40 bg-[#0b1d47] text-white">

        {/* Logo area */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-blue-900/40 px-5">
          <img
            src="/images/helloschool.jpg"
            alt="Hello Technology"
            className="h-10 w-auto rounded-lg object-contain bg-white/95 p-0.5"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white">Hello Technology</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-sky-400">Admin Control</span>
          </div>
        </div>

        {/* Nav section grouped */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {adminNavGroups.map((group) => {
            const isGroupActive = group.items.some((i) => i.id === tab)
            return (
              <div key={group.id} className="space-y-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1">
                  <group.icon className={`size-3.5 ${isGroupActive ? 'text-sky-400' : 'text-blue-300/50'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isGroupActive ? 'text-sky-300' : 'text-blue-300/60'}`}>
                    {group.title}
                  </p>
                </div>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = tab === item.id
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setTab(item.id)}
                          className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? 'bg-[#155DFC] text-white font-bold shadow-md shadow-blue-500/25'
                              : 'text-blue-100/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <item.icon className={`size-4 shrink-0 ${active ? 'text-white' : 'text-blue-200/70 group-hover:text-white'}`} />
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge != null ? (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#155DFC] px-1.5 shadow-xs">
                              {item.badge}
                            </span>
                          ) : item.count > 0 ? (
                            <span className={`text-[11px] font-mono font-medium ${active ? 'text-white/90' : 'text-blue-200/70'}`}>
                              {item.count}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>

        {/* Bottom user strip with profile popover */}
        <div className="relative shrink-0 border-t border-blue-900/40 p-3 bg-[#081533]" ref={sidebarProfileRef}>
          <button
            type="button"
            onClick={() => setSidebarProfileOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2.5 text-left transition cursor-pointer group border border-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
            aria-expanded={sidebarProfileOpen}
            aria-label="Admin Profile Menu"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-8 shrink-0 rounded-full object-cover border border-white/20 group-hover:border-white/40 transition"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#155DFC]">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white group-hover:text-sky-200 transition">{user.name || 'Admin'}</p>
              <p className="truncate text-[10px] text-blue-200/80">{user.email}</p>
            </div>
            <ChevronUp className={`size-3.5 text-blue-300 transition-transform duration-200 shrink-0 ${sidebarProfileOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Floating upward popover menu */}
          {sidebarProfileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl bg-[#081533] border border-blue-800/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-blue-900/60">
                <div className="flex items-center gap-2.5">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="size-8 rounded-full object-cover border border-sky-400/40" />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user.name || 'Admin'}</p>
                    <p className="text-[10px] text-blue-200 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-full bg-sky-500/20 border border-sky-500/30 px-2 py-0.5 text-[9px] font-semibold text-sky-300 uppercase tracking-wider">
                    {user.role || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                  </span>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setTab('profile')
                    setSidebarProfileOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition cursor-pointer text-left"
                >
                  <UserCog className="size-4 text-sky-400 shrink-0" />
                  <span>Profile & Picture</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 transition cursor-pointer text-left"
                  onClick={() => setSidebarProfileOpen(false)}
                >
                  <ExternalLink className="size-4 text-blue-300 shrink-0" />
                  <span>View Public Site</span>
                </a>
              </div>

              <div className="p-1 border-t border-blue-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarProfileOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition cursor-pointer text-left"
                >
                  <LogOut className="size-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar with Group Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 dark:border-slate-800/80 dark:bg-slate-900/95 z-10">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#155DFC] dark:bg-blue-950/50 dark:text-sky-400">
              <currentGroup.icon className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {currentGroup.title}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400">
                  {currentItem.label}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {currentItem.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdminInquiriesNotification
              inquiries={inquiries}
              companyInquiries={companyInquiries}
              onOpenReader={(item) => setReaderInquiry(item)}
              onMarkAllAsRead={markAllInquiriesAsRead}
              onUpdateStudentStatus={updateInquiryStatus}
              onUpdateCompanyStatus={updateCompanyInquiryStatus}
            />
            <ThemeToggle size="sm" />

            {/* Header profile dropdown trigger */}
            <div className="relative ml-1" ref={headerProfileRef}>
              <button
                type="button"
                onClick={() => setHeaderProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 pr-2.5 transition cursor-pointer"
                aria-expanded={headerProfileOpen}
                aria-label="Admin Profile"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="size-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-[11px] font-bold text-white shadow-xs">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline truncate max-w-[110px]">
                  {user.name || 'Admin'}
                </span>
                <ChevronDown className={`size-3.5 text-slate-400 transition-transform duration-200 ${headerProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {headerProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name || 'Admin'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <span className="mt-1 inline-block rounded-md bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[9px] font-semibold text-blue-600 dark:text-sky-400 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('profile')
                        setHeaderProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-left"
                    >
                      <UserCog className="size-4 text-blue-600 dark:text-sky-400 shrink-0" />
                      <span>Profile & Picture</span>
                    </button>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-left"
                      onClick={() => setHeaderProfileOpen(false)}
                    >
                      <ExternalLink className="size-4 text-slate-400 shrink-0" />
                      <span>View Public Site</span>
                    </a>
                  </div>
                  <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setHeaderProfileOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer text-left"
                    >
                      <LogOut className="size-4 shrink-0" />
                      <span className="font-semibold">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-7">

          {/* ─── TAB: EXECUTIVE DASHBOARD & REPORTS ─── */}
          {tab === 'dashboard' && (
            <AdminDashboardView />
          )}



          {/* ─── TAB: TRUSTED PARTNERS ─── */}
          {tab === 'trusted-partners' && (
            <TrustedPartnersView
              partners={trustedPartners}
              loading={loading}
              search={search}
              setSearch={setSearch}
              savingId={savingId}
              savePartner={savePartner}
              deletePartner={deletePartner}
            />
          )}

          {/* ─── TAB: COURSES ─── */}
          {tab === 'courses' && (
            <ListView<Course>
              title="Courses"
              subtitle="Manage course catalog details, prices, and skills"
              loading={loading}
              search={search}
              setSearch={setSearch}
              items={courses}
              searchableFields={['title', 'category', 'slug', 'description']}
              onAdd={openNewCourse}
              onEdit={openEditCourse}
              onDelete={deleteCourse}
              onPreview={(c) => setSeoPreviewCourse(c)}
              savingId={savingId}
              columns={[
                { key: 'title', label: 'Title', className: 'font-semibold' },
                { key: 'category', label: 'Category' },
                { key: 'level', label: 'Level' },
                { key: 'duration', label: 'Duration' },
                { key: 'price', label: 'Price' },
                {
                  key: 'published',
                  label: 'Status',
                  render: (v) => (
                    <span
                      className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${
                        v
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {v ? 'Published' : 'Draft'}
                    </span>
                  ),
                },
                {
                  key: 'sortOrder',
                  label: 'Order',
                  className: 'text-center text-muted-foreground',
                },
              ]}
              addLabel="Add course"
            />
          )}

          {/* ─── TAB: LIBRARY ─── */}
          {tab === 'library' && (
            <AdminLibraryView
              items={library as any}
              onRefresh={loadLibrary}
              onEdit={(item) => openEditLibrary(item as any)}
              onCreate={openNewLibrary}
              onDelete={(id) => deleteLibrary(id)}
            />
          )}


          {/* ─── TAB: INSTRUCTORS ─── */}
          {tab === 'instructors' && (
            <InstructorsView
              items={instructors}
              loading={loading}
              search={search}
              setSearch={setSearch}
              onAdd={() => {
                setEditingInstructor(null)
                setInstructorOpen(true)
              }}
              onEdit={(inst) => {
                setEditingInstructor(inst)
                setInstructorOpen(true)
              }}
              onDelete={deleteInstructor}
              savingId={savingId}
            />
          )}

          {/* ─── TAB: FACILITIES ─── */}
          {tab === 'facilities' && (
            <FacilitiesView
              items={facilities}
              loading={loading}
              search={search}
              setSearch={setSearch}
              onAdd={() => {
                setEditingFacility(null)
                setFacilityOpen(true)
              }}
              onEdit={(fac) => {
                setEditingFacility(fac)
                setFacilityOpen(true)
              }}
              onDelete={deleteFacility}
              savingId={savingId}
            />
          )}

          {/* ─── TAB: PROJECTS ─── */}
          {tab === 'projects' && (
            <ProjectsView
              items={projects}
              loading={loading}
              search={search}
              setSearch={setSearch}
              onAdd={() => {
                setEditingProject(null)
                setProjectOpen(true)
              }}
              onEdit={(proj) => {
                setEditingProject(proj)
                setProjectOpen(true)
              }}
              onDelete={deleteProject}
              savingId={savingId}
            />
          )}

          {/* ─── TAB: PROFILE ─── */}
          {tab === 'profile' && (
            <ProfileView user={user} onUserUpdate={(updated) => setUser(updated)} />
          )}
        </main>
      </div>

      {/* ─── Modals ─── */}
      {editingCourse && (
        <CourseEditor
          open={courseOpen}
          onClose={() => {
            setCourseOpen(false)
            setEditingCourse(null)
          }}
          initial={editingCourse}
          onSave={saveCourse}
          saving={savingId === 'course'}
          existingSlugs={courses.map((c) => c.slug)}
        />
      )}
      {editingLibrary && (
        <LibraryEditor
          open={libraryOpen}
          onClose={() => {
            setLibraryOpen(false)
            setEditingLibrary(null)
          }}
          initial={editingLibrary}
          onSave={saveLibrary}
          saving={savingId === 'library'}
        />
      )}
      {seoPreviewCourse && (
        <CourseSeoPreviewModal
          open={!!seoPreviewCourse}
          onClose={() => setSeoPreviewCourse(null)}
          course={seoPreviewCourse}
        />
      )}
      {instructorOpen && (
        <InstructorModal
          open={instructorOpen}
          onClose={() => {
            setInstructorOpen(false)
            setEditingInstructor(null)
          }}
          instructor={editingInstructor}
          onSave={saveInstructor}
        />
      )}
      {facilityOpen && (
        <FacilityModal
          open={facilityOpen}
          onClose={() => {
            setFacilityOpen(false)
            setEditingFacility(null)
          }}
          facility={editingFacility}
          onSave={saveFacility}
        />
      )}
      {projectOpen && (
        <ProjectModal
          open={projectOpen}
          onClose={() => {
            setProjectOpen(false)
            setEditingProject(null)
          }}
          project={editingProject}
          onSave={saveProject}
        />
      )}
      {/* ── Unified Inquiry Reader Modal ── */}
      <AdminInquiryReaderModal
        inquiry={readerInquiry}
        open={!!readerInquiry}
        onClose={() => setReaderInquiry(null)}
        onUpdateStatus={handleReaderUpdateStatus}
        onSaveCompanyNotes={updateCompanyInquiryNotes}
        onDelete={handleReaderDelete}
        allInquiries={allUnifiedInquiries}
        onSelectInquiry={(item) => setReaderInquiry(item)}
      />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Profile View
   ────────────────────────────────────────────────────────────── */
const PRESET_AVATARS = [
  { label: 'Technician 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
  { label: 'Technician 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { label: 'Technician 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80' },
  { label: 'Technician 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' },
  { label: 'Technician 5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80' },
  { label: 'Default Icon', url: '/placeholder-user.jpg' },
]

function ProfileView({
  user,
  onUserUpdate,
}: {
  user: User
  onUserUpdate: (u: User) => void
}) {
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAvatarUrl(user.avatarUrl || '')
  }, [user.avatarUrl])

  // Name form
  const [name, setName] = useState(user.name || '')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Password form
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function saveAvatar(urlToSave: string | null) {
    setAvatarMsg(null)
    setAvatarSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: urlToSave }),
      })
      const d = await res.json()
      if (!res.ok) {
        setAvatarMsg({ type: 'err', text: d.error || 'Failed to update avatar' })
      } else {
        onUserUpdate(d.user)
        setAvatarUrl(d.user.avatarUrl || '')
        setAvatarMsg({ type: 'ok', text: urlToSave ? 'Profile photo updated!' : 'Avatar reset to initials!' })
      }
    } catch {
      setAvatarMsg({ type: 'err', text: 'Network error updating avatar' })
    } finally {
      setAvatarSaving(false)
    }
  }

  function compressImage(file: File, maxDim = 400, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let { width, height } = img
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        }
        img.onerror = () => resolve(e.target?.result as string)
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileUpload(file: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarMsg({ type: 'err', text: 'Please select a valid image file (JPG, PNG, WebP, GIF)' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarMsg({ type: 'err', text: 'File size must be under 10MB' })
      return
    }

    setAvatarMsg(null)
    setUploading(true)

    try {
      // 1. Compress image to clean lightweight avatar in browser
      const optimizedDataUrl = await compressImage(file, 400, 0.85)
      setAvatarUrl(optimizedDataUrl)

      // 2. Save directly to database profile (persisted in TiDB Cloud)
      await saveAvatar(optimizedDataUrl)
      setAvatarMsg({ type: 'ok', text: 'Photo uploaded and profile updated successfully!' })
    } catch (err: any) {
      setAvatarMsg({ type: 'err', text: err.message || 'Error uploading file' })
    } finally {
      setUploading(false)
    }
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setNameMsg(null)
    setNameSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const d = await res.json()
      if (!res.ok) {
        setNameMsg({ type: 'err', text: d.error || 'Failed to update name' })
      } else {
        onUserUpdate(d.user)
        setNameMsg({ type: 'ok', text: 'Display name updated!' })
      }
    } catch {
      setNameMsg({ type: 'err', text: 'Network error updating name' })
    } finally {
      setNameSaving(false)
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'err', text: 'New passwords do not match' })
      return
    }
    if (newPw.length < 8) {
      setPwMsg({ type: 'err', text: 'Password must be at least 8 characters' })
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const d = await res.json()
      if (!res.ok) {
        setPwMsg({ type: 'err', text: d.error || 'Failed to change password' })
      } else {
        setPwMsg({ type: 'ok', text: 'Password changed successfully!' })
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
      }
    } catch {
      setPwMsg({ type: 'err', text: 'Network error changing password' })
    } finally {
      setPwSaving(false)
    }
  }

  const cardCls = 'rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'
  const fieldCls = 'flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300'
  const inputCls =
    'h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Header Account Overview Card ── */}
      <div className={cardCls}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || user.email}
                  className="size-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl font-bold text-blue-600 border border-blue-400/30">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
                <Check className="size-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {user.name || 'Site Administrator'}
                </h2>
                <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 border border-blue-400/20">
                  {user.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-1 text-[11px] text-slate-500">Account ID: {user.id}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-card sm:text-right">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Session Status</p>
            <p className="mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium">● Active & Protected</p>
            <p className="mt-1 text-[10px] text-slate-400">Sliding 8-hr TTL token</p>
          </div>
        </div>
      </div>

      {/* ── Avatar & Profile Picture Card (Matching Student Portal) ── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-blue-600 dark:text-sky-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Profile Photo & Avatar
            </h3>
          </div>
          {user.avatarUrl && (
            <button
              type="button"
              onClick={() => saveAvatar(null)}
              disabled={avatarSaving || uploading}
              className="text-xs font-semibold text-rose-500 hover:underline disabled:opacity-50 cursor-pointer"
            >
              Reset to initials
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Upload your profile photo, pick a preset avatar, or enter an image link.
        </p>

        {avatarMsg && (
          <div
            className={`mt-4 rounded-xl p-3 text-xs font-medium flex items-center justify-between ${
              avatarMsg.type === 'ok'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <span>{avatarMsg.text}</span>
            <button
              type="button"
              onClick={() => setAvatarMsg(null)}
              className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Circular Upload Area matching Student Portal */}
        <div className="mt-6 flex flex-col items-center">
          <span className="self-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Avatar
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = ''
            }}
          />

          {/* Circular Upload Box matching Student Portal */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className={`size-44 md:size-52 rounded-full border transition cursor-pointer flex flex-col items-center justify-center p-4 text-center overflow-hidden relative group shadow-xs ${
              dragOver
                ? 'border-sky-500 bg-sky-500/10 ring-4 ring-sky-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-10 text-sky-500 animate-spin" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Uploading...
                </p>
              </div>
            ) : avatarUrl ? (
              <>
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="size-full object-cover rounded-full"
                />
                {/* Hover overlay for changing picture */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-3">
                  <Camera className="size-7 mb-1 text-sky-300" />
                  <span className="text-xs font-semibold">Change Picture</span>
                  <span className="text-[10px] text-slate-300 mt-0.5">Click or drop file</span>
                </div>
              </>
            ) : (
              <>
                <UserIcon className="size-16 text-sky-400 stroke-1 mb-2" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[120px] leading-tight">
                  Click here or drag image to add
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="mt-3 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-3.5 py-1 text-xs font-semibold transition cursor-pointer"
                >
                  Select File
                </button>
              </>
            )}
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            Supports PNG, JPG, WebP or GIF up to 5MB
          </p>

          {avatarUrl && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || avatarSaving}
                className="rounded-lg border border-sky-400 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="size-3.5" /> Select File
              </button>
              <button
                type="button"
                onClick={() => saveAvatar(null)}
                disabled={uploading || avatarSaving}
                className="rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            </div>
          )}
        </div>

        {/* Preset Avatars Grid */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Or Choose from Presets:
          </p>
          <div className="mt-2.5 flex flex-wrap gap-3">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = avatarUrl === preset.url
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(preset.url)
                    saveAvatar(preset.url)
                  }}
                  disabled={avatarSaving || uploading}
                  className={`group relative size-12 overflow-hidden rounded-xl border-2 transition hover:scale-105 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="size-full object-cover" />
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-blue-900/40 text-white">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom URL Input Form */}
        <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
          <label className={fieldCls}>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or Custom Image URL
            </span>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://.../photo.jpg or /placeholder-user.jpg"
              />
              <Button
                type="button"
                onClick={() => saveAvatar(avatarUrl.trim() || null)}
                disabled={avatarSaving || uploading}
                className="shrink-0 rounded-lg px-4"
              >
                {avatarSaving ? <Loader2 className="size-4 animate-spin" /> : 'Save URL'}
              </Button>
            </div>
          </label>
        </div>

        {avatarMsg && (
          <p
            className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              avatarMsg.type === 'ok'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
            }`}
          >
            {avatarMsg.type === 'ok' ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
            {avatarMsg.text}
          </p>
        )}
      </div>

      {/* ── Display Name Card ── */}
      <div className={cardCls}>
        <form onSubmit={saveName} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Display Name</h3>
          <label className={fieldCls}>
            Full name
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Site Administrator"
              minLength={2}
              required
            />
          </label>
          {nameMsg && (
            <p
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                nameMsg.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
              }`}
            >
              {nameMsg.type === 'ok' ? <Check className="size-4" /> : null}
              {nameMsg.text}
            </p>
          )}
          <div>
            <Button type="submit" disabled={nameSaving} className="rounded-lg">
              {nameSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {nameSaving ? 'Saving...' : 'Save Name'}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Change Password Card ── */}
      <div className={cardCls}>
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-slate-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Change Password</h3>
          </div>
          <label className={fieldCls}>
            Current password
            <input
              type="password"
              className={inputCls}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Your current password"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={fieldCls}>
              New password
              <input
                type="password"
                className={inputCls}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </label>
            <label className={fieldCls}>
              Confirm new password
              <input
                type="password"
                className={inputCls}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </label>
          </div>
          {pwMsg && (
            <p
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                pwMsg.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
              }`}
            >
              {pwMsg.type === 'ok' ? <Check className="size-4" /> : null}
              {pwMsg.text}
            </p>
          )}
          <div>
            <Button type="submit" disabled={pwSaving} className="rounded-lg">
              {pwSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {pwSaving ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Security & Role Permissions Summary ── */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-blue-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Security & Permissions</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="rounded-xl border bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Session Security</p>
            <p className="mt-1 leading-5">Protected with SHA-256 HMAC cookie tokens and sliding renewal window.</p>
          </div>
          <div className="rounded-xl border bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Brute Force Protection</p>
            <p className="mt-1 leading-5">Rate-limiting enforced per email key and source IP address.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ──────────────────────────────────────────────────────────────
   Inquiries table view & Workflow
   ────────────────────────────────────────────────────────────── */

function cleanPhoneForChat(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
    cleaned = '251' + cleaned.slice(1)
  }
  return cleaned.replace(/^\+/, '')
}

function exportInquiriesToCsv(items: Inquiry[], filename: string) {
  const headers = [
    'ID',
    'Student Name',
    'Phone',
    'Email',
    'Course',
    'Preferred Contact',
    'Experience Level',
    'Message',
    'Status',
    'Submitted Date',
  ]
  const rows = items.map((i) => [
    i.id,
    i.studentName,
    i.phone,
    i.email || '',
    i.course || '',
    i.preferredContact || '',
    i.experience || '',
    (i.message || '').replace(/\r?\n/g, ' '),
    i.status === 'Converted' ? 'Enrolled' : i.status,
    new Date(i.createdAt).toLocaleString(),
  ])
  const escapeCell = (val: string) => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return `"${s}"`
  }
  const csvContent =
    '\uFEFF' +
    [headers, ...rows]
      .map((r) => r.map(escapeCell).join(','))
      .join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function InquiryDetailModal({
  inquiry,
  open,
  onClose,
  onUpdateStatus,
  onDelete,
  saving,
}: {
  inquiry: Inquiry | null
  open: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
  saving: boolean
}) {
  const { confirm } = useConfirm()
  if (!open || !inquiry) return null

  const cleanPhone = cleanPhoneForChat(inquiry.phone)
  const isEnrolled = inquiry.status === 'Enrolled' || inquiry.status === 'Converted'

  return (
    <Modal open={open} onClose={onClose} title="Student Inquiry Details" width="max-w-2xl">
      <div className="space-y-6">
        {/* Header summary banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 border dark:bg-slate-900/60 dark:border-slate-800">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {inquiry.studentName}
            </h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="size-3.5" />
              Submitted {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              STATUS_COLORS[inquiry.status] || 'border-slate-200 bg-slate-100'
            }`}
          >
            {isEnrolled ? 'Enrolled' : inquiry.status}
          </span>
        </div>

        {/* Course & Student Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-3.5 bg-background">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selected Course
            </p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
              {inquiry.course || 'General Technical Training'}
            </p>
          </div>

          <div className="rounded-xl border p-3.5 bg-background">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Technical Background
            </p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
              {inquiry.experience || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Contact details with quick action buttons */}
        <div className="rounded-xl border p-4 bg-background space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact & Follow-up Channels
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <span className="font-semibold">{inquiry.phone}</span>
              {inquiry.preferredContact && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Pref: {inquiry.preferredContact}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${inquiry.phone}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <Phone className="size-3 text-primary" /> Call
              </a>
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                >
                  <Send className="size-3" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {inquiry.email && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm pt-2 border-t">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span>{inquiry.email}</span>
              </div>
              <a
                href={`mailto:${inquiry.email}?subject=Hello Technology Enrollment Inquiry - ${inquiry.course || 'Technical Training'}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <Mail className="size-3 text-primary" /> Send Email
              </a>
            </div>
          )}
        </div>

        {/* Message / Special Notes */}
        <div className="rounded-xl border p-4 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Student Message / Questions
          </p>
          {inquiry.message ? (
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
              {inquiry.message}
            </p>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              No specific message or requirements provided with this inquiry.
            </p>
          )}
        </div>

        {/* Status Workflow Action Stepper */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Advance Workflow Status
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={() => onUpdateStatus(inquiry.id, 'New')}
              disabled={saving || inquiry.status === 'New'}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
                inquiry.status === 'New'
                  ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              } disabled:opacity-60`}
            >
              <AlertCircle className="size-3.5" />
              New
            </button>

            <button
              onClick={() => onUpdateStatus(inquiry.id, 'Contacted')}
              disabled={saving || inquiry.status === 'Contacted'}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
                inquiry.status === 'Contacted'
                  ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              } disabled:opacity-60`}
            >
              <Phone className="size-3.5" />
              Contacted
            </button>

            <button
              onClick={() => onUpdateStatus(inquiry.id, 'Enrolled')}
              disabled={saving || isEnrolled}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
                isEnrolled
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              } disabled:opacity-60`}
            >
              <GraduationCap className="size-3.5" />
              Enrolled
            </button>

            <button
              onClick={() => onUpdateStatus(inquiry.id, 'Archived')}
              disabled={saving || inquiry.status === 'Archived'}
              className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
                inquiry.status === 'Archived'
                  ? 'border-slate-600 bg-slate-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              } disabled:opacity-60`}
            >
              <Archive className="size-3.5" />
              Archived
            </button>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const ok = await confirm({
                title: 'Delete Inquiry',
                message: 'Are you sure you want to delete this inquiry permanently?',
                confirmText: 'Delete',
                variant: 'danger',
              })
              if (ok) {
                onDelete(inquiry.id)
                onClose()
              }
            }}
            className="text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <Trash2 className="size-3.5 mr-1.5" /> Delete Inquiry
          </Button>

          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function InquiriesView(props: {
  loading: boolean
  inquiries: Inquiry[]
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  savingId: string | null
  updateStatus: (id: string, status: string) => void
  bulkUpdateStatus: (ids: string[], status: string) => void
  remove: (id: string) => void
  bulkRemove: (ids: string[]) => void
  overview: {
    total: number
    new: number
    contacted: number
    enrolled: number
    converted?: number
    archived: number
  }
}) {
  const {
    loading,
    inquiries,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    savingId,
    updateStatus,
    bulkUpdateStatus,
    remove,
    bulkRemove,
    overview,
  } = props

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailInquiry, setDetailInquiry] = useState<Inquiry | null>(null)

  const filtered = useMemo(
    () =>
      inquiries.filter((i) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          i.studentName.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          (i.email || '').toLowerCase().includes(q) ||
          (i.course || '').toLowerCase().includes(q) ||
          (i.message || '').toLowerCase().includes(q) ||
          (i.experience || '').toLowerCase().includes(q)
        )
      }),
    [inquiries, search]
  )

  // Selection helpers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)))
    }
  }

  // Export handlers
  const handleExportCsv = () => {
    const itemsToExport =
      selectedIds.size > 0
        ? filtered.filter((i) => selectedIds.has(i.id))
        : filtered
    const dateStr = new Date().toISOString().slice(0, 10)
    exportInquiriesToCsv(itemsToExport, `helloschool_inquiries_${dateStr}.csv`)
  }

  const handleExportExcel = () => {
    // Downloads with Excel format
    const url = `/api/admin/inquiries?format=excel${
      statusFilter !== 'All' ? `&status=${encodeURIComponent(statusFilter)}` : ''
    }`
    window.open(url, '_blank')
  }

  // Bulk actions
  const handleBulkStatus = (status: string) => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    bulkUpdateStatus(ids, status)
    setSelectedIds(new Set())
  }

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    bulkRemove(ids)
    setSelectedIds(new Set())
  }

  const enrolledCount = overview.enrolled || overview.converted || 0
  const conversionRate =
    overview.total > 0 ? Math.round((enrolledCount / overview.total) * 100) : 0

  return (
    <div>
      {/* ─── Interactive Stat Cards ─── */}
      <div className="mb-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <button
          onClick={() => setStatusFilter('All')}
          className={`text-left rounded-2xl border p-4 transition shadow-sm ${
            statusFilter === 'All'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</span>
            <Users className="size-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">{overview.total}</p>
          <p className="mt-1 text-[11px] text-slate-400">All submissions</p>
        </button>

        <button
          onClick={() => setStatusFilter('New')}
          className={`text-left rounded-2xl border p-4 transition shadow-sm ${
            statusFilter === 'New'
              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-950/40'
              : 'border-blue-100 bg-blue-50/50 hover:border-blue-300 dark:border-blue-900/40 dark:bg-blue-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">New</span>
            <AlertCircle className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">{overview.new}</p>
          <p className="mt-1 text-[11px] text-blue-600/70 dark:text-blue-400/70">Needs follow-up</p>
        </button>

        <button
          onClick={() => setStatusFilter('Contacted')}
          className={`text-left rounded-2xl border p-4 transition shadow-sm ${
            statusFilter === 'Contacted'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50 dark:bg-amber-950/40'
              : 'border-amber-100 bg-amber-50/50 hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Contacted</span>
            <Phone className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">{overview.contacted || 0}</p>
          <p className="mt-1 text-[11px] text-amber-600/70 dark:text-amber-400/70">In discussion</p>
        </button>

        <button
          onClick={() => setStatusFilter('Enrolled')}
          className={`text-left rounded-2xl border p-4 transition shadow-sm ${
            statusFilter === 'Enrolled'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40'
              : 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Enrolled</span>
            <GraduationCap className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{enrolledCount}</p>
          <p className="mt-1 text-[11px] text-emerald-600/70 dark:text-emerald-400/70">
            {overview.total > 0 ? `${conversionRate}% conversion` : 'Registered'}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter('Archived')}
          className={`text-left rounded-2xl border p-4 transition shadow-sm ${
            statusFilter === 'Archived'
              ? 'border-slate-500 ring-2 ring-slate-500/20 bg-slate-100 dark:bg-slate-800'
              : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Archived</span>
            <Archive className="size-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">{overview.archived || 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">Closed records</p>
        </button>
      </div>

      {/* ─── Filter Pills & Search & Export Bar ─── */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...INQUIRY_STATUS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                statusFilter === s
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {s}
              {s === 'All' && ` (${overview.total})`}
              {s === 'New' && ` (${overview.new})`}
              {s === 'Contacted' && ` (${overview.contacted || 0})`}
              {s === 'Enrolled' && ` (${enrolledCount})`}
              {s === 'Archived' && ` (${overview.archived || 0})`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, phone, course..."
              className="h-9 w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="rounded-xl border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            title="Export filtered inquiries to CSV"
          >
            <Download className="mr-1.5 size-3.5 text-slate-500" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={filtered.length === 0}
            className="rounded-xl border-emerald-200 bg-emerald-50/40 text-xs font-medium text-emerald-800 hover:bg-emerald-100/50 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300"
            title="Download Excel compatible CSV file with UTF-8 BOM"
          >
            <FileSpreadsheet className="mr-1.5 size-3.5 text-emerald-600" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* ─── Bulk Actions Bar (Shown when items are selected) ─── */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-3.5 text-sm dark:bg-primary/15 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckSquare className="size-4 text-primary" />
            <span className="font-semibold text-primary">
              {selectedIds.size} of {filtered.length} inquiries selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Mark selected as:</span>
            <button
              onClick={() => handleBulkStatus('Contacted')}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
            >
              <Phone className="size-3" /> Contacted
            </button>
            <button
              onClick={() => handleBulkStatus('Enrolled')}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
            >
              <GraduationCap className="size-3" /> Enrolled
            </button>
            <button
              onClick={() => handleBulkStatus('Archived')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Archive className="size-3" /> Archived
            </button>
            <button
              onClick={() => handleBulkStatus('New')}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200"
            >
              <RefreshCw className="size-3" /> New
            </button>

            <div className="h-4 w-px bg-primary/20 mx-1" />

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Download className="size-3" /> Export Selected
            </button>

            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="size-3" /> Delete
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              title="Clear selection"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Table ─── */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={handleSelectAll}
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    title="Select all"
                  />
                </th>
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">Course</th>
                <th className="px-5 py-3.5 font-semibold">Contact & Channels</th>
                <th className="px-5 py-3.5 font-semibold">Experience</th>
                <th className="px-5 py-3.5 font-semibold">Submitted</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Workflow Action</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-muted-foreground">
                    <Loader2 className="mx-auto mb-3 size-6 animate-spin text-primary" />
                    Loading inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-muted-foreground">
                    No inquiries found matching your current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((i) => {
                  const isSelected = selectedIds.has(i.id)
                  const cleanPhone = cleanPhoneForChat(i.phone)
                  const isEnrolled = i.status === 'Enrolled' || i.status === 'Converted'

                  return (
                    <tr
                      key={i.id}
                      className={`border-b last:border-0 transition hover:bg-muted/30 ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-10 px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(i.id)}
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </td>

                      {/* Student Name */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDetailInquiry(i)}
                          className="text-left font-semibold text-slate-900 hover:text-primary dark:text-white"
                        >
                          {i.studentName}
                        </button>
                        {i.email && (
                          <p className="text-xs text-muted-foreground">{i.email}</p>
                        )}
                        {i.message && (
                          <p className="mt-1 line-clamp-1 text-[11px] text-slate-500 max-w-xs">
                            "{i.message}"
                          </p>
                        )}
                      </td>

                      {/* Course */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg border bg-muted/50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {i.course || 'General'}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${i.phone}`}
                            className="font-medium text-slate-900 hover:underline dark:text-white"
                          >
                            {i.phone}
                          </a>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                              title="Chat on WhatsApp"
                            >
                              <Send className="size-3.5" />
                            </a>
                          )}
                        </div>
                        {i.preferredContact && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Pref: {i.preferredContact}
                          </p>
                        )}
                      </td>

                      {/* Experience */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {i.experience || '—'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(i.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status Selector */}
                      <td className="px-5 py-4">
                        <select
                          value={isEnrolled ? 'Enrolled' : i.status}
                          onChange={(e) => updateStatus(i.id, e.target.value)}
                          disabled={savingId === i.id}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                            STATUS_COLORS[i.status] || 'border-slate-200 bg-slate-50'
                          } disabled:opacity-60 cursor-pointer`}
                        >
                          {INQUIRY_STATUS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Quick 1-Click Workflow Advance Button */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {i.status === 'New' && (
                          <button
                            onClick={() => updateStatus(i.id, 'Contacted')}
                            disabled={savingId === i.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200 disabled:opacity-50"
                            title="Mark as Contacted"
                          >
                            <Phone className="size-3" /> Contact
                          </button>
                        )}
                        {i.status === 'Contacted' && (
                          <button
                            onClick={() => updateStatus(i.id, 'Enrolled')}
                            disabled={savingId === i.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 disabled:opacity-50"
                            title="Mark as Enrolled"
                          >
                            <GraduationCap className="size-3" /> Enroll
                          </button>
                        )}
                        {isEnrolled && (
                          <button
                            onClick={() => updateStatus(i.id, 'Archived')}
                            disabled={savingId === i.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 disabled:opacity-50"
                            title="Archive Inquiry"
                          >
                            <Archive className="size-3" /> Archive
                          </button>
                        )}
                        {i.status === 'Archived' && (
                          <button
                            onClick={() => updateStatus(i.id, 'New')}
                            disabled={savingId === i.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200 disabled:opacity-50"
                            title="Reopen Inquiry"
                          >
                            <RefreshCw className="size-3" /> Reopen
                          </button>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setDetailInquiry(i)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            title="View details"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => remove(i.id)}
                            disabled={savingId === i.id}
                            className="rounded-lg border border-destructive/30 p-1.5 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                            title="Delete"
                          >
                            {savingId === i.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      <InquiryDetailModal
        inquiry={detailInquiry}
        open={!!detailInquiry}
        onClose={() => setDetailInquiry(null)}
        onUpdateStatus={(id, s) => {
          updateStatus(id, s)
          setDetailInquiry((prev) => (prev ? { ...prev, status: s } : null))
        }}
        onDelete={remove}
        saving={savingId === detailInquiry?.id}
      />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Generic list view with search, add, edit, delete
   ────────────────────────────────────────────────────────────── */
type ColumnDef<T> = {
  key: string
  label: string
  className?: string
  render?: (value: any, row: T) => React.ReactNode
}

function ListView<T extends { id: string }>(props: {
  title: string
  subtitle?: string
  loading: boolean
  search: string
  setSearch: (v: string) => void
  items: T[]
  searchableFields: string[]
  onAdd: () => void
  onEdit: (row: T) => void
  onDelete: (id: string) => void
  onPreview?: (row: T) => void
  savingId: string | null
  columns: ColumnDef<T>[]
  addLabel: string
}) {
  const {
    title,
    subtitle,
    loading,
    search,
    setSearch,
    items,
    searchableFields,
    onAdd,
    onEdit,
    onDelete,
    onPreview,
    savingId,
    columns,
    addLabel,
  } = props

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return searchableFields.some((f) => {
          const v = (i as any)[f]
          return typeof v === 'string' && v.toLowerCase().includes(q)
        })
      }),
    [items, search, searchableFields]
  )

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-10 w-64 rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={onAdd} size="sm" className="rounded-lg">
            <Plus className="mr-2 size-4" />
            {addLabel}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-5 py-4 font-semibold ${c.className || ''}`}
                  >
                    {c.label}
                  </th>
                ))}
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    <Loader2 className="mx-auto mb-3 size-6 animate-spin" />
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    No items. Click "{addLabel}" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-5 py-4 align-middle ${c.className || ''}`}
                      >
                        {c.render
                          ? c.render((row as any)[c.key], row)
                          : (row as any)[c.key] ?? '—'}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {onPreview && (
                          <button
                            onClick={() => onPreview(row)}
                            className="inline-flex items-center rounded-lg border border-blue-500/30 p-2 text-blue-600 transition hover:bg-blue-500/10 dark:text-sky-400"
                            title="SEO & Social Sharing Preview"
                          >
                            <Share2 className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(row)}
                          disabled={savingId === row.id}
                          className="inline-flex items-center rounded-lg border border-primary/30 p-2 text-primary transition hover:bg-primary/10 disabled:opacity-50"
                          title="Edit"
                        >
                          {savingId === row.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Pencil className="size-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          disabled={savingId === row.id}
                          className="inline-flex items-center rounded-lg border border-destructive/30 p-2 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Course editor modal
   ────────────────────────────────────────────────────────────── */
function CourseEditor({
  open,
  onClose,
  initial,
  onSave,
  saving,
  existingSlugs,
}: {
  open: boolean
  onClose: () => void
  initial: Course
  onSave: (data: Course) => void
  saving: boolean
  existingSlugs: string[]
}) {
  const [form, setForm] = useState<Course>({
    ...initial,
    category: initial.category || 'General',
    skills: initial.skills || [],
    syllabus: initial.syllabus || [],
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!initial.id

  useEffect(() => {
    setForm({
      ...initial,
      skills: initial.skills || [],
      syllabus: initial.syllabus || [],
    })
    setErrors({})
  }, [initial, open])

  function update<K extends keyof Course>(k: K, v: Course[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  function addSkill() {
    const s = skillInput.trim()
    if (!s) return
    if (form.skills.includes(s)) return
    update('skills', [...form.skills, s])
    setSkillInput('')
  }

  function removeSkill(idx: number) {
    update(
      'skills',
      form.skills.filter((_, i) => i !== idx)
    )
  }

  /* ─── Syllabus / Curriculum Operations ─── */
  function addModule() {
    const current = form.syllabus || []
    const newMod: SyllabusModule = {
      title: `Module ${current.length + 1}: `,
      duration: '2 Weeks',
      description: '',
      lessons: [],
      labMilestone: '',
    }
    update('syllabus', [...current, newMod])
  }

  function updateModule(modIdx: number, field: keyof SyllabusModule, val: any) {
    const list = [...(form.syllabus || [])]
    list[modIdx] = { ...list[modIdx], [field]: val }
    update('syllabus', list)
  }

  function removeModule(modIdx: number) {
    const list = (form.syllabus || []).filter((_, i) => i !== modIdx)
    update('syllabus', list)
  }

  function moveModule(modIdx: number, direction: 'up' | 'down') {
    const list = [...(form.syllabus || [])]
    const targetIdx = direction === 'up' ? modIdx - 1 : modIdx + 1
    if (targetIdx < 0 || targetIdx >= list.length) return
    const temp = list[modIdx]
    list[modIdx] = list[targetIdx]
    list[targetIdx] = temp
    update('syllabus', list)
  }

  function addLesson(modIdx: number, topic: string) {
    const trimmed = topic.trim()
    if (!trimmed) return
    const list = [...(form.syllabus || [])]
    const lessons = list[modIdx].lessons || []
    if (lessons.includes(trimmed)) return
    list[modIdx] = { ...list[modIdx], lessons: [...lessons, trimmed] }
    update('syllabus', list)
  }

  function removeLesson(modIdx: number, lessonIdx: number) {
    const list = [...(form.syllabus || [])]
    list[modIdx] = {
      ...list[modIdx],
      lessons: (list[modIdx].lessons || []).filter((_, i) => i !== lessonIdx),
    }
    update('syllabus', list)
  }

  function loadCurriculumTemplate() {
    const cat = (form.category || '').toLowerCase()
    let template: SyllabusModule[] = []

    if (cat.includes('mobile')) {
      template = [
        {
          title: 'Module 1: Safety, Precision Tools & Hardware Teardown',
          duration: '2 Weeks',
          description: 'ESD ground isolation, precision screwdrivers, thermal opening plates, safe battery disconnect, and bezel separation.',
          lessons: [
            'ESD workstation safety & ground loop prevention',
            'Heating plate & hot air adhesive softening techniques',
            'Display, frame, and battery extraction without damage',
            'Screw mapping and micro-bracket organization',
          ],
          labMilestone: 'Perform clean full teardown and reassembly of test smartphone units with 100% functional display and sensors.',
        },
        {
          title: 'Module 2: Multimeter Diagnostics & Primary Power Rails',
          duration: '3 Weeks',
          description: 'Diode mode drop testing on FPC connectors, schematic interpretation, and DC power supply current draw analysis.',
          lessons: [
            'Diode mode readings vs reference ground values',
            'VBUS, VBAT & VDD_MAIN power sequencing',
            'DC bench power supply current draw signatures (short vs open)',
            'Thermal imaging and freeze spray short isolation',
          ],
          labMilestone: 'Diagnose a non-powering board, locate glowing shorted capacitor on VDD_MAIN rail, and safely remove it to restore boot.',
        },
        {
          title: 'Module 3: Micro-Soldering, Jumper Running & Port Rework',
          duration: '3 Weeks',
          description: 'Stereomicroscope soldering, micro-pencil tips, repairing severed traces, and replacing charge ports.',
          lessons: [
            'Microscope focus, lighting, and ergonomics',
            '0.02mm insulated jumper wire routing for torn motherboard pads',
            'UV-curable solder mask application and curing',
            'Micro-USB and Type-C multi-pin port desoldering and replacement',
          ],
          labMilestone: 'Reconstruct two torn motherboard pads beneath an FPC connector using jumper wire and cure with UV solder mask.',
        },
        {
          title: 'Module 4: BGA IC Reballing, Baseband & Charging Circuits',
          duration: '4 Weeks',
          description: 'Underfill glue removal, BGA stencil reballing, replacing power management ICs (PMIC) and charging ICs.',
          lessons: [
            'Black and clear underfill resin softening and scraping',
            'Direct-heat stencils and solder paste reballing technique',
            'PMIC, Tristar/Hydra charging IC, and audio IC replacement',
            'Firmware flashing, error codes, and bootloop recovery',
          ],
          labMilestone: 'Successfully de-solder, clean pads, reball, and solder back a PMIC chip on a mobile motherboard with verified boot.',
        },
      ]
    } else if (cat.includes('computer') || cat.includes('laptop')) {
      template = [
        {
          title: 'Module 1: Motherboard Power Architecture & Multimeter Probing',
          duration: '2 Weeks',
          description: 'Laptop 19V/20V DC-in rail, charging circuit MOSFETs, and 3.3V/5V standby power generation.',
          lessons: [
            'DC-in jack testing, reverse polarity protection & 1st/2nd input MOSFETs',
            'Current sensing resistor (VIN / CLR) voltage drop analysis',
            'Standby power chip operation (3.3V / 5V always-on coils)',
            'Coil resistance to ground measurements across all motherboard rails',
          ],
          labMilestone: 'Trace 19V rail on a dead laptop board, identify blown gate driver MOSFET, and restore primary DC rail.',
        },
        {
          title: 'Module 2: Power Sequencing, S0/S3/S5 States & Signal Tracing',
          duration: '3 Weeks',
          description: 'Understanding laptop power-on sequence from RTC reset, AC_IN, to PM_SLP_S3# and CPU Vcore.',
          lessons: [
            'Intel / AMD power sequencing flowcharts and state diagrams',
            'Embedded Controller (KBC / SIO) inputs: AC_IN, LID_SW#, PWRBTN#',
            'Oscilloscope signal verification on 32.768 kHz RTC clock crystals',
            'Memory power (VCC_DDR) and CPU core switching buck regulators',
          ],
          labMilestone: 'Connect 4-channel oscilloscope to probe power good signals and trace interrupted sequence on a no-POST motherboard.',
        },
        {
          title: 'Module 3: BIOS/EC SPI Flashing & ME Region Cleaning',
          duration: '2 Weeks',
          description: 'Hardware SPI programmer usage, reading corrupted Flash ROMs, and building clean BIOS binaries.',
          lessons: [
            'CH341A / RT809F high-speed SPI programmer operations',
            'Desoldering 8-pin and 16-pin SOIC / WSON flash chips',
            'Intel Management Engine (ME) region cleaning for delayed shutdown fixes',
            'Super I/O (ITE, ENE, Nuvoton) onboard programmable chip flashing',
          ],
          labMilestone: 'Desolder SPI chip, flash verified manufacturer binary with cleaned Intel ME region, and verify fast boot without delay.',
        },
        {
          title: 'Module 4: Component Rework, Port Replacements & Cooling Systems',
          duration: '3 Weeks',
          description: 'Type-C power delivery controllers, HDMI port replacements, and thermal pipe & fan restoration.',
          lessons: [
            'USB-C PD negotiation controller troubleshooting (5V to 20V trigger)',
            'Micro-soldering multi-pin HDMI and headphone jacks',
            'Heat pipe vapor chamber testing and phase change thermal pad application',
            'Liquid damage ultrasonic cleaning, corrosion mitigation, and conformal coating',
          ],
          labMilestone: 'Replace a broken Type-C power receptacle and repair liquid-damaged trace on a modern laptop board.',
        },
      ]
    } else {
      template = [
        {
          title: 'Module 1: Passive & Active Component Deep-Dive Diagnostics',
          duration: '2 Weeks',
          description: 'In-circuit vs out-of-circuit testing of capacitors, inductors, diodes, BJTs, and MOSFETs.',
          lessons: [
            'ESR capacitor testing and ripple current degradation',
            'Diode forward voltage drops (Silicon vs Schottky vs Zener)',
            'Bipolar junction transistors and N-channel / P-channel MOSFET gate triggering',
            'Optocoupler isolation and feedback loop diagnostics',
          ],
          labMilestone: 'Identify high-ESR dried electrolytic capacitors and leaky MOSFETs in circuit using LCR meter and component tester.',
        },
        {
          title: 'Module 2: Oscilloscope Mastering & Signal Waveform Analysis',
          duration: '3 Weeks',
          description: 'Digital storage oscilloscope triggers, probe calibration, PWM duty cycles, and noise detection.',
          lessons: [
            '10X probe compensation, grounding clips, and bandwidth considerations',
            'PWM switching waveforms across SMPS MOSFET drain pins',
            'Bus communication decoding: I2C clock/data, SPI, and UART waveforms',
            'AC ripple voltage measurement on regulated DC power supplies',
          ],
          labMilestone: 'Capture and decode an I2C communication packet between a microcontroller and sensor using oscilloscope serial triggers.',
        },
        {
          title: 'Module 3: Linear & Switched-Mode Power Supplies (SMPS)',
          duration: '3 Weeks',
          description: 'Flyback converters, forward topologies, buck-boost circuits, and TL431 regulation loops.',
          lessons: [
            'Hot side vs cold side isolation and safety isolation transformers',
            'Bridge rectifiers, primary filter smoothing, and startup resistors',
            'PWM controller ICs (UC3842, VIPer, TOPswitch) pinout diagnostics',
            'Optocoupler & TL431 precision shunt regulator feedback loops',
          ],
          labMilestone: 'Troubleshoot a pulsing/clicking SMPS board, diagnose open feedback optocoupler, and restore stable DC output.',
        },
        {
          title: 'Module 4: Schematic Reading, Boardviews & Fault Tree Strategy',
          duration: '2 Weeks',
          description: 'Decoding complex schematics, locating test points, and applying deductive fault isolation trees.',
          lessons: [
            'OpenBoardView and PDF schematic cross-referencing',
            'Net naming conventions and signal direction arrows',
            'Root cause failure analysis (overvoltage vs thermal breakdown)',
            'Reverse engineering un-schematiced circuit sections',
          ],
          labMilestone: 'Given an unfamiliar broken circuit board without documentation, trace input-to-output and locate defective component.',
        },
      ]
    }

    update('syllabus', template)
  }

  function submit() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Title required'
    if (!form.slug.trim()) e.slug = 'Slug required'
    else if (
      !isEdit &&
      existingSlugs.includes(form.slug.trim())
    )
      e.slug = 'Slug already exists'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onSave({
      ...form,
      category: form.category || 'General',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Course & Curriculum' : 'Add New Course'}
      width="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Core Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course Title *">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Mobile Phone Repair & Maintenance"
            />
            {errors.title && (
              <span className="text-xs text-destructive">{errors.title}</span>
            )}
          </Field>
          <Field label="URL Slug * (e.g. mobile-repair)">
            <input
              className={inputCls}
              value={form.slug}
              disabled={isEdit}
              onChange={(e) =>
                update(
                  'slug',
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                )
              }
              placeholder="mobile-repair"
            />
            {errors.slug && (
              <span className="text-xs text-destructive">{errors.slug}</span>
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Level">
            <input
              className={inputCls}
              value={form.level || ''}
              onChange={(e) => update('level', e.target.value || null)}
              placeholder="Beginner / Intermediate / Advanced"
            />
          </Field>
          <Field label="Duration">
            <input
              className={inputCls}
              value={form.duration || ''}
              onChange={(e) => update('duration', e.target.value || null)}
              placeholder="e.g. 3 months"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price">
            <input
              className={inputCls}
              value={form.price || ''}
              onChange={(e) => update('price', e.target.value || null)}
              placeholder="ETB 6,500 or Contact for details"
            />
          </Field>
          <Field label="Icon (emoji or short name)">
            <input
              className={inputCls}
              value={form.icon || ''}
              onChange={(e) => update('icon', e.target.value || null)}
              placeholder="📱 or Smartphone"
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              className={inputCls}
              value={form.sortOrder}
              onChange={(e) =>
                update('sortOrder', Number(e.target.value) || 0)
              }
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cover Image URL">
            <input
              className={inputCls}
              value={form.image || ''}
              onChange={(e) => update('image', e.target.value || null)}
              placeholder="https://... or /images/..."
            />
          </Field>
          <Field label="Status">
            <div className="flex h-11 items-center">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update('published', e.target.checked)}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-normal">Published on website</span>
              </label>
            </div>
          </Field>
        </div>

        <Field label="Short Description">
          <textarea
            rows={3}
            className={textareaCls}
            value={form.description || ''}
            onChange={(e) => update('description', e.target.value || null)}
            placeholder="1-2 sentences describing the course..."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Who This Course Is For">
            <textarea
              rows={2}
              className={textareaCls}
              value={form.audience || ''}
              onChange={(e) => update('audience', e.target.value || null)}
              placeholder="Beginners, technicians who want to upgrade..."
            />
          </Field>

          <Field label="Prerequisites">
            <textarea
              rows={2}
              className={textareaCls}
              value={form.prerequisites || ''}
              onChange={(e) => update('prerequisites', e.target.value || null)}
              placeholder="Basic electricity knowledge..."
            />
          </Field>
        </div>

        {/* Skills editor */}
        <div className="rounded-2xl border p-4 bg-muted/20">
          <label className="mb-1.5 flex flex-col gap-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Skills & Competencies Overview
          </label>
          <div className="mb-2 flex gap-2">
            <input
              className={`${inputCls} flex-1 text-xs`}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="Type a skill and press Enter or click Add"
            />
            <Button type="button" variant="outline" size="sm" onClick={addSkill}>
              Add
            </Button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── Curriculum & Syllabus Editor ─── */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Layers className="size-4 text-primary" />
                Course Curriculum & Practical Lab Milestones
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define the multi-module progression, lecture topics, and hands-on practical lab milestones.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadCurriculumTemplate}
                className="text-xs rounded-xl border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                <Sparkles className="size-3.5 mr-1.5 text-amber-500" />
                Load Template
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addModule}
                className="text-xs rounded-xl bg-primary"
              >
                <Plus className="size-3.5 mr-1.5" />
                Add Module
              </Button>
            </div>
          </div>

          {(!form.syllabus || form.syllabus.length === 0) ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-muted-foreground dark:border-slate-800">
              <Layers className="mx-auto mb-2 size-6 text-slate-400 opacity-60" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No syllabus modules defined yet</p>
              <p className="mt-1">Add modules manually or click "Load Template" to insert a standard practical curriculum.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.syllabus.map((mod, modIdx) => (
                <div
                  key={modIdx}
                  className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-card space-y-3.5"
                >
                  {/* Module Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        Module {modIdx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveModule(modIdx, 'up')}
                          disabled={modIdx === 0}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModule(modIdx, 'down')}
                          disabled={modIdx === (form.syllabus || []).length - 1}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeModule(modIdx)}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                    >
                      <Trash2 className="size-3.5" /> Remove Module
                    </button>
                  </div>

                  {/* Title & Duration */}
                  <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                    <Field label="Module Title *">
                      <input
                        className={inputCls}
                        value={mod.title}
                        onChange={(e) => updateModule(modIdx, 'title', e.target.value)}
                        placeholder="e.g. Module 1: DC Power Supply & Primary Rail Diagnostics"
                      />
                    </Field>
                    <Field label="Duration">
                      <input
                        className={inputCls}
                        value={mod.duration || ''}
                        onChange={(e) => updateModule(modIdx, 'duration', e.target.value)}
                        placeholder="e.g. 2 Weeks"
                      />
                    </Field>
                  </div>

                  {/* Description */}
                  <Field label="Module Summary / Scope">
                    <input
                      className={inputCls}
                      value={mod.description || ''}
                      onChange={(e) => updateModule(modIdx, 'description', e.target.value)}
                      placeholder="Short summary of lecture concepts and bench work..."
                    />
                  </Field>

                  {/* Lessons / Topics Tags */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Topics / Lessons Covered
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={`new-lesson-${modIdx}`}
                        className={`${inputCls} flex-1 text-xs`}
                        placeholder="Type lesson/topic and press Enter..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.currentTarget
                            addLesson(modIdx, input.value)
                            input.value = ''
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const el = document.getElementById(`new-lesson-${modIdx}`) as HTMLInputElement | null
                          if (el && el.value) {
                            addLesson(modIdx, el.value)
                            el.value = ''
                          }
                        }}
                        className="text-xs"
                      >
                        Add Topic
                      </Button>
                    </div>

                    {mod.lessons && mod.lessons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {mod.lessons.map((lesson, lIdx) => (
                          <span
                            key={lIdx}
                            className="inline-flex items-center gap-1 rounded-md border bg-muted/60 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200"
                          >
                            <span>{lesson}</span>
                            <button
                              type="button"
                              onClick={() => removeLesson(modIdx, lIdx)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Practical Lab Milestone */}
                  <div className="rounded-xl border border-amber-300/60 bg-amber-50/50 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1.5">
                      <Wrench className="size-3.5" /> Practical Lab Milestone (Hands-On Exam)
                    </div>
                    <input
                      className="h-9 w-full rounded-lg border border-amber-300/80 bg-white px-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-500 dark:border-amber-900 dark:bg-slate-900 dark:text-slate-100"
                      value={mod.labMilestone || ''}
                      onChange={(e) => updateModule(modIdx, 'labMilestone', e.target.value)}
                      placeholder="e.g. Isolate short to ground using voltage injection, locate thermal hotspot, and restore clean boot."
                    />
                    <p className="mt-1 text-[11px] text-amber-800/70 dark:text-amber-400/70">
                      The hands-on benchmark test that trainees must independently accomplish in the practical lab.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="gap-2 border-blue-500/30 text-xs text-blue-600 hover:bg-blue-50 dark:text-sky-400 dark:hover:bg-blue-950/30"
          >
            <Share2 className="size-3.5" />
            SEO & Social Preview
          </Button>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </div>

        {previewOpen && (
          <CourseSeoPreviewModal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            course={form}
          />
        )}
      </div>
    </Modal>
  )
}

/* ──────────────────────────────────────────────────────────────
/* ──────────────────────────────────────────────────────────────
   Library editor modal
   ────────────────────────────────────────────────────────────── */
function LibraryEditor({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean
  onClose: () => void
  initial: LibraryItem
  onSave: (data: LibraryItem) => void
  saving: boolean
}) {
  const [form, setForm] = useState<LibraryItem>({
    ...initial,
    category: initial.category || 'General',
  })
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null)
  const isEdit = !!initial.id

  useEffect(() => {
    let parsedLessons = []
    try {
      parsedLessons = typeof initial.lessons === 'string' ? JSON.parse(initial.lessons) : (initial.lessons || [])
    } catch {}
    let parsedChapters = []
    try {
      parsedChapters = typeof initial.chapters === 'string' ? JSON.parse(initial.chapters) : (initial.chapters || [])
    } catch {}

    const pETB = typeof initial.priceETB === 'number'
      ? initial.priceETB
      : parseInt(String(initial.price || '').replace(/[^0-9]/g, ''), 10) || 0

    setForm({
      ...initial,
      priceETB: pETB,
      price: initial.price || (pETB === 0 ? 'Free' : `${pETB} ETB`),
      subtitle: initial.subtitle || '',
      instructor: initial.instructor || 'Hello Technology Faculty',
      instructorRole: initial.instructorRole || 'Technical Instructor',
      rating: initial.rating ?? 4.9,
      reviewCount: initial.reviewCount ?? 100,
      badgeText: initial.badgeText || (pETB === 0 ? 'Free Gift' : 'Popular'),
      skillsLearned: initial.skillsLearned || '',
      lessons: parsedLessons,
      chapters: parsedChapters,
    })
  }, [initial, open])

  function update<K extends keyof LibraryItem>(k: K, v: LibraryItem[K]) {
    setForm((p) => {
      const next = { ...p, [k]: v }
      if (k === 'priceETB') {
        const val = Number(v) || 0
        next.price = val === 0 ? 'Free' : `${val} ETB`
      }
      return next
    })
  }

  // Lesson helpers for Video courses
  function addLesson() {
    const currentLessons = Array.isArray(form.lessons) ? [...form.lessons] : []
    const newLesson = {
      id: `les-${Date.now()}`,
      title: `Lesson ${currentLessons.length + 1}: Diagnostic Procedure & Bench Testing`,
      duration: '30 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      summary: 'Practical hands-on multimeter analysis and workbench demonstration.',
      labExercise: 'Execute diode mode voltage drop measurement on battery connector.',
      keyTakeaways: ['Power sequencing', 'Multimeter readings'],
    }
    update('lessons', [...currentLessons, newLesson])
  }

  function updateLesson(index: number, field: string, val: any) {
    const currentLessons = Array.isArray(form.lessons) ? [...form.lessons] : []
    if (!currentLessons[index]) return
    currentLessons[index] = { ...currentLessons[index], [field]: val }
    update('lessons', currentLessons)
  }

  function removeLesson(index: number) {
    const currentLessons = Array.isArray(form.lessons) ? [...form.lessons] : []
    currentLessons.splice(index, 1)
    update('lessons', currentLessons)
  }

  // Chapter helpers for Manuals & Guides
  function addChapter() {
    const currentChapters = Array.isArray(form.chapters) ? [...form.chapters] : []
    const newChapter = {
      id: `ch-${Date.now()}`,
      title: `Chapter ${currentChapters.length + 1}: Power Sequencing & Troubleshooting`,
      pageRange: `pp. ${currentChapters.length * 20 + 1}-${currentChapters.length * 20 + 20}`,
      summary: 'Schematic tracing, test point locations, and typical short-circuit symptoms.',
    }
    update('chapters', [...currentChapters, newChapter])
  }

  function updateChapter(index: number, field: string, val: any) {
    const currentChapters = Array.isArray(form.chapters) ? [...form.chapters] : []
    if (!currentChapters[index]) return
    currentChapters[index] = { ...currentChapters[index], [field]: val }
    update('chapters', currentChapters)
  }

  function removeChapter(index: number) {
    const currentChapters = Array.isArray(form.chapters) ? [...form.chapters] : []
    currentChapters.splice(index, 1)
    update('chapters', currentChapters)
  }

  function submit() {
    if (!form.title.trim()) return
    const pETB = typeof form.priceETB === 'number' ? form.priceETB : 0
    onSave({
      ...form,
      category: form.category || 'General',
      priceETB: pETB,
      price: form.price?.trim() || (pETB === 0 ? 'Free' : `${pETB} ETB`),
    })
  }

  const isVideoFormat =
    (form.format && form.format.toLowerCase().includes('video')) ||
    (form.category && form.category.toLowerCase().includes('video'))

  const lessonsList: any[] = Array.isArray(form.lessons) ? form.lessons : []
  const chaptersList: any[] = Array.isArray(form.chapters) ? form.chapters : []

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Online Course / Resource' : 'Add Online Course / Resource'}
      width="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Basic Resource Info */}
        <div className="rounded-2xl border bg-muted/20 p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            1. Resource Overview &amp; Categorization
          </h4>
          <Field label="Title *">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Complete Mobile Phone Hardware Diagnostic Manual"
            />
          </Field>

          <Field label="Subtitle / Tagline">
            <input
              className={inputCls}
              value={form.subtitle || ''}
              onChange={(e) => update('subtitle', e.target.value || null)}
              placeholder="e.g. Step-by-step schematics, multimeter board diagnosis, power IC & baseband repair"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Format">
              <select
                className={inputCls}
                value={form.format || 'Technical Repair Manual'}
                onChange={(e) => update('format', e.target.value || null)}
              >
                <option>Technical Repair Manual</option>
                <option>Video Masterclass</option>
                <option>Quick Reference Guide</option>
                <option>Schematic & Circuit Handbook</option>
                <option>Book</option>
                <option>PDF Guide</option>
              </select>
            </Field>
            <Field label="Level">
              <select
                className={inputCls}
                value={form.level || 'All Skill Levels'}
                onChange={(e) => update('level', e.target.value || null)}
              >
                <option>All Skill Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Intermediate to Advanced</option>
                <option>Advanced</option>
              </select>
            </Field>
            <Field label="Pages / Video Duration">
              <input
                className={inputCls}
                value={form.pages || ''}
                onChange={(e) => update('pages', e.target.value || null)}
                placeholder="e.g. 18 Lessons (14 Hours) or 128 Pages"
              />
            </Field>
          </div>
        </div>

        {/* Pricing, Commercial & Access */}
        <div className="rounded-2xl border bg-muted/20 p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            2. Live Pricing &amp; Access Controls
          </h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price in Birr (ETB) *">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="50"
                  className={inputCls}
                  value={form.priceETB ?? 0}
                  onChange={(e) => update('priceETB', Number(e.target.value) || 0)}
                  placeholder="e.g. 850 (0 for Free)"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-muted-foreground">
                  ETB
                </span>
              </div>
            </Field>

            <Field label="Display Price Label">
              <input
                className={inputCls}
                value={form.price || ''}
                onChange={(e) => update('price', e.target.value || null)}
                placeholder="e.g. 850 ETB or Free"
              />
            </Field>

            <Field label="Access Status">
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              >
                {LIBRARY_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Badge Text">
              <input
                className={inputCls}
                value={form.badgeText || ''}
                onChange={(e) => update('badgeText', e.target.value || null)}
                placeholder="e.g. Bestseller, Masterclass, Free Gift"
              />
            </Field>
            <Field label="Rating (1.0 - 5.0)">
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className={inputCls}
                value={form.rating ?? 4.9}
                onChange={(e) => update('rating', parseFloat(e.target.value) || 4.9)}
              />
            </Field>
            <Field label="Reviews Count">
              <input
                type="number"
                min="0"
                className={inputCls}
                value={form.reviewCount ?? 100}
                onChange={(e) => update('reviewCount', parseInt(e.target.value, 10) || 0)}
              />
            </Field>
          </div>
        </div>

        {/* Instructor & Accreditation */}
        <div className="rounded-2xl border bg-muted/20 p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            3. Author &amp; Instructor Faculty
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instructor / Author Name">
              <input
                className={inputCls}
                value={form.instructor || ''}
                onChange={(e) => update('instructor', e.target.value || null)}
                placeholder="e.g. Eng. Dawit Tadesse"
              />
            </Field>
            <Field label="Instructor Role / Title">
              <input
                className={inputCls}
                value={form.instructorRole || ''}
                onChange={(e) => update('instructorRole', e.target.value || null)}
                placeholder="e.g. Senior Hardware & BGA Diagnostic Specialist"
              />
            </Field>
          </div>
        </div>

        {/* Description & Technical Documentation Details */}
        <div className="space-y-4">
          <Field label="Description">
            <textarea
              rows={3}
              className={textareaCls}
              value={form.description || ''}
              onChange={(e) => update('description', e.target.value || null)}
              placeholder="Describe what students will learn, diagnostic skills acquired, and equipment covered..."
            />
          </Field>

          <Field label="Skills Learned (comma-separated)">
            <input
              className={inputCls}
              value={form.skillsLearned || ''}
              onChange={(e) => update('skillsLearned', e.target.value || null)}
              placeholder="e.g. Board Schematics, Multimeter Diagnostics, Short Circuit Hunting, BGA Soldering"
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground">
                DRM Document / PDF Manual URL
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline">
                <Upload className="size-3.5" /> Upload PDF Document
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const fd = new FormData()
                    fd.append('file', f)
                    fd.append('folder', 'manuals')
                    try {
                      setUploadingPdf(true)
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
                      const d = await res.json()
                      if (d.url) {
                        update('fileUrl', d.url)
                      } else {
                        alert(d.error || 'Failed to upload PDF')
                      }
                    } catch (err: any) {
                      alert(err.message || 'Error uploading file')
                    } finally {
                      setUploadingPdf(false)
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <input
                className={`${inputCls} flex-1`}
                value={form.fileUrl || ''}
                onChange={(e) => update('fileUrl', e.target.value || null)}
                placeholder="/uploads/manuals/... or https://..."
              />
              {uploadingPdf && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 px-3 py-2 bg-blue-500/10 rounded-xl">
                  <Loader2 className="size-4 animate-spin" /> Uploading PDF...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Curriculum Builder */}
        <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                {isVideoFormat ? <Video className="size-4 text-blue-600" /> : <BookOpen className="size-4 text-blue-600" />}
                {isVideoFormat ? 'Video Lessons Curriculum' : 'Manual Chapters & Diagnostic Sections'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isVideoFormat
                  ? 'Define the structured lessons students watch inside the secure DRM player.'
                  : 'Define the reading chapters and diagnostic tables students study inside the platform reader.'}
              </p>
            </div>
            {isVideoFormat ? (
              <Button size="sm" type="button" onClick={addLesson} className="gap-1.5 rounded-xl text-xs">
                <Plus className="size-3.5" /> Add Lesson
              </Button>
            ) : (
              <Button size="sm" type="button" onClick={addChapter} className="gap-1.5 rounded-xl text-xs">
                <Plus className="size-3.5" /> Add Chapter
              </Button>
            )}
          </div>

          {/* Video Lessons list */}
          {isVideoFormat && (
            <div className="space-y-3">
              {lessonsList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-3 text-center">
                  No lessons defined yet. Click &quot;Add Lesson&quot; to configure course videos.
                </p>
              ) : (
                lessonsList.map((les, idx) => (
                  <div key={les.id || idx} className="rounded-xl border bg-muted/30 p-3.5 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">
                        Lesson #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLesson(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition"
                        title="Remove lesson"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Lesson Title</label>
                        <input
                          className={inputCls + ' h-9 text-xs'}
                          value={les.title || ''}
                          onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                          placeholder="e.g. Identifying Short Circuits with Thermal Camera"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Duration</label>
                        <input
                          className={inputCls + ' h-9 text-xs'}
                          value={les.duration || ''}
                          onChange={(e) => updateLesson(idx, 'duration', e.target.value)}
                          placeholder="e.g. 42 min"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-muted-foreground block">
                            Video Embed / Stream URL
                          </label>
                          <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline">
                            <Upload className="size-3" /> Upload MP4 Video
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0]
                                if (!f) return
                                const fd = new FormData()
                                fd.append('file', f)
                                fd.append('folder', 'videos')
                                try {
                                  setUploadingVideoIdx(idx)
                                  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
                                  const d = await res.json()
                                  if (d.url) {
                                    updateLesson(idx, 'videoUrl', d.url)
                                  } else {
                                    alert(d.error || 'Failed to upload video')
                                  }
                                } catch (err: any) {
                                  alert(err.message || 'Error uploading video')
                                } finally {
                                  setUploadingVideoIdx(null)
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            className={inputCls + ' h-9 text-xs font-mono flex-1'}
                            value={les.videoUrl || ''}
                            onChange={(e) => updateLesson(idx, 'videoUrl', e.target.value)}
                            placeholder="https://... or /uploads/videos/..."
                          />
                          {uploadingVideoIdx === idx && (
                            <span className="flex items-center text-[11px] text-blue-600 whitespace-nowrap">
                              <Loader2 className="size-3 animate-spin mr-1" /> Uploading...
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Lab Practical Exercise</label>
                        <input
                          className={inputCls + ' h-9 text-xs'}
                          value={les.labExercise || ''}
                          onChange={(e) => updateLesson(idx, 'labExercise', e.target.value)}
                          placeholder="e.g. Measure voltage drop on battery terminal pins"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Chapters list for Manuals */}
          {!isVideoFormat && (
            <div className="space-y-3">
              {chaptersList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-3 text-center">
                  No chapters defined yet. Click &quot;Add Chapter&quot; to configure reading guide sections.
                </p>
              ) : (
                chaptersList.map((ch, idx) => (
                  <div key={ch.id || idx} className="rounded-xl border bg-muted/30 p-3.5 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">
                        Chapter #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeChapter(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition"
                        title="Remove chapter"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Chapter Title</label>
                        <input
                          className={inputCls + ' h-9 text-xs'}
                          value={ch.title || ''}
                          onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                          placeholder="e.g. Motherboard Power Rail Sequencing & Short Isolation"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Page Range</label>
                        <input
                          className={inputCls + ' h-9 text-xs'}
                          value={ch.pageRange || ''}
                          onChange={(e) => updateChapter(idx, 'pageRange', e.target.value)}
                          placeholder="e.g. pp. 1-28"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Summary &amp; Key Test Points</label>
                      <input
                        className={inputCls + ' h-9 text-xs'}
                        value={ch.summary || ''}
                        onChange={(e) => updateChapter(idx, 'summary', e.target.value)}
                        placeholder="e.g. Primary power rail diagnostics, buck converter inductors, VBUS line testing"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sort Order & Publishing Visibility */}
        <div className="grid gap-4 sm:grid-cols-2 items-center rounded-2xl border bg-muted/20 p-4">
          <Field label="Catalog Sort Order (lower numbers appear first)">
            <input
              type="number"
              className={inputCls}
              value={form.sortOrder}
              onChange={(e) => update('sortOrder', Number(e.target.value) || 0)}
            />
          </Field>
          <div>
            <Field label="Catalog Visibility">
              <div className="flex h-11 items-center">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => update('published', e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm font-semibold">
                    Visible in Public Catalog &amp; Student Dashboard
                  </span>
                </label>
              </div>
            </Field>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button variant="outline" onClick={onClose} disabled={saving} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving
              ? 'Saving Changes...'
              : isEdit
              ? 'Save & Synchronize Resource'
              : 'Create & Synchronize Resource'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

