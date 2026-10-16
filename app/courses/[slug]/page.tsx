import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Wrench, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPublishedCourseBySlug, getPublishedCourses } from '@/lib/content'
import { CourseIcon, CTASection, InquiryForm, SiteShell } from '@/components/site'
import { getCourseSchema, JsonLd } from '@/lib/schema'

export const revalidate = 60

export async function generateStaticParams() {
  const courses = await getPublishedCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getPublishedCourseBySlug(slug)
  if (!course) return { title: 'Course Not Found' }

  const ogImageUrl = `/courses/${slug}/opengraph-image`

  return {
    title: `${course.title} - Practical Workshop Training`,
    description: course.description,
    keywords: [
      course.title,
      course.category,
      course.level,
      ...course.skills,
      'electronics repair course Bahir Dar',
      'hands-on workshop training Ethiopia',
      'hardware troubleshooting EMS',
    ],
    alternates: {
      canonical: `/courses/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/courses/${slug}`,
      title: `${course.title} | Hello TVET`,
      description: course.description,
      siteName: 'Hello TVET (ሄሎ የቴክኒክና ሙያ ማሰልጠኛ)',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${course.title} Workbench Curriculum`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} | Hello TVET`,
      description: course.description,
      creator: '@helloschool_et',
      images: [ogImageUrl],
    },
  }
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [course, allCourses] = await Promise.all([
    getPublishedCourseBySlug(slug),
    getPublishedCourses(),
  ])
  if (!course) notFound()

  const allCourseTitles = allCourses.map((c) => c.title)

  const courseSchema = getCourseSchema(course)

  return (
    <SiteShell>
      <JsonLd data={courseSchema} />
      <main>
        <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-24 circuit-grid-bg">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 pointer-events-none" />
          <div className="container relative mx-auto max-w-7xl">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
            >
              <ArrowLeft className="size-4" /> All courses
            </Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 animate-float-slow">
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  {course.category}
                </div>
                <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-white">
                  {course.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{course.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={`/register?course=${course.slug}`}>
                    <Button
                      size="lg"
                      className="rounded-xl bg-cyan-400 px-6 font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]"
                    >
                      Register for this course <ArrowRight data-icon="inline-end" />
                    </Button>
                  </Link>
                  <a href="#inquire">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                    >
                      Quick Question
                    </Button>
                  </a>
                  {course.duration ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300">
                      <Clock3 className="size-4 text-cyan-400" /> {course.duration}
                    </span>
                  ) : null}
                </div>
              </div>
              {course.image ? (
                <div className="relative group overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-cyan-950/40">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="aspect-[4/3] w-full rounded-3xl object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ─── Practical Curriculum & Lab Milestones ─── */}
        {course.syllabus && course.syllabus.length > 0 && (
          <section className="border-b bg-slate-900/70 py-16 lg:py-24 text-white">
            <div className="container mx-auto max-w-7xl px-5 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
                  <Layers className="size-3.5" /> Hands-On Curriculum Outline
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Step-by-step modular training roadmap
                </h2>
                <p className="mt-4 text-base text-slate-300">
                  Each module pairs component-level circuit theory with independent workbench lab milestones.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {course.syllabus.map((mod, idx) => (
                  <div
                    key={idx}
                    className="card-hover-lift group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl lg:p-8 hover:border-cyan-500/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                        <span className="inline-flex items-center rounded-lg bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 text-xs font-bold text-cyan-300">
                          Module {String(idx + 1).padStart(2, '0')}
                        </span>
                        {mod.duration && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Clock3 className="size-3.5 text-cyan-400" />
                            {mod.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-cyan-300">
                        {mod.title}
                      </h3>

                      {mod.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {mod.description}
                        </p>
                      )}

                      {mod.lessons && mod.lessons.length > 0 && (
                        <div className="mt-5 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Topics Covered:
                          </p>
                          <ul className="space-y-2">
                            {mod.lessons.map((lesson, lIdx) => (
                              <li
                                key={lIdx}
                                className="flex items-start gap-2.5 text-xs text-slate-300 transition-colors hover:text-white"
                              >
                                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-cyan-400" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {mod.labMilestone && (
                      <div className="mt-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                          <Wrench className="size-3.5" />
                          Practical Lab Milestone
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-relaxed text-amber-100">
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
            <p className="text-sm font-semibold text-primary">What you will learn</p>
            <h2 className="mt-3 text-3xl font-bold">Skills that translate to the bench.</h2>
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
                <strong className="text-foreground">Who it is for:</strong> {course.audience}
                <br />
                <strong className="text-foreground">Prerequisites:</strong> {course.prerequisites}
              </p>
            </div>
          </div>
          <div id="inquire" className="rounded-3xl border bg-card p-7 shadow-xl dark:shadow-cyan-950/20 md:p-9 scroll-mt-24">
            <h2 className="text-2xl font-bold">Ask about this course</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Share your details and the school can follow up with dates, requirements, and pricing.
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
