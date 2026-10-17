'use client'

import { useState } from 'react'
import {
  X,
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Search,
  Sparkles,
  Layers,
  Wrench,
  Clock3,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCourseSchema } from '@/lib/schema'

export type SeoCourseData = {
  title: string
  slug: string
  category: string
  level?: string | null
  description?: string | null
  duration?: string | null
  price?: string | null
  skills?: string[]
  syllabus?: Array<{
    title: string
    duration?: string | null
    description?: string | null
    lessons: string[]
    labMilestone?: string | null
  }>
}

export function CourseSeoPreviewModal({
  open,
  onClose,
  course,
}: {
  open: boolean
  onClose: () => void
  course: SeoCourseData | null
}) {
  const [activeTab, setActiveTab] = useState<'google' | 'og' | 'twitter' | 'schema'>('google')
  const [copied, setCopied] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  if (!open || !course) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://helloschool.edu.et'
  const courseUrl = `${siteUrl}/courses/${course.slug}`
  const ogImageUrl = `/api/og/course/${course.slug}`
  const metaTitle = `${course.title} - Practical Workshop Training | Hello TVET`
  const metaDescription =
    course.description ||
    'Certified hands-on training in electronics repair, schematic diagnosis, and component maintenance in Bahir Dar, Ethiopia.'

  const courseSchema = getCourseSchema({
    id: course.slug,
    slug: course.slug,
    title: course.title,
    category: course.category,
    level: course.level || 'Beginner to Advanced',
    description: course.description || '',
    icon: 'Smartphone',
    skills: course.skills || [],
    syllabus: (course.syllabus || []).map((m) => ({
      title: m.title,
      duration: m.duration || undefined,
      description: m.description || undefined,
      lessons: m.lessons || [],
      labMilestone: m.labMilestone || undefined,
    })),
    audience: 'Technicians and students',
    prerequisites: 'Basic enthusiasm',
    duration: course.duration || '6 Weeks',
    price: course.price || 'ETB 4,500',
    image: '',
  })

  const schemaJson = JSON.stringify(courseSchema, null, 2)

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(schemaJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4.5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
              <Share2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  SEO & Social Sharing Preview
                </h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-sky-300">
                  {course.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live OpenGraph, Twitter card, Google SERP snippet, and Schema.org rich markup for{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {course.title}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b bg-slate-50/60 px-6 dark:border-slate-800 dark:bg-slate-900/40">
          {[
            { id: 'google', label: 'Google Search (SERP)', icon: Globe },
            { id: 'og', label: 'Facebook & LinkedIn (OG)', icon: Share2 },
            { id: 'twitter', label: 'Twitter / X Card', icon: Sparkles },
            { id: 'schema', label: 'Schema.org JSON-LD', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
                  active
                    ? 'border-blue-600 text-blue-600 dark:border-sky-400 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ─── TAB: GOOGLE SERP ─── */}
          {activeTab === 'google' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                    H
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Hello TVET · Technical and Vocational Training
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                      {courseUrl}
                    </p>
                  </div>
                </div>

                <h4 className="mt-2.5 text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer dark:text-[#8ab4f8]">
                  {metaTitle}
                </h4>

                <p className="mt-1 text-xs leading-relaxed text-[#4d5156] dark:text-[#bdc1c6]">
                  {metaDescription}
                </p>

                {/* Google Course Rich Result attributes */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    🎓 {course.level || 'Beginner to Advanced'}
                  </span>
                  {course.duration && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      ⏱️ {course.duration}
                    </span>
                  )}
                  {course.price && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      🏷️ {course.price}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    📍 Bahir Dar (Onsite Lab)
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    ⭐ 4.9 (120+ trainees)
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-blue-600 dark:text-sky-400" /> Google Search
                  Optimization Highlights
                </p>
                <p className="text-[11px] leading-relaxed">
                  Canonical URL is configured as <code className="font-mono">{courseUrl}</code>. Google
                  will crawl the embedded <strong>Schema.org Course structured data</strong> to display rich
                  educational badges (duration, cost, provider, skills taught, and location) directly in
                  Google Search results.
                </p>
              </div>
            </div>
          )}

          {/* ─── TAB: OPENGRAPH (FACEBOOK / LINKEDIN) ─── */}
          {activeTab === 'og' && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900 max-w-2xl mx-auto">
                <div className="relative aspect-[1200/630] w-full bg-[#0b1d47] overflow-hidden">
                  <img
                    src={ogImageUrl}
                    alt={course.title}
                    onLoad={() => setImgLoaded(true)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    helloschool.edu.et
                  </p>
                  <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {course.title} | Hello TVET
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {metaDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Dynamic OpenGraph Image Generator Active
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Rendered live via <code className="font-mono text-blue-600 dark:text-sky-400">{ogImageUrl}</code> (1200 × 630 px PNG)
                  </p>
                </div>
                <a
                  href={ogImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <ExternalLink className="size-3.5" /> Open Full Image
                </a>
              </div>
            </div>
          )}

          {/* ─── TAB: TWITTER / X CARD ─── */}
          {activeTab === 'twitter' && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto">
                <div className="relative aspect-[1200/630] w-full bg-[#0b1d47] overflow-hidden">
                  <img
                    src={ogImageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <span>helloschool.edu.et</span>
                    <span>•</span>
                    <span className="text-sky-500">@helloschool_et</span>
                  </div>
                  <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {course.title} | Hello TVET
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {metaDescription}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Twitter Card Meta Configuration
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <div className="rounded-lg bg-white p-2 border dark:bg-slate-800 dark:border-slate-700">
                    <span className="text-sky-500">twitter:card</span> → summary_large_image
                  </div>
                  <div className="rounded-lg bg-white p-2 border dark:bg-slate-800 dark:border-slate-700">
                    <span className="text-sky-500">twitter:site</span> → @helloschool_et
                  </div>
                  <div className="rounded-lg bg-white p-2 border dark:bg-slate-800 dark:border-slate-700 col-span-2">
                    <span className="text-sky-500">twitter:image</span> → /courses/{course.slug}/twitter-image
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: SCHEMA.ORG JSON-LD ─── */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Schema.org Course Structured Data
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Injected automatically into the &lt;head&gt; of <code className="font-mono">/courses/{course.slug}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopySchema}
                    className="h-8 gap-1.5 text-xs rounded-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> Copy JSON-LD
                      </>
                    )}
                  </Button>
                  <a
                    href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(courseUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <ExternalLink className="size-3.5" /> Google Test
                  </a>
                </div>
              </div>

              <div className="relative rounded-2xl border border-blue-900/40 bg-[#081533] p-4 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-96">
                <pre>{schemaJson}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            OpenGraph images are rendered via <code className="font-mono text-blue-600 dark:text-sky-400">next/og</code> ImageResponse
          </span>
          <Button onClick={onClose} size="sm" className="rounded-xl px-5">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
