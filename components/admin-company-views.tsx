'use client'

import { useState } from 'react'
import {
  Building2,
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  X,
  Plus,
  Pencil,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Upload,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/ui/dialog-modal'

export type AdminCompanyInquiry = {
  id: string
  companyName: string
  institutionType: string
  contactPerson: string
  jobTitle: string | null
  email: string
  phone: string
  employeeCount: string | null
  trainingFocus: string | null
  location: string | null
  message: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export type CompanyOverview = {
  total: number
  new: number
  contacted: number
  proposalSent: number
  inDiscussion: number
  converted: number
  archived: number
}

export type AdminTrustedPartner = {
  id: string
  name: string
  category: string | null
  logoUrl: string
  websiteUrl: string | null
  description: string | null
  published: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Proposal Sent',
  'In Discussion',
  'Converted',
  'Archived',
]

const STATUS_THEMES: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-600 dark:text-sky-400 border-blue-500/30',
  Contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  'Proposal Sent': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  'In Discussion': 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
  Converted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Archived: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
}

/* ──────────────────────────────────────────────────────────────
   1. COMPANY INQUIRIES VIEW
   ────────────────────────────────────────────────────────────── */
export function CompanyInquiriesView({
  inquiries,
  overview,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  savingId,
  updateStatus,
  updateNotes,
  deleteInquiry,
  refresh,
}: {
  inquiries: AdminCompanyInquiry[]
  overview: CompanyOverview
  loading: boolean
  search: string
  setSearch: (s: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  savingId: string | null
  updateStatus: (id: string, status: string) => Promise<void>
  updateNotes: (id: string, adminNotes: string) => Promise<void>
  deleteInquiry: (id: string) => Promise<void>
  refresh: () => void
}) {
  const [selectedInquiry, setSelectedInquiry] = useState<AdminCompanyInquiry | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  function openDetail(item: AdminCompanyInquiry) {
    setSelectedInquiry(item)
    setNotesDraft(item.adminNotes || '')
    setDetailOpen(true)
  }

  async function handleSaveNotes() {
    if (!selectedInquiry) return
    setSavingNotes(true)
    try {
      await updateNotes(selectedInquiry.id, notesDraft)
      setSelectedInquiry({ ...selectedInquiry, adminNotes: notesDraft })
    } finally {
      setSavingNotes(false)
    }
  }

  const filtered = inquiries.filter((i) => {
    if (statusFilter !== 'All' && i.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      i.companyName.toLowerCase().includes(q) ||
      i.contactPerson.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.toLowerCase().includes(q) ||
      (i.institutionType && i.institutionType.toLowerCase().includes(q)) ||
      (i.trainingFocus && i.trainingFocus.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div
          onClick={() => setStatusFilter('All')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'All'
              ? 'border-[#155DFC] bg-blue-500/10 shadow-md shadow-blue-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Total</span>
            <Building2 className="size-4 text-[#155DFC]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{overview.total}</div>
        </div>

        <div
          onClick={() => setStatusFilter('New')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'New'
              ? 'border-[#155DFC] bg-blue-500/15 shadow-md shadow-blue-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#155DFC]">
            <span>New Requests</span>
            <span className="size-2 rounded-full bg-[#155DFC] animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#155DFC]">{overview.new}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Contacted')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'Contacted'
              ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Contacted</div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{overview.contacted}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Proposal Sent')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'Proposal Sent'
              ? 'border-purple-500 bg-purple-500/15 shadow-md shadow-purple-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Proposal Sent</div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">{overview.proposalSent}</div>
        </div>

        <div
          onClick={() => setStatusFilter('In Discussion')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'In Discussion'
              ? 'border-sky-500 bg-sky-500/15 shadow-md shadow-sky-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">In Discussion</div>
          <div className="mt-2 text-2xl font-extrabold text-sky-600 dark:text-sky-400">{overview.inDiscussion}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Converted')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-sm ${
            statusFilter === 'Converted'
              ? 'border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/15'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-card'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Enrolled/Partner</div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{overview.converted}</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-card">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, sector, contact, email..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Status Filters & Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            {['All', 'New', 'Contacted', 'Proposal Sent', 'In Discussion', 'Converted'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-[#155DFC] text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <a
            href={`/api/admin/company-inquiries?format=csv${statusFilter !== 'All' ? `&status=${statusFilter}` : ''}`}
            download
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="size-3.5" /> Export CSV
          </a>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-muted/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Institution / Company</th>
                <th className="px-5 py-3.5">Contact Person</th>
                <th className="px-5 py-3.5">Trainees / Focus</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto size-6 animate-spin text-[#155DFC]" />
                    <p className="mt-2 text-xs">Loading institutional inquiries...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Building2 className="mx-auto size-8 text-slate-400 dark:text-slate-600" />
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">No company inquiries found</p>
                    <p className="text-xs text-slate-500">
                      Inquiries from the Customized Company Training CTA will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.companyName}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#155DFC] dark:text-sky-300">
                          {item.institutionType}
                        </span>
                        {item.location && (
                          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            · {item.location}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.contactPerson}</div>
                      {item.jobTitle && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.jobTitle}</div>
                      )}
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <a href={`tel:${item.phone}`} className="hover:text-[#155DFC] dark:hover:text-sky-300">
                          📞 {item.phone}
                        </a>
                        <a href={`mailto:${item.email}`} className="hover:text-[#155DFC] dark:hover:text-sky-300">
                          ✉️ {item.email}
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.employeeCount || 'Not specified'}
                      </div>
                      {item.trainingFocus && (
                        <div className="mt-1 line-clamp-1 max-w-xs text-[11px] text-slate-500 dark:text-slate-400">
                          🎯 {item.trainingFocus}
                        </div>
                      )}
                      {item.adminNotes && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">
                          📝 Notes attached
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        disabled={savingId === item.id}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer ${
                          STATUS_THEMES[item.status] || 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetail(item)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#155DFC] hover:bg-blue-50/50 hover:text-[#155DFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
                          title="View Details & Notes"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => deleteInquiry(item.id)}
                          disabled={savingId === item.id}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          title="Delete Inquiry"
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

      {/* DETAIL & ADMIN NOTES MODAL */}
      {detailOpen && selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl my-8 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-card dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1048ca] via-[#155DFC] to-[#0c3694] px-6 py-4.5 text-white">
              <div>
                <span className="rounded-md border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {selectedInquiry.institutionType}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">{selectedInquiry.companyName}</h3>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
              {/* Contact Information Strip */}
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/40">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Contact Person
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    {selectedInquiry.contactPerson}
                  </p>
                  {selectedInquiry.jobTitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedInquiry.jobTitle}</p>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Reach Out
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">📞 {selectedInquiry.phone}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">✉️ {selectedInquiry.email}</p>
                </div>
              </div>

              {/* Training Parameters */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Employees Count
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-1">
                    {selectedInquiry.employeeCount || 'Not specified'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Location Preference
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {selectedInquiry.location || 'HelloSchool Labs'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Submission Date
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-1">
                    {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Hardware / Focus */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Hardware & Equipment Focus
                </p>
                <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                  {selectedInquiry.trainingFocus || 'General hardware diagnostic skills'}
                </div>
              </div>

              {/* Message / Maintenance Challenges */}
              {selectedInquiry.message && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Client Description / Message
                  </p>
                  <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-800 leading-relaxed whitespace-pre-line dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                    {selectedInquiry.message}
                  </div>
                </div>
              )}

              {/* Admin Internal Notes */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#155DFC] dark:text-sky-400">
                    Admin Follow-up Notes & Quotations
                  </p>
                  <span className="text-[11px] text-slate-500">Internal only</span>
                </div>
                <textarea
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record call summaries, quotation amounts, custom syllabus agreements, or meeting dates..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="bg-[#155DFC] text-white font-bold hover:bg-[#0D4ECC] shadow-md shadow-blue-500/25"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Saving Notes...
                      </>
                    ) : (
                      'Save Notes'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   2. TRUSTED PARTNERS VIEW (ADMIN CRUD)
   ────────────────────────────────────────────────────────────── */
export function TrustedPartnersView({
  partners,
  loading,
  search,
  setSearch,
  savingId,
  savePartner,
  deletePartner,
}: {
  partners: AdminTrustedPartner[]
  loading: boolean
  search: string
  setSearch: (s: string) => void
  savingId: string | null
  savePartner: (data: Partial<AdminTrustedPartner>) => Promise<void>
  deletePartner: (id: string) => Promise<void>
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminTrustedPartner | null>(null)
  const [uploading, setUploading] = useState(false)
  const { alert } = useConfirm()

  // Form state
  const [form, setForm] = useState<Partial<AdminTrustedPartner>>({
    name: '',
    category: 'Hospitals & Biomedical',
    logoUrl: '/images/helloschool.jpg',
    websiteUrl: '',
    description: '',
    published: true,
    sortOrder: 0,
  })

  function openNew() {
    setEditing(null)
    setForm({
      name: '',
      category: 'Hospitals & Biomedical',
      logoUrl: '/images/helloschool.jpg',
      websiteUrl: '',
      description: '',
      published: true,
      sortOrder: partners.length + 1,
    })
    setModalOpen(true)
  }

  function openEdit(partner: AdminTrustedPartner) {
    setEditing(partner)
    setForm({ ...partner })
    setModalOpen(true)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'partners')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm((prev) => ({ ...prev, logoUrl: data.url }))
    } catch (err: any) {
      await alert({
        title: 'Upload Failed',
        message: err.message || 'Image upload failed',
        variant: 'danger',
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name?.trim()) {
      await alert({
        title: 'Validation Error',
        message: 'Partner name is required.',
        variant: 'warning',
      })
      return
    }
    if (!form.logoUrl?.trim()) {
      await alert({
        title: 'Validation Error',
        message: 'Logo URL or image is required.',
        variant: 'warning',
      })
      return
    }

    await savePartner(editing ? { ...form, id: editing.id } : form)
    setModalOpen(false)
  }

  const filtered = partners.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners by name or sector..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          onClick={openNew}
          className="rounded-xl bg-[#155DFC] font-bold text-white hover:bg-[#0D4ECC] shadow-md shadow-blue-500/25"
        >
          <Plus className="size-4 mr-2" /> Add Partner Logo
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <Loader2 className="mx-auto size-6 animate-spin text-[#155DFC]" />
            <p className="mt-2 text-xs">Loading trusted partners...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <ShieldCheck className="mx-auto size-8 text-slate-400 dark:text-slate-600" />
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">No partners added yet</p>
            <p className="text-xs text-slate-500">
              Click &quot;Add Partner Logo&quot; to showcase organizations that trust Hello TVET.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#155DFC]/50 dark:border-slate-800 dark:bg-card"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-white/95">
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="size-full object-contain"
                      onError={(e) => {
                        ;(e.target as any).src =
                          'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/></svg>'
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.published
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.published ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{item.sortOrder}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="inline-block rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#155DFC] border border-blue-500/20 dark:text-sky-300">
                    {item.category || 'Institution'}
                  </span>
                  <h4 className="mt-1.5 font-bold text-slate-900 text-base group-hover:text-[#155DFC] transition-colors dark:text-white">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                      {item.description}
                    </p>
                  )}
                  {item.websiteUrl && (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#155DFC] dark:hover:text-sky-300"
                    >
                      <ExternalLink className="size-3" /> {item.websiteUrl}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(item)}
                  className="border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 hover:border-[#155DFC] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Pencil className="size-3.5 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={savingId === item.id}
                  onClick={() => deletePartner(item.id)}
                  className="border-slate-200 bg-white text-xs text-red-500 hover:bg-red-50 hover:border-red-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PARTNER ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg my-8 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-card dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1048ca] via-[#155DFC] to-[#0c3694] px-6 py-4.5 text-white">
              <h3 className="text-lg font-bold">
                {editing ? 'Edit Trusted Partner' : 'Add Trusted Partner'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Partner / Institution Name *
                <input
                  required
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Felege Hiwot Hospital, Bahir Dar University"
                  className="h-10 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Sector / Category
                <select
                  value={form.category || 'Hospitals & Biomedical'}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-10 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Hospitals & Biomedical">Hospitals & Biomedical</option>
                  <option value="Universities & Higher Ed">Universities & Higher Ed</option>
                  <option value="Industries & Manufacturing">Industries & Manufacturing</option>
                  <option value="Telecom & Enterprise IT">Telecom & Enterprise IT</option>
                  <option value="Banking & Corporate Systems">Banking & Corporate Systems</option>
                  <option value="Government & Public Agencies">Government & Public Agencies</option>
                  <option value="Other Partner">Other Partner</option>
                </select>
              </label>

              {/* Logo Upload & Preview */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                  Logo Image *
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-white/95">
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt="Preview"
                        className="size-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="size-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Upload className="size-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Logo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <input
                      value={form.logoUrl || ''}
                      onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                      placeholder="Or enter image URL..."
                      className="h-8 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Website URL (optional)
                <input
                  value={form.websiteUrl || ''}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="h-10 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Short Description / Training Scope
                <textarea
                  rows={2}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Biomedical electronics repair cohort for hospital biomedical engineers."
                  className="rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Display Order
                  <input
                    type="number"
                    value={form.sortOrder ?? 0}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="h-10 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-[#155DFC] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published !== false}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="size-4 rounded accent-[#155DFC] cursor-pointer"
                  />
                  <span>Published on Marquee</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 mt-4 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#155DFC] text-white font-bold hover:bg-[#0D4ECC] shadow-md shadow-blue-500/25"
                >
                  {editing ? 'Save Changes' : 'Add Partner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
