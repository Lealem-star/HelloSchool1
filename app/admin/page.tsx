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
  ImageIcon,
  Folder,
  Users,
  UserCog,
  Check,
  KeyRound,
  Camera,
  Lock,
  Sparkles,
  Shield,
  Tag,
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
type GalleryItem = {
  id: string
  title: string
  description: string | null
  image: string
  published: boolean
  sortOrder: number
}
type LibraryItem = {
  id: string
  title: string
  category: string
  description: string | null
  format: string | null
  level: string | null
  status: string
  price: string | null
  pages: string | null
  fileUrl: string | null
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
type Category = {
  id: string
  name: string
  type: string
  sortOrder: number
  createdAt: string
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
  const [user, setUser] = useState<User | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<
    | 'registrations'
    | 'inquiries'
    | 'company-inquiries'
    | 'trusted-partners'
    | 'courses'
    | 'gallery'
    | 'library'
    | 'categories'
    | 'instructors'
    | 'facilities'
    | 'projects'
    | 'profile'
  >('registrations')
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

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

  // Gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null)

  // Library state
  const [library, setLibrary] = useState<LibraryItem[]>([])
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [editingLibrary, setEditingLibrary] = useState<LibraryItem | null>(null)

  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'course' | 'library'>('all')

  /* ─── Session check ─── */
  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((d) => d.user && setUser(d.user))
      .catch(() => {})
  }, [])

  /* ─── Load data on tab change ─── */
  useEffect(() => {
    if (!user) return
    loadCategories()
    loadRegistrations()
    loadInquiries()
    loadCompanyInquiries()
    loadTrustedPartners()
    if (tab === 'registrations') loadRegistrations()
    if (tab === 'inquiries') loadInquiries()
    if (tab === 'company-inquiries') loadCompanyInquiries()
    if (tab === 'trusted-partners') loadTrustedPartners()
    if (tab === 'courses') loadCourses()
    if (tab === 'gallery') loadGallery()
    if (tab === 'library') loadLibrary()
    if (tab === 'categories') {
      loadCategories()
      loadCourses()
      loadLibrary()
    }
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
  async function loadGallery() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gallery')
      const d = await res.json()
      if (res.ok) setGallery(d.items || [])
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
  async function loadCategories() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const d = await res.json()
      if (res.ok) setCategories(d.items || [])
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
      alert(e.message)
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
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteRegistration(id: string) {
    if (!confirm('Are you sure you want to permanently delete this registration record?')) return
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
      alert(e.message)
    } finally {
      setSavingId(null)
    }
  }

  async function bulkDeleteRegistrations(ids: string[]) {
    if (ids.length === 0) return
    if (!confirm(`Are you sure you want to delete ${ids.length} selected registration(s)?`)) return
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
      alert(e.message)
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
      alert(e.message)
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
      alert(e.message)
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
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Are you sure you want to delete this student inquiry?')) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setInquiries((p) => p.filter((i) => i.id !== id))
      loadInquiries()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSavingId(null)
    }
  }

  async function bulkDeleteInquiries(ids: string[]) {
    if (ids.length === 0) return
    if (!confirm(`Are you sure you want to delete ${ids.length} inquiries?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/inquiries?ids=${ids.join(',')}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Bulk delete failed')
      setInquiries((p) => p.filter((i) => !ids.includes(i.id)))
      loadInquiries()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  /* ─── Course operations ─── */
  function openNewCourse() {
    const defaultCat =
      categories.find((c) => c.type === 'course')?.name || 'Mobile Repair'
    setEditingCourse({
      id: '',
      slug: '',
      title: '',
      category: defaultCat,
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
        alert(d.error || 'Save failed')
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
    if (!confirm('Delete this course?')) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
      loadCourses()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Gallery operations ─── */
  function openNewGallery() {
    setEditingGallery({
      id: '',
      title: '',
      description: null,
      image: '',
      published: true,
      sortOrder: gallery.length,
    })
    setGalleryOpen(true)
  }
  function openEditGallery(g: GalleryItem) {
    setEditingGallery({ ...g })
    setGalleryOpen(true)
  }
  async function saveGallery(formData: GalleryItem) {
    setSavingId('gallery')
    try {
      const isNew = !editingGallery?.id
      const body = isNew ? { ...formData } : { ...formData, id: editingGallery!.id }
      const res = await fetch('/api/admin/gallery', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        alert(d.error || 'Save failed')
        return
      }
      setGalleryOpen(false)
      setEditingGallery(null)
      loadGallery()
    } finally {
      setSavingId(null)
    }
  }
  async function deleteGallery(id: string) {
    if (!confirm('Delete this gallery item?')) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
      loadGallery()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Library operations ─── */
  function openNewLibrary() {
    const defaultCat =
      categories.find((c) => c.type === 'library')?.name || 'PDF Guides'
    setEditingLibrary({
      id: '',
      title: '',
      category: defaultCat,
      description: null,
      format: 'PDF Guide',
      level: null,
      status: 'Coming Soon',
      price: null,
      pages: null,
      fileUrl: null,
      published: true,
      sortOrder: library.length,
    })
    setLibraryOpen(true)
  }
  function openEditLibrary(l: LibraryItem) {
    setEditingLibrary({ ...l })
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
        alert(d.error || 'Save failed')
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
    if (!confirm('Delete this library resource?')) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/library?id=${id}`, { method: 'DELETE' })
      loadLibrary()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Category operations ─── */
  function openNewCategory(defaultType?: 'course' | 'library') {
    const t = defaultType || (categoryTypeFilter !== 'all' ? categoryTypeFilter : 'course')
    setEditingCategory({
      id: '',
      name: '',
      type: t,
      sortOrder: categories.filter((c) => c.type === t).length,
      createdAt: '',
    })
    setCategoryOpen(true)
  }
  function openEditCategory(cat: Category) {
    setEditingCategory({ ...cat })
    setCategoryOpen(true)
  }
  async function saveCategory(formData: Category) {
    setSavingId('category')
    try {
      const isNew = !editingCategory?.id
      const body = isNew
        ? {
            name: formData.name.trim(),
            type: formData.type.trim(),
            sortOrder: Number(formData.sortOrder) || 0,
          }
        : {
            id: editingCategory!.id,
            name: formData.name.trim(),
            type: formData.type.trim(),
            sortOrder: Number(formData.sortOrder) || 0,
          }
      const res = await fetch('/api/admin/categories', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) {
        throw new Error(d.error || 'Save failed')
      }
      setCategoryOpen(false)
      setEditingCategory(null)
      loadCategories()
    } finally {
      setSavingId(null)
    }
  }
  async function deleteCategory(id: string) {
    const cat = categories.find((c) => c.id === id)
    const label = cat ? `"${cat.name}"` : 'this category'
    if (
      !confirm(
        `Are you sure you want to delete ${label}? Courses or digital library items using it will retain their text label, but it will be removed from navigation filters.`
      )
    )
      return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (!res.ok) {
        alert(d.error || 'Delete failed')
        return
      }
      loadCategories()
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
    if (!confirm('Are you sure you want to delete this instructor?')) return
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
    if (!confirm('Are you sure you want to delete this facility?')) return
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
    if (!confirm('Are you sure you want to delete this student project?')) return
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
    if (!confirm('Are you sure you want to delete this company inquiry?')) return
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
    if (!confirm('Are you sure you want to delete this partner?')) return
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
    if (tab === 'registrations') loadRegistrations()
    if (tab === 'inquiries') loadInquiries()
    if (tab === 'company-inquiries') loadCompanyInquiries()
    if (tab === 'trusted-partners') loadTrustedPartners()
    if (tab === 'courses') loadCourses()
    if (tab === 'gallery') loadGallery()
    if (tab === 'library') loadLibrary()
    if (tab === 'categories') {
      loadCategories()
      loadCourses()
      loadLibrary()
    }
    if (tab === 'instructors') loadInstructors()
    if (tab === 'facilities') loadFacilities()
    if (tab === 'projects') loadProjects()
  }

  /* ──────────────────────────────────────────────────────────
     LOGIN SCREEN
     ────────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-5">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/images/helloschool.jpg"
            alt="Hello TVET"
            className="h-16 w-auto rounded-xl object-contain bg-white/95 p-1 shadow-md"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin Portal</p>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <ShieldCheck className="size-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-white">Staff Login</h1>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to manage inquiries and content.
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
                placeholder="admin@emschool.edu.et"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                required
              />
            </Field>
            {loginError && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{loginError}</p>
            )}
            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-semibold"
            >
              {loggingIn ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Signing in...</>
              ) : (
                'Sign in'
              )}
            </Button>
            <p className="text-center text-xs text-slate-500">
              Default: admin@emschool.edu.et / admin123
            </p>
          </form>
        </div>
      </div>
    )
  }

  /* ──────────────────────────────────────────────────────────
     DASHBOARD
     ────────────────────────────────────────────────────────── */
  const navItems = [
    {
      id: 'registrations' as const,
      label: 'Registrations',
      icon: FileText,
      count: registrations.length,
      badge: regOverview.pending > 0 ? regOverview.pending : null,
    },
    { id: 'inquiries' as const, label: 'Student Inquiries', icon: Users, count: inquiries.length, badge: overview.new > 0 ? overview.new : null },
    {
      id: 'company-inquiries' as const,
      label: 'Company Training',
      icon: Building2,
      count: companyInquiries.length,
      badge: companyOverview.new > 0 ? companyOverview.new : null,
    },
    {
      id: 'trusted-partners' as const,
      label: 'Trusted Partners',
      icon: ShieldCheck,
      count: trustedPartners.length,
      badge: null,
    },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen, count: courses.length, badge: null },
    { id: 'library' as const, label: 'Library', icon: Folder, count: library.length, badge: null },
    { id: 'categories' as const, label: 'Categories', icon: Tag, count: categories.length, badge: null },
    { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon, count: gallery.length, badge: null },
    { id: 'instructors' as const, label: 'Instructors', icon: GraduationCap, count: instructors.length, badge: null },
    { id: 'facilities' as const, label: 'Facilities', icon: Wrench, count: facilities.length, badge: null },
    { id: 'projects' as const, label: 'Projects', icon: Cpu, count: projects.length, badge: null },
    { id: 'profile' as const, label: 'My Profile', icon: UserCog, count: 0, badge: null },
  ]

  const currentSection = navItems.find((n) => n.id === tab)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">

      {/* ── SIDEBAR ── */}
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900">

        {/* Logo area */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-5">
          <img
            src="/images/helloschool.jpg"
            alt="Hello TVET"
            className="h-10 w-auto rounded-lg object-contain bg-white/95 p-0.5"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white">Hello TVET</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin</span>
          </div>
        </div>

        {/* Nav section */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Content
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = tab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setTab(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`size-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge != null ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-slate-950">
                        {item.badge}
                      </span>
                    ) : item.count > 0 ? (
                      <span className={`text-xs font-medium ${active ? 'text-cyan-400/70' : 'text-slate-600'}`}>
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Quick stats divider */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Overview
            </p>
            <div className="flex flex-col gap-2 px-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Student Inquiries</span>
                <span className="font-semibold text-white">{overview.total}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Company Inquiries</span>
                <span className="font-semibold text-cyan-400">{companyOverview.total}</span>
              </div>
              {companyOverview.new > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">New Company Inquiries</span>
                  <span className="font-semibold text-amber-400">{companyOverview.new}</span>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Bottom user strip */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-8 shrink-0 rounded-full object-cover border border-cyan-400/40"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-400">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user.name || 'Admin'}</p>
              <p className="truncate text-[10px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-1.5">
            <a
              href="/"
              target="_blank"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="size-3" /> View site
            </a>
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
            >
              <LogOut className="size-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {currentSection && <currentSection.icon className="size-4 text-slate-400" />}
            <h1 className="text-base font-semibold text-slate-800 dark:text-white">
              {currentSection?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCurrent}
              disabled={loading}
              className="rounded-lg border-slate-200 text-slate-600 hover:text-slate-900"
            >
              <RefreshCw className={`mr-1.5 size-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-7">

          {/* ─── TAB: REGISTRATIONS ─── */}
          {tab === 'registrations' && (
            <RegistrationsView
              items={registrations}
              overview={regOverview}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={regStatusFilter}
              setStatusFilter={setRegStatusFilter}
              savingId={savingId}
              onUpdateStatus={updateRegistrationStatus}
              onBulkUpdateStatus={bulkUpdateRegistrationStatus}
              onDelete={deleteRegistration}
              onBulkDelete={bulkDeleteRegistrations}
              onSaveNotes={saveRegistrationNotes}
            />
          )}

          {/* ─── TAB: INQUIRIES ─── */}
          {tab === 'inquiries' && (
            <InquiriesView
              loading={loading}
              inquiries={inquiries}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              savingId={savingId}
              updateStatus={updateInquiryStatus}
              bulkUpdateStatus={bulkUpdateInquiryStatus}
              remove={deleteInquiry}
              bulkRemove={bulkDeleteInquiries}
              overview={overview}
            />
          )}

          {/* ─── TAB: COMPANY INQUIRIES ─── */}
          {tab === 'company-inquiries' && (
            <CompanyInquiriesView
              inquiries={companyInquiries}
              overview={companyOverview}
              loading={loading}
              search={search}
              setSearch={setSearch}
              statusFilter={companyStatusFilter}
              setStatusFilter={setCompanyStatusFilter}
              savingId={savingId}
              updateStatus={updateCompanyInquiryStatus}
              updateNotes={updateCompanyInquiryNotes}
              deleteInquiry={deleteCompanyInquiry}
              refresh={loadCompanyInquiries}
            />
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

          {/* ─── TAB: GALLERY ─── */}
          {tab === 'gallery' && (
            <ListView<GalleryItem>
              title="Training Gallery"
              subtitle="Manage practical workshop photos and captions"
              loading={loading}
              search={search}
              setSearch={setSearch}
              items={gallery}
              searchableFields={['title', 'description']}
              onAdd={openNewGallery}
              onEdit={openEditGallery}
              onDelete={deleteGallery}
              savingId={savingId}
              columns={[
                {
                  key: 'image',
                  label: 'Preview',
                  render: (v: any) => (
                    <img
                      src={String(v)}
                      alt=""
                      className="size-14 rounded-lg border object-cover"
                      onError={(e) =>
                        ((e.target as any).src =
                          'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/></svg>')
                      }
                    />
                  ),
                },
                { key: 'title', label: 'Title', className: 'font-semibold' },
                { key: 'description', label: 'Description' },
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
                      {v ? 'Live' : 'Hidden'}
                    </span>
                  ),
                },
                {
                  key: 'sortOrder',
                  label: 'Order',
                  className: 'text-center text-muted-foreground',
                },
              ]}
              addLabel="Add gallery item"
            />
          )}

          {/* ─── TAB: LIBRARY ─── */}
          {tab === 'library' && (
            <ListView<LibraryItem>
              title="Digital Library"
              subtitle="Manage guides, manuals, video courses and learning materials"
              loading={loading}
              search={search}
              setSearch={setSearch}
              items={library}
              searchableFields={['title', 'category', 'description', 'format', 'level']}
              onAdd={openNewLibrary}
              onEdit={openEditLibrary}
              onDelete={deleteLibrary}
              savingId={savingId}
              columns={[
                { key: 'title', label: 'Title', className: 'font-semibold' },
                { key: 'category', label: 'Category' },
                { key: 'format', label: 'Format' },
                { key: 'level', label: 'Level' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (v) => (
                    <span
                      className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${
                        v === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : v === 'Coming Soon'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {String(v)}
                    </span>
                  ),
                },
                { key: 'price', label: 'Price' },
                {
                  key: 'sortOrder',
                  label: 'Order',
                  className: 'text-center text-muted-foreground',
                },
              ]}
              addLabel="Add library resource"
            />
          )}

          {/* ─── TAB: CATEGORIES ─── */}
          {tab === 'categories' && (
            <CategoriesView
              categories={categories}
              courses={courses}
              library={library}
              loading={loading}
              search={search}
              setSearch={setSearch}
              typeFilter={categoryTypeFilter}
              setTypeFilter={setCategoryTypeFilter}
              onAdd={() => openNewCategory()}
              onEdit={openEditCategory}
              onDelete={deleteCategory}
              savingId={savingId}
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
          categoryOptions={categories.filter((c) => c.type === 'course').map((c) => c.name)}
        />
      )}
      {editingGallery && (
        <GalleryEditor
          open={galleryOpen}
          onClose={() => {
            setGalleryOpen(false)
            setEditingGallery(null)
          }}
          initial={editingGallery}
          onSave={saveGallery}
          saving={savingId === 'gallery'}
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
          categoryOptions={categories.filter((c) => c.type === 'library').map((c) => c.name)}
        />
      )}
      {editingCategory && (
        <CategoryEditor
          open={categoryOpen}
          onClose={() => {
            setCategoryOpen(false)
            setEditingCategory(null)
          }}
          initial={editingCategory}
          onSave={saveCategory}
          saving={savingId === 'category'}
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

  async function handleFileUpload(file: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarMsg({ type: 'err', text: 'Please select a valid image file (JPG, PNG, WebP, GIF)' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ type: 'err', text: 'File size must be under 5MB' })
      return
    }

    setAvatarMsg(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'avatars')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      await saveAvatar(data.url)
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
    'h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

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
                  className="size-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl font-bold text-cyan-500 border border-cyan-400/30">
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
                <span className="rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-500 border border-cyan-400/20">
                  {user.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-1 text-[11px] text-slate-500">Account ID: {user.id}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 sm:text-right">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Session Status</p>
            <p className="mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium">● Active & Protected</p>
            <p className="mt-1 text-[10px] text-slate-400">Sliding 8-hr TTL token</p>
          </div>
        </div>
      </div>

      {/* ── Avatar & Profile Picture Card ── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-cyan-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Profile Photo & Avatar
            </h3>
          </div>
          {user.avatarUrl && (
            <button
              type="button"
              onClick={() => saveAvatar(null)}
              disabled={avatarSaving || uploading}
              className="text-xs font-semibold text-rose-500 hover:underline disabled:opacity-50"
            >
              Reset to initials
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Upload your technician picture, pick a preset avatar, or enter an image link.
        </p>

        {/* ── Direct File Upload Drag & Drop Zone ── */}
        <div className="mt-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = ''
            }}
          />

          <div
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
            onClick={() => fileInputRef.current?.click()}
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition ${
              dragOver
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-slate-200 bg-slate-50/60 hover:border-cyan-400/60 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-cyan-400/40'
            }`}
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 transition group-hover:scale-105 dark:text-cyan-400">
              {uploading || avatarSaving ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <Upload className="size-6" />
              )}
            </div>
            <p className="mt-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {uploading ? 'Uploading and optimizing photo...' : 'Click to upload or drag & drop photo'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Supports PNG, JPG, WebP or GIF up to 5MB (Stored in server uploads)
            </p>
          </div>
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
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="size-full object-cover" />
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-cyan-900/40 text-white">
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
          <Shield className="size-4 text-cyan-500" />
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
                href={`mailto:${inquiry.email}?subject=Hello TVET Enrollment Inquiry - ${inquiry.course || 'Technical Training'}`}
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
            onClick={() => {
              if (confirm('Delete this inquiry permanently?')) {
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
                            className="inline-flex items-center rounded-lg border border-cyan-500/30 p-2 text-cyan-600 transition hover:bg-cyan-500/10 dark:text-cyan-400"
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
  categoryOptions = [],
}: {
  open: boolean
  onClose: () => void
  initial: Course
  onSave: (data: Course) => void
  saving: boolean
  existingSlugs: string[]
  categoryOptions?: string[]
}) {
  const [form, setForm] = useState<Course>({
    ...initial,
    skills: initial.skills || [],
    syllabus: initial.syllabus || [],
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!initial.id

  const defaultCourseCats = [
    'Mobile Repair',
    'Computer Repair',
    'General Electronics',
    'TV Repair',
    'Business & Management',
    'Short Course',
  ]
  const availableCats = Array.from(
    new Set([
      ...(categoryOptions.length > 0 ? categoryOptions : defaultCourseCats),
      form.category,
    ].filter(Boolean))
  )

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
    if (!form.category.trim()) e.category = 'Category required'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onSave(form)
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

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category *">
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              {availableCats.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-xs text-destructive">
                {errors.category}
              </span>
            )}
          </Field>
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
                Define the multi-module progression, lecture topics, and hands-on workbench milestones.
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
                  className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 space-y-3.5"
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
                      <Wrench className="size-3.5" /> Practical Lab Milestone (Workbench Exam)
                    </div>
                    <input
                      className="h-9 w-full rounded-lg border border-amber-300/80 bg-white px-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-500 dark:border-amber-900 dark:bg-slate-900 dark:text-slate-100"
                      value={mod.labMilestone || ''}
                      onChange={(e) => updateModule(modIdx, 'labMilestone', e.target.value)}
                      placeholder="e.g. Isolate short to ground using voltage injection, locate thermal hotspot, and restore clean boot."
                    />
                    <p className="mt-1 text-[11px] text-amber-800/70 dark:text-amber-400/70">
                      The hands-on benchmark test that trainees must independently accomplish on their workbench.
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
            className="gap-2 border-cyan-500/30 text-xs text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
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
   Gallery editor modal
   ────────────────────────────────────────────────────────────── */
function GalleryEditor({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean
  onClose: () => void
  initial: GalleryItem
  onSave: (data: GalleryItem) => void
  saving: boolean
}) {
  const [form, setForm] = useState<GalleryItem>(initial)
  const isEdit = !!initial.id

  useEffect(() => {
    setForm(initial)
  }, [initial, open])

  function update<K extends keyof GalleryItem>(k: K, v: GalleryItem[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  function submit() {
    if (!form.title.trim() || !form.image.trim()) return
    onSave(form)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Gallery Item' : 'Add Gallery Item'}
    >
      <div className="space-y-5">
        {form.image && (
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Preview
            </p>
            <img
              src={form.image}
              alt="Preview"
              className="max-h-60 w-full rounded-2xl border object-cover"
              onError={(e) =>
                ((e.target as any).style.display = 'none')
              }
            />
          </div>
        )}
        <Field label="Title *">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Workshop activity title"
          />
        </Field>
        <Field label="Image URL *">
          <input
            className={inputCls}
            value={form.image}
            onChange={(e) => update('image', e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </Field>
        <Field label="Description / Caption">
          <textarea
            rows={3}
            className={textareaCls}
            value={form.description || ''}
            onChange={(e) => update('description', e.target.value || null)}
            placeholder="What does this photo show?"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Field label="Status">
            <div className="flex h-11 items-center">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update('published', e.target.checked)}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-normal">Visible on website</span>
              </label>
            </div>
          </Field>
        </div>
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving
              ? 'Saving...'
              : isEdit
              ? 'Save Changes'
              : 'Create Gallery Item'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ──────────────────────────────────────────────────────────────
   Library editor modal
   ────────────────────────────────────────────────────────────── */
function LibraryEditor({
  open,
  onClose,
  initial,
  onSave,
  saving,
  categoryOptions = [],
}: {
  open: boolean
  onClose: () => void
  initial: LibraryItem
  onSave: (data: LibraryItem) => void
  saving: boolean
  categoryOptions?: string[]
}) {
  const [form, setForm] = useState<LibraryItem>(initial)
  const isEdit = !!initial.id

  const defaultLibCats = [
    'PDF Guides',
    'Video Courses',
    'Schematics',
    'Tools & Equipment',
    'Reference Books',
  ]
  const availableCats = Array.from(
    new Set([
      ...(categoryOptions.length > 0 ? categoryOptions : defaultLibCats),
      form.category,
    ].filter(Boolean))
  )

  useEffect(() => {
    setForm(initial)
  }, [initial, open])

  function update<K extends keyof LibraryItem>(k: K, v: LibraryItem[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  function submit() {
    if (!form.title.trim() || !form.category.trim()) return
    onSave(form)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Library Resource' : 'Add Library Resource'}
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Mobile Repair Complete Handbook"
            />
          </Field>
          <Field label="Category *">
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              {availableCats.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Format">
            <select
              className={inputCls}
              value={form.format || ''}
              onChange={(e) => update('format', e.target.value || null)}
            >
              <option value="">Select...</option>
              <option>PDF Guide</option>
              <option>Video Course</option>
              <option>Schematic Set</option>
              <option>Book</option>
              <option>Handouts</option>
            </select>
          </Field>
          <Field label="Level">
            <select
              className={inputCls}
              value={form.level || ''}
              onChange={(e) => update('level', e.target.value || null)}
            >
              <option value="">Select...</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All Levels</option>
            </select>
          </Field>
          <Field label="Pages / Length">
            <input
              className={inputCls}
              value={form.pages || ''}
              onChange={(e) => update('pages', e.target.value || null)}
              placeholder="80 pages or 5 hrs"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
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
          <Field label="Price">
            <input
              className={inputCls}
              value={form.price || ''}
              onChange={(e) => update('price', e.target.value || null)}
              placeholder="Free or ETB 450"
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
        <Field label="Description">
          <textarea
            rows={3}
            className={textareaCls}
            value={form.description || ''}
            onChange={(e) => update('description', e.target.value || null)}
            placeholder="Describe this resource..."
          />
        </Field>
        <Field label="Download / File URL (once available)">
          <input
            className={inputCls}
            value={form.fileUrl || ''}
            onChange={(e) => update('fileUrl', e.target.value || null)}
            placeholder="https://.../download.pdf"
          />
        </Field>
        <div>
          <Field label="Visibility">
            <div className="flex h-11 items-center">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update('published', e.target.checked)}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-normal">Visible in catalog</span>
              </label>
            </div>
          </Field>
        </div>
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving
              ? 'Saving...'
              : isEdit
              ? 'Save Changes'
              : 'Create Resource'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ──────────────────────────────────────────────────────────────
   Categories View
   ────────────────────────────────────────────────────────────── */
function CategoriesView({
  categories,
  courses,
  library,
  loading,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  onAdd,
  onEdit,
  onDelete,
  savingId,
}: {
  categories: Category[]
  courses: Course[]
  library: LibraryItem[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  typeFilter: 'all' | 'course' | 'library'
  setTypeFilter: (v: 'all' | 'course' | 'library') => void
  onAdd: (defaultType?: 'course' | 'library') => void
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  savingId: string | null
}) {
  const courseCount = useMemo(
    () => categories.filter((c) => c.type === 'course').length,
    [categories]
  )
  const libraryCount = useMemo(
    () => categories.filter((c) => c.type === 'library').length,
    [categories]
  )

  const filtered = useMemo(() => {
    return categories
      .filter((c) => {
        if (typeFilter !== 'all' && c.type !== typeFilter) return false
        if (!search.trim()) return true
        return c.name.toLowerCase().includes(search.toLowerCase())
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [categories, typeFilter, search])

  return (
    <div>
      {/* ── Overview Stat Cards ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Categories</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{categories.length}</p>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Live sync
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 shadow-sm dark:border-cyan-900/40 dark:bg-cyan-950/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Course Categories</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{courseCount}</p>
            <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300">
              Courses catalog
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Library Categories</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{libraryCount}</p>
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              Digital Library
            </span>
          </div>
        </div>
      </div>

      {/* ── Toolbar & Filters ── */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Category Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage course and digital library categories dynamically. Changes sync immediately with public catalog filters.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="h-9 w-52 rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex rounded-lg border bg-muted/40 p-0.5 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                typeFilter === 'all'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({categories.length})
            </button>
            <button
              onClick={() => setTypeFilter('course')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                typeFilter === 'course'
                  ? 'bg-card text-cyan-600 shadow-sm dark:text-cyan-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Courses ({courseCount})
            </button>
            <button
              onClick={() => setTypeFilter('library')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                typeFilter === 'library'
                  ? 'bg-card text-purple-600 shadow-sm dark:text-purple-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Library ({libraryCount})
            </button>
          </div>

          {/* Add Category Button */}
          <Button
            onClick={() => onAdd()}
            className="rounded-lg bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <Plus className="mr-1.5 size-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Tag className="size-6" />
            </span>
            <p className="font-semibold text-slate-800 dark:text-white">No categories found</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              {search
                ? `No categories match "${search}". Try clearing your search term.`
                : 'No categories currently configured in this section.'}
            </p>
            <div className="mt-4 flex gap-2">
              {search && (
                <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
              <Button size="sm" onClick={() => onAdd()}>
                <Plus className="mr-1.5 size-3.5" /> Create category
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-6 py-3.5">Section</th>
                  <th className="px-6 py-3.5 text-center">Display Order</th>
                  <th className="px-6 py-3.5">Assigned Items</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((cat) => {
                  const assignedCount =
                    cat.type === 'course'
                      ? courses.filter((c) => c.category === cat.name).length
                      : library.filter((l) => l.category === cat.name).length

                  return (
                    <tr
                      key={cat.id}
                      className="group transition hover:bg-muted/40"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <Tag className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{cat.name}</p>
                            <p className="text-[11px] text-muted-foreground">ID: {cat.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Section */}
                      <td className="px-6 py-4">
                        {cat.type === 'course' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-800/60 dark:bg-cyan-950/40 dark:text-cyan-300">
                            <BookOpen className="size-3 text-cyan-600 dark:text-cyan-400" />
                            Course Catalog
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-800 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300">
                            <Folder className="size-3 text-purple-600 dark:text-purple-400" />
                            Digital Library
                          </span>
                        )}
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                          #{cat.sortOrder}
                        </span>
                      </td>

                      {/* Assigned Items */}
                      <td className="px-6 py-4">
                        {assignedCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {assignedCount} {cat.type === 'course' ? (assignedCount === 1 ? 'course' : 'courses') : (assignedCount === 1 ? 'resource' : 'resources')}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            0 items assigned
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(cat)}
                            className="h-8 px-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            title="Edit Category"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(cat.id)}
                            disabled={savingId === cat.id}
                            className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                            title="Delete Category"
                          >
                            {savingId === cat.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Category Editor Modal
   ────────────────────────────────────────────────────────────── */
function CategoryEditor({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean
  onClose: () => void
  initial: Category
  onSave: (data: Category) => Promise<void> | void
  saving: boolean
}) {
  const [name, setName] = useState(initial.name)
  const [type, setType] = useState(initial.type || 'course')
  const [sortOrder, setSortOrder] = useState(initial.sortOrder ?? 0)
  const [formError, setFormError] = useState<string | null>(null)
  const isEdit = !!initial.id

  useEffect(() => {
    setName(initial.name)
    setType(initial.type || 'course')
    setSortOrder(initial.sortOrder ?? 0)
    setFormError(null)
  }, [initial, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    const trimmed = name.trim()
    if (!trimmed || trimmed.length < 2) {
      setFormError('Category name must be at least 2 characters long.')
      return
    }
    try {
      await onSave({
        ...initial,
        name: trimmed,
        type,
        sortOrder: Number(sortOrder) || 0,
      })
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add New Category'}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            <p className="flex-1">{formError}</p>
          </div>
        )}

        <Field label="Category Name *">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (formError) setFormError(null)
            }}
            placeholder="e.g. Micro-Soldering & BGA"
            required
            autoFocus
          />
          <span className="text-xs text-muted-foreground">
            Unique name as displayed in navigation tabs and filter pills.
          </span>
        </Field>

        <Field label="Catalog Section *">
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setType('course')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition ${
                type === 'course'
                  ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/20 dark:border-cyan-400 dark:bg-cyan-950/30'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <BookOpen className="size-4 text-cyan-500" />
                <span>Course Catalog</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                For training courses, practical workshops & syllabus
              </p>
            </button>

            <button
              type="button"
              onClick={() => setType('library')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition ${
                type === 'library'
                  ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20 dark:border-purple-400 dark:bg-purple-950/30'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Folder className="size-4 text-purple-500" />
                <span>Digital Library</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                For downloadable PDFs, manuals, schematics & videos
              </p>
            </button>
          </div>
        </Field>

        <Field label="Display Sort Order">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
          />
          <span className="text-xs text-muted-foreground">
            Lower numbers appear first in the catalog filter tabs (e.g. 0, 1, 2).
          </span>
        </Field>

        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
