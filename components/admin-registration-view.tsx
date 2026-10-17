'use client'

import { useState } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  CheckCheck,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Loader2,
  X,
  FileText,
  CreditCard,
  Send,
  Sparkles,
  Plus,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/components/ui/dialog-modal'
import type { BatchItem } from './admin-batch-view'

export type AdminRegistration = {
  id: string
  registrationNumber: string
  fullName: string
  phone: string
  email: string | null
  telegramUsername: string | null
  city: string | null
  courseTitle: string
  shift: string
  education: string | null
  experienceYears: string | null
  paymentPlan: string
  paymentMethod: string
  basePrice: number
  discount: number
  finalPrice: number
  couponCode: string | null
  transactionRef: string | null
  receiptUrl: string | null
  confirmationLink: string | null
  status: string // 'Pending' | 'Approved' | 'Rejected' | 'Enrolled'
  adminNotes: string | null
  approvedAt: string | null
  approvedBy: string | null
  createdAt: string
  updatedAt?: string
  batchId?: string | null
  batch?: {
    id: string
    batchNumber: string
    title: string
    status: string
  } | null
}

export type RegistrationOverview = {
  total: number
  pending: number
  approved: number
  rejected: number
  enrolled: number
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; border: string; icon: any }
> = {
  Pending: {
    label: 'Pending Approval',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    icon: Clock,
  },
  Approved: {
    label: 'Approved',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  Enrolled: {
    label: 'Enrolled / Paid',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
    icon: GraduationCap,
  },
  Rejected: {
    label: 'Rejected',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800',
    icon: XCircle,
  },
}

export function RegistrationsView({
  items,
  overview,
  batches = [],
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  savingId,
  onUpdateStatus,
  onBulkUpdateStatus,
  onDelete,
  onBulkDelete,
  onSaveNotes,
  onAssignToBatch,
  onRemoveFromBatch,
  onNavigateToBatches,
}: {
  items: AdminRegistration[]
  overview: RegistrationOverview
  batches?: BatchItem[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  savingId: string | null
  onUpdateStatus: (id: string, status: string) => Promise<void>
  onBulkUpdateStatus: (ids: string[], status: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onBulkDelete: (ids: string[]) => Promise<void>
  onSaveNotes: (id: string, notes: string) => Promise<void>
  onAssignToBatch?: (data: {
    batchId: string
    registrationId?: string
    studentName?: string
    phone?: string
    courseTitle: string
    shift: string
    status?: string
  }) => Promise<boolean>
  onRemoveFromBatch?: (registrationId: string) => Promise<boolean>
  onNavigateToBatches?: () => void
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [inspectItem, setInspectItem] = useState<AdminRegistration | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [batchFilter, setBatchFilter] = useState<string>('All')

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Filter
  const filtered = items.filter((r) => {
    const q = search.toLowerCase()
    const matchesQuery =
      r.fullName.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.courseTitle.toLowerCase().includes(q) ||
      r.registrationNumber.toLowerCase().includes(q) ||
      (r.transactionRef && r.transactionRef.toLowerCase().includes(q)) ||
      (r.telegramUsername && r.telegramUsername.toLowerCase().includes(q))

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Pending'
        ? r.status === 'Pending'
        : statusFilter === 'Approved'
        ? r.status === 'Approved'
        : statusFilter === 'Enrolled'
        ? r.status === 'Enrolled'
        : statusFilter === 'Rejected'
        ? r.status === 'Rejected'
        : true

    const matchesBatch =
      batchFilter === 'All'
        ? true
        : batchFilter === 'unassigned'
        ? !r.batchId && !r.batch
        : r.batchId === batchFilter || r.batch?.id === batchFilter

    return matchesQuery && matchesStatus && matchesBatch
  })

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(filtered.map((f) => f.id))
  }
  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((x) => x !== id))
    else setSelectedIds([...selectedIds, id])
  }

  return (
    <div className="space-y-6">
      {/* ── METRICS OVERVIEW ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          onClick={() => setStatusFilter('All')}
          className={`cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition hover:border-blue-500/50 ${
            statusFilter === 'All' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Total Applications</span>
            <FileText className="size-4 text-blue-600 dark:text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">{overview.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">All course applicants</p>
        </div>

        <div
          onClick={() => setStatusFilter('Pending')}
          className={`cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition hover:border-amber-500/50 ${
            statusFilter === 'Pending' ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>Pending Approval</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{overview.pending}</p>
            {overview.pending > 0 && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-300">
                Action required
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting admission review</p>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition hover:border-emerald-500/50 ${
            statusFilter === 'Approved' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span>Approved</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {overview.approved}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Confirmed & verified</p>
        </div>

        <div
          onClick={() => setStatusFilter('Enrolled')}
          className={`cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition hover:border-blue-500/50 ${
            statusFilter === 'Enrolled' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Enrolled Students</span>
            <GraduationCap className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {overview.enrolled}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Fully attending cohort</p>
        </div>
      </div>

      {/* ── TOOLBAR & FILTERS ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border bg-card p-1">
          {['All', 'Pending', 'Approved', 'Enrolled', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {st}
              {st === 'Pending' && overview.pending > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-black text-white">
                  {overview.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch (ዙር) Filter */}
          {batches.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl border bg-card px-2.5 py-1.5 text-xs shadow-xs">
              <Layers className="size-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
              <span className="font-semibold text-muted-foreground text-[11px]">Batch:</span>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="bg-transparent font-bold text-foreground outline-none cursor-pointer text-xs"
              >
                <option value="All">All Batches (ሁሉም ዙሮች)</option>
                <option value="unassigned">Unassigned (No Batch)</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} · {b.status} ({b.enrolledCount || 0} students)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, course, Reg#..."
              className="h-10 w-full min-w-[260px] rounded-xl border bg-card pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <a
            href={`/api/admin/registrations?format=csv${statusFilter !== 'All' ? `&status=${statusFilter}` : ''}`}
            download
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border bg-card px-3 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            <Download className="size-3.5 text-muted-foreground" />
            Export CSV
          </a>
        </div>
      </div>

      {/* ── BULK ACTION BAR ── */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs font-medium text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600 dark:text-sky-400">
              {selectedIds.length} registration{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onBulkUpdateStatus(selectedIds, 'Approved')}
              className="h-8 bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold"
            >
              <CheckCircle2 className="size-3.5 mr-1" /> Approve Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkUpdateStatus(selectedIds, 'Rejected')}
              className="h-8 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 text-xs"
            >
              <XCircle className="size-3.5 mr-1" /> Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkDelete(selectedIds)}
              className="h-8 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 text-xs"
            >
              <Trash2 className="size-3.5 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* ── REGISTRATIONS TABLE ── */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-3.5">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {allSelected ? (
                      <CheckSquare className="size-4 text-blue-600" />
                    ) : (
                      <Square className="size-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5">Applicant & Contact</th>
                <th className="px-4 py-3.5">Course & Shift</th>
                <th className="px-4 py-3.5">Payment & Proof</th>
                <th className="px-4 py-3.5">Workflow Status</th>
                <th className="px-4 py-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-blue-600" />
                    <p className="mt-2 text-xs text-muted-foreground">Loading applications...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    No registrations found matching the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending
                  const StatusIcon = statusConf.icon
                  const isSelected = selectedIds.includes(item.id)
                  const isSaving = savingId === item.id

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-muted/40 ${
                        isSelected ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleSelectOne(item.id)}
                          className="flex items-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4 text-blue-600" />
                          ) : (
                            <Square className="size-4 text-muted-foreground" />
                          )}
                        </button>
                      </td>

                      {/* Applicant & Contact */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">
                              {item.fullName}
                            </span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                              {item.registrationNumber}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                            <a
                              href={`tel:${item.phone}`}
                              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-sky-400"
                            >
                              <Phone className="size-3" /> {item.phone}
                            </a>

                            {item.telegramUsername && (
                              <a
                                href={`https://t.me/${item.telegramUsername.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sky-500 hover:underline"
                              >
                                <Send className="size-3" /> {item.telegramUsername}
                              </a>
                            )}

                            {item.email && (
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Mail className="size-3" /> {item.email}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-muted-foreground">
                            Applied on {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Course & Shift */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <span className="font-semibold text-foreground line-clamp-1">
                            {item.courseTitle}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-sky-300 font-medium">
                            <Clock className="size-3 shrink-0" /> {item.shift}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {/* Academic Batch (ዙር) Badge */}
                            {item.batch ? (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (onNavigateToBatches) onNavigateToBatches()
                                }}
                                className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-sky-300 w-fit cursor-pointer hover:bg-blue-500/20"
                                title={`Batch: ${item.batch.batchNumber} - ${item.batch.title}`}
                              >
                                <Layers className="size-2.5 text-blue-600 dark:text-sky-400 shrink-0" />
                                {item.batch.batchNumber}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70">
                                <Layers className="size-2.5 text-muted-foreground/60 shrink-0" />
                                No Batch
                              </span>
                            )}
                          </div>
                          {item.education && (
                            <span className="text-[10px] text-muted-foreground">
                              Edu: {item.education}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment & Proof */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-foreground">
                              {item.finalPrice} Birr
                            </span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                              {item.paymentMethod}
                            </span>
                          </div>

                          {item.transactionRef && (
                            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                              <span>Ref: {item.transactionRef}</span>
                              <button
                                onClick={() => handleCopy(item.transactionRef || '', `ref-${item.id}`)}
                                title="Copy Transaction Reference"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copiedKey === `ref-${item.id}` ? (
                                  <CheckCheck className="size-3 text-emerald-500" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            </div>
                          )}

                          {item.receiptUrl && (
                            <a
                              href={item.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-sky-400"
                            >
                              <ExternalLink className="size-3" /> View Bank Receipt
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Workflow Status */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold w-fit ${statusConf.badge}`}
                          >
                            <StatusIcon className="size-3.5" />
                            {statusConf.label}
                          </span>

                          {item.status === 'Approved' && item.approvedAt && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              Approved {new Date(item.approvedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Approval Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'Approved' && (
                            <Button
                              size="sm"
                              disabled={isSaving}
                              onClick={() => onUpdateStatus(item.id, 'Approved')}
                              className="h-8 bg-emerald-600 text-white hover:bg-emerald-500 font-semibold px-2.5 text-xs shadow-sm"
                            >
                              {isSaving ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="size-3.5 mr-1" /> Approve
                                </>
                              )}
                            </Button>
                          )}

                          {item.status === 'Approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSaving}
                              onClick={() => onUpdateStatus(item.id, 'Enrolled')}
                              className="h-8 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 px-2.5 text-xs font-semibold"
                            >
                              <GraduationCap className="size-3.5 mr-1" /> Enroll
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setInspectItem(item)}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            title="Inspect application details"
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isSaving}
                            onClick={() => onDelete(item.id)}
                            className="h-8 px-2 text-rose-500 hover:text-rose-600"
                            title="Delete registration"
                          >
                            <Trash2 className="size-4" />
                          </Button>
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

      {/* ── INSPECT REGISTRATION MODAL ── */}
      {inspectItem && (
        <RegistrationDetailsModal
          open={!!inspectItem}
          onClose={() => setInspectItem(null)}
          item={inspectItem}
          batches={batches}
          onAssignToBatch={onAssignToBatch}
          onRemoveFromBatch={onRemoveFromBatch}
          onNavigateToBatches={onNavigateToBatches}
          onUpdateStatus={async (status) => {
            await onUpdateStatus(inspectItem.id, status)
            setInspectItem((prev) => (prev ? { ...prev, status } : null))
          }}
          onSaveNotes={async (notes) => {
            await onSaveNotes(inspectItem.id, notes)
            setInspectItem((prev) => (prev ? { ...prev, adminNotes: notes } : null))
          }}
        />
      )}
    </div>
  )
}

function RegistrationDetailsModal({
  open,
  onClose,
  item,
  batches = [],
  onUpdateStatus,
  onSaveNotes,
  onAssignToBatch,
  onRemoveFromBatch,
  onNavigateToBatches,
}: {
  open: boolean
  onClose: () => void
  item: AdminRegistration
  batches?: BatchItem[]
  onUpdateStatus: (status: string) => Promise<void>
  onSaveNotes: (notes: string) => Promise<void>
  onAssignToBatch?: (data: {
    batchId: string
    registrationId?: string
    studentName?: string
    phone?: string
    courseTitle: string
    shift: string
    status?: string
  }) => Promise<boolean>
  onRemoveFromBatch?: (registrationId: string) => Promise<boolean>
  onNavigateToBatches?: () => void
}) {
  const [notes, setNotes] = useState(item.adminNotes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const currentBatch = batches.find((b) => b.id === (item.batchId || item.batch?.id))
  const [selectedBatchId, setSelectedBatchId] = useState(
    currentBatch ? currentBatch.id : batches.length > 0 ? batches[0].id : ''
  )
  const [assigningBatch, setAssigningBatch] = useState(false)
  const { confirm, alert } = useConfirm()

  if (!open) return null

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingNotes(true)
    try {
      await onSaveNotes(notes)
      await alert({
        title: 'Notes Saved',
        message: 'Internal staff notes saved successfully.',
        variant: 'success',
      })
    } finally {
      setSavingNotes(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    setActionLoading(true)
    try {
      await onUpdateStatus(status)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-8 rounded-3xl border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{item.fullName}</h3>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-muted-foreground">
                {item.registrationNumber}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Applied {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Status & Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 bg-muted/20">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Current Admission Status
              </span>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  STATUS_CONFIG[item.status]?.badge || 'bg-slate-100'
                }`}
              >
                {item.status}
              </span>
              {item.approvedAt && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (by {item.approvedBy || 'Admin'} on {new Date(item.approvedAt).toLocaleDateString()})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {item.status !== 'Approved' && (
                <Button
                  size="sm"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Approved')}
                  className="bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs"
                >
                  <CheckCircle2 className="size-3.5 mr-1" /> Approve Admission
                </Button>
              )}
              {item.status !== 'Rejected' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Rejected')}
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 text-xs"
                >
                  <XCircle className="size-3.5 mr-1" /> Reject
                </Button>
              )}
              {item.status !== 'Enrolled' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Enrolled')}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-900 text-xs"
                >
                  <GraduationCap className="size-3.5 mr-1" /> Mark Enrolled
                </Button>
              )}
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact Details
              </h4>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <a href={`tel:${item.phone}`} className="font-semibold text-blue-600 dark:text-sky-400">
                    {item.phone}
                  </a>
                </div>
                {item.telegramUsername && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telegram:</span>
                    <a
                      href={`https://t.me/${item.telegramUsername.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-sky-500"
                    >
                      {item.telegramUsername}
                    </a>
                  </div>
                )}
                {item.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground">{item.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium text-foreground">{item.city || 'Bahir Dar'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Course & Shift Selection
              </h4>
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground block">Course Track:</span>
                  <span className="font-bold text-foreground text-sm">{item.courseTitle}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Shift:</span>
                  <span className="font-semibold text-blue-600 dark:text-sky-400">{item.shift}</span>
                </div>
                {item.education && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Education:</span>
                    <span className="font-medium text-foreground">{item.education}</span>
                  </div>
                )}
                {item.experienceYears && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium text-foreground">{item.experienceYears}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Batch (ዙር / Cohort Intake) Card */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Layers className="size-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 block">
                    Academic Batch (ዙር / Cohort Intake)
                  </span>
                  <p className="text-xs font-semibold text-foreground">
                    {item.batch ? (
                      <>
                        Enrolled in <strong className="text-blue-600 dark:text-sky-400">{item.batch.batchNumber}</strong>: {item.batch.title}
                        <span className="ml-2 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                          {item.batch.status}
                        </span>
                      </>
                    ) : (
                      'No batch intake allocated yet'
                    )}
                  </p>
                </div>
              </div>

              {onNavigateToBatches && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onNavigateToBatches()
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Manage all batches <ExternalLink className="size-3" />
                </button>
              )}
            </div>

            {batches.length > 0 && onAssignToBatch && (
              <div className="rounded-xl bg-background/80 border p-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Assign / Switch Academic Batch
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full h-9 rounded-lg border bg-background px-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} · {b.title} ({b.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 sm:self-end pt-1 sm:pt-0">
                  <Button
                    size="sm"
                    disabled={assigningBatch || !selectedBatchId || selectedBatchId === item.batch?.id}
                    onClick={async () => {
                      setAssigningBatch(true)
                      try {
                        const ok = await onAssignToBatch({
                          batchId: selectedBatchId,
                          registrationId: item.id,
                          studentName: item.fullName,
                          phone: item.phone,
                          courseTitle: item.courseTitle,
                          shift: item.shift,
                          status: item.status,
                        })
                        if (ok) {
                          const found = batches.find((b) => b.id === selectedBatchId)
                          if (found) {
                            item.batch = {
                              id: found.id,
                              batchNumber: found.batchNumber,
                              title: found.title,
                              status: found.status,
                            }
                            item.batchId = found.id
                          }
                        }
                      } finally {
                        setAssigningBatch(false)
                      }
                    }}
                    className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                  >
                    {assigningBatch ? (
                      <Loader2 className="size-3.5 animate-spin mr-1" />
                    ) : (
                      <Sparkles className="size-3.5 mr-1" />
                    )}
                    {item.batch ? 'Switch Batch' : 'Assign to Batch'}
                  </Button>

                  {item.batch && onRemoveFromBatch && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={assigningBatch}
                      onClick={async () => {
                        const ok = await confirm({
                          title: 'Remove Student from Batch',
                          message: `Are you sure you want to remove ${item.fullName} from ${item.batch?.batchNumber}?`,
                          confirmText: 'Remove',
                          variant: 'danger',
                        })
                        if (!ok) return
                        setAssigningBatch(true)
                        try {
                          const resOk = await onRemoveFromBatch(item.id)
                          if (resOk) {
                            item.batch = null
                            item.batchId = null
                          }
                        } finally {
                          setAssigningBatch(false)
                        }
                      }}
                      className="h-9 text-rose-600 border-rose-300 hover:bg-rose-50 text-xs"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment Proof & Ref Inspection */}
          <div className="rounded-2xl border p-5 bg-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Payment & Bank Verification
            </h4>

            <div className="grid gap-4 sm:grid-cols-3 text-xs mb-4">
              <div className="rounded-xl bg-muted/60 p-3">
                <span className="text-muted-foreground block text-[10px] uppercase">Payment Plan</span>
                <span className="font-bold text-foreground capitalize">
                  {item.paymentPlan === 'full' ? 'Full Access (10% Off)' : 'Installments'}
                </span>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <span className="text-muted-foreground block text-[10px] uppercase">Method</span>
                <span className="font-bold text-foreground capitalize">{item.paymentMethod}</span>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <span className="text-muted-foreground block text-[10px] uppercase">Final Amount</span>
                <span className="font-black text-foreground text-sm">{item.finalPrice} Birr</span>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Transaction Reference:</span>
                <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                  {item.transactionRef || 'None provided'}
                </span>
              </div>

              {item.confirmationLink && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Confirmation Link:</span>
                  <a
                    href={item.confirmationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline dark:text-sky-400 font-medium inline-flex items-center gap-1"
                  >
                    Open link <ExternalLink className="size-3" />
                  </a>
                </div>
              )}

              {item.receiptUrl && (
                <div className="pt-2">
                  <span className="text-muted-foreground font-medium block mb-2">Uploaded Bank Receipt:</span>
                  <div className="rounded-xl border overflow-hidden bg-muted/50 p-2 text-center">
                    <img
                      src={item.receiptUrl}
                      alt="Payment Receipt"
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <a
                      href={item.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline"
                    >
                      <ExternalLink className="size-3" /> Open Full Resolution Receipt
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Internal Staff Notes */}
          <form onSubmit={handleNotesSubmit} className="rounded-2xl border p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Internal Staff Notes & Log
            </h4>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. CBE confirmation checked on 10/16, student called and confirmed morning seat..."
              className="w-full rounded-xl border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" size="sm" disabled={savingNotes} className="text-xs">
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
