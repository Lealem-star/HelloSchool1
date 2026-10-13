import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPublishedCourseBySlug, getPublishedCourses } from '@/lib/content'
import { CourseIcon, CTASection, InquiryForm, SiteShell } from '@/components/site'

export const revalidate = 60

export async function generateStaticParams() {
  const courses = await getPublishedCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getPublishedCourseBySlug(slug)
  if (!course) notFound()

  return (
    <SiteShell>
      <main>
        <section className="bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-24">
          <div className="container mx-auto max-w-7xl">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
              <ArrowLeft className="size-4" /> All courses
            </Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{course.category}</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">{course.title}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{course.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="#inquire">
                    <Button size="lg" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                      Ask about this course <ArrowRight data-icon="inline-end" />
                    </Button>
                  </Link>
                  {course.duration ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 text-sm text-slate-300">
                      <Clock3 className="size-4" /> {course.duration}
                    </span>
                  ) : null}
                </div>
              </div>
              {course.image ? (
                <img src={course.image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover opacity-90" />
              ) : null}
            </div>
          </div>
        </section>
        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">What you will learn</p>
            <h2 className="mt-3 text-3xl font-bold">Skills that translate to the bench.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {course.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-3 rounded-xl border p-4 text-sm">
                  <CheckCircle2 className="size-4 text-primary" />
                  {skill}
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-muted/45 p-6">
              <CourseIcon name={course.icon as any} />
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                <strong className="text-foreground">Who it is for:</strong> {course.audience}
                <br />
                <strong className="text-foreground">Prerequisites:</strong> {course.prerequisites}
              </p>
            </div>
          </div>
          <div id="inquire" className="rounded-2xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Ask about this course</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Share your details and the school can follow up with dates, requirements, and pricing.
            </p>
            <div className="mt-7">
              <InquiryForm courseName={course.title} />
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </SiteShell>
  )
}
