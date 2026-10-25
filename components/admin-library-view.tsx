'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Video,
  FileText,
  CircuitBoard,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  Lock,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Layers,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  ChevronDown,
  ChevronUp,
  Upload,
  Loader2,
  Copy,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  UserCheck,
  Phone,
  Mail,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type AdminLibraryItem = {
  id: string
  title: string
  subtitle?: string | null
  category: string
  description?: string | null
  format: string
  level?: string | null
  status: string
  price?: string | null
  priceETB?: number | null
  pages?: string | null
  fileUrl?: string | null
  thumbnailUrl?: string | null
  instructor?: string | null
  instructorRole?: string | null
  rating?: number | null
  reviewCount?: number | null
  badgeText?: string | null
  skillsLearned?: string | null
  lessons?: string | null
  chapters?: string | null
  published: boolean
  sortOrder: number
  createdAt?: string
}

export type AdminDigitalPurchase = {
  id: string
  studentId: string
  resourceId: string
  title: string
  format: string
  amount: number
  paymentMethod: string
  transactionRef: string
  status: 'Pending' | 'Active' | 'Rejected'
  progress: number
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    fullName: string
    studentId: string
    phone: string
    institutionalEmail?: string | null
    personalEmail?: string | null
  }
}

type AdminLibraryViewProps = {
  items: AdminLibraryItem[]
  categories: string[]
  onRefresh: () => void
  onEdit: (item: AdminLibraryItem) => void
  onCreate: () => void
  onDelete: (id: string, title: string) => void
}

export function AdminLibraryView({
  items,
  categories,
  onRefresh,
  onEdit,
  onCreate,
  onDelete,
}: AdminLibraryViewProps) {
  // Main Sub-Tab switcher: 'catalog' | 'purchases'
  const [subTab, setSubTab] = useState<'catalog' | 'purchases'>('catalog')

  // Catalog search & filters
  const [search, setSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Purchases state
  const [purchases, setPurchases] = useState<AdminDigitalPurchase[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(false)
  const [purchaseSearch, setPurchaseSearch] = useState('')
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<'All' | 'Pending' | 'Active' | 'Rejected'>('All')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Fetch purchases
  const loadPurchases = async () => {
    setLoadingPurchases(true)
    try {
      const res = await fetch('/api/admin/purchases')
      if (res.ok) {
        const data = await res.json()
        setPurchases(data.purchases || [])
      }
    } catch (err) {
      console.error('Failed to load purchases:', err)
    } finally {
      setLoadingPurchases(false)
    }
  }

  useEffect(() => {
    loadPurchases()
  }, [])

  // Catalog Metrics
  const totalItems = items.length
  const videoCount = items.filter((i) => (i.format || '').toLowerCase().includes('video')).length
  const manualCount = items.filter((i) => !(i.format || '').toLowerCase().includes('video')).length
  const availableCount = items.filter((i) => i.status === 'Available').length

  // Purchases Metrics
  const pendingPurchases = purchases.filter((p) => p.status === 'Pending')
  const activePurchases = purchases.filter((p) => p.status === 'Active')
  const totalETBRevenue = activePurchases.reduce((sum, p) => sum + (p.amount || 0), 0)

  // Filter Catalog
  const filteredCatalog = items.filter((item) => {
    const q = search.toLowerCase()
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    const matchesFormat =
      formatFilter === 'All'
        ? true
        : formatFilter === 'Video'
        ? (item.format || '').toLowerCase().includes('video')
        : !(item.format || '').toLowerCase().includes('video')
    const matchesStatus =
      statusFilter === 'All' ? true : item.status === statusFilter

    return matchesSearch && matchesFormat && matchesStatus
  })

  // Filter Purchases
  const filteredPurchases = purchases.filter((p) => {
    const q = purchaseSearch.toLowerCase()
    const matchesSearch =
      (p.title || '').toLowerCase().includes(q) ||
      (p.transactionRef || '').toLowerCase().includes(q) ||
      (p.student?.fullName || '').toLowerCase().includes(q) ||
      (p.student?.phone || '').toLowerCase().includes(q) ||
      (p.student?.studentId || '').toLowerCase().includes(q) ||
      (p.paymentMethod || '').toLowerCase().includes(q)

    const matchesStatus =
      purchaseStatusFilter === 'All' ? true : p.status === purchaseStatusFilter

    return matchesSearch && matchesStatus
  })

  // Approve / Reject purchase
  const handleUpdateStatus = async (id: string, newStatus: 'Active' | 'Rejected' | 'Pending') => {
    setActionLoadingId(id)
    try {
      const res = await fetch('/api/admin/purchases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to update purchase')
        return
      }
      setPurchases((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )
    } catch (err: any) {
      alert(err.message || 'Error updating purchase')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Delete purchase
  const handleDeletePurchase = async (id: string, studentName?: string) => {
    if (!confirm(`Are you sure you want to delete this purchase order for ${studentName || 'this student'}?`)) {
      return
    }
    setActionLoadingId(id)
    try {
      const res = await fetch(`/api/admin/purchases?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete purchase')
        return
      }
      setPurchases((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error deleting purchase')
    } finally {
      setActionLoadingId(null)
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* ─── Top Sub-Navigation Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <BookOpen className="size-4" />
            Online Courses Catalog ({totalItems})
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('purchases')
              loadPurchases()
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
              subTab === 'purchases'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <ShoppingBag className="size-4" />
            Student Purchases &amp; Approvals
            {pendingPurchases.length > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                {pendingPurchases.length} Pending
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'catalog' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="rounded-xl text-xs gap-1.5"
                title="Refresh database records"
              >
                <RefreshCw className="size-3.5" /> Refresh
              </Button>
              <Button
                size="sm"
                onClick={onCreate}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="size-4" /> + Add Online Course / Resource
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={loadPurchases}
              disabled={loadingPurchases}
              className="rounded-xl text-xs gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${loadingPurchases ? 'animate-spin' : ''}`} /> Refresh Orders
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VIEW 1: DIGITAL LIBRARY CATALOG                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'catalog' && (
        <div className="space-y-6">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Online Offerings
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{totalItems}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Online Video Courses
              </span>
              <p className="mt-1 text-2xl font-black text-blue-600 dark:text-sky-400">
                {videoCount}
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Manuals &amp; Schematics
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{manualCount}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Available Online
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {availableCount}
              </p>
            </div>
          </div>

          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search online courses, manuals, topics..."
                  className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1 text-xs">
                {['All', 'Video', 'Manual'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormatFilter(fmt)}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                      formatFilter === fmt
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {fmt === 'All' ? 'All Types' : fmt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1 text-xs">
                {['All', 'Available', 'Coming Soon'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                      statusFilter === st
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Digital Library Items Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((item) => {
              const isVideo = (item.format || '').toLowerCase().includes('video')
              let lessonsCount = 0
              let chaptersCount = 0
              try {
                if (item.lessons) lessonsCount = JSON.parse(item.lessons).length
                if (item.chapters) chaptersCount = JSON.parse(item.chapters).length
              } catch {}

              const priceNumber =
                item.priceETB ?? (parseInt(String(item.price || '').replace(/[^0-9]/g, ''), 10) || 0)

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                        {isVideo ? <Video className="size-5" /> : <BookOpen className="size-5" />}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'Available'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-black text-blue-600 dark:text-sky-400">
                          {priceNumber > 0 ? `${priceNumber} ETB` : 'Free Gift'}
                        </span>
                      </div>
                    </div>

                    {/* Category & Title */}
                    <span className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                      {item.category}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="mt-0.5 text-xs text-muted-foreground font-medium line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Metadata Pill Row */}
                    <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                      <span className="font-semibold text-foreground">{item.format}</span>
                      <span className="font-mono text-[11px]">
                        {isVideo
                          ? `${lessonsCount} HD Lessons`
                          : `${chaptersCount || item.pages || 'Full'} Chapters`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground truncate">
                      By: <strong>{item.instructor || 'Hello Technology'}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 rounded-xl text-xs gap-1 hover:border-blue-500"
                      >
                        <Pencil className="size-3 text-blue-600 dark:text-sky-400" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item.id, item.title)}
                        className="h-8 rounded-xl text-xs gap-1 text-destructive hover:bg-destructive/10 hover:border-destructive"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredCatalog.length === 0 && (
            <div className="rounded-3xl border border-dashed p-12 text-center bg-card">
              <BookOpen className="size-10 mx-auto text-muted-foreground opacity-40 mb-2" />
              <h3 className="text-base font-bold">No Online Courses Match Query</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search query or add a new online course.
              </p>
              <Button
                onClick={onCreate}
                size="sm"
                className="mt-4 rounded-xl bg-blue-600 text-white font-bold"
              >
                + Add Online Course / Resource
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VIEW 2: STUDENT PURCHASES & LICENSE APPROVALS                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'purchases' && (
        <div className="space-y-6">
          {/* Top KPI Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Purchase Orders
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{purchases.length}</p>
            </div>
            <div className="rounded-2xl border bg-amber-500/10 border-amber-500/30 p-4 shadow-sm">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-3.5" /> Pending Approval
              </span>
              <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">
                {pendingPurchases.length}
              </p>
              <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 font-medium">
                Waiting for payment check
              </span>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active &amp; Licensed
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {activePurchases.length}
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Revenue
              </span>
              <p className="mt-1 text-2xl font-black text-blue-600 dark:text-sky-400">
                {totalETBRevenue.toLocaleString()} ETB
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  placeholder="Search by student, phone, student ID, or transaction code..."
                  className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1 text-xs">
                {(['All', 'Pending', 'Active', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPurchaseStatusFilter(st)}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                      purchaseStatusFilter === st
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {st === 'Pending' ? `⏳ Pending (${pendingPurchases.length})` : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purchases Table */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Digital Resource</th>
                    <th className="p-4">Payment &amp; Transaction Code</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">License Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPurchases.map((purchase) => {
                    const isPending = purchase.status === 'Pending'
                    const isActive = purchase.status === 'Active'
                    const isRejected = purchase.status === 'Rejected'
                    const isLoading = actionLoadingId === purchase.id

                    return (
                      <tr
                        key={purchase.id}
                        className={`transition-colors ${
                          isPending
                            ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                            : 'hover:bg-muted/20'
                        }`}
                      >
                        {/* Student Details */}
                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                              <User className="size-3.5 text-blue-600" />
                              {purchase.student?.fullName || 'Student'}
                            </p>
                            {purchase.student?.studentId && (
                              <span className="inline-block rounded-md bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-600 dark:text-sky-400">
                                {purchase.student.studentId}
                              </span>
                            )}
                            <div className="flex flex-col text-[11px] text-muted-foreground gap-0.5">
                              {purchase.student?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="size-3 text-muted-foreground" />
                                  {purchase.student.phone}
                                </span>
                              )}
                              {(purchase.student?.institutionalEmail || purchase.student?.personalEmail) && (
                                <span className="flex items-center gap-1 truncate max-w-[200px]">
                                  <Mail className="size-3 text-muted-foreground" />
                                  {purchase.student.institutionalEmail || purchase.student.personalEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Digital Resource */}
                        <td className="p-4 align-top">
                          <div className="space-y-1 max-w-[240px]">
                            <p className="font-bold text-foreground line-clamp-2">
                              {purchase.title}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              {(purchase.format || '').toLowerCase().includes('video') ? (
                                <Video className="size-3 text-blue-600" />
                              ) : (
                                <BookOpen className="size-3 text-amber-600" />
                              )}
                              {purchase.format || 'Digital Resource'}
                            </span>
                          </div>
                        </td>

                        {/* Payment & Transaction Code */}
                        <td className="p-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-foreground">
                                {purchase.amount > 0 ? `${purchase.amount} ETB` : 'Free Gift'}
                              </span>
                              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {purchase.paymentMethod}
                              </span>
                            </div>

                            {purchase.transactionRef && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="font-mono text-[11px] font-bold text-foreground bg-muted/80 px-2 py-0.5 rounded-md border">
                                  {purchase.transactionRef}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(purchase.transactionRef, purchase.id)}
                                  className="p-1 rounded hover:bg-muted text-muted-foreground"
                                  title="Copy transaction reference"
                                >
                                  {copiedKey === purchase.id ? (
                                    <Check className="size-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-4 align-top text-muted-foreground text-[11px] whitespace-nowrap">
                          {purchase.createdAt
                            ? new Date(purchase.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </td>

                        {/* Status */}
                        <td className="p-4 align-top">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                              <Clock className="size-3" /> Waiting Approval
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Active &amp; Unlocked
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-500/20">
                              <X className="size-3" /> Payment Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={isLoading}
                                  onClick={() => handleUpdateStatus(purchase.id, 'Active')}
                                  className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1 shadow-sm shadow-emerald-600/20"
                                >
                                  {isLoading ? (
                                    <Loader2 className="size-3 animate-spin" />
                                  ) : (
                                    <Check className="size-3.5" />
                                  )}
                                  Approve &amp; Unlock
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isLoading}
                                  onClick={() => handleUpdateStatus(purchase.id, 'Rejected')}
                                  className="h-8 rounded-xl text-xs gap-1 text-rose-600 hover:bg-rose-500/10 hover:border-rose-500"
                                >
                                  <X className="size-3" /> Reject
                                </Button>
                              </>
                            )}

                            {isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => handleUpdateStatus(purchase.id, 'Pending')}
                                className="h-8 rounded-xl text-xs gap-1 text-amber-600 hover:bg-amber-500/10"
                                title="Revert to pending state"
                              >
                                Revoke / Re-verify
                              </Button>
                            )}

                            {isRejected && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => handleUpdateStatus(purchase.id, 'Active')}
                                className="h-8 rounded-xl text-xs gap-1 text-emerald-600 hover:bg-emerald-500/10"
                              >
                                <Check className="size-3" /> Approve Now
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isLoading}
                              onClick={() => handleDeletePurchase(purchase.id, purchase.student?.fullName)}
                              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                              title="Delete purchase order"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredPurchases.length === 0 && (
              <div className="p-12 text-center">
                <ShoppingBag className="size-10 mx-auto text-muted-foreground opacity-40 mb-2" />
                <h3 className="text-base font-bold">No Purchase Orders Found</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {purchases.length === 0
                    ? 'When students purchase digital video masterclasses or repair manuals via Telebirr or CBE Bank, their payment references will appear here for one-click approval.'
                    : 'No orders match your search and status filters.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Admin Modal: Create & Edit Digital Resource with Price & Lessons
// ─────────────────────────────────────────────────────────────
type AdminLibraryModalProps = {
  item: Partial<AdminLibraryItem> | null
  categories: string[]
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<AdminLibraryItem>) => Promise<void>
}

export function AdminLibraryModal({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
}: AdminLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'lessons' | 'chapters'>('general')
  const [saving, setSaving] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('')
  const [format, setFormat] = useState('Video Masterclass')
  const [priceETB, setPriceETB] = useState<number>(850)
  const [level, setLevel] = useState('All Skill Levels')
  const [status, setStatus] = useState('Available')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [instructor, setInstructor] = useState('Master Tech Haile')
  const [instructorRole, setInstructorRole] = useState('Lead Hardware Diagnostic Instructor')
  const [badgeText, setBadgeText] = useState('')
  const [published, setPublished] = useState(true)

  // Dynamic Lessons Builder
  const [lessonsList, setLessonsList] = useState<
    { id: string; title: string; duration: string; summary: string; videoUrl?: string }[]
  >([])

  // Dynamic Chapters Builder
  const [chaptersList, setChaptersList] = useState<
    { id: string; title: string; pageRange: string; summary: string }[]
  >([])

  useEffect(() => {
    if (item) {
      setTitle(item.title || '')
      setSubtitle(item.subtitle || '')
      setCategory(item.category || categories[0] || 'Smartphone Hardware')
      setFormat(item.format || 'Video Masterclass')
      const calculatedPrice =
        item.priceETB ??
        (item.price ? parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0 : 450)
      setPriceETB(calculatedPrice)
      setLevel(item.level || 'All Skill Levels')
      setStatus(item.status || 'Available')
      setDescription(item.description || '')
      setFileUrl(item.fileUrl || '')
      setInstructor(item.instructor || 'Hello Technology Faculty')
      setInstructorRole(item.instructorRole || 'Technical Instructor')
      setBadgeText(item.badgeText || '')
      setPublished(typeof item.published === 'boolean' ? item.published : true)

      try {
        if (item.lessons) setLessonsList(JSON.parse(item.lessons))
        else setLessonsList([])
      } catch {
        setLessonsList([])
      }

      try {
        if (item.chapters) setChaptersList(JSON.parse(item.chapters))
        else setChaptersList([])
      } catch {
        setChaptersList([])
      }
    }
  }, [item, categories])

  if (!isOpen) return null

  const handleAddLesson = () => {
    const newIdx = lessonsList.length + 1
    setLessonsList([
      ...lessonsList,
      {
        id: `l${Date.now()}`,
        title: `Lesson ${newIdx}: Practical Diagnostic Procedure`,
        duration: '15:00',
        summary: 'Bench procedure notes and multimeter testing.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
    ])
  }

  const handleAddChapter = () => {
    const newIdx = chaptersList.length + 1
    setChaptersList([
      ...chaptersList,
      {
        id: `c${Date.now()}`,
        title: `Chapter ${newIdx}: Circuit Power Sequencing & Schematics`,
        pageRange: `Pages ${newIdx * 20 - 19} - ${newIdx * 20}`,
        summary: 'Detailed circuit breakdown, test points, and fault isolation.',
      },
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        id: item?.id,
        title,
        subtitle,
        category,
        format,
        price: `${priceETB} ETB`,
        priceETB,
        level,
        status,
        description,
        fileUrl: fileUrl.trim() || null,
        instructor,
        instructorRole,
        badgeText,
        published,
        lessons: JSON.stringify(lessonsList),
        chapters: JSON.stringify(chaptersList),
      })
      onClose()
    } catch (err: any) {
      alert(err.message || 'Failed to save digital resource')
    } finally {
      setSaving(false)
    }
  }

  const isVideo = format.toLowerCase().includes('video')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-3xl rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div>
            <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-sky-400">
              Admin Online Courses &amp; Resources Manager
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
              {item?.id ? 'Edit Online Course / Resource' : 'Add Online Course / Resource'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set title, ETB tuition fee, video lessons curriculum, PDF manuals, and DRM protection settings for instant online registration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-4 pb-2 border-b text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'general'
                ? 'bg-blue-600 text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            General &amp; Pricing
          </button>
          {isVideo ? (
            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'lessons'
                  ? 'bg-blue-600 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Video Lessons Curriculum ({lessonsList.length})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('chapters')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'chapters'
                  ? 'bg-blue-600 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Manual Chapters &amp; Schematics ({chaptersList.length})
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Title & Subtitle */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Recorded Mobile Micro-Soldering Fundamentals"
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Subtitle / Highlight Summary
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. 18 Step-by-Step Practical HD Video Lessons with Bench Demonstrations"
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Format & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Resource Format *
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Video Masterclass">🎥 Video Masterclass</option>
                    <option value="Technical Repair Manual">📘 Technical Repair Manual</option>
                    <option value="Schematic & Circuit Handbook">⚡ Schematic &amp; Circuit Handbook</option>
                    <option value="Quick Reference Guide">🛠️ Quick Reference Guide</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Smartphone Hardware or Computer Maintenance"
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Pricing & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Price in ETB (Birr) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      required
                      value={priceETB}
                      onChange={(e) => setPriceETB(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-input bg-background pl-3 pr-12 text-xs font-black outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ETB
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    {priceETB === 0 ? 'Complimentary for all students' : `Displayed as ${priceETB} ETB`}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Availability Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Available">Available to Buy &amp; Study</option>
                    <option value="Coming Soon">Coming Soon (Preview Only)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Skill Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="All Skill Levels">All Skill Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced Technician</option>
                  </select>
                </div>
              </div>

              {/* Instructor & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Instructor / Author Name
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g. Master Tech Haile"
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Promotional Badge Tag
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. Bestseller Video Masterclass"
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Full Description &amp; Syllabus Overview
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive summary of circuit diagnostic steps and lab exercises..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* PDF Manual URL & Direct Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground">
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
                            setFileUrl(d.url)
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
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/uploads/manuals/... or https://..."
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-mono"
                  />
                  {uploadingPdf && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 px-3 py-1.5 bg-blue-500/10 rounded-xl whitespace-nowrap">
                      <Loader2 className="size-3.5 animate-spin" /> Uploading PDF...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published_checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="size-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="published_checkbox" className="text-xs font-semibold cursor-pointer">
                  Publish resource on public online courses catalog and student portal
                </label>
              </div>
            </div>
          )}

          {/* Lessons Tab (for Video courses) */}
          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold text-foreground">
                  Recorded Video Curriculum ({lessonsList.length} Lessons)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddLesson}
                  className="rounded-xl text-xs gap-1 bg-blue-600 text-white font-bold"
                >
                  <Plus className="size-3.5" /> Add Lesson
                </Button>
              </div>

              {lessonsList.map((lesson, idx) => (
                <div key={lesson.id} className="p-4 rounded-2xl border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-sky-400 font-mono">
                      Lesson {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLessonsList(lessonsList.filter((_, i) => i !== idx))}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Lesson Title</label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => {
                          const updated = [...lessonsList]
                          updated[idx].title = e.target.value
                          setLessonsList(updated)
                        }}
                        className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => {
                          const updated = [...lessonsList]
                          updated[idx].duration = e.target.value
                          setLessonsList(updated)
                        }}
                        placeholder="e.g. 18:30"
                        className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Video URL with MP4 Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Video Stream URL
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-sky-400 hover:underline">
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
                                const updated = [...lessonsList]
                                updated[idx].videoUrl = d.url
                                setLessonsList(updated)
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
                        type="text"
                        value={lesson.videoUrl || ''}
                        onChange={(e) => {
                          const updated = [...lessonsList]
                          updated[idx].videoUrl = e.target.value
                          setLessonsList(updated)
                        }}
                        placeholder="https://... or /uploads/videos/..."
                        className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-mono"
                      />
                      {uploadingVideoIdx === idx && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-600 px-2 py-1 bg-blue-500/10 rounded-md whitespace-nowrap">
                          <Loader2 className="size-3 animate-spin" /> Uploading Video...
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Lab Summary &amp; Notes</label>
                    <input
                      type="text"
                      value={lesson.summary}
                      onChange={(e) => {
                        const updated = [...lessonsList]
                        updated[idx].summary = e.target.value
                        setLessonsList(updated)
                      }}
                      className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs"
                    />
                  </div>
                </div>
              ))}

              {lessonsList.length === 0 && (
                <div className="p-8 text-center border border-dashed rounded-2xl text-xs text-muted-foreground">
                  No video lessons added yet. Click &quot;Add Lesson&quot; to build the curriculum.
                </div>
              )}
            </div>
          )}

          {/* Chapters Tab (for Manuals & Books) */}
          {activeTab === 'chapters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold text-foreground">
                  Manual Chapters ({chaptersList.length} Chapters)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddChapter}
                  className="rounded-xl text-xs gap-1 bg-blue-600 text-white font-bold"
                >
                  <Plus className="size-3.5" /> Add Chapter
                </Button>
              </div>

              {chaptersList.map((chap, idx) => (
                <div key={chap.id} className="p-4 rounded-2xl border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-sky-400 font-mono">
                      Chapter {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChaptersList(chaptersList.filter((_, i) => i !== idx))}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Chapter Title</label>
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => {
                          const updated = [...chaptersList]
                          updated[idx].title = e.target.value
                          setChaptersList(updated)
                        }}
                        className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Page Range</label>
                      <input
                        type="text"
                        value={chap.pageRange}
                        onChange={(e) => {
                          const updated = [...chaptersList]
                          updated[idx].pageRange = e.target.value
                          setChaptersList(updated)
                        }}
                        placeholder="e.g. Pages 5 - 34"
                        className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-0.5">Chapter Summary</label>
                    <input
                      type="text"
                      value={chap.summary}
                      onChange={(e) => {
                        const updated = [...chaptersList]
                        updated[idx].summary = e.target.value
                        setChaptersList(updated)
                      }}
                      className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs"
                    />
                  </div>
                </div>
              ))}

              {chaptersList.length === 0 && (
                <div className="p-8 text-center border border-dashed rounded-2xl text-xs text-muted-foreground">
                  No chapters added yet. Click &quot;Add Chapter&quot; to build the manual contents.
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
            >
              {saving ? 'Saving...' : 'Save & Sync to Live Database'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
