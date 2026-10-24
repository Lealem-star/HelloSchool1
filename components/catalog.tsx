'use client'

import Link from 'next/link'
import { useMemo, useState, useRef } from 'react'
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
  Pause,
  ShoppingBag,
  BarChart3,
  ListChecks,
  Tv,
  Check,
  Layers,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PublicCourse, PublicLibraryItem } from '@/lib/content'
import { CourseIcon, PageIntro, SearchField, SiteShell, CTASection } from '@/components/site'
import { DigitalPurchaseModal } from '@/components/digital-purchase-modal'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

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
            <Link href="/library" className="shrink-0">
              <Button className="rounded-xl px-5 font-bold uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25">
                {isAm ? 'ዲጂታል ላይብረሪ' : 'Explore Courses'} <ArrowRight className="ml-1.5 size-4" />
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
   Enhanced Interactive Media / Preview Modal
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
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)

  if (!resource) return null

  const catalogMeta = DIGITAL_CATALOG[resource.id]
  const isVideo =
    resource.format.toLowerCase().includes('video') ||
    (resource.pages && resource.pages.toLowerCase().includes('hour')) ||
    (resource.pages && resource.pages.toLowerCase().includes('lesson'))
  const isAvailable = resource.status.toLowerCase() === 'available'

  // Default sample lessons if not in catalogMeta
  const lessons = catalogMeta?.lessons || [
    {
      id: 'l1',
      title: isAm ? 'ክፍል 1፡ የላብራቶሪ መሣሪያዎች አጠቃቀምና ዝግጅት' : 'Lesson 1: Bench Safety, Meters & Optical Alignment',
      duration: '14:35',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      summary: isAm ? 'የመልቲሜትር፣ የዲሲ ፓወር ሰፕላይ እና የስቴሪዮ ማይክሮስኮፕ ዝግጅት።' : 'Essential workstation setup, probe calibration, and ESD safety protocols.',
    },
    {
      id: 'l2',
      title: isAm ? 'ክፍል 2፡ የሰርኪዩት ንድፍና የመለኪያ መርሆዎች' : 'Lesson 2: Diode Mode Tracing & Power Rail Testing',
      duration: '19:40',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      summary: isAm ? 'በሰሌዳ ላይ የቮልቴጅ እና የሾርት ሰርኪውት ፍተሻ በዳዮድ ሞድ።' : 'Voltage drop readings, ground injections, and short-to-ground localization.',
    },
    {
      id: 'l3',
      title: isAm ? 'ክፍል 3፡ የላቁ የጥገና ቴክኒኮችና ማጠቃለያ' : 'Lesson 3: Component Replacement & Bench QA Checklist',
      duration: '22:15',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      summary: isAm ? 'የተጠገኑ መሳሪያዎችን የመጨረሻ ፍተሻ ማድረግና የጥራት ማረጋገጫ።' : 'Final functional verification, current draw profile analysis, and quality check.',
    },
  ]

  const activeLesson = lessons[activeLessonIndex] || lessons[0]
  const videoSrc = activeLesson?.videoUrl || resource.fileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 items-center justify-center rounded-xl text-white shadow-sm ${
              isVideo ? 'bg-blue-600' : 'bg-indigo-600'
            }`}>
              {isVideo ? <Video className="size-5" /> : <BookOpen className="size-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {resource.category}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {isVideo ? (isAm ? 'የቪዲዮ ኮርስ ማሳያ' : 'Video Masterclass Preview') : (isAm ? 'ቴክኒካል መጽሐፍ / ማኑዋል' : 'Technical Book / Manual')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight line-clamp-1">
                {resource.title}
              </h3>
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

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8">
          {isVideo ? (
            /* ─── VIDEO PREVIEW PLAYER & LESSONS ─── */
            <div className="space-y-6">
              {/* Video Player */}
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-lg">
                <div className="relative aspect-video w-full">
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    controls
                    poster={resource.thumbnailUrl || '/images/course-preview-hero.jpg'}
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 text-xs text-white">
                  <span className="flex items-center gap-2 font-medium">
                    <Play className="size-3.5 fill-red-500 text-red-500" />
                    <span>{activeLesson?.title}</span>
                  </span>
                  <span className="text-slate-400 font-mono">{activeLesson?.duration}</span>
                </div>
              </div>

              {/* Lesson Switcher */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {isAm ? 'በኮርሱ ውስጥ የተካተቱ የቪዲዮ ክፍለ-ጊዜዎች' : 'Interactive Lesson Milestones'}
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`flex flex-col text-left p-3 rounded-xl border text-xs transition-all duration-200 ${
                        activeLessonIndex === idx
                          ? 'border-blue-600 bg-blue-600/10 text-foreground ring-1 ring-blue-500'
                          : 'border-border/60 bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-foreground mb-1">
                        <span className="line-clamp-1">{lesson.title}</span>
                        <span className="font-mono text-[10px] text-primary">{lesson.duration}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {lesson.summary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ─── BOOK / MANUAL PREVIEW ─── */
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start rounded-2xl border border-border/80 bg-muted/20 p-5">
                <div className="w-full md:w-48 shrink-0 overflow-hidden rounded-xl border border-border/80 shadow-md">
                  <img
                    src={resource.thumbnailUrl || '/images/manual-book-cover.jpg'}
                    alt={resource.title}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    <BookOpen className="size-3" /> {isAm ? 'የተረጋገጠ የጥገና መጽሐፍ' : 'Verified Technician Handbook'}
                  </span>
                  <h4 className="text-xl font-bold text-foreground">{resource.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    {isAm ? 'አዘጋጅ፦ ' : 'Author : '} <span className="font-semibold text-foreground">{resource.instructor || 'Hello Technology Academy'}</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-lg bg-card border px-3 py-1 font-semibold text-foreground">
                      📄 {resource.pages || '250 Pages'}
                    </span>
                    <span className="rounded-lg bg-card border px-3 py-1 font-semibold text-foreground">
                      📊 {resource.level || 'All Skill Levels'}
                    </span>
                    <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 font-bold">
                      {resource.priceETB === 0 ? (isAm ? 'ነፃ መዳረሻ' : 'Free Access') : `${resource.priceETB} ETB`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Chapters Table */}
              <div className="rounded-2xl border border-border/80 overflow-hidden">
                <div className="bg-muted/40 px-4 py-3 border-b border-border/60">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {isAm ? 'የምዕራፎች ማውጫና የሰርኪዩት ንድፎች' : 'Chapter Table of Contents & Schematics'}
                  </h5>
                </div>
                <div className="divide-y divide-border/60 text-xs">
                  <div className="p-3.5 flex items-center justify-between hover:bg-muted/20">
                    <div>
                      <p className="font-bold text-foreground">Chapter 1: Power Rail Architectures & Voltage Injection</p>
                      <p className="text-muted-foreground text-[11px]">Primary buck converters, VDD_MAIN drop testing, and short detection</p>
                    </div>
                    <span className="font-mono text-muted-foreground text-[11px]">pp. 1 - 42</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between hover:bg-muted/20">
                    <div>
                      <p className="font-bold text-foreground">Chapter 2: USB Fast Charging & Handshake Protocols</p>
                      <p className="text-muted-foreground text-[11px]">Type-C CC orientation lines, OVP protection MOSFETs, and battery NTC logic</p>
                    </div>
                    <span className="font-mono text-muted-foreground text-[11px]">pp. 43 - 88</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between hover:bg-muted/20">
                    <div>
                      <p className="font-bold text-foreground">Chapter 3: Display Backlight Boost & T-CON Calibration</p>
                      <p className="text-muted-foreground text-[11px]">Inductor boost ratios, high-voltage diode arrays, and cathode feedback rails</p>
                    </div>
                    <span className="font-mono text-muted-foreground text-[11px]">pp. 89 - 142</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Specifications Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-4 text-xs sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">{isAm ? 'ፎርማት' : 'Format'}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.format || (isVideo ? 'Video Course' : 'Book / PDF')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAm ? 'የደረጃ ከፍታ' : 'Difficulty'}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.level || 'Everyone'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isVideo ? (isAm ? 'የቪዲዮ ቆይታ' : 'Video Duration') : (isAm ? 'የገጽ ብዛት' : 'Page Count')}</p>
              <p className="mt-1 font-semibold text-foreground">{resource.pages || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAm ? 'ክፍያ' : 'Price'}</p>
              <p className="mt-1 font-bold text-primary">
                {resource.priceETB === 0
                  ? (isAm ? 'ነፃ' : 'Free')
                  : `${resource.priceETB} ETB`}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            {isAm ? 'ዝጋ' : 'Close preview'}
          </Button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="size-3" /> {isAm ? 'የተጠበቀ ዲጂታል ትምህርት' : 'Protected Digital Curriculum'}
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
              className="rounded-xl gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 px-5"
            >
              <ShoppingBag className="size-3.5" />
              {resource.priceETB === 0
                ? (isAm ? 'በነፃ ይመልከቱ' : 'Access For Free')
                : (isAm
                  ? `አሁኑኑ ይግዙ · ${resource.priceETB} ብር`
                  : `Get Started · ${resource.priceETB} ETB`)}
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

  // Primary filters
  const [formatFilter, setFormatFilter] = useState<'All' | 'Video' | 'Book'>('All')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All resources')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Free'>('All')

  // Modals & player state
  const [selectedResource, setSelectedResource] = useState<PublicLibraryItem | null>(null)
  const [purchasingResource, setPurchasingResource] = useState<PublicLibraryItem | null>(null)
  const [heroVideoPlaying, setHeroVideoPlaying] = useState(false)

  // Counts
  const videoCount = useMemo(
    () =>
      resources.filter(
        (r) =>
          r.format.toLowerCase().includes('video') ||
          (r.pages && r.pages.toLowerCase().includes('hour')) ||
          (r.pages && r.pages.toLowerCase().includes('lesson'))
      ).length,
    [resources]
  )

  const bookCount = useMemo(
    () =>
      resources.filter(
        (r) =>
          !r.format.toLowerCase().includes('video') &&
          !(r.pages && r.pages.toLowerCase().includes('hour'))
      ).length,
    [resources]
  )

  const availableCount = useMemo(
    () => resources.filter((r) => r.status.toLowerCase() === 'available').length,
    [resources]
  )

  // Filtered items
  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const isVideo =
        r.format.toLowerCase().includes('video') ||
        (r.pages && r.pages.toLowerCase().includes('hour')) ||
        (r.pages && r.pages.toLowerCase().includes('lesson'))

      // Format filter
      if (formatFilter === 'Video' && !isVideo) return false
      if (formatFilter === 'Book' && isVideo) return false

      // Category filter
      if (category !== 'All resources' && r.category !== category) return false

      // Status filter
      if (statusFilter === 'Available' && r.status.toLowerCase() !== 'available') return false
      if (statusFilter === 'Free' && (r.priceETB ?? 0) > 0) return false

      // Search query
      const searchTarget = `${r.title} ${r.description} ${r.category} ${r.format} ${r.instructor ?? ''}`.toLowerCase()
      if (query && !searchTarget.includes(query.toLowerCase())) return false

      return true
    })
  }, [resources, formatFilter, category, statusFilter, query])

  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* ── HERO: WATCH COURSE PREVIEW (EXACT STYLE FROM SCREENSHOT 1) ── */}
        <section className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-4 shadow-sm">
            <Play className="size-3.5 fill-sky-600 dark:fill-sky-400" />
            <span>{isAm ? 'ልዩ የኮርስ ማሳያ ቪዲዮ' : 'Featured Course Preview'}</span>
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {isAm ? 'የስልጠና ማሳያ ቪዲዮ ይመልከቱ' : 'Watch Course Preview'}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            {isAm
              ? 'በተግባራዊ የቪዲዮ ትምህርቶቻችን እና የጥገና መመሪያዎቻችን ምን እንደሚማሩ የቀጥታ ማሳያ ይመልከቱ።'
              : "Get a taste of what you'll learn in our comprehensive practical video lessons and technical manuals"}
          </p>

          {/* Video Player Card */}
          <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-slate-950 shadow-2xl relative group text-left">
            {/* Top Bar matching Screenshot 1 */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/10 text-white backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
                  HT
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {isAm ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል' : 'Hello Technology Academy'}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {isAm ? 'የተግባራዊ ወርክሾፕ ማሳያ' : 'Practical Workshop Preview'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-400">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                HD 1080p
              </span>
            </div>

            {/* Video Container / Thumbnail with Big YouTube-Style Play Button */}
            <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
              {heroVideoPlaying ? (
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  controls
                  autoPlay
                  className="size-full object-cover"
                />
              ) : (
                <>
                  <img
                    src="/images/course-preview-hero.jpg"
                    alt="Course Preview"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Centered YouTube-style Red Play Button */}
                  <button
                    onClick={() => setHeroVideoPlaying(true)}
                    className="absolute z-10 flex size-20 md:size-24 items-center justify-center rounded-2xl bg-red-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/40"
                    aria-label="Play course preview"
                  >
                    <Play className="size-10 fill-white ml-1" />
                  </button>

                  {/* Bottom Overlay info inside video frame */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-white pointer-events-none">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 font-semibold border border-white/10">
                        ⏱ 14:35 Min
                      </span>
                      <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 font-semibold border border-white/10">
                        🔬 Stereo Microscope Board Tracing
                      </span>
                    </div>
                    <span className="rounded-lg bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md">
                      {isAm ? 'አሁኑኑ ይመልከቱ' : 'Click to Watch'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── PRIMARY FORMAT SWITCHER: BOTH VIDEO AND BOOK ── */}
        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex rounded-2xl border border-border/80 bg-muted/40 p-1.5 shadow-sm">
            <button
              onClick={() => setFormatFilter('All')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                formatFilter === 'All'
                  ? 'bg-background text-foreground shadow-sm shadow-black/10 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="size-4" />
              <span>{isAm ? 'ሁሉንም ማቴሪያሎች' : 'All Materials'}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {resources.length}
              </span>
            </button>
            <button
              onClick={() => setFormatFilter('Video')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                formatFilter === 'Video'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Video className="size-4" />
              <span>{isAm ? '📹 የቪዲዮ ኮርሶች' : '📹 Video Courses'}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  formatFilter === 'Video' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {videoCount}
              </span>
            </button>
            <button
              onClick={() => setFormatFilter('Book')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                formatFilter === 'Book'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="size-4" />
              <span>{isAm ? '📚 መጻሕፍትና ማኑዋሎች' : '📚 Books & Manuals'}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  formatFilter === 'Book' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {bookCount}
              </span>
            </button>
          </div>
        </div>

        {/* ── SEARCH & TOPIC FILTERS ── */}
        <div className="mb-10 flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder={
                  formatFilter === 'Video'
                    ? (isAm ? 'በቪዲዮ ርዕስ ወይም በመምህር ስም ይፈልጉ...' : 'Search video courses by topic or instructor...')
                    : formatFilter === 'Book'
                    ? (isAm ? 'በመጽሐፍ፣ በሰርኪዩት ንድፍ ወይም ማኑዋል ይፈልጉ...' : 'Search books, schematics, or manuals...')
                    : (isAm ? 'በቪዲዮ፣ በመጽሐፍ ወይም በሰርኪዩት ንድፍ ይፈልጉ...' : 'Search by video, book, or schematic...')
                }
              />
            </div>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1.5 rounded-2xl border bg-muted/30 p-1 text-xs">
              {(['All', 'Available', 'Free'] as const).map((st) => {
                const label =
                  st === 'All'
                    ? (isAm ? 'ሁሉም' : 'All')
                    : st === 'Available'
                    ? (isAm ? 'የሚገኙ' : 'Available')
                    : (isAm ? 'ነፃ ብቻ' : 'Free Only')
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3.5 py-1.5 font-semibold transition-all duration-200 ${
                      statusFilter === st
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
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                category === 'All resources'
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
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  category === item
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                    : 'bg-background text-muted-foreground hover:border-blue-500/40 hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESOURCE CARDS GRID (EXACT DONKEY ACADEMY STYLE FROM SCREENSHOT 2 & 3) ── */}
        {filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => {
              const isVideo =
                resource.format.toLowerCase().includes('video') ||
                (resource.pages && resource.pages.toLowerCase().includes('hour')) ||
                (resource.pages && resource.pages.toLowerCase().includes('lesson'))

              // Extract duration / page count & activity count
              let durationOrPages = resource.pages || (isVideo ? '6:00' : '180 Pages')
              let activityCount = isVideo ? '18 Lessons' : '8 Chapters'

              if (resource.pages && resource.pages.includes('·')) {
                const parts = resource.pages.split('·')
                durationOrPages = parts[0].trim().replace(/Hours?/i, '').trim()
                activityCount = parts[1].trim()
              } else if (isVideo) {
                activityCount = '15 Activities'
              } else {
                activityCount = '6 Chapters'
              }

              const thumbImage =
                resource.thumbnailUrl ||
                (isVideo ? '/images/course-preview-hero.jpg' : '/images/manual-book-cover.jpg')

              return (
                <article
                  key={resource.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div>
                    {/* Media Thumbnail Container with Circular Play Button Overlay */}
                    <Link
                      href={`/library/${resource.id}`}
                      className="relative block aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={thumbImage}
                        alt={resource.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                      {/* Top-Left Format Pill */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md ${
                            isVideo ? 'bg-blue-600/90' : 'bg-indigo-600/90'
                          }`}
                        >
                          {isVideo ? <Video className="size-3" /> : <BookOpen className="size-3" />}
                          {isVideo
                            ? (isAm ? 'ቪዲዮ ኮርስ' : 'Video Course')
                            : (isAm ? 'ቴክኒካል መጽሐፍ' : 'Book / Manual')}
                        </span>
                      </div>

                      {/* Top-Right Price Tag */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-md ${
                            resource.priceETB === 0
                              ? 'bg-emerald-600/90 text-white'
                              : 'bg-black/75 text-white border border-white/20'
                          }`}
                        >
                          {resource.priceETB === 0
                            ? (isAm ? 'ነፃ' : 'Free')
                            : `${resource.priceETB} ETB`}
                        </span>
                      </div>

                      {/* Centered Circular Dark Play Button (exact style from Screenshots 2 & 3!) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur-md text-white shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                          {isVideo ? (
                            <Play className="size-5 fill-white ml-0.5" />
                          ) : (
                            <BookOpen className="size-5 text-white" />
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Title */}
                      <Link href={`/library/${resource.id}`} className="block">
                        <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                          {resource.title}
                        </h3>
                      </Link>

                      {/* Instructor / Author byline (exact syntax from screenshot: A Course By : Eshetu Melese) */}
                      <p className="mt-1.5 text-xs text-muted-foreground font-medium">
                        {isVideo ? (isAm ? 'መምህር፦ ' : 'A Course By : ') : (isAm ? 'አዘጋጅ፦ ' : 'Author : ')}
                        <span className="font-semibold text-foreground">
                          {resource.instructor || 'Hello Technology Academy'}
                        </span>
                      </p>

                      {/* Description */}
                      <p className="mt-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.6rem]">
                        {resource.description}
                      </p>

                      {/* 3-Column Metadata Row (exact visual from screenshot 2 & 3) */}
                      <div className="mt-4 border-t border-border/60 pt-3 grid grid-cols-3 gap-2 text-xs">
                        {/* Column 1: Level */}
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <BarChart3 className="size-3 text-sky-500" />
                            {isAm ? 'ደረጃ' : 'Level'}
                          </span>
                          <span className="font-semibold text-foreground text-xs mt-0.5 truncate">
                            {resource.level || (isAm ? 'ለሁሉም' : 'Everyone')}
                          </span>
                        </div>

                        {/* Column 2: Duration / Pages */}
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="size-3 text-amber-500" />
                            {isVideo ? (isAm ? 'ቆይታ' : 'Duration') : (isAm ? 'ገጾች' : 'Pages')}
                          </span>
                          <span className="font-semibold text-foreground text-xs mt-0.5 truncate">
                            {durationOrPages}
                          </span>
                        </div>

                        {/* Column 3: Activity */}
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <ListChecks className="size-3 text-emerald-500" />
                            {isAm ? 'ክፍል' : 'Activity'}
                          </span>
                          <span className="font-semibold text-foreground text-xs mt-0.5 truncate">
                            {activityCount}
                          </span>
                        </div>
                      </div>

                      {/* Full-Width Action Button linking to /library/[id] */}
                      <Link href={`/library/${resource.id}`} className="block w-full mt-4">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-sky-500/40 text-sky-600 dark:text-sky-400 font-bold hover:bg-sky-500 hover:text-white transition-all duration-200"
                        >
                          {isAm ? 'ጀምር (Get started)' : 'Get started'}
                        </Button>
                      </Link>
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
              {isAm ? 'ምንም ማቴሪያል አልተገኘም' : 'No materials match your filters'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAm
                ? 'የፍለጋ ቃልዎን ይቀይሩ ወይም ፊልተሩን ያጥፉ።'
                : 'Try adjusting your search terms or switch between Video and Book tabs.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('')
                setCategory('All resources')
                setStatusFilter('All')
                setFormatFilter('All')
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
