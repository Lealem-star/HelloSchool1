'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Bell,
  Mail,
  Building2,
  GraduationCap,
  Phone,
  Send,
  Clock,
  Calendar,
  X,
  Trash2,
  Loader2,
  Check,
  CheckCheck,
  Filter,
  Eye,
  Archive,
  RefreshCw,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Users,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/ui/dialog-modal'
import type { AdminCompanyInquiry } from '@/components/admin-company-views'

export type StudentInquiry = {
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

export type UnifiedInquiry =
  | {
      kind: 'student'
      id: string
      title: string
      subtitle: string
      contactPhone: string
      contactEmail: string | null
      message: string | null
      status: string
      createdAt: string
      data: StudentInquiry
    }
  | {
      kind: 'company'
      id: string
      title: string
      subtitle: string
      contactPhone: string
      contactEmail: string | null
      message: string | null
      status: string
      createdAt: string
      data: AdminCompanyInquiry
    }

export function cleanPhoneForChat(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
    cleaned = '251' + cleaned.slice(1)
  }
  return cleaned.replace(/^\+/, '')
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (isNaN(diffSec) || diffSec < 0) return 'Just now'
  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 172800) return 'Yesterday'
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const STATUS_BADGES: Record<string, string> = {
  New: 'bg-blue-500/15 text-blue-600 dark:text-sky-400 border-blue-500/30',
  Contacted: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  'Proposal Sent': 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  'In Discussion': 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  Enrolled: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Converted: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Archived: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
}

/* ──────────────────────────────────────────────────────────────
   1. ADMIN INQUIRIES NOTIFICATION DROPDOWN COMPONENT
   ────────────────────────────────────────────────────────────── */
interface AdminInquiriesNotificationProps {
  inquiries: StudentInquiry[]
  companyInquiries: AdminCompanyInquiry[]
  onOpenReader: (item: UnifiedInquiry) => void
  onMarkAllAsRead: () => Promise<void>
  onUpdateStudentStatus: (id: string, status: string) => Promise<void>
  onUpdateCompanyStatus: (id: string, status: string) => Promise<void>
}

export function AdminInquiriesNotification({
  inquiries,
  companyInquiries,
  onOpenReader,
  onMarkAllAsRead,
  onUpdateStudentStatus,
  onUpdateCompanyStatus,
}: AdminInquiriesNotificationProps) {
  const [open, setOpen] = useState(false)
  const [filterTab, setFilterTab] = useState<'all' | 'student' | 'company' | 'unread'>('all')
  const [markingAll, setMarkingAll] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Unify and sort chronologically (newest first)
  const unifiedItems: UnifiedInquiry[] = useMemo(() => {
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

  // Unread count
  const unreadCount = useMemo(() => {
    return unifiedItems.filter((i) => i.status === 'New').length
  }, [unifiedItems])

  // Filtered list
  const filteredItems = useMemo(() => {
    if (filterTab === 'student') return unifiedItems.filter((i) => i.kind === 'student')
    if (filterTab === 'company') return unifiedItems.filter((i) => i.kind === 'company')
    if (filterTab === 'unread') return unifiedItems.filter((i) => i.status === 'New')
    return unifiedItems
  }, [unifiedItems, filterTab])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Item click handler: mark as read if new and open reader modal
  const handleItemClick = async (item: UnifiedInquiry) => {
    if (item.status === 'New') {
      if (item.kind === 'student') {
        onUpdateStudentStatus(item.id, 'Contacted')
      } else {
        onUpdateCompanyStatus(item.id, 'Contacted')
      }
    }
    setOpen(false)
    onOpenReader(item)
  }

  const handleMarkAll = async () => {
    setMarkingAll(true)
    try {
      await onMarkAllAsRead()
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* ── NOTIFICATION BELL BUTTON ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Inquiries and Notifications"
        title={
          unreadCount > 0
            ? `${unreadCount} new inquiry notification${unreadCount > 1 ? 's' : ''}`
            : 'Inbound Inquiries & Notifications'
        }
        className={`relative flex size-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
          open
            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-sky-500 dark:bg-blue-950/60 dark:text-sky-300 ring-2 ring-blue-500/20'
            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-700'
        }`}
      >
        <Bell className={`size-4.5 ${unreadCount > 0 ? 'text-blue-600 dark:text-sky-400' : ''}`} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white shadow-md shadow-red-500/40 ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── NOTIFICATION DROPDOWN POPUP ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2.5 z-50 w-[380px] sm:w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-sky-400 font-bold">
                  <Bell className="size-3.5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Inbound Inquiries & Requests
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {unreadCount > 0
                      ? `${unreadCount} unread request${unreadCount > 1 ? 's' : ''}`
                      : 'All caught up · Live requests feed'}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markingAll}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-sky-400 dark:hover:text-sky-300 disabled:opacity-50 cursor-pointer"
                >
                  {markingAll ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCheck className="size-3" />
                  )}
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mt-2.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterTab('all')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                All ({unifiedItems.length})
              </button>
              <button
                onClick={() => setFilterTab('student')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  filterTab === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <GraduationCap className="size-3" /> Students ({inquiries.length})
              </button>
              <button
                onClick={() => setFilterTab('company')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  filterTab === 'company'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Building2 className="size-3" /> Companies ({companyInquiries.length})
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={() => setFilterTab('unread')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                    filterTab === 'unread'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300'
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-red-500 animate-ping" />
                  New ({unreadCount})
                </button>
              )}
            </div>
          </div>

          {/* Inquiry List Feed */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <MessageSquare className="size-8 stroke-[1.5] text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No inquiries found
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {filterTab === 'unread'
                    ? 'All incoming student and company inquiries have been reviewed.'
                    : 'New inquiries submitted via the public site will appear here.'}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isNew = item.status === 'New'
                const isStudent = item.kind === 'student'
                const timeAgo = formatRelativeTime(item.createdAt)

                return (
                  <div
                    key={`${item.kind}_${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-all cursor-pointer ${
                      isNew
                        ? 'bg-blue-50/70 dark:bg-blue-950/25 border-l-3 border-l-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Icon Avatar */}
                    <div
                      className={`relative shrink-0 flex size-9 items-center justify-center rounded-xl shadow-xs ${
                        isStudent
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-sky-300'
                          : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}
                    >
                      {isStudent ? (
                        <GraduationCap className="size-4.5" />
                      ) : (
                        <Building2 className="size-4.5" />
                      )}
                      {isNew && (
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                              isStudent
                                ? 'bg-blue-500/10 text-blue-700 dark:text-sky-300'
                                : 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                            }`}
                          >
                            {isStudent ? 'Student' : 'Company'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                        </div>
                        <span className="shrink-0 text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="size-2.5" />
                          {timeAgo}
                        </span>
                      </div>

                      {/* Subtitle / Focus */}
                      <p className="mt-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                        {item.subtitle}
                      </p>

                      {/* Message preview snippet */}
                      {item.message ? (
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2 italic">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-slate-400 italic">
                          No written message provided
                        </p>
                      )}

                      {/* Footer Info: Phone & Status badge */}
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                          <Phone className="size-3 text-slate-400" />
                          {item.contactPhone}
                        </span>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${
                            STATUS_BADGES[item.status] || 'border-slate-200 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-2.5 text-center text-[10px] text-muted-foreground dark:border-slate-800 dark:bg-slate-900/90 flex items-center justify-between">
            <span>Click any request to read full details</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Total {unifiedItems.length} records
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   2. UNIFIED INQUIRY READER MODAL ("Open as Reader Page or Modal")
   ────────────────────────────────────────────────────────────── */
interface AdminInquiryReaderModalProps {
  inquiry: UnifiedInquiry | null
  open: boolean
  onClose: () => void
  onUpdateStatus: (id: string, kind: 'student' | 'company', status: string) => Promise<void>
  onSaveCompanyNotes?: (id: string, notes: string) => Promise<void>
  onDelete: (id: string, kind: 'student' | 'company') => Promise<void>
  allInquiries?: UnifiedInquiry[]
  onSelectInquiry?: (item: UnifiedInquiry) => void
}

export function AdminInquiryReaderModal({
  inquiry,
  open,
  onClose,
  onUpdateStatus,
  onSaveCompanyNotes,
  onDelete,
  allInquiries = [],
  onSelectInquiry,
}: AdminInquiryReaderModalProps) {
  const { confirm } = useConfirm()
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Sync draft notes when inquiry changes
  useEffect(() => {
    if (inquiry && inquiry.kind === 'company') {
      setNotesDraft(inquiry.data.adminNotes || '')
    }
  }, [inquiry])

  if (!open || !inquiry) return null

  const isStudent = inquiry.kind === 'student'
  const studentData = isStudent ? inquiry.data : null
  const companyData = !isStudent ? inquiry.data : null

  const cleanPhone = cleanPhoneForChat(inquiry.contactPhone)

  // Navigation between inquiries
  const currentIndex = allInquiries.findIndex(
    (i) => i.id === inquiry.id && i.kind === inquiry.kind
  )
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < allInquiries.length - 1

  const handlePrev = () => {
    if (hasPrev && onSelectInquiry) {
      onSelectInquiry(allInquiries[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (hasNext && onSelectInquiry) {
      onSelectInquiry(allInquiries[currentIndex + 1])
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    try {
      await onUpdateStatus(inquiry.id, inquiry.kind, newStatus)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!companyData || !onSaveCompanyNotes) return
    setSavingNotes(true)
    try {
      await onSaveCompanyNotes(companyData.id, notesDraft)
    } finally {
      setSavingNotes(false)
    }
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: isStudent ? 'Delete Student Inquiry' : 'Delete Company Request',
      message: `Are you sure you want to permanently delete this inquiry from "${inquiry.title}"?`,
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return

    setDeleting(true)
    try {
      await onDelete(inquiry.id, inquiry.kind)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-6 rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP BANNER / READER HEADER ── */}
        <div
          className={`px-6 py-5 border-b ${
            isStudent
              ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-[#155DFC] text-white border-blue-700'
              : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white border-purple-800'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
                {isStudent ? (
                  <GraduationCap className="size-4.5 text-white" />
                ) : (
                  <Building2 className="size-4.5 text-white" />
                )}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block">
                  {isStudent ? '🎓 Student Admissions Inquiry' : '🏢 Customized Company Training Request'}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {inquiry.title}
                </h2>
              </div>
            </div>

            {/* Quick close & navigation */}
            <div className="flex items-center gap-1.5">
              {allInquiries.length > 1 && (
                <div className="flex items-center bg-white/15 rounded-xl border border-white/20 p-0.5">
                  <button
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    title="Previous inquiry"
                    className="p-1.5 text-white hover:bg-white/20 rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-[10px] font-mono font-bold px-1 text-white/90">
                    {currentIndex + 1}/{allInquiries.length}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    title="Next inquiry"
                    className="p-1.5 text-white hover:bg-white/20 rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
                aria-label="Close reader"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Subtitle / Timestamp bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/85 pt-2 border-t border-white/15">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5" />
              <span>Submitted {new Date(inquiry.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span className="font-semibold text-white/90">
                {formatRelativeTime(inquiry.createdAt)}
              </span>
            </div>

            {/* Live Interactive Status dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-white/75">Workflow Status:</span>
              <select
                value={inquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="rounded-xl border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white outline-none cursor-pointer hover:bg-white/30 focus:bg-slate-900 focus:text-white"
              >
                {isStudent ? (
                  <>
                    <option value="New" className="text-slate-900">New</option>
                    <option value="Contacted" className="text-slate-900">Contacted</option>
                    <option value="Enrolled" className="text-slate-900">Enrolled</option>
                    <option value="Archived" className="text-slate-900">Archived</option>
                  </>
                ) : (
                  <>
                    <option value="New" className="text-slate-900">New</option>
                    <option value="Contacted" className="text-slate-900">Contacted</option>
                    <option value="Proposal Sent" className="text-slate-900">Proposal Sent</option>
                    <option value="In Discussion" className="text-slate-900">In Discussion</option>
                    <option value="Converted" className="text-slate-900">Converted</option>
                    <option value="Archived" className="text-slate-900">Archived</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* ── MODAL BODY / READER CONTENT ── */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* Quick Contact & Communication Bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Phone & Instant Chat Action */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-sky-400">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Contact
                  </p>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {inquiry.contactPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${inquiry.contactPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
                >
                  <Phone className="size-3.5 text-blue-600 dark:text-sky-400" />
                  <span>Call</span>
                </a>

                {cleanPhone && (
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 transition cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {inquiry.contactEmail && (
                  <a
                    href={`mailto:${inquiry.contactEmail}?subject=Hello Technology - Inbound Request Follow-up`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
                  >
                    <Mail className="size-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {inquiry.contactEmail && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="size-3.5" />
                <span>Official Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {inquiry.contactEmail}
                </span>
              </div>
            )}
          </div>

          {/* Key Metadata Cards */}
          {isStudent && studentData && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Course Selected
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {studentData.course || 'General Training'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Experience / Background
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {studentData.experience || 'Beginner / Not specified'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Contact
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {studentData.preferredContact || 'Phone Call'}
                </p>
              </div>
            </div>
          )}

          {!isStudent && companyData && (
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sector / Institution
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {companyData.institutionType || 'Corporate'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Trainee Cohort Size
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {companyData.employeeCount || 'Custom cohort'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Technical Focus
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">
                  {companyData.trainingFocus || 'Biomedical / Hardware'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-card p-3.5 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Location Preference
                </p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">
                  {companyData.location || 'Onsite / Campus'}
                </p>
              </div>
            </div>
          )}

          {/* ── THE RECEIVED REQUEST / MESSAGE DOCUMENT (READER VIEW) ── */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-blue-600 dark:text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Inbound Message & Scope Description
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Document Reader
              </span>
            </div>

            {inquiry.message ? (
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/60">
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap font-sans">
                  {inquiry.message}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-xs italic text-muted-foreground">
                No custom message was submitted with this request. Follow up directly using the phone or WhatsApp channels above.
              </div>
            )}
          </div>

          {/* ── COMPANY INQUIRY INTERNAL NOTES & QUOTATIONS ── */}
          {!isStudent && companyData && (
            <div className="rounded-3xl border border-purple-200/80 bg-purple-50/30 p-5 dark:border-purple-900/50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                    Internal Follow-up Notes & Agreed Quotation
                  </h4>
                </div>
                <span className="text-[10px] text-muted-foreground">Confidential · Admin only</span>
              </div>

              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Record agreed pricing, custom curriculum topics, meeting dates, or corporate contract terms..."
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />

              <div className="mt-3 flex justify-end">
                <Button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  size="sm"
                  className="rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-sm"
                >
                  {savingNotes ? (
                    <>
                      <Loader2 className="mr-2 size-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-1.5 size-3.5" /> Save Internal Notes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── 1-CLICK WORKFLOW STATUS ADVANCE STEPPER ── */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Quick Workflow Transitions
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {isStudent ? (
                <>
                  <button
                    onClick={() => handleStatusChange('Contacted')}
                    disabled={inquiry.status === 'Contacted' || updatingStatus}
                    className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40 transition cursor-pointer dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange('Enrolled')}
                    disabled={inquiry.status === 'Enrolled' || updatingStatus}
                    className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 transition cursor-pointer dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    Mark as Enrolled
                  </button>
                  <button
                    onClick={() => handleStatusChange('Archived')}
                    disabled={inquiry.status === 'Archived' || updatingStatus}
                    className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleStatusChange('New')}
                    disabled={inquiry.status === 'New' || updatingStatus}
                    className="rounded-xl border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 disabled:opacity-40 transition cursor-pointer dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                  >
                    Mark as New
                  </button>
                </>
              ) : (
                <>
                  {['Contacted', 'Proposal Sent', 'In Discussion', 'Converted', 'Archived'].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        disabled={inquiry.status === st || updatingStatus}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition cursor-pointer ${
                          STATUS_BADGES[st] || 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
          >
            {deleting ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 size-3.5" />
            )}
            <span>Delete Request</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            Close Reader
          </Button>
        </div>
      </div>
    </div>
  )
}
