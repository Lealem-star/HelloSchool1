'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircuitBoard,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Search,
  Sparkles,
  Video,
  X,
  Zap,
  Lock,
  Play,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PublicCourse, PublicLibraryItem } from '@/lib/content'
import { CourseIcon, PageIntro, SearchField, SiteShell, CTASection } from '@/components/site'
import { DigitalPurchaseModal } from '@/components/digital-purchase-modal'

/* ──────────────────────────────────────────────────────────────
   Courses Catalog Component
   ────────────────────────────────────────────────────────────── */
export function CoursesCatalog({
  courses,
  categories,
}: {
  courses: PublicCourse[]
  categories: string[]
}) {
  const { language } = useLanguage()
  const isAm = language === 'am'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All courses')
  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (category === 'All courses' || c.category === category) &&
          `${c.title} ${c.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [courses, query, category]
  )

  return (
    <SiteShell>
      <PageIntro
        eyebrow={isAm ? 'የስልጠና ካታሎግ' : 'Course catalog'}
        title={isAm ? 'ተግባራዊ የሙያ መስመርዎን ይምረጡ' : 'Choose your technical path.'}
        description={
          isAm
            ? 'በዕለት ተዕለት ሕይወት የምንገለገልባቸውን የኤሌክትሮኒክስ መሣሪያዎች ለመመርመር፣ ለመጠገንና ብልሽት ለመፍታት የሚያስችሉ ተግባራዊ ፕሮግራሞች።'
            : 'Explore practical programs designed to help you understand, diagnose, and repair the devices people rely on every day.'
        }
      />
      <main className="container mx-auto max-w-7xl px-5 py-14 lg:px-8">
        {/* Promotional Banner & COC Certification */}
        <div className="mb-8 rounded-3xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-transparent p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  🎉 {isAm ? 'ልዩ ማበረታቻ፦ 2+1 በነፃ!' : 'Special Incentive: 2+1 Free!'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-sky-400">
                  {isAm ? 'ሙሉ ዕውቅና ያለው' : 'Fully Accredited'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {isAm ? 'የCOC ደረጃዎችን ያሟላ' : 'COC Level Aligned'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {isAm ? 'በነፃ፦ ከሁለት በላይ ት/ት ለሚመዘገብ አንድ በነፃ!' : 'Enroll in 2+ Courses, Get 1 Completely Free!'}
              </h2>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                {isAm
                  ? 'ከሁለት ኮርሶች በላይ ለሚመዘገቡ ተማሪዎች አንድ ተጨማሪ ኮርስ በነፃ ይሰጣል። ሁሉም ስልጠናዎች የላብራቶሪ ተግባር፣ የCOC ብቃት ምዘና ዝግጅት እና የቴክኒክ ዲጂታል መመሪያዎችን ያካትታሉ።'
                  : 'Register for more than two courses and get one course completely free. All training tracks include hands-on practical lab training, COC exam alignment (Basic Electrical Electronics & Industrial Machines), and access to our technical digital library.'}
              </p>
            </div>
            <Link href="/register" className="shrink-0">
              <Button className="rounded-xl px-5 font-bold uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25">
                {isAm ? 'አሁኑኑ ይመዝገቡ' : 'Register for Cohort'} <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <div className="w-full md:max-w-sm">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder={isAm ? 'ስልጠናዎችን ይፈልጉ...' : 'Search courses...'}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All courses', ...categories].map((item) => {
              const label = item === 'All courses' ? (isAm ? 'ሁሉም ስልጠናዎች' : 'All courses') : item
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${category === item
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                      : 'bg-background text-muted-foreground hover:border-blue-500/40 hover:text-foreground'
                    }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
        {filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-3xl border bg-card card-hover-lift"
              >
                <div className="grid sm:grid-cols-[200px_1fr]">
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-48">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="size-full min-h-48 bg-muted flex items-center justify-center text-muted-foreground">
                        <CourseIcon name={course.icon as any} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d47]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <CourseIcon name={course.icon as any} />
                        <div className="flex items-center gap-1.5">
                          {course.syllabus && course.syllabus.length > 0 && (
                            <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400">
                              {course.syllabus.length} {isAm ? 'ሞጁሎች' : 'Modules'}
                            </span>
                          )}
                          {course.level ? (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {course.level}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">{course.category}</p>
                      <h2 className="mt-1.5 text-xl font-bold transition-colors group-hover:text-primary">{course.title}</h2>
                      <p className="mt-2.5 text-sm leading-6 text-muted-foreground line-clamp-3">{course.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock className="size-3.5 text-primary" />
                        {course.duration}
                      </span>
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-xl group-hover:border-blue-500/50">
                          {isAm ? 'ዝርዝር መረጃ' : 'Details'} <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-14 text-center">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 font-bold">{isAm ? 'ምንም ስልጠና አልተገኘም' : 'No courses found'}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAm ? 'እባክዎ ሌላ ቃል ይፈልጉ ወይም ፊልተሩን ያጥፉ።' : 'Try another search or clear the category filter.'}
            </p>
          </div>
        )}
      </main>
      <CTASection />
    </SiteShell>
  )
}

/* ──────────────────────────────────────────────────────────────
   Resource Detail / Preview Modal
   ────────────────────────────────────────────────────────────── */
function ResourceModal({
  resource,
  onClose,
  onBuy,
}: {
  resource: PublicLibraryItem | null
  onClose: () => void
  onBuy?: (resource: PublicLibraryItem) => void
}) {
  const { language } = useLanguage()
  const isAm = language === 'am'
  if (!resource) return null

  const isAvailable = resource.status.toLowerCase() === 'available'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl rounded-3xl border bg-card p-6 shadow-2xl dark:border-slate-800 md:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b pb-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
              {resource.format.includes('Video') ? (
                <Video className="size-6" />
              ) : resource.format.includes('Reference') ? (
                <CircuitBoard className="size-6" />
              ) : (
                <FileText className="size-6" />
              )}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                  {resource.category}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isAvailable
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                >
                  {isAvailable ? (isAm ? 'ይገኛል' : 'Available') : (isAm ? 'በቅርቡ' : 'Coming Soon')}
                </span>
              </div>
              <h3 className="mt-1 text-xl font-bold">{resource.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <p className="text-sm leading-7 text-muted-foreground">{resource.description}</p>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">{isAm ? 'ፎርማት' : 'Format'}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.format || 'Document'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAm ? 'የደረጃ ከፍታ' : 'Difficulty Level'}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.level || (isAm ? 'ሁሉም ደረጃዎች' : 'All Levels')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAm ? 'ገጾች / ቆይታ' : 'Pages / Duration'}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.pages || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAm ? 'የመዳረሻ ክፍያ' : 'Access Fee'}</p>
              <p className="mt-1 font-semibold text-primary">{resource.price || (resource.priceETB ? `${resource.priceETB} ${isAm ? 'ብር' : 'ETB'}` : (isAm ? 'ነፃ' : 'Free'))}</p>
            </div>
          </div>

          <div className="rounded-2xl border p-4 text-xs dark:border-slate-800">
            <p className="font-bold text-foreground">{isAm ? 'በዚህ ማቴሪያል ውስጥ የተካተቱ ነጥቦች፡' : 'Topics covered in this resource:'}</p>
            <ul className="mt-2.5 space-y-1.5 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>{isAm ? 'የተደራጁ የዲያግኖስቲክስ ሂደቶችና የሰርኪዩት ንድፍ ንባብ' : 'Systematic diagnostic procedures & schematic navigation'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>{isAm ? 'የኤሌክትሮኒክስ አካላት ፍተሻ በመልቲሜትር ዳዮድ ሞድ' : 'Component-level testing with multimeter diode mode drop values'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>{isAm ? 'የተግባራዊ ወርክሾፕ የደህንነት እና የብልሽት መለያ ደረጃዎች' : 'Practical workshop safety and fault isolation steps'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            {isAm ? 'ዝጋ' : 'Close preview'}
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="size-3" /> {isAm ? 'የተጠበቀ DRM የትምህርት ማቴሪያል' : 'Protected DRM Material (No Downloads)'}
            </span>
            <Button
              size="sm"
              onClick={() => {
                if (onBuy) {
                  const resToBuy = resource
                  onClose()
                  onBuy(resToBuy)
                }
              }}
              className="rounded-xl gap-1.5 bg-[#155DFC] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              <ShoppingBag className="size-3.5" />
              {resource.priceETB === 0
                ? (isAm ? 'በነፃ ይመልከቱ' : 'Claim Free Access')
                : (isAm
                  ? `አሁኑኑ ይግዙ · ${resource.price || `${resource.priceETB} ብር`}`
                  : `Buy Now · ${resource.price || `${resource.priceETB} ETB`}`)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Enhanced Digital Library Catalog Component
   ────────────────────────────────────────────────────────────── */
export function LibraryCatalog({
  resources,
  categories,
}: {
  resources: PublicLibraryItem[]
  categories: string[]
}) {
  const { language } = useLanguage()
  const isAm = language === 'am'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All resources')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Coming Soon'>('All')
  const [selectedResource, setSelectedResource] = useState<PublicLibraryItem | null>(null)
  const [purchasingResource, setPurchasingResource] = useState<PublicLibraryItem | null>(null)

  const availableCount = useMemo(
    () => resources.filter((r) => r.status.toLowerCase() === 'available').length,
    [resources]
  )

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesCategory = category === 'All resources' || r.category === category
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Available' && r.status.toLowerCase() === 'available') ||
        (statusFilter === 'Coming Soon' && r.status.toLowerCase() === 'coming soon')
      const matchesQuery =
        `${r.title} ${r.description} ${r.category} ${r.format}`
          .toLowerCase()
          .includes(query.toLowerCase())

      return matchesCategory && matchesStatus && matchesQuery
    })
  }, [resources, category, statusFilter, query])

  return (
    <SiteShell>
      <PageIntro
        eyebrow={isAm ? 'ዲጂታል ቴክኒካል ቤተ-መጽሐፍት' : 'Digital Technical Library'}
        title={isAm ? 'ከተግባራዊ ክፍለ-ጊዜው ባሻገር ዕውቀትዎን ያዳብሩ' : 'Keep learning beyond the workshop.'}
        description={
          isAm
            ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል መምህራን የተዘጋጁ የጥገና ማኑዋሎች፣ መልቲሜትር ዲያግኖስቲክስ ቺት ሺቶች፣ የሰርኪዩት ንድፎች (Schematics) እና ማይክሮ-ሶልደሪንግ ሪፈረንሶችን ያግኙ።'
            : 'Access verified repair manuals, multimeter diagnostic cheat sheets, power rail schematics, and micro-soldering references crafted by Hello Technology Training Center faculty.'
        }
      />

      <main className="container mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* ── METRICS & STATS BAR ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 rounded-3xl border bg-card p-5 sm:grid-cols-4">
          <div className="p-3 rounded-2xl bg-muted/30 card-hover-lift">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              {isAm ? 'አጠቃላይ ማኑዋሎች' : 'Total Resources'}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{resources.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 card-hover-lift">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
              {isAm ? 'አሁን የሚገኙ' : 'Available Now'}
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{availableCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 card-hover-lift">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              {isAm ? 'የፋይል አይነቶች' : 'Formats'}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{isAm ? 'ፒዲኤፍ እና ቪዲዮ' : 'PDFs & Videos'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 card-hover-lift">
            <p className="text-xs text-blue-600 dark:text-sky-400 uppercase tracking-wider font-semibold">
              {isAm ? 'የመዳረሻ ፈቃድ' : 'Access'}
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-sky-400">{isAm ? 'ነፃ / ለተመዘገቡ' : 'Free / Enrolled'}</p>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="mb-10 flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder={isAm ? 'በርዕስ፣ በሰርኪዩት ንድፍ ወይም በመሳሪያ ይፈልጉ...' : 'Search by topic, schematic, or device...'}
              />
            </div>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1.5 rounded-2xl border bg-muted/30 p-1 text-xs">
              {(['All', 'Available', 'Coming Soon'] as const).map((st) => {
                const label =
                  st === 'All'
                    ? (isAm ? 'ሁሉም መመሪያዎች' : 'All Guides')
                    : st === 'Available'
                    ? (isAm ? 'የሚገኙ' : 'Available')
                    : (isAm ? 'በቅርቡ' : 'Coming Soon')
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all duration-200 ${statusFilter === st
                        ? 'bg-background text-foreground shadow-sm shadow-black/5 scale-[1.02]'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="size-3" /> {isAm ? 'ርዕስ፡' : 'Topic:'}
            </span>
            <button
              onClick={() => setCategory('All resources')}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${category === 'All resources'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                  : 'bg-background text-muted-foreground hover:border-blue-500/40 hover:text-foreground'
                }`}
            >
              {isAm ? 'ሁሉም ርዕሶች' : 'All topics'}
            </button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${category === item
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                    : 'bg-background text-muted-foreground hover:border-blue-500/40 hover:text-foreground'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESOURCE CARDS GRID ── */}
        {filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => {
              const isAvailable = resource.status.toLowerCase() === 'available'
              const isVideo = resource.format.toLowerCase().includes('video')
              const isReference = resource.format.toLowerCase().includes('reference')

              return (
                <article
                  key={resource.id}
                  className="group flex flex-col justify-between rounded-3xl border bg-card p-6 card-hover-lift"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {isVideo ? (
                          <Video className="size-5" />
                        ) : isReference ? (
                          <CircuitBoard className="size-5" />
                        ) : (
                          <FileText className="size-5" />
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {resource.level ? (
                          <span className="rounded-md border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {resource.level}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isAvailable
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}
                        >
                          {isAvailable ? (isAm ? 'ይገኛል' : 'Available') : (isAm ? 'በቅርቡ' : 'Coming Soon')}
                        </span>
                      </div>
                    </div>

                    {/* Category & Title */}
                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">
                      {resource.category}
                    </p>
                    <h2 className="mt-2 text-lg font-bold text-foreground leading-snug">
                      {resource.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">
                      {resource.description}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-6 border-t pt-4">
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {resource.format}
                        {resource.pages ? ` · ${resource.pages}` : ''}
                      </span>
                      <span className="text-[11px] font-semibold text-primary">
                        {resource.price || (isAm ? 'ነፃ' : 'Free')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResource(resource)}
                        className="rounded-lg text-xs gap-1.5"
                      >
                        <Eye className="size-3.5" /> {isAm ? 'ዝርዝር እይ' : 'Details'}
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => setPurchasingResource(resource)}
                        className="rounded-lg text-xs gap-1.5 bg-[#155DFC] hover:bg-blue-600 text-white font-bold shadow-sm"
                      >
                        <ShoppingBag className="size-3.5" />
                        {resource.priceETB === 0
                          ? (isAm ? 'በነፃ ውሰድ' : 'Get Free')
                          : (isAm
                            ? `አሁኑኑ ይግዙ · ${resource.priceETB} ብር`
                            : `Buy Now · ${resource.priceETB} ETB`)}
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed p-16 text-center">
            <Search className="mx-auto size-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-bold">
              {isAm ? 'ምንም መረጃ አልተገኘም' : 'No resources match your filters'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAm
                ? 'የፍለጋ ቃልዎን ይቀይሩ ወይም ፊልተሩን ያጥፉ።'
                : 'Try adjusting your search terms or reset the status and topic filters.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('')
                setCategory('All resources')
                setStatusFilter('All')
              }}
              className="mt-6 rounded-lg"
            >
              {isAm ? 'ሁሉንም ፊልተሮች አፅዳ' : 'Reset all filters'}
            </Button>
          </div>
        )}
      </main>

      {/* ── REQUEST A SCHEMATIC OR GUIDE BANNER ── */}
      <section className="border-y bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] px-5 py-16 text-white lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30 shadow-md">
            <BookOpen className="size-6" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {isAm
              ? 'ልዩ የሰርኪዩት ንድፍ ወይም የቦርድ ሌይአውት ይፈልጋሉ?'
              : 'Need a specific circuit schematic or board layout?'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100">
            {isAm
              ? 'የእኛ ወርክሾፕ የላፕቶፕ ቦርድ ቪው፣ የስማርትፎን ፒንአውት ዲያግራም እና የSMPS ፓወር ሰርኪዩት ንድፎች አሉት። ውስብስብ ብልሽት እየጠገኑ ከሆነ በቀጥታ ከመምህራን ዴስክ ይጠይቁ።'
              : 'Our workshop maintains an extensive repository of laptop board views, smartphone pinout diagrams, and SMPS power schematics. If you are troubleshooting a tricky board, request it directly from our instructor desk.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button className="rounded-xl bg-white px-6 font-bold text-[#155DFC] hover:bg-blue-50 shadow-xl transition-all duration-300 hover:scale-[1.02]">
                {isAm ? 'ንድፍ ወይም ማኑዋል ይጠይቁ' : 'Request a schematic or manual'} <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODALS ── */}
      <ResourceModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onBuy={setPurchasingResource}
      />

      <DigitalPurchaseModal
        resource={purchasingResource as any}
        isOpen={Boolean(purchasingResource)}
        onClose={() => setPurchasingResource(null)}
      />
    </SiteShell>
  )
}
