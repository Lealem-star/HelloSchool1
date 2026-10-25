'use client'

import React, { useState, useEffect } from 'react'
import {
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Laptop,
  Globe,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  Building2,
  FileSpreadsheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

interface DashboardData {
  period: AnalyticsPeriod
  dateRangeLabel: string
  startDate: string
  endDate: string
  metrics: {
    totalRevenue: number
    registrationRevenue: number
    digitalRevenue: number
    revenueTrendPercent: number

    totalRegistrations: number
    pendingRegistrations: number
    approvedRegistrations: number
    registrationsTrendPercent: number

    totalVisitors: number
    uniqueVisitors: number
    pageViews: number
    visitorsTrendPercent: number
    bounceRate: number
    avgSessionDuration: string

    totalInquiries: number
    companyInquiries: number
    conversionRate: number
  }
  timeline: {
    label: string
    date: string
    revenue: number
    registrations: number
    visitors: number
  }[]
  trafficSources: {
    source: string
    percentage: number
    visitors: number
    color: string
  }[]
  deviceBreakdown: {
    device: string
    percentage: number
    count: number
  }[]
  coursePerformance: {
    courseTitle: string
    enrolledCount: number
    revenueETB: number
    percentage: number
  }[]
  recentTransactions: {
    id: string
    registrationNumber: string
    fullName: string
    phone: string
    courseTitle: string
    amount: number
    paymentMethod: string
    status: string
    createdAt: string
  }[]
}

export function AdminDashboardView({
  onNavigateToRegistrations,
}: {
  onNavigateToRegistrations?: () => void
}) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'registrations' | 'visitors'>('revenue')
  const [hoveredTimelineIndex, setHoveredTimelineIndex] = useState<number | null>(null)

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize custom dates with default last 30 days
  useEffect(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    setCustomEnd(today.toISOString().slice(0, 10))
    setCustomStart(thirtyDaysAgo.toISOString().slice(0, 10))
  }, [])

  const fetchAnalytics = async (selectedPeriod = period, start = customStart, end = customEnd) => {
    setLoading(true)
    setError(null)
    try {
      let url = `/api/admin/analytics?period=${selectedPeriod}`
      if (selectedPeriod === 'custom' && start && end) {
        url += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`
      }
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error('Failed to load institutional analytics')
      }
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (period !== 'custom') {
      fetchAnalytics(period)
    }
  }, [period])

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return
    setPeriod('custom')
    fetchAnalytics('custom', customStart, customEnd)
  }

  const exportReportCsv = () => {
    if (!data) return
    const rows = [
      ['Hello Technology Training Center - Analytics & Performance Report'],
      ['Report Period', data.dateRangeLabel],
      ['Generated On', new Date().toLocaleString()],
      [''],
      ['METRIC', 'VALUE'],
      ['Total Revenue (ETB)', data.metrics.totalRevenue],
      ['Online Registration Revenue (ETB)', data.metrics.registrationRevenue],
      ['Digital Library Revenue (ETB)', data.metrics.digitalRevenue],
      ['Total Online Registrations', data.metrics.totalRegistrations],
      ['Approved / Active Enrollments', data.metrics.approvedRegistrations],
      ['Pending Registrations', data.metrics.pendingRegistrations],
      ['Total Site Visitors', data.metrics.totalVisitors],
      ['Unique Visitors', data.metrics.uniqueVisitors],
      ['Total Page Views', data.metrics.pageViews],
      ['Inbound Inquiries Captured', data.metrics.totalInquiries],
      ['Corporate Training Inquiries', data.metrics.companyInquiries],
      ['Visitor Conversion Rate (%)', `${data.metrics.conversionRate}%`],
      [''],
      ['TIMELINE BREAKDOWN'],
      ['Date / Label', 'Revenue (ETB)', 'Registrations', 'Visitors'],
      ...data.timeline.map((t) => [t.label, t.revenue, t.registrations, t.visitors]),
      [''],
      ['TOP COURSE ENROLLMENTS'],
      ['Course Title', 'Learners Enrolled', 'Revenue (ETB)', 'Share (%)'],
      ...data.coursePerformance.map((c) => [c.courseTitle, c.enrolledCount, c.revenueETB, `${c.percentage}%`]),
    ]

    const csvContent = '\uFEFF' + rows.map((e) => e.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `HelloTechnology_Analytics_${period}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Format currency
  const formatETB = (val: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Calculate timeline max for bar heights
  const maxTimelineValue = Math.max(
    1,
    ...(data?.timeline.map((t) =>
      activeChartMetric === 'revenue'
        ? t.revenue
        : activeChartMetric === 'registrations'
        ? t.registrations
        : t.visitors
    ) || [1])
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── TOP HEADER WITH TIMEFRAME SELECTOR ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#155DFC] dark:bg-blue-950/60 dark:text-sky-400 font-bold">
              <BarChart3 className="size-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Institutional Performance Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Executive Analytics & Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tracking online student registrations, institutional tuition revenue, and site visitor telemetry across{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {data?.dateRangeLabel || 'selected period'}
            </span>
          </p>
        </div>

        {/* Action Controls & Period Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Period Buttons */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => {
                setPeriod('daily')
                setIsCustomOpen(false)
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                period === 'daily'
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => {
                setPeriod('weekly')
                setIsCustomOpen(false)
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                period === 'weekly'
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => {
                setPeriod('monthly')
                setIsCustomOpen(false)
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                period === 'monthly'
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setPeriod('yearly')
                setIsCustomOpen(false)
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                period === 'yearly'
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setIsCustomOpen(!isCustomOpen)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                period === 'custom' || isCustomOpen
                  ? 'bg-[#155DFC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Calendar className="size-3.5" />
              <span>Customize</span>
            </button>
          </div>

          {/* Export Report CSV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportReportCsv}
            disabled={!data || loading}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 gap-1.5 font-semibold shadow-xs cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export Report</span>
          </Button>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics()}
            disabled={loading}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs cursor-pointer p-2"
            title="Refresh analytics data"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin text-[#155DFC]' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ── CUSTOM DATE RANGE EXPANDABLE DRAWER ── */}
      {isCustomOpen && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 animate-fade-in flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="size-4 text-[#155DFC]" />
              Select Custom Report Range:
            </span>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground font-medium">From:</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#155DFC] dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground font-medium">To:</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#155DFC] dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleApplyCustom}
              disabled={loading || !customStart || !customEnd}
              size="sm"
              className="rounded-xl bg-[#155DFC] text-white hover:bg-[#0D4ECC] font-bold shadow-sm cursor-pointer"
            >
              Generate Custom Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCustomOpen(false)}
              className="text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── 4 KEY STATS / KPI CARDS ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Revenue */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tuition & DRM Revenue
            </span>
            <span className="flex size-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <DollarSign className="size-4.5" />
            </span>
          </div>

          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data ? formatETB(data.metrics.totalRevenue) : 'ETB ...'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold">
              {data && data.metrics.revenueTrendPercent >= 0 ? (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3.5" />
                  +{data.metrics.revenueTrendPercent}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-red-500">
                  <TrendingDown className="size-3.5" />
                  {data?.metrics.revenueTrendPercent}%
                </span>
              )}
              <span className="text-muted-foreground font-normal">vs prev period</span>
            </div>

            <span className="text-[10px] text-muted-foreground">
              Digital: {data ? formatETB(data.metrics.digitalRevenue) : '0'}
            </span>
          </div>
        </div>

        {/* KPI 2: Online Registered Students */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Online Registered Students
            </span>
            <span className="flex size-9 items-center justify-center rounded-2xl bg-blue-50 text-[#155DFC] dark:bg-blue-950/60 dark:text-sky-400">
              <GraduationCap className="size-4.5" />
            </span>
          </div>

          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data ? `${data.metrics.totalRegistrations} Learners` : '...'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold">
              {data && data.metrics.registrationsTrendPercent >= 0 ? (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3.5" />
                  +{data.metrics.registrationsTrendPercent}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-amber-500">
                  <TrendingDown className="size-3.5" />
                  {data?.metrics.registrationsTrendPercent}%
                </span>
              )}
              <span className="text-muted-foreground font-normal">vs prev</span>
            </div>

            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {data?.metrics.approvedRegistrations} Approved / Active
            </span>
          </div>
        </div>

        {/* KPI 3: Site Visitors & Pageviews */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Site Visitors Telemetry
            </span>
            <span className="flex size-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Eye className="size-4.5" />
            </span>
          </div>

          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data ? data.metrics.totalVisitors.toLocaleString() : '...'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold">
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3.5" />
                +{data?.metrics.visitorsTrendPercent || 8.4}%
              </span>
              <span className="text-muted-foreground font-normal">traffic</span>
            </div>

            <span className="text-[10px] text-muted-foreground">
              {data ? `${data.metrics.pageViews.toLocaleString()} Page Views` : ''}
            </span>
          </div>
        </div>

        {/* KPI 4: Inquiries & Visitor-to-Student Conversion */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Inbound Pipeline & Conversion
            </span>
            <span className="flex size-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Sparkles className="size-4.5" />
            </span>
          </div>

          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {data ? `${data.metrics.conversionRate}%` : '...'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Lead Conversion Rate
            </span>

            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              {data ? `${data.metrics.totalInquiries + data.metrics.companyInquiries} Inquiries Captured` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── TIMELINE VISUAL GROWTH CHART (REVENUE & REGISTRATIONS) ── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-[#155DFC] dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Trend Analysis & Volume Progression
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparative distribution across intervals for {data?.dateRangeLabel}
            </p>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartMetric('revenue')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                activeChartMetric === 'revenue'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Revenue (ETB)
            </button>
            <button
              onClick={() => setActiveChartMetric('registrations')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                activeChartMetric === 'registrations'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Online Registrations
            </button>
            <button
              onClick={() => setActiveChartMetric('visitors')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                activeChartMetric === 'visitors'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Site Visitors
            </button>
          </div>
        </div>

        {/* The Visual Bar Chart */}
        <div className="mt-6">
          <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2">
            {data?.timeline.map((point, idx) => {
              const currentVal =
                activeChartMetric === 'revenue'
                  ? point.revenue
                  : activeChartMetric === 'registrations'
                  ? point.registrations
                  : point.visitors
              const heightPercent = Math.max(8, Math.round((currentVal / maxTimelineValue) * 100))
              const isHovered = hoveredTimelineIndex === idx

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredTimelineIndex(idx)}
                  onMouseLeave={() => setHoveredTimelineIndex(null)}
                  className="group relative flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 whitespace-nowrap rounded-xl bg-slate-900 text-white px-2.5 py-1.5 text-[11px] font-semibold shadow-xl border border-slate-700 animate-fade-in pointer-events-none">
                      <p className="font-bold">{point.label}</p>
                      <p className="text-sky-300">
                        {activeChartMetric === 'revenue'
                          ? formatETB(point.revenue)
                          : activeChartMetric === 'registrations'
                          ? `${point.registrations} Registrations`
                          : `${point.visitors} Visitors`}
                      </p>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                      activeChartMetric === 'revenue'
                        ? isHovered
                          ? 'bg-[#155DFC] shadow-lg shadow-blue-500/30'
                          : 'bg-blue-500/80 hover:bg-[#155DFC]'
                        : activeChartMetric === 'registrations'
                        ? isHovered
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                          : 'bg-emerald-500/80 hover:bg-emerald-500'
                        : isHovered
                        ? 'bg-sky-400 shadow-lg shadow-sky-500/30'
                        : 'bg-sky-400/80 hover:bg-sky-400'
                    }`}
                  />

                  {/* Interval Label */}
                  <span className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-full">
                    {point.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECONDARY GRID: TRAFFIC CHANNELS & COURSE PERFORMANCE ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Course Revenue & Enrollment Breakdown */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Top Enrolled Courses & Track Demand
              </h3>
              <p className="text-xs text-muted-foreground">Tuition revenue contribution per discipline</p>
            </div>
            <span className="text-xs font-semibold text-[#155DFC] dark:text-sky-400">
              By Revenue
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {data?.coursePerformance.map((c, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                    {c.courseTitle}
                  </span>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="font-mono text-muted-foreground">
                      {c.enrolledCount} enrolled
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatETB(c.revenueETB)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.max(12, c.percentage))}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#155DFC]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Visitors & Traffic Sources Attribution */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Site Visitors & Channel Attribution
              </h3>
              <p className="text-xs text-muted-foreground">Where prospective students discover HelloSchool</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Globe className="size-3.5" />
              Live Telemetry
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {data?.trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {source.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">
                      {source.visitors.toLocaleString()} visitors
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}

            {/* Device breakdown strip */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                <Smartphone className="size-4 mx-auto text-blue-600 dark:text-sky-400 mb-1" />
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">76% Mobile</p>
                <p className="text-[9px] text-muted-foreground">Smartphones</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                <Laptop className="size-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">21% Desktop</p>
                <p className="text-[9px] text-muted-foreground">PC / Laptops</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                <Globe className="size-4 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">3% Tablet</p>
                <p className="text-[9px] text-muted-foreground">iPads & Other</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECENT ONLINE REGISTRATIONS & REVENUE TRANSACTIONS ── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-[#155DFC] dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Online Registrations & Payment Ledger
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified online enrollment submissions and tuition fees received
            </p>
          </div>

          {onNavigateToRegistrations && (
            <button
              onClick={onNavigateToRegistrations}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155DFC] hover:underline dark:text-sky-400 cursor-pointer"
            >
              <span>Manage all enrollments</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-3">Student & Reg No</th>
                <th className="py-3 px-3">Course Track</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{tx.fullName}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{tx.registrationNumber}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {tx.courseTitle}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {formatETB(tx.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-sky-300 uppercase">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          tx.status === 'Enrolled' || tx.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[10px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground text-xs">
                    No registrations found in this timeframe.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
