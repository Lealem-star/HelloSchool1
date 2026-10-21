'use client'

import React, { useState, useMemo } from 'react'
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  BookOpen,
  Phone,
  UserCheck,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Download,
  X,
  Eye,
  LayoutList,
  LayoutGrid,
  Send,
  FileSpreadsheet,
  Tag,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/ui/dialog-modal'

export interface BatchRegistrationItem {
  id: string
  registrationNumber: string
  fullName: string
  phone: string
  email?: string | null
  courseTitle: string
  shift: string
  status: string
  finalPrice?: number
  createdAt: string
}

export interface CourseBreakdownItem {
  courseTitle: string
  studentCount: number
  students: BatchRegistrationItem[]
}

export interface BatchItem {
  id: string
  batchNumber: string // e.g. "Batch 01", "Batch 02"
  title: string
  description?: string | null
  startDate?: string | null
  endDate?: string | null
  registrationDeadline?: string | null
  status: 'Open' | 'Active' | 'Completed' | 'Upcoming'
  capacity: number
  campus: string
  notes?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  registrations: BatchRegistrationItem[]
  enrolledCount: number
  courseBreakdown: CourseBreakdownItem[]
  shiftBreakdown: { shift: string; count: number }[]
}

export interface BatchOverview {
  totalBatches: number
  openBatches: number
  activeBatches: number
  completedBatches: number
  upcomingBatches: number
  totalEnrolledTrainees: number
}

export interface CandidateStudent {
  id: string
  registrationNumber: string
  fullName: string
  phone: string
  email?: string | null
  courseTitle: string
  shift: string
  status: string
  batchId?: string | null
}

export interface CourseMeta {
  id?: string
  title: string
  category?: string
  level?: string | null
  price?: string | null
}

const COMMON_SHIFTS = [
  'Morning (8:30 AM - 12:30 PM)',
  'Afternoon (1:30 PM - 5:30 PM)',
  'Evening (6:00 PM - 8:30 PM)',
  'Weekend Intensive',
]

const BATCH_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  Open: {
    label: 'Open for Enrollment',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  Active: {
    label: 'In Training / In Progress',
    badge: 'bg-[#155DFC]/15 text-[#155DFC] dark:text-sky-300 border border-[#155DFC]/30',
    dot: 'bg-[#155DFC]',
  },
  Upcoming: {
    label: 'Upcoming / Opening Soon',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-500',
  },
  Completed: {
    label: 'Completed / Graduated',
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30',
    dot: 'bg-slate-400',
  },
}

function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) return '251' + digits.slice(1)
  if (digits.startsWith('251')) return digits
  return '251' + digits
}

function exportBatchRosterCSV(batch: BatchItem) {
  const headers = [
    '#',
    'Batch Code',
    'Student Name',
    'Registration Number',
    'Course Track',
    'Shift',
    'Phone',
    'Status',
    'Enrollment Date',
  ]

  const rows = (batch.registrations || []).map((r, i) => [
    i + 1,
    `"${batch.batchNumber}"`,
    `"${r.fullName || ''}"`,
    `"${r.registrationNumber || ''}"`,
    `"${r.courseTitle || ''}"`,
    `"${r.shift || ''}"`,
    `"${r.phone || ''}"`,
    `"${r.status || 'Enrolled'}"`,
    `"${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${batch.batchNumber.replace(/\s+/g, '_')}_Student_Roster.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function AdminBatchView({
  batches,
  overview,
  courses = [],
  coursesList = [],
  candidateStudents = [],
  loading,
  refresh,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  onAssignToBatch,
  onRemoveFromBatch,
}: {
  batches: BatchItem[]
  overview: BatchOverview
  courses?: string[]
  coursesList?: CourseMeta[]
  candidateStudents: CandidateStudent[]
  loading: boolean
  refresh: () => void
  onCreateBatch: (data: Partial<BatchItem>) => Promise<boolean>
  onUpdateBatch: (data: Partial<BatchItem> & { id: string }) => Promise<boolean>
  onDeleteBatch: (id: string) => Promise<boolean>
  onAssignToBatch: (data: {
    batchId: string
    registrationId?: string
    studentName?: string
    phone?: string
    email?: string
    city?: string
    telegramUsername?: string
    password?: string
    courseTitle: string
    shift: string
    status?: string
  }) => Promise<boolean>
  onRemoveFromBatch: (registrationId: string) => Promise<boolean>
}) {
  const { confirm } = useConfirm()
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedCourse, setSelectedCourse] = useState<string>('All')
  const [viewLayout, setViewLayout] = useState<'list' | 'cards'>('list')

  // Modals state
  const [viewingBatch, setViewingBatch] = useState<BatchItem | null>(null)
  const [batchModalOpen, setBatchModalOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [targetBatch, setTargetBatch] = useState<BatchItem | null>(null)
  const [targetCourse, setTargetCourse] = useState<string>('')
  const [targetShift, setTargetShift] = useState<string>('')
  const [savingAction, setSavingAction] = useState(false)

  // Card view mode per batch in cards mode: 'course' | 'shift'
  const [cardViewModes, setCardViewModes] = useState<Record<string, 'course' | 'shift'>>({})
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({})

  // Course Category Lookup Map
  const courseCategoryMap = useMemo(() => {
    const map: Record<string, string> = {}
    coursesList.forEach((c) => {
      if (c.title && c.category) {
        map[c.title.trim().toLowerCase()] = c.category
      }
    })
    return map
  }, [coursesList])

  const toggleCourseExpand = (key: string) => {
    setExpandedCourses((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleBatchMode = (batchId: string) => {
    setCardViewModes((prev) => ({
      ...prev,
      [batchId]: prev[batchId] === 'shift' ? 'course' : 'shift',
    }))
  }

  // All distinct courses
  const allCourses = useMemo(() => {
    const set = new Set<string>(courses)
    batches.forEach((b) =>
      b.courseBreakdown?.forEach((cb) => cb.courseTitle && set.add(cb.courseTitle))
    )
    candidateStudents.forEach((cs) => cs.courseTitle && set.add(cs.courseTitle))
    coursesList.forEach((cl) => cl.title && set.add(cl.title))
    return Array.from(set).filter(Boolean).sort()
  }, [courses, batches, candidateStudents, coursesList])

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (selectedStatus !== 'All' && b.status !== selectedStatus) return false

      if (selectedCourse !== 'All') {
        const matches = (b.courseBreakdown || []).some(
          (cb) => cb.courseTitle.toLowerCase() === selectedCourse.toLowerCase()
        )
        if (!matches) return false
      }

      if (!search.trim()) return true
      const q = search.toLowerCase()
      const inNum = b.batchNumber.toLowerCase().includes(q)
      const inTitle = b.title.toLowerCase().includes(q)
      const inCampus = (b.campus || '').toLowerCase().includes(q)
      const inNotes = (b.notes || '').toLowerCase().includes(q)
      const inStudent = (b.registrations || []).some(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.registrationNumber.toLowerCase().includes(q) ||
          r.courseTitle.toLowerCase().includes(q)
      )

      return inNum || inTitle || inCampus || inNotes || inStudent
    })
  }, [batches, selectedStatus, selectedCourse, search])

  // Handlers
  const handleOpenCreate = () => {
    setEditingBatch(null)
    setBatchModalOpen(true)
  }

  const handleOpenEdit = (batch: BatchItem) => {
    setEditingBatch(batch)
    setBatchModalOpen(true)
  }

  const handleOpenEnroll = (batch: BatchItem, courseHint?: string, shiftHint?: string) => {
    setTargetBatch(batch)
    setTargetCourse(courseHint || '')
    setTargetShift(shiftHint || COMMON_SHIFTS[0])
    setEnrollModalOpen(true)
  }

  const handleViewDetails = (batch: BatchItem) => {
    setViewingBatch(batch)
  }

  // Sync viewingBatch if batches list reloads
  const currentViewingBatch = useMemo(() => {
    if (!viewingBatch) return null
    return batches.find((b) => b.id === viewingBatch.id) || viewingBatch
  }, [viewingBatch, batches])

  return (
    <div className="space-y-6">
      {/* ── TOP STATS OVERVIEW ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Batches */}
        <div
          onClick={() => {
            setSelectedStatus('All')
            setSelectedCourse('All')
          }}
          className={`cursor-pointer rounded-2xl border bg-card p-4.5 shadow-sm transition hover:border-[#155DFC]/50 ${
            selectedStatus === 'All' ? 'ring-2 ring-[#155DFC]/50' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Total Batches (ዙሮች)</span>
            <Layers className="size-4 text-[#155DFC] dark:text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">{overview.totalBatches}</span>
            <span className="text-[11px] font-semibold text-[#155DFC] dark:text-sky-400">Intakes</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">School-wide academic cohorts</p>
        </div>

        {/* Open Batches */}
        <div
          onClick={() => setSelectedStatus('Open')}
          className={`cursor-pointer rounded-2xl border bg-card p-4.5 shadow-sm transition hover:border-emerald-500/50 ${
            selectedStatus === 'Open' ? 'ring-2 ring-emerald-500/50' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Open for Enrollment</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{overview.openBatches}</span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              Active Intake
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Accepting student applications</p>
        </div>

        {/* In-Training Batches */}
        <div
          onClick={() => setSelectedStatus('Active')}
          className={`cursor-pointer rounded-2xl border bg-card p-4.5 shadow-sm transition hover:border-[#155DFC]/50 ${
            selectedStatus === 'Active' ? 'ring-2 ring-[#155DFC]/50' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>In Training</span>
            <GraduationCap className="size-4 text-[#155DFC] dark:text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#155DFC] dark:text-sky-400">
              {overview.activeBatches}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">In Lab</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Practical classes in session</p>
        </div>

        {/* Upcoming Batches */}
        <div
          onClick={() => setSelectedStatus('Upcoming')}
          className={`cursor-pointer rounded-2xl border bg-card p-4.5 shadow-sm transition hover:border-amber-500/50 ${
            selectedStatus === 'Upcoming' ? 'ring-2 ring-amber-500/50' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Upcoming Intakes</span>
            <Calendar className="size-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {overview.upcomingBatches}
            </span>
            <span className="text-[11px] font-semibold text-amber-600">Opening Soon</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Next scheduled cohorts</p>
        </div>

        {/* Total Trainees Enrolled */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border bg-[#155DFC] text-white p-4.5 shadow-md shadow-blue-500/20">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-100">
            <span>Total Trainees</span>
            <Users className="size-4 text-white" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {overview.totalEnrolledTrainees}
            </span>
            <span className="text-[11px] font-semibold text-blue-200">Registered</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-100">Across all active course tracks</p>
        </div>
      </div>

      {/* ── SEARCH, FILTER, AND VIEW SWITCHER BAR ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border bg-card p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Batch code, title, campus, or enrolled student..."
            className="h-10 w-full rounded-2xl border bg-background pl-10 pr-4 text-xs font-medium text-foreground outline-none transition focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC]/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-xl border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#155DFC]"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open for Enrollment</option>
            <option value="Active">In Training</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Course Track Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-9 rounded-xl border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-[#155DFC] max-w-[180px] truncate"
          >
            <option value="All">All Course Tracks</option>
            {allCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* View Mode Toggle: List vs Cards */}
          <div className="flex items-center rounded-xl border bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setViewLayout('list')}
              title="List View"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                viewLayout === 'list'
                  ? 'bg-white shadow-xs text-[#155DFC] dark:bg-card dark:text-sky-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutList className="size-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('cards')}
              title="Card Grid View"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                viewLayout === 'cards'
                  ? 'bg-white shadow-xs text-[#155DFC] dark:bg-card dark:text-sky-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="h-9 rounded-xl border text-xs"
          >
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 rounded-xl bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            <Plus className="size-4 mr-1" />
            + New Batch (አዲስ ዙር)
          </Button>
        </div>
      </div>

      {/* ── BATCHES MAIN CONTENT ── */}
      {loading ? (
        <div className="rounded-3xl border bg-card p-16 text-center shadow-sm">
          <Loader2 className="mx-auto size-8 animate-spin text-[#155DFC]" />
          <p className="mt-3 text-sm font-semibold text-foreground">Loading academic cohorts...</p>
          <p className="mt-1 text-xs text-muted-foreground">Fetching live batch registrations and course enrollment</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-card/60 p-16 text-center shadow-sm">
          <Layers className="mx-auto size-12 text-muted-foreground/60" />
          <h3 className="mt-3 text-base font-bold text-foreground">No batches found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {search || selectedStatus !== 'All' || selectedCourse !== 'All'
              ? 'Try resetting the active filters or search terms above.'
              : 'Create the first academic Batch (ዙር) to start accepting student registrations across all courses.'}
          </p>
          <Button onClick={handleOpenCreate} className="mt-4 bg-[#155DFC] text-white font-bold" size="sm">
            <Plus className="size-4 mr-1.5" /> Create First Batch
          </Button>
        </div>
      ) : viewLayout === 'list' ? (
        /* ══════════════════════════════════════════════════════════════
           ORGANIZED LIST VIEW (PRIMARY USER REQUIREMENT)
           ══════════════════════════════════════════════════════════════ */
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 pl-6 pr-4">Batch Code & Title</th>
                  <th className="px-4 py-3.5">Intake Status</th>
                  <th className="px-4 py-3.5">Intake Progress & Capacity</th>
                  <th className="px-4 py-3.5">Schedule Timeline</th>
                  <th className="px-4 py-3.5">Active Courses</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBatches.map((batch) => {
                  const statusConfig = BATCH_STATUS_CONFIG[batch.status] || BATCH_STATUS_CONFIG.Open
                  const enrolled = batch.enrolledCount || 0
                  const capacity = batch.capacity || 60
                  const percentFilled = Math.min(100, Math.round((enrolled / capacity) * 100))
                  const coursesCount = (batch.courseBreakdown || []).length

                  return (
                    <tr
                      key={batch.id}
                      className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      {/* 1. Batch Code & Title */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-start gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#155DFC] font-mono font-black text-xs text-white shadow-sm shadow-blue-500/20">
                            {batch.batchNumber.replace(/Batch\s*/i, 'B')}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground text-sm group-hover:text-[#155DFC] transition-colors">
                                {batch.batchNumber}
                              </span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Building className="size-3" /> {batch.campus}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground font-medium line-clamp-1">
                              {batch.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Intake Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusConfig.badge}`}
                          >
                            <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={async () => {
                                const newStatus = batch.status === 'Open' ? 'Active' : 'Open'
                                await onUpdateBatch({ id: batch.id, status: newStatus })
                              }}
                              className="text-[10px] font-semibold text-muted-foreground hover:text-[#155DFC] hover:underline transition"
                            >
                              {batch.status === 'Open' ? 'Switch to Active' : 'Switch to Open'}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 3. Intake Progress & Capacity */}
                      <td className="px-4 py-4 min-w-[200px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-foreground">
                              {enrolled} / {capacity} Students
                            </span>
                            <span className="font-bold text-[#155DFC] dark:text-sky-400">
                              {percentFilled}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percentFilled >= 100
                                  ? 'bg-rose-500'
                                  : percentFilled >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-[#155DFC]'
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {capacity - enrolled > 0
                              ? `${capacity - enrolled} seats remaining`
                              : 'Intake is at full capacity'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Schedule Timeline */}
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="space-y-1 text-[11px]">
                          {batch.startDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3 text-[#155DFC] dark:text-sky-400" />
                              <span>Starts: <strong className="text-foreground">{new Date(batch.startDate).toLocaleDateString()}</strong></span>
                            </div>
                          )}
                          {batch.registrationDeadline && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3 text-amber-500" />
                              <span>Deadline: <strong className="text-foreground">{new Date(batch.registrationDeadline).toLocaleDateString()}</strong></span>
                            </div>
                          )}
                          {batch.endDate && (
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="size-3 text-emerald-600" />
                              <span>Graduation: <strong className="text-foreground">{new Date(batch.endDate).toLocaleDateString()}</strong></span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Active Courses & Trainees */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5 max-w-[220px]">
                          <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
                            <BookOpen className="size-3.5 text-[#155DFC]" />
                            <span>{coursesCount} {coursesCount === 1 ? 'Course' : 'Courses'} Active</span>
                          </div>
                          {coursesCount > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(batch.courseBreakdown || []).slice(0, 2).map((cb) => (
                                <span
                                  key={cb.courseTitle}
                                  className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground truncate max-w-[180px]"
                                  title={`${cb.courseTitle} (${cb.studentCount} students)`}
                                >
                                  {cb.courseTitle} ({cb.studentCount})
                                </span>
                              ))}
                              {coursesCount > 2 && (
                                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                  +{coursesCount - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] italic text-muted-foreground">No students enrolled yet</span>
                          )}
                        </div>
                      </td>

                      {/* 6. Actions */}
                      <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* PRIMARY VIEW DETAILS BUTTON */}
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(batch)}
                            className="h-8 rounded-xl bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs px-3 shadow-sm shadow-blue-500/20 gap-1.5"
                          >
                            <Eye className="size-3.5" />
                            <span>View Details</span>
                          </Button>

                          {/* Quick Enroll Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEnroll(batch)}
                            className="h-8 rounded-xl border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-[#155DFC] dark:text-sky-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/40"
                          >
                            <Plus className="size-3.5 mr-0.5" /> Enroll
                          </Button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(batch)}
                            title="Edit Batch"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                          >
                            <Edit2 className="size-3.5" />
                          </button>

                          {/* Delete Button with in-app Card Dialog */}
                          <button
                            type="button"
                            onClick={async () => {
                              const ok = await confirm({
                                title: 'Delete Cohort Intake Batch',
                                message: `Are you sure you want to delete ${batch.batchNumber} (${batch.title})? Any enrolled students will be unassigned and returned to the admissions queue.`,
                                confirmText: 'Delete Batch',
                                cancelText: 'Keep Batch',
                                variant: 'danger',
                              })
                              if (ok) {
                                await onDeleteBatch(batch.id)
                              }
                            }}
                            title="Delete Batch"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           GRID CARDS VIEW (ALTERNATIVE)
           ══════════════════════════════════════════════════════════════ */
        <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
          {filteredBatches.map((batch) => {
            const statusConfig = BATCH_STATUS_CONFIG[batch.status] || BATCH_STATUS_CONFIG.Open
            const enrolled = batch.enrolledCount || 0
            const capacity = batch.capacity || 60
            const percentFilled = Math.min(100, Math.round((enrolled / capacity) * 100))

            return (
              <div
                key={batch.id}
                className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm transition hover:shadow-md border-border/80 hover:border-[#155DFC]/40"
              >
                <div>
                  {/* Card Top: Batch Tag + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-xl bg-[#155DFC] text-white font-mono font-black text-xs px-3 py-1 tracking-wider shadow-sm">
                        {batch.batchNumber}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Building className="size-3" /> {batch.campus}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusConfig.badge}`}
                    >
                      <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 text-lg font-bold text-foreground line-clamp-1">
                    {batch.title}
                  </h3>
                  {batch.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {batch.description}
                    </p>
                  )}

                  {/* Dates & Schedule */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-y py-2.5">
                    {batch.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-[#155DFC] dark:text-sky-400" />
                        <span>Starts: <strong className="text-foreground">{new Date(batch.startDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}
                    {batch.registrationDeadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="size-3.5 text-amber-500" />
                        <span>Deadline: <strong className="text-foreground">{new Date(batch.registrationDeadline).toLocaleDateString()}</strong></span>
                      </div>
                    )}
                    {batch.endDate && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="size-3.5 text-emerald-600" />
                        <span>Graduation: <strong className="text-foreground">{new Date(batch.endDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Intake Enrollment Progress</span>
                      <span className="font-bold text-foreground">
                        {enrolled} / {capacity} Students ({percentFilled}% Filled)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          percentFilled >= 100
                            ? 'bg-rose-500'
                            : percentFilled >= 75
                            ? 'bg-amber-500'
                            : 'bg-[#155DFC]'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Summary Chips */}
                  <div className="mt-4 pt-3 border-t">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Courses Enrolled ({(batch.courseBreakdown || []).length})
                    </span>
                    {(batch.courseBreakdown || []).length === 0 ? (
                      <p className="text-xs italic text-muted-foreground">No students enrolled yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {batch.courseBreakdown.map((cb) => (
                          <span
                            key={cb.courseTitle}
                            className="rounded-lg bg-muted/60 px-2 py-1 text-xs font-medium text-foreground"
                          >
                            {cb.courseTitle} · <strong>{cb.studentCount}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 flex items-center justify-between border-t pt-3.5 text-xs">
                  <Button
                    size="sm"
                    onClick={() => handleViewDetails(batch)}
                    className="rounded-xl bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs gap-1.5 shadow-sm"
                  >
                    <Eye className="size-3.5" /> View Details
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEnroll(batch)}
                      className="rounded-xl border text-xs"
                    >
                      <Plus className="size-3.5 mr-1" /> Enroll
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(batch)}
                      title="Edit Batch"
                      className="rounded-lg border bg-background p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await confirm({
                          title: 'Delete Cohort Intake Batch',
                          message: `Are you sure you want to delete ${batch.batchNumber} (${batch.title})? Any enrolled students will be unassigned.`,
                          confirmText: 'Delete Batch',
                          variant: 'danger',
                        })
                        if (ok) {
                          await onDeleteBatch(batch.id)
                        }
                      }}
                      title="Delete Batch"
                      className="rounded-lg border bg-background p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
         BATCH DETAILS MODAL (VIEW ALL INFO & STUDENTS UNDER COURSES)
         ══════════════════════════════════════════════════════════════ */}
      {currentViewingBatch && (
        <BatchDetailsModal
          batch={currentViewingBatch}
          courseCategoryMap={courseCategoryMap}
          allCourses={allCourses}
          onClose={() => setViewingBatch(null)}
          onEdit={() => {
            const b = currentViewingBatch
            setViewingBatch(null)
            handleOpenEdit(b)
          }}
          onEnroll={(courseHint, shiftHint) => {
            const b = currentViewingBatch
            handleOpenEnroll(b, courseHint, shiftHint)
          }}
          onRemoveStudent={async (regId) => {
            return await onRemoveFromBatch(regId)
          }}
          onUpdateStatus={async (newStatus) => {
            await onUpdateBatch({ id: currentViewingBatch.id, status: newStatus })
          }}
        />
      )}

      {/* ── CREATE / EDIT BATCH MODAL ── */}
      {batchModalOpen && (
        <BatchModal
          editingBatch={editingBatch}
          onClose={() => setBatchModalOpen(false)}
          onSave={async (data) => {
            setSavingAction(true)
            try {
              if (editingBatch) {
                return await onUpdateBatch({ ...data, id: editingBatch.id })
              } else {
                return await onCreateBatch(data)
              }
            } finally {
              setSavingAction(false)
            }
          }}
        />
      )}

      {/* ── ENROLL STUDENT MODAL ── */}
      {enrollModalOpen && targetBatch && (
        <EnrollStudentModal
          batch={targetBatch}
          initialCourse={targetCourse}
          initialShift={targetShift}
          allCourses={allCourses}
          candidateStudents={candidateStudents}
          onClose={() => setEnrollModalOpen(false)}
          onEnroll={async (data) => {
            setSavingAction(true)
            try {
              return await onAssignToBatch(data)
            } finally {
              setSavingAction(false)
            }
          }}
        />
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   BATCH DETAILS MODAL
   ────────────────────────────────────────────────────────────── */
function BatchDetailsModal({
  batch,
  courseCategoryMap,
  allCourses,
  onClose,
  onEdit,
  onEnroll,
  onRemoveStudent,
  onUpdateStatus,
}: {
  batch: BatchItem
  courseCategoryMap: Record<string, string>
  allCourses: string[]
  onClose: () => void
  onEdit: () => void
  onEnroll: (courseHint?: string, shiftHint?: string) => void
  onRemoveStudent: (regId: string) => Promise<boolean>
  onUpdateStatus: (status: BatchItem['status']) => Promise<void>
}) {
  const { confirm } = useConfirm()
  const [activeTab, setActiveTab] = useState<'courses' | 'shifts' | 'roster'>('courses')
  const [studentSearch, setStudentSearch] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const statusConfig = BATCH_STATUS_CONFIG[batch.status] || BATCH_STATUS_CONFIG.Open
  const enrolled = batch.enrolledCount || 0
  const capacity = batch.capacity || 60
  const percentFilled = Math.min(100, Math.round((enrolled / capacity) * 100))

  // Filter students based on search inside modal
  const filteredRegistrations = useMemo(() => {
    if (!studentSearch.trim()) return batch.registrations || []
    const q = studentSearch.toLowerCase()
    return (batch.registrations || []).filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.courseTitle.toLowerCase().includes(q) ||
        r.shift.toLowerCase().includes(q)
    )
  }, [batch.registrations, studentSearch])

  // Group filtered students by course
  const groupedCourses = useMemo(() => {
    const map: Record<string, BatchRegistrationItem[]> = {}
    // initialize from courseBreakdown
    ;(batch.courseBreakdown || []).forEach((cb) => {
      map[cb.courseTitle] = []
    })
    filteredRegistrations.forEach((r) => {
      const c = r.courseTitle || 'General Technical Track'
      if (!map[c]) map[c] = []
      map[c].push(r)
    })
    return Object.entries(map).map(([courseTitle, students]) => ({
      courseTitle,
      category: courseCategoryMap[courseTitle.trim().toLowerCase()] || 'Technical Trade & Hardware Track',
      students,
    }))
  }, [filteredRegistrations, batch.courseBreakdown, courseCategoryMap])

  // Group filtered students by shift
  const groupedShifts = useMemo(() => {
    const map: Record<string, BatchRegistrationItem[]> = {}
    COMMON_SHIFTS.forEach((sh) => {
      map[sh] = []
    })
    filteredRegistrations.forEach((r) => {
      const s = r.shift || COMMON_SHIFTS[0]
      if (!map[s]) map[s] = []
      map[s].push(r)
    })
    return Object.entries(map).map(([shift, students]) => ({
      shift,
      students,
    }))
  }, [filteredRegistrations])

  const handleRemove = async (st: BatchRegistrationItem) => {
    const ok = await confirm({
      title: 'Remove Student from Batch',
      message: `Are you sure you want to remove ${st.fullName} from ${batch.batchNumber}? The student record will be preserved in registrations.`,
      confirmText: 'Remove Student',
      variant: 'danger',
    })
    if (!ok) return
    setRemovingId(st.id)
    try {
      await onRemoveStudent(st.id)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 sm:p-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-6 max-h-[92vh] w-full max-w-5xl flex flex-col rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-card dark:text-white animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/75 px-6 py-4.5 dark:border-slate-800 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#155DFC] font-mono font-black text-sm text-white shadow-md shadow-blue-500/25">
              {batch.batchNumber.replace(/Batch\s*/i, 'B')}
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {batch.batchNumber} — {batch.title}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusConfig.badge}`}
                >
                  <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 font-semibold">
                  <Building className="size-3 text-[#155DFC]" /> {batch.campus}
                </span>
                <span>•</span>
                <span>Cohort Intake Management</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onEnroll()}
              className="rounded-xl bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs gap-1 shadow-sm shadow-blue-500/20"
            >
              <Plus className="size-3.5" /> + Enroll Student
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportBatchRosterCSV(batch)}
              title="Download CSV Class Roster"
              className="rounded-xl border text-xs gap-1.5"
            >
              <Download className="size-3.5" /> Export Roster
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="rounded-xl border text-xs"
            >
              <Edit2 className="size-3.5 mr-1" /> Edit
            </Button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* ── MODAL BODY (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Enrollment Progress */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Enrollment Capacity
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {enrolled} / {capacity}
                </span>
                <span className="text-xs font-bold text-[#155DFC] dark:text-sky-400">
                  {percentFilled}% Filled
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    percentFilled >= 100 ? 'bg-rose-500' : percentFilled >= 75 ? 'bg-amber-500' : 'bg-[#155DFC]'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
                {capacity - enrolled > 0 ? `${capacity - enrolled} seats available` : 'Full capacity'}
              </span>
            </div>

            {/* Start Date */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#155DFC]" /> Intake Start Date
              </span>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'Not Set'}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Official lab & theory kickoff
              </span>
            </div>

            {/* Registration Deadline */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-500" /> Application Deadline
              </span>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {batch.registrationDeadline
                  ? new Date(batch.registrationDeadline).toLocaleDateString()
                  : 'Open Until Full'}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Admissions cutoff date
              </span>
            </div>

            {/* Expected Graduation */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-emerald-600" /> Graduation Date
              </span>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'TBD (3-4 Months)'}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                CoC & diploma assessment
              </span>
            </div>
          </div>

          {batch.description && (
            <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#155DFC] dark:text-sky-300">
                Cohort Overview & Syllabus Focus
              </span>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {batch.description}
              </p>
            </div>
          )}

          {/* ── TABS AND IN-MODAL SEARCH ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'courses'
                    ? 'bg-white shadow-xs text-[#155DFC] dark:bg-card dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>By Course & Categories ({(batch.courseBreakdown || []).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shifts')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'shifts'
                    ? 'bg-white shadow-xs text-[#155DFC] dark:bg-card dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Clock className="size-3.5" />
                <span>By Shift Cohorts</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'roster'
                    ? 'bg-white shadow-xs text-[#155DFC] dark:bg-card dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Users className="size-3.5" />
                <span>All Enrolled Students ({enrolled})</span>
              </button>
            </div>

            {/* In-Modal Search */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Filter students in this batch..."
                className="h-8.5 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs outline-none focus:border-[#155DFC] dark:border-slate-800 dark:bg-slate-900"
              />
              {studentSearch && (
                <button
                  onClick={() => setStudentSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* ── TAB CONTENT: BY COURSES & CATEGORIES ── */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {groupedCourses.length === 0 ? (
                <div className="rounded-3xl border border-dashed p-10 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <BookOpen className="mx-auto size-8 text-slate-400 mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    No course enrollment in this batch yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Students registered online or manually enrolled will appear grouped under their technical course tracks.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onEnroll()}
                    className="mt-4 bg-[#155DFC] text-white font-bold text-xs"
                  >
                    <Plus className="size-3.5 mr-1" /> Enroll First Student
                  </Button>
                </div>
              ) : (
                groupedCourses.map(({ courseTitle, category, students }) => (
                  <div
                    key={courseTitle}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-4"
                  >
                    {/* Course Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#155DFC] dark:bg-blue-950/60 dark:text-sky-300">
                          <BookOpen className="size-4" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              {courseTitle}
                            </h4>
                            <span className="rounded-full bg-blue-500/10 text-[#155DFC] dark:text-sky-300 font-black text-[10px] px-2 py-0.5 border border-blue-500/20">
                              {students.length} {students.length === 1 ? 'student' : 'students'}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Tag className="size-3 text-slate-400" /> Category: {category}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEnroll(courseTitle)}
                        className="rounded-xl border-blue-200 text-[#155DFC] hover:bg-blue-50 dark:border-blue-900 dark:text-sky-300 text-xs font-bold h-8"
                      >
                        <Plus className="size-3.5 mr-1" /> Enroll to this Track
                      </Button>
                    </div>

                    {/* Students Table under this Course */}
                    {students.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 italic">
                        {studentSearch ? 'No students match your search filter in this course.' : 'No students assigned to this course track yet.'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <th className="py-2 pl-2">#</th>
                              <th className="py-2">Student Name</th>
                              <th className="py-2">Reg #</th>
                              <th className="py-2">Shift</th>
                              <th className="py-2">Phone / Contact</th>
                              <th className="py-2">Status</th>
                              <th className="py-2">Enrolled On</th>
                              <th className="py-2 pr-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {students.map((st, idx) => {
                              const cleanPhone = cleanPhoneForWhatsApp(st.phone)
                              return (
                                <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                                  <td className="py-2.5 pl-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                                    {st.fullName}
                                  </td>
                                  <td className="py-2.5 font-mono text-[11px] text-slate-500">
                                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5">
                                      {st.registrationNumber}
                                    </span>
                                  </td>
                                  <td className="py-2.5">
                                    <span className="rounded-md bg-blue-50 text-[#155DFC] dark:bg-blue-950/60 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5">
                                      {st.shift.split(' ')[0]}
                                    </span>
                                  </td>
                                  <td className="py-2.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`tel:${st.phone}`}
                                        className="text-slate-600 hover:text-[#155DFC] font-medium"
                                      >
                                        {st.phone}
                                      </a>
                                      {cleanPhone && (
                                        <a
                                          href={`https://wa.me/${cleanPhone}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title="Open WhatsApp chat"
                                          className="text-emerald-600 hover:text-emerald-700"
                                        >
                                          <Send className="size-3" />
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5">
                                    <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/20">
                                      {st.status || 'Enrolled'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-slate-400 text-[11px]">
                                    {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : '—'}
                                  </td>
                                  <td className="py-2.5 pr-2 text-right">
                                    <button
                                      type="button"
                                      disabled={removingId === st.id}
                                      onClick={() => handleRemove(st)}
                                      title="Remove student from batch"
                                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
                                    >
                                      {removingId === st.id ? (
                                        <Loader2 className="size-3.5 animate-spin text-rose-600" />
                                      ) : (
                                        <UserMinus className="size-3.5" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── TAB CONTENT: BY SHIFT COHORTS ── */}
          {activeTab === 'shifts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedShifts.map(({ shift, students }) => (
                <div
                  key={shift}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {shift}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {students.length} {students.length === 1 ? 'student enrolled' : 'students enrolled'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEnroll(undefined, shift)}
                        className="rounded-xl text-xs h-7.5"
                      >
                        <Plus className="size-3 mr-1" /> Enroll
                      </Button>
                    </div>

                    {students.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400 italic">
                        No students enrolled in this shift yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {students.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white block truncate">
                                {st.fullName}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {st.courseTitle} • {st.phone}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemove(st)}
                              className="text-slate-400 hover:text-rose-600 ml-2"
                              title="Remove from batch"
                            >
                              <UserMinus className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB CONTENT: FULL STUDENT ROSTER ── */}
          {activeTab === 'roster' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Complete Enrolled Trainees Roster
                  </h4>
                  <p className="text-xs text-slate-500">
                    Showing {filteredRegistrations.length} of {batch.registrations?.length || 0} registered trainees
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportBatchRosterCSV(batch)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Download className="size-3.5" /> Download CSV
                </Button>
              </div>

              {filteredRegistrations.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400 italic">
                  No students found matching your criteria.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 pl-2">#</th>
                        <th className="py-2.5">Student Full Name</th>
                        <th className="py-2.5">Reg #</th>
                        <th className="py-2.5">Course Track</th>
                        <th className="py-2.5">Shift</th>
                        <th className="py-2.5">Phone Contact</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 pr-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredRegistrations.map((st, i) => (
                        <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                          <td className="py-2.5 pl-2 font-mono text-[11px] text-slate-400">{i + 1}</td>
                          <td className="py-2.5 font-bold text-slate-900 dark:text-white">{st.fullName}</td>
                          <td className="py-2.5 font-mono text-[11px] text-slate-500">{st.registrationNumber}</td>
                          <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{st.courseTitle}</td>
                          <td className="py-2.5">
                            <span className="rounded-md bg-blue-50 text-[#155DFC] dark:bg-blue-950/60 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5">
                              {st.shift}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-600 dark:text-slate-300">{st.phone}</td>
                          <td className="py-2.5">
                            <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                              {st.status || 'Enrolled'}
                            </span>
                          </td>
                          <td className="py-2.5 pr-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemove(st)}
                              className="text-slate-400 hover:text-rose-600"
                              title="Remove from batch"
                            >
                              <UserMinus className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/60 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Cohort ID: <span className="font-mono">{batch.id}</span>
          </span>
          <Button size="sm" onClick={onClose} className="rounded-xl px-5 text-xs font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   BATCH CREATE / EDIT MODAL
   ────────────────────────────────────────────────────────────── */
function BatchModal({
  editingBatch,
  onClose,
  onSave,
}: {
  editingBatch: BatchItem | null
  onClose: () => void
  onSave: (data: Partial<BatchItem>) => Promise<boolean>
}) {
  const [batchNumber, setBatchNumber] = useState(editingBatch?.batchNumber || 'Batch 01')
  const [title, setTitle] = useState(
    editingBatch?.title || '2026 Practical TVET Intake · Bahir Dar Campus'
  )
  const [description, setDescription] = useState(editingBatch?.description || '')
  const [startDate, setStartDate] = useState(
    editingBatch?.startDate ? new Date(editingBatch.startDate).toISOString().slice(0, 10) : ''
  )
  const [endDate, setEndDate] = useState(
    editingBatch?.endDate ? new Date(editingBatch.endDate).toISOString().slice(0, 10) : ''
  )
  const [registrationDeadline, setRegistrationDeadline] = useState(
    editingBatch?.registrationDeadline
      ? new Date(editingBatch.registrationDeadline).toISOString().slice(0, 10)
      : ''
  )
  const [status, setStatus] = useState<BatchItem['status']>(editingBatch?.status || 'Open')
  const [capacity, setCapacity] = useState(editingBatch?.capacity || 60)
  const [campus, setCampus] = useState(editingBatch?.campus || 'Bahir Dar Campus')
  const [notes, setNotes] = useState(editingBatch?.notes || '')
  const [sortOrder, setSortOrder] = useState(editingBatch?.sortOrder || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!batchNumber.trim() || !title.trim()) return

    const success = await onSave({
      batchNumber: batchNumber.trim(),
      title: title.trim(),
      description: description.trim() || null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline).toISOString()
        : null,
      status,
      capacity: Number(capacity) || 60,
      campus: campus.trim() || 'Bahir Dar Campus',
      notes: notes.trim() || null,
      sortOrder: Number(sortOrder) || 0,
    })

    if (success) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-lg rounded-3xl border bg-card text-card-foreground shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
          <div>
            <h3 className="font-bold text-base text-foreground">
              {editingBatch ? `Edit Cohort: ${editingBatch.batchNumber}` : 'Create New Academic Batch (ዙር)'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Setup academic cohort, admission deadlines, and trainee capacity
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Batch Code and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Batch Code / Label *
              </label>
              <input
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. Batch 01, ዙር 02"
                className="h-10 w-full rounded-xl border bg-background px-3 font-mono font-bold text-foreground outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Intake Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="h-10 w-full rounded-xl border bg-background px-3 font-semibold text-foreground outline-none focus:border-blue-500"
              >
                <option value="Open">Open for Enrollment</option>
                <option value="Active">In Training / In Progress</option>
                <option value="Upcoming">Upcoming / Opening Soon</option>
                <option value="Completed">Completed / Graduated</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Cohort Intake Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Practical TVET Intake · Advanced Electronics & Diagnostics"
              className="h-10 w-full rounded-xl border bg-background px-3 font-semibold text-foreground outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Description / Specialization Focus
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Intensive hands-on hardware training covering smartphone motherboard diagnosis and laptop schematics..."
              className="w-full rounded-xl border bg-background p-3 text-xs text-foreground outline-none focus:border-blue-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3 font-medium text-foreground outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Registration Cutoff
              </label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3 font-medium text-foreground outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Expected End / Grad
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3 font-medium text-foreground outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Capacity and Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Maximum Student Capacity *
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="h-10 w-full rounded-xl border bg-background px-3 font-bold text-foreground outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Campus Location
              </label>
              <input
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                placeholder="e.g. Signal Mall, Bahir Dar"
                className="h-10 w-full rounded-xl border bg-background px-3 font-semibold text-foreground outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Internal Staff Notes
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. First week dedicated to ESD safety and diagnostic instrumentation"
              className="h-10 w-full rounded-xl border bg-background px-3 text-foreground outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs px-5 shadow-md shadow-blue-500/25"
            >
              {editingBatch ? 'Save Changes' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   ENROLL STUDENT MODAL
   ────────────────────────────────────────────────────────────── */
function EnrollStudentModal({
  batch,
  initialCourse = '',
  initialShift = '',
  allCourses,
  candidateStudents,
  onClose,
  onEnroll,
}: {
  batch: BatchItem
  initialCourse?: string
  initialShift?: string
  allCourses: string[]
  candidateStudents: CandidateStudent[]
  onClose: () => void
  onEnroll: (data: {
    batchId: string
    registrationId?: string
    studentName?: string
    phone?: string
    email?: string
    city?: string
    telegramUsername?: string
    password?: string
    courseTitle: string
    shift: string
    status?: string
  }) => Promise<boolean>
}) {
  const { alert } = useConfirm()
  const [courseTitle, setCourseTitle] = useState(initialCourse || allCourses[0] || '')
  const [shift, setShift] = useState(initialShift || COMMON_SHIFTS[0])
  const [selectedRegId, setSelectedRegId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Bahir Dar')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [password, setPassword] = useState('Hello@2026')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Unassigned candidate applicants (if any remain from pending queue)
  const availableCandidates = useMemo(() => {
    return candidateStudents.filter((c) => c.batchId !== batch.id)
  }, [candidateStudents, batch.id])

  const handleSelectCandidate = (regId: string) => {
    setSelectedRegId(regId)
    if (!regId) return
    const cand = availableCandidates.find((c) => c.id === regId)
    if (cand) {
      setStudentName(cand.fullName || '')
      setPhone(cand.phone || '')
      if (cand.courseTitle) setCourseTitle(cand.courseTitle)
      if (cand.shift) setShift(cand.shift)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName.trim() || !courseTitle.trim() || !shift.trim() || !phone.trim()) {
      await alert({
        title: 'Required Information',
        message: 'Student Full Name, Phone Number, Course Track, and Shift Cohort are required.',
        variant: 'warning',
      })
      return
    }

    if (password && password.trim().length < 6) {
      await alert({
        title: 'Password Too Short',
        message: 'Student Portal Password must be at least 6 characters.',
        variant: 'warning',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const ok = await onEnroll({
        batchId: batch.id,
        registrationId: selectedRegId || undefined,
        studentName: studentName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim() || 'Bahir Dar',
        telegramUsername: telegramUsername.trim() || undefined,
        password: password.trim() || 'Hello@2026',
        courseTitle: courseTitle.trim(),
        shift: shift.trim(),
        status: 'Enrolled',
      })

      if (ok) onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-xl rounded-3xl border bg-card text-card-foreground shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#155DFC] text-white font-bold text-sm shadow-md shadow-blue-500/20">
              {batch.batchNumber.slice(-2)}
            </span>
            <div>
              <h3 className="font-bold text-foreground text-base">
                Manual Registration & Cohort Enrollment
              </h3>
              <p className="text-xs text-muted-foreground">
                Enrolling into <span className="font-semibold text-foreground">{batch.batchNumber}</span> ({batch.title})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          {/* Student Account Auto-Creation Notice */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 flex items-start gap-3">
            <div className="rounded-xl bg-[#155DFC] p-2 text-white shrink-0 mt-0.5 shadow-sm shadow-blue-500/20">
              <ShieldCheck className="size-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#155DFC] dark:text-sky-300">
                Official Student Portal Account Included
              </p>
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                Just like online registration, enrolling here automatically generates an official student account with an institutional email (<span className="font-mono font-medium text-foreground">@hellotechnology.edu.et</span>), student ID, and login credentials. The student can immediately sign in at <span className="font-semibold text-[#155DFC]">/student</span>.
              </p>
            </div>
          </div>

          {/* Optional Pre-fill from pending candidates if any unassigned exist */}
          {availableCandidates.length > 0 && (
            <div className="rounded-xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 p-3">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Optional: Pre-fill from Unassigned Applicant</span>
                <span className="text-[10px] normal-case font-normal text-muted-foreground">
                  ({availableCandidates.length} in queue)
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedRegId}
                  onChange={(e) => handleSelectCandidate(e.target.value)}
                  className="h-9 w-full appearance-none rounded-lg border bg-background px-3 pr-8 text-xs font-medium text-foreground outline-none focus:border-[#155DFC]"
                >
                  <option value="">-- Enter new student details manually below --</option>
                  {availableCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} • {c.phone} • {c.courseTitle} ({c.registrationNumber})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Shift Selection */}
          <div>
            <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Shift Cohort *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_SHIFTS.map((sh) => (
                <button
                  key={sh}
                  type="button"
                  onClick={() => setShift(sh)}
                  className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                    shift === sh
                      ? 'border-[#155DFC] bg-[#155DFC]/10 text-[#155DFC] dark:text-sky-400 ring-1 ring-[#155DFC]'
                      : 'border-border bg-background hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <span className="block font-bold">{sh.split(' ')[0]}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {sh.split('(')[1]?.replace(')', '') || ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Course Track Dropdown */}
          <div>
            <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Course Track *
            </label>
            <div className="relative">
              <select
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border bg-background px-3.5 pr-10 font-semibold text-foreground outline-none transition focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC]/20 cursor-pointer text-xs"
              >
                <option value="" disabled>
                  -- Select a Technical Course Track --
                </option>
                {Array.from(new Set([courseTitle, ...allCourses]))
                  .filter(Boolean)
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Student Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Student Full Name *
              </label>
              <input
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Abebe Kebede"
                className="h-10 w-full rounded-xl border bg-background px-3 font-semibold text-foreground outline-none focus:border-[#155DFC] text-xs"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Phone Number *
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09 12 34 56 78"
                className="h-10 w-full rounded-xl border bg-background px-3 font-medium text-foreground outline-none focus:border-[#155DFC] text-xs"
              />
            </div>
          </div>

          {/* Personal Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Personal Email <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none focus:border-[#155DFC]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                City / Residence
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bahir Dar"
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none focus:border-[#155DFC]"
              />
            </div>
          </div>

          {/* Telegram & Portal Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Telegram Username <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs text-foreground outline-none focus:border-[#155DFC]"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Portal Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hello@2026"
                className="h-10 w-full rounded-xl border bg-background px-3 font-mono text-xs text-foreground outline-none focus:border-[#155DFC]"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Default: Hello@2026. Student can change it in the portal.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold text-xs px-5 shadow-md shadow-blue-500/25 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Creating Account & Enrolling...</span>
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5" />
                  <span>Enroll & Create Account</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
