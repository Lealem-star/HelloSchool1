'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState, useRef, useEffect } from 'react'
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
   Courses Catalog Component (matching Screenshot 2: All Courses)
   ────────────────────────────────────────────────────────────── */

const FEATURED_WEGESHA_COURSES: PublicCourse[] = [
  {
    id: 'wegesha-finot',
    slug: 'wegesha-finot',
    title: 'Wegesha Finot',
    category: 'Video Editing & Media',
    level: 'Everyone',
    description:
      'ይህ ኮርስ በቤታቸው ለተቀመጡ ባለሙያዎች፣ ስራ ላጡ እና ተስፋ ለቆረጡ ምሩቃን፣ ለተለያዩ ተቋማት እና የቢዝነስ ባለቤቶች በዓለም ዓለም ትልቅ እድገት ሊያስገኝ ስለሚችል ተግባራዊ ዕውቀት ይሰጣል።',
    icon: 'Video',
    skills: ['Video Editing', 'Content Creation', 'Storytelling', 'Monetization'],
    syllabus: Array.from({ length: 47 }, (_, i) => ({ title: `Module ${i + 1}`, lessons: [`Lesson ${i + 1}`] })),
    audience: 'Everyone interested in creative video production',
    prerequisites: 'No prior experience required',
    duration: '6:00',
    price: '2499 Birr',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'wegesha-bundle',
    slug: 'wegesha-bundle',
    title: 'Wegesha Bundle',
    category: 'Video Editing & Media',
    level: 'Everyone',
    description:
      'This course is aimed to empower Professionals currently at home, Graduates who are unemployed and disheartened and businesses seeking digital media dominance.',
    icon: 'Layers',
    skills: ['Premiere Pro', 'CapCut', 'Color Grading', 'Sound Design'],
    syllabus: Array.from({ length: 81 }, (_, i) => ({ title: `Module ${i + 1}`, lessons: [`Lesson ${i + 1}`] })),
    audience: 'Content creators, video editors, marketers',
    prerequisites: 'Basic computer skills',
    duration: '6:00',
    price: '3499 Birr',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'wegesha-video-editing',
    slug: 'wegesha-video-editing',
    title: 'Wegesha Video Editing : Master the Basics and Create Stunning Videos',
    category: 'Video Editing & Media',
    level: 'Beginners',
    description:
      'In this training, someone with no prior video editing knowledge will gain the foundational knowledge to, starting from basic software setup to professional exports.',
    icon: 'Monitor',
    skills: ['Timeline Workflow', 'Transitions', 'Typography', 'Audio Sync'],
    syllabus: Array.from({ length: 33 }, (_, i) => ({ title: `Module ${i + 1}`, lessons: [`Lesson ${i + 1}`] })),
    audience: 'Beginners looking to master editing from scratch',
    prerequisites: 'None',
    duration: '9:09:55',
    price: '2899 Birr',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=900&q=85',
  },
]

function getCourseInstructor(course: PublicCourse): string {
  if (course.title.toLowerCase().includes('wegesha')) return 'Eshetu Melese'
  if (course.category.toLowerCase().includes('mobile')) return 'Master Tech Haile'
  if (course.category.toLowerCase().includes('computer')) return 'Eng. Biruk T.'
  if (course.category.toLowerCase().includes('tv') || course.category.toLowerCase().includes('electronic')) return 'Tech. Yohannes M.'
  return 'Eshetu Melese'
}

function getCourseActivityCount(course: PublicCourse): number {
  if (course.id === 'wegesha-finot') return 47
  if (course.id === 'wegesha-bundle') return 81
  if (course.id === 'wegesha-video-editing') return 33
  if (course.syllabus && course.syllabus.length > 0) {
    const totalLessons = course.syllabus.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 1), 0)
    return Math.max(totalLessons, course.syllabus.length * 4)
  }
  return 24
}

export function CoursesCatalog({
  courses,
  categories,
}: {
  courses: PublicCourse[]
  categories: string[]
}) {
  const pathname = usePathname()
  const { language } = useLanguage()
  const isAm = language === 'am'
  const isStudentPortal = Boolean(
    pathname &&
      (pathname.startsWith('/profile') ||
        (pathname.startsWith('/student') && pathname !== '/student/login') ||
        pathname.startsWith('/achievements') ||
        pathname.startsWith('/certificates') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/learn') ||
        pathname.startsWith('/cart'))
  )

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All courses')

  // Purchased courses tracking (pre-seed with 'wegesha-bundle' so user can see both states)
  const [purchasedSlugs, setPurchasedSlugs] = useState<Set<string>>(() => {
    const s = new Set<string>(['wegesha-bundle'])
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('hellotvet_purchased_courses')
        if (stored) {
          const arr = JSON.parse(stored)
          if (Array.isArray(arr)) arr.forEach((id: string) => s.add(id))
        }
      } catch {}
    }
    return s
  })

  // Sync purchases from server
  useEffect(() => {
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          setPurchasedSlugs((prev) => {
            const next = new Set(prev)
            if (Array.isArray(data.digitalPurchases)) {
              data.digitalPurchases.forEach((p: any) => {
                if (p.resourceId) next.add(p.resourceId)
                if (p.title) next.add(p.title.toLowerCase().replace(/\s+/g, '-'))
              })
            }
            if (Array.isArray(data.registrations)) {
              data.registrations.forEach((r: any) => {
                if (r.status === 'Approved' || r.status === 'Enrolled') {
                  if (r.courseId) next.add(r.courseId)
                  if (r.courseTitle) next.add(r.courseTitle.toLowerCase().replace(/\s+/g, '-'))
                }
              })
            }
            return next
          })
        }
      })
      .catch(() => {})
  }, [])

  // Modals state
  const [playingCourse, setPlayingCourse] = useState<PublicCourse | null>(null)
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)
  const [checkoutCourse, setCheckoutCourse] = useState<PublicCourse | null>(null)
  const [checkoutMethod, setCheckoutMethod] = useState<'telebirr' | 'cbe' | 'chapa'>('telebirr')
  const [checkoutProcessing, setCheckoutProcessing] = useState(false)
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null)

  // Combine featured masterclasses with existing school courses (avoid duplicates)
  const allCoursesList = useMemo(() => {
    const existingSlugs = new Set(courses.map((c) => c.slug))
    const uniqueFeatured = FEATURED_WEGESHA_COURSES.filter((f) => !existingSlugs.has(f.slug))
    return [...uniqueFeatured, ...courses]
  }, [courses])

  const allCategories = useMemo(() => {
    const catSet = new Set(['Video Editing & Media', ...categories])
    return Array.from(catSet)
  }, [categories])

  const filtered = useMemo(
    () =>
      allCoursesList.filter(
        (c) =>
          (category === 'All courses' || c.category === category) &&
          `${c.title} ${c.description} ${getCourseInstructor(c)}`.toLowerCase().includes(query.toLowerCase())
      ),
    [allCoursesList, query, category]
  )

  // Handle purchase execution
  const handleCompleteEnrollment = () => {
    if (!checkoutCourse) return
    setCheckoutProcessing(true)
    setTimeout(() => {
      setPurchasedSlugs((prev) => {
        const next = new Set(prev)
        next.add(checkoutCourse.slug)
        next.add(checkoutCourse.id)
        try {
          localStorage.setItem('hellotvet_purchased_courses', JSON.stringify(Array.from(next)))
        } catch {}
        return next
      })
      setCheckoutProcessing(false)
      setCheckoutSuccessMsg(
        isAm
          ? '🎉 እንኳን ደስ አለዎት! ስልጠናው በተሳካ ሁኔታ ተከፍቷል። አሁን መመልከት ይችላሉ።'
          : '🎉 Congratulations! Course unlocked successfully. You can now start learning.'
      )
      setTimeout(() => {
        const courseToOpen = checkoutCourse
        setCheckoutSuccessMsg(null)
        setCheckoutCourse(null)
        setPlayingCourse(courseToOpen)
      }, 1500)
    }, 1000)
  }

  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-5 py-8 md:py-12 lg:px-8">
        {/* Top Header matching Screenshot: All Courses */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isAm ? 'ሁሉም ስልጠናዎች' : 'All Courses'}
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-muted-foreground">
              {isAm
                ? 'በተግባር የተደገፉ የቪዲዮ ኤዲቲንግ እና የቴክኒክ ጥገና ስልጠናዎች'
                : 'Explore foundational media masterclasses and hands-on accredited technical courses.'}
            </p>
          </div>

          <div className="w-full md:w-72">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder={isAm ? 'ስልጠናዎችን ይፈልጉ...' : 'Search courses...'}
            />
          </div>
        </div>

        {/* Categories Filter Tabs (Unobtrusive) */}
        <div className="mb-8 flex flex-wrap gap-2 border-b pb-4">
          {['All courses', ...allCategories].map((item) => {
            const label = item === 'All courses' ? (isAm ? 'ሁሉም ስልጠናዎች' : 'All courses') : item
            const active = category === item
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 3-Column Courses Grid (matching Donkey Academy /learn screenshot) */}
        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const instructor = getCourseInstructor(course)
              const activityCount = getCourseActivityCount(course)
              const duration = course.duration || '6:00'
              const level = course.level || 'Everyone'
              const isPurchased = purchasedSlugs.has(course.slug) || purchasedSlugs.has(course.id)

              return (
                <article
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Thumbnail with central play button overlay */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.image || '/images/helloschool.jpg'}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Unlocked / Purchased Badge */}
                    {isPurchased && (
                      <span className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-emerald-500/95 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-md backdrop-blur-xs animate-fade-in">
                        <CheckCircle2 className="size-3" />
                        <span>{isAm ? 'ተከፍቷል' : 'Purchased'}</span>
                      </span>
                    )}

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => (isPurchased ? setPlayingCourse(course) : setCheckoutCourse(course))}
                      aria-label={isPurchased ? 'Open Course' : 'Get started'}
                      className="absolute inset-0 bg-black/15 flex items-center justify-center transition-colors group-hover:bg-black/25 cursor-pointer"
                    >
                      <div className="size-11 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="size-5 fill-white ml-0.5" />
                      </div>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                        {course.title}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground font-medium">
                        A Course By : <span className="text-foreground/80 font-semibold">{instructor}</span>
                      </p>
                      <p className="mt-2 text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-5">
                      {/* Stats Row: Level + Duration + Activity (matching Screenshot 2) */}
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px] md:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="size-3.5 text-sky-500 shrink-0" />
                          <span>Level</span>
                          <strong className="text-foreground font-medium truncate max-w-[65px]">{level}</strong>
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-sky-500 shrink-0" />
                          <span>Duration:</span>
                          <strong className="text-foreground font-medium">{duration}</strong>
                        </span>

                        <span className="flex items-center gap-1">
                          <ListChecks className="size-3.5 text-sky-500 shrink-0" />
                          <span>Activity</span>
                          <strong className="text-foreground font-medium">{activityCount}</strong>
                        </span>
                      </div>

                      {/* Purchased: "Open Course" | Not Purchased: "Get started" */}
                      {isPurchased ? (
                        <button
                          onClick={() => setPlayingCourse(course)}
                          className="w-full mt-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs md:text-sm py-2.5 transition shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="size-4 fill-white" />
                          <span>{isAm ? 'ስልጠናውን ክፈት (Open Course)' : 'Open Course'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setCheckoutCourse(course)}
                          className="w-full mt-3.5 rounded-xl border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 font-semibold text-xs md:text-sm py-2.5 transition shadow-2xs block text-center cursor-pointer"
                        >
                          {isAm ? 'Get started' : 'Get started'}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
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

        {/* ── INTERACTIVE COURSE LEARNING PLAYER MODAL (When Purchased Course is Opened) ── */}
        {playingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-5xl rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Top Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Video className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">{playingCourse.title}</h3>
                    <p className="text-xs text-sky-400 font-medium">A Course By : {getCourseInstructor(playingCourse)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setPlayingCourse(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Main Player Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
                {/* Left: Video Player */}
                <div className="lg:col-span-8 flex flex-col bg-black">
                  <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    <video
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                      poster={playingCourse.image || undefined}
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 overflow-y-auto border-t border-slate-800/80 bg-slate-900/90">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-sky-500/20 text-sky-400 px-3 py-1 text-xs font-bold">
                        Lesson {activeLessonIdx + 1}
                      </span>
                      <span className="text-xs text-slate-400">Duration: 18:40 • Full HD 1080p</span>
                    </div>
                    <h4 className="mt-2 text-base font-bold text-white">
                      {activeLessonIdx === 0 && 'Module 1: Introduction & Foundation Setup'}
                      {activeLessonIdx === 1 && 'Module 2: Essential Editing Workflow & Cuts'}
                      {activeLessonIdx === 2 && 'Module 3: Advanced Color Grading & Cinematic Look'}
                      {activeLessonIdx === 3 && 'Module 4: Audio Synchronizing & Sound Design'}
                      {activeLessonIdx >= 4 && 'Module 5: Final Project Polish & High-Bitrate Export'}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {playingCourse.description}
                    </p>
                  </div>
                </div>

                {/* Right: Lesson Playlist */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/60 p-4 flex flex-col overflow-y-auto max-h-[320px] lg:max-h-none">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Course Syllabus</span>
                    <span className="text-xs text-sky-400 font-semibold">5 Lessons</span>
                  </div>

                  <div className="mt-3 space-y-2 flex-1">
                    {[
                      { id: 0, title: 'Introduction & Foundation Setup', time: '14:20' },
                      { id: 1, title: 'Essential Editing Workflow & Cuts', time: '22:15' },
                      { id: 2, title: 'Color Grading & Cinematic Look', time: '18:40' },
                      { id: 3, title: 'Audio Synchronizing & Sound Design', time: '16:50' },
                      { id: 4, title: 'Final Project Polish & Master Export', time: '28:10' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveLessonIdx(item.id)}
                        className={`w-full text-left p-3 rounded-xl transition flex items-start gap-2.5 ${
                          activeLessonIdx === item.id
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {activeLessonIdx === item.id ? (
                            <Play className="size-3.5 fill-sky-400 text-sky-400" />
                          ) : (
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-snug line-clamp-2">{item.title}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHECKOUT / "GET STARTED" MODAL (Process as Normal) ── */}
        {checkoutCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-card p-6 shadow-2xl text-foreground">
              <button
                onClick={() => setCheckoutCourse(null)}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <img
                  src={checkoutCourse.image || '/images/helloschool.jpg'}
                  alt={checkoutCourse.title}
                  className="size-14 rounded-2xl object-cover shrink-0 shadow-sm border"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-base line-clamp-1">{checkoutCourse.title}</h3>
                  <p className="text-xs text-muted-foreground">A Course By : {getCourseInstructor(checkoutCourse)}</p>
                  <p className="text-sm font-extrabold text-blue-600 dark:text-sky-400 mt-0.5">
                    {checkoutCourse.price || '2,499 Birr'}
                  </p>
                </div>
              </div>

              {checkoutSuccessMsg ? (
                <div className="py-6 text-center animate-fade-in">
                  <div className="size-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{checkoutSuccessMsg}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {isAm ? 'የክፍያ አማራጭ ይምረጡ' : 'Select Payment Method'}
                  </p>

                  <div className="space-y-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setCheckoutMethod('telebirr')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        checkoutMethod === 'telebirr'
                          ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-foreground'
                          : 'border-border/80 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="size-6 rounded-md bg-[#005cb9] text-white flex items-center justify-center text-[10px] font-black">
                          TB
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">Telebirr (ቴሌብር)</p>
                          <p className="text-[10px] text-muted-foreground">0934551781 (Hello Technology)</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">Active</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutMethod('cbe')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        checkoutMethod === 'cbe'
                          ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-foreground'
                          : 'border-border/80 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="size-6 rounded-md bg-[#800080] text-white flex items-center justify-center text-[10px] font-black">
                          CBE
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">Commercial Bank of Ethiopia</p>
                          <p className="text-[10px] text-muted-foreground">10002348912 • Bahir Dar</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutMethod('chapa')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        checkoutMethod === 'chapa'
                          ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-foreground'
                          : 'border-border/80 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="size-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                          CP
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">Chapa Instant Payment</p>
                          <p className="text-[10px] text-muted-foreground">Visa, Mastercard, Debit card</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <Button
                    onClick={handleCompleteEnrollment}
                    disabled={checkoutProcessing}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm shadow-md shadow-blue-500/25"
                  >
                    {checkoutProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {isAm ? 'ክፍያ በመፈጸም ላይ...' : 'Processing Enrollment...'}
                      </span>
                    ) : (
                      isAm ? 'ይክፈሉና ስልጠናውን ይክፈቱ (Complete & Unlock)' : 'Complete & Unlock Course'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      {!isStudentPortal && <CTASection />}
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
