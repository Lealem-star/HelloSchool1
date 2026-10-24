'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Wrench, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseIcon, CTASection, InquiryForm, SiteShell } from '@/components/site'
import { useLanguage } from '@/components/language-provider'
import type { PublicCourse } from '@/lib/content'

interface CourseDetailClientProps {
  course: PublicCourse
  allCourseTitles: string[]
}

export function CourseDetailClient({ course, allCourseTitles }: CourseDetailClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'

  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden bg-[#0d2a75] bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] px-5 py-16 text-white lg:px-8 lg:py-24">
          <div className="absolute inset-0 circuit-grid-bg opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.2),transparent_45%)] pointer-events-none" />
          <div className="container relative mx-auto max-w-7xl">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm text-blue-100 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" /> {isAm ? 'ሁሉም ስልጠናዎች' : 'All courses'}
            </Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white animate-float-slow backdrop-blur-md">
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                  {course.category}
                </div>
                <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-white">
                  {course.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">{course.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={`/cart?course=${course.slug}`}>
                    <Button
                      size="lg"
                      className="rounded-xl bg-white px-6 font-bold text-[#155DFC] transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]"
                    >
                      {isAm ? 'አሁኑኑ በኦንላይን ይጀምሩ' : 'Enroll Online Now'} <ArrowRight data-icon="inline-end" />
                    </Button>
                  </Link>
                  <a href="#inquire">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white"
                    >
                      {isAm ? 'ፈጣን ጥያቄ' : 'Quick Question'}
                    </Button>
                  </a>
                  {course.duration ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
                      <Clock3 className="size-4 text-white" /> {course.duration}
                    </span>
                  ) : null}
                </div>
              </div>
              {course.image ? (
                <div className="relative group overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-2xl shadow-blue-950/30">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="aspect-[4/3] w-full rounded-3xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c3694]/60 via-transparent to-transparent" />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ─── Practical Curriculum & Lab Milestones ─── */}
        {course.syllabus && course.syllabus.length > 0 && (
          <section className="border-b bg-slate-50/70 dark:bg-card/50 py-16 lg:py-24 text-foreground">
            <div className="container mx-auto max-w-7xl px-5 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-[#155DFC] dark:text-sky-400 mb-3">
                  <Layers className="size-3.5" />
                  <span>{isAm ? 'የተግባር ካሪኩለም ዝርዝር' : 'Hands-On Curriculum Outline'}</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {isAm ? 'ደረጃ በደረጃ የተዋቀረ የስልጠና ፍኖተ ካርታ' : 'Step-by-step modular training roadmap'}
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  {isAm
                    ? 'እያንዳንዱ ሞጁል የሰርኪውት ንድፈ-ሀሳብን ከተግባራዊ የላብራቶሪ ምዕራፎች ጋር ያጣምራል።'
                    : 'Each module pairs component-level circuit theory with independent practical lab milestones.'}
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {course.syllabus.map((mod, idx) => (
                  <div
                    key={idx}
                    className="card-hover-lift group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm lg:p-8 hover:border-[#155DFC]/50 hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 border-b pb-4">
                        <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-xs font-bold text-[#155DFC] dark:text-sky-400">
                          {isAm ? 'ሞጁል' : 'Module'} {String(idx + 1).padStart(2, '0')}
                        </span>
                        {mod.duration && (
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Clock3 className="size-3.5 text-[#155DFC] dark:text-sky-400" />
                            {mod.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-foreground transition-colors group-hover:text-[#155DFC]">
                        {mod.title}
                      </h3>

                      {mod.description && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {mod.description}
                        </p>
                      )}

                      {mod.lessons && mod.lessons.length > 0 && (
                        <div className="mt-5 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {isAm ? 'የሚዳሰሱ ርዕሶች፡' : 'Topics Covered:'}
                          </p>
                          <ul className="space-y-2">
                            {mod.lessons.map((lesson, lIdx) => (
                              <li
                                key={lIdx}
                                className="flex items-start gap-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                              >
                                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#155DFC]" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {mod.labMilestone && (
                      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                          <Wrench className="size-3.5" />
                          <span>{isAm ? 'የተግባር ላብራቶሪ ምዕራፍ' : 'Practical Lab Milestone'}</span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-relaxed text-foreground">
                          {mod.labMilestone}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">
              {isAm ? 'ምን ይማራሉ' : 'What you will learn'}
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              {isAm ? 'በስራ ጠረጴዛ ላይ የሚተገበሩ ክህሎቶች' : 'Skills that translate to the bench.'}
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {course.skills.map((skill) => (
                <div key={skill} className="card-hover-lift flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm font-medium">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl bg-muted/40 p-7 border">
              <CourseIcon name={course.icon as any} />
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                <strong className="text-foreground">{isAm ? 'ለማን የተዘጋጀ፡' : 'Who it is for:'}</strong> {course.audience}
                <br />
                <strong className="text-foreground">{isAm ? 'ቅድመ ሁኔታዎች፡' : 'Prerequisites:'}</strong> {course.prerequisites}
              </p>
            </div>
          </div>
          <div id="inquire" className="rounded-3xl border bg-card p-7 shadow-xl dark:shadow-blue-950/20 md:p-9 scroll-mt-24">
            <h2 className="text-2xl font-bold">
              {isAm ? 'ስለዚህ ስልጠና ይጠይቁ' : 'Ask about this course'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isAm
                ? 'መረጃዎን ያጋሩ፤ ማዕከሉ ስለ ቀናት፣ መስፈርቶች እና ክፍያዎች ያነጋግርዎታል።'
                : 'Share your details and the school can follow up with dates, requirements, and pricing.'}
            </p>
            <div className="mt-7">
              <InquiryForm courseName={course.title} coursesList={allCourseTitles} />
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </SiteShell>
  )
}
