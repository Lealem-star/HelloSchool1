'use client'

import { useEffect, useState, useMemo } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteShell } from '@/components/site'

/* ──────────────────────────────────────────────────────────────
   Shared types
   ────────────────────────────────────────────────────────────── */
type Inquiry = {
  id: string
  studentName: string
  email: string | null
  phone: string
  course: string | null
  preferredContact: string | null
  experience: string | null
  status: string
  createdAt: string
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
type User = { id: string; email: string; role: string; name: string | null }

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  Converted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Archived: 'bg-slate-100 text-slate-600 border-slate-200',
}

const LIBRARY_STATUS = ['Coming Soon', 'Available', 'Draft']
const INQUIRY_STATUS = ['New', 'Contacted', 'Converted', 'Archived']

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
  const [tab, setTab] = useState<'inquiries' | 'courses' | 'gallery' | 'library'>(
    'inquiries'
  )
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [overview, setOverview] = useState({ total: 0, new: 0, converted: 0 })
  const [statusFilter, setStatusFilter] = useState('All')

  // Courses state
  const [courses, setCourses] = useState<Course[]>([])
  const [courseOpen, setCourseOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Gallery state
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null)

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

  /* ─── Load data on tab change ─── */
  useEffect(() => {
    if (!user) return
    if (tab === 'inquiries') loadInquiries()
    if (tab === 'courses') loadCourses()
    if (tab === 'gallery') loadGallery()
    if (tab === 'library') loadLibrary()
  }, [user, tab, statusFilter])

  /* ─── Loaders ─── */
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
        setOverview(d.overview || { total: 0, new: 0, converted: 0 })
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

  /* ─── Inquiry operations ─── */
  async function updateInquiryStatus(id: string, status: string) {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setInquiries((p) => p.map((i) => (i.id === id ? { ...i, status } : i)))
        if (status === 'New' || status === 'Converted') loadInquiries()
      }
    } finally {
      setSavingId(null)
    }
  }
  async function deleteInquiry(id: string) {
    if (!confirm('Delete this inquiry?')) return
    setSavingId(id)
    try {
      await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' })
      setInquiries((p) => p.filter((i) => i.id !== id))
      loadInquiries()
    } finally {
      setSavingId(null)
    }
  }

  /* ─── Course operations ─── */
  function openNewCourse() {
    setEditingCourse({
      id: '',
      slug: '',
      title: '',
      category: 'Mobile Repair',
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
    setEditingLibrary({
      id: '',
      title: '',
      category: 'PDF Guides',
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

  /* ─── Shared refresh per tab ─── */
  function refreshCurrent() {
    if (tab === 'inquiries') loadInquiries()
    if (tab === 'courses') loadCourses()
    if (tab === 'gallery') loadGallery()
    if (tab === 'library') loadLibrary()
  }

  /* ──────────────────────────────────────────────────────────
     LOGIN SCREEN
     ────────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <SiteShell>
        <main className="container mx-auto flex max-w-md flex-col items-center px-5 py-24">
          <div className="w-full rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-8" />
              </span>
              <h1 className="mt-5 text-2xl font-bold">Staff Login</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to manage inquiries and content.
              </p>
            </div>
            <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="admin@emschool.edu.et"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </Field>
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <Button type="submit" disabled={loggingIn} className="w-full">
                {loggingIn ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Default: admin@emschool.edu.et / admin123
              </p>
            </form>
          </div>
        </main>
      </SiteShell>
    )
  }

  /* ──────────────────────────────────────────────────────────
     DASHBOARD
     ────────────────────────────────────────────────────────── */
  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 size-4" /> Back to website
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCurrent}
              disabled={loading}
              className="rounded-lg"
            >
              <RefreshCw
                className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-lg"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats (always inquiry overview on top) */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Inquiries
            </p>
            <p className="mt-2 text-3xl font-bold">{overview.total}</p>
          </div>
          <div className="rounded-2xl border bg-blue-50/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              New
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {overview.new}
            </p>
          </div>
          <div className="rounded-2xl border bg-emerald-50/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Converted
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {overview.converted}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap gap-2 border-b pb-1">
          {(
            [
              { id: 'inquiries', label: 'Inquiries', icon: Users, count: inquiries.length },
              { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: gallery.length },
              { id: 'library', label: 'Library', icon: Folder, count: library.length },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === t.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  tab === t.id
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

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
            remove={deleteInquiry}
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
      </main>

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
        />
      )}
    </SiteShell>
  )
}

/* ──────────────────────────────────────────────────────────────
   Inquiries table view
   ────────────────────────────────────────────────────────────── */
function InquiriesView(props: {
  loading: boolean
  inquiries: Inquiry[]
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  savingId: string | null
  updateStatus: (id: string, status: string) => void
  remove: (id: string) => void
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
    remove,
  } = props

  const filtered = useMemo(
    () =>
      inquiries.filter((i) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          i.studentName.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          (i.email || '').toLowerCase().includes(q) ||
          (i.course || '').toLowerCase().includes(q)
        )
      }),
    [inquiries, search]
  )

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">Student Inquiries</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email, course"
              className="h-10 w-72 rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {['All', ...INQUIRY_STATUS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                statusFilter === s
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Course</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    <Loader2 className="mx-auto mb-3 size-6 animate-spin" />
                    Loading inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr
                    key={i.id}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold">{i.studentName}</p>
                      {i.email && (
                        <p className="text-xs text-muted-foreground">
                          {i.email}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {i.course || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{i.phone}</p>
                      {i.preferredContact && (
                        <p className="text-xs text-muted-foreground">
                          Pref: {i.preferredContact}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={i.status}
                        onChange={(e) => updateStatus(i.id, e.target.value)}
                        disabled={savingId === i.id}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                          STATUS_COLORS[i.status] ||
                          'border-slate-200 bg-slate-50'
                        } disabled:opacity-60`}
                      >
                        {INQUIRY_STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => remove(i.id)}
                        disabled={savingId === i.id}
                        className="inline-flex items-center rounded-lg border border-destructive/30 p-2 text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                        title="Delete"
                      >
                        {savingId === i.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
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
  const [form, setForm] = useState<Course>(initial)
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!initial.id

  useEffect(() => {
    setForm(initial)
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
      title={isEdit ? 'Edit Course' : 'Add New Course'}
      width="max-w-4xl"
    >
      <div className="space-y-5">
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
              <option>Mobile Repair</option>
              <option>Computer Repair</option>
              <option>General Electronics</option>
              <option>TV Repair</option>
              <option>Business &amp; Management</option>
              <option>Short Course</option>
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

        {/* Skills editor */}
        <div>
          <label className="mb-1.5 flex flex-col gap-1.5 text-sm font-medium">
            Skills You Will Learn (one per entry)
          </label>
          <div className="mb-2 flex gap-2">
            <input
              className={`${inputCls} flex-1`}
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
            <Button type="button" variant="outline" onClick={addSkill}>
              Add
            </Button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs font-medium"
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

        <div className="flex justify-end gap-3 border-t pt-5">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
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
}: {
  open: boolean
  onClose: () => void
  initial: LibraryItem
  onSave: (data: LibraryItem) => void
  saving: boolean
}) {
  const [form, setForm] = useState<LibraryItem>(initial)
  const isEdit = !!initial.id

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
              <option>PDF Guides</option>
              <option>Video Courses</option>
              <option>Schematics</option>
              <option>Tools &amp; Equipment</option>
              <option>Reference Books</option>
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
