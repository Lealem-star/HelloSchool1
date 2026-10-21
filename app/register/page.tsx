import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Clock,
  HelpCircle,
} from 'lucide-react'
import { PageIntro, SiteShell } from '@/components/site'
import { getPublishedCourses } from '@/lib/content'
import { CourseRegistrationWizard } from '@/components/course-registration-wizard'

import prisma from '@/lib/prisma'

export const revalidate = 60

export const metadata = {
  title: 'Course Registration & Cohort Admissions | Hello Technology Training Center',
  description:
    'Enroll in hands-on practical technical and vocational training at Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል). Reserve your seat for the upcoming cohort intake.',
}

export default async function RegisterPage(props: {
  searchParams?: Promise<{ course?: string }>
}) {
  const searchParams = (await props.searchParams) || {}
  const [publishedCourses, activeBatch] = await Promise.all([
    getPublishedCourses(),
    (prisma as any).batch
      ? (prisma as any).batch.findFirst({
          where: { status: 'Open' },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        }).catch(() => null)
      : null,
  ])

  const hasOpenBatch = Boolean(activeBatch)

  // Match initial course from query param (by slug or title)
  let initialCourseTitle = ''
  if (searchParams.course) {
    const matched = publishedCourses.find(
      (c) =>
        c.slug.toLowerCase() === searchParams.course?.toLowerCase() ||
        c.title.toLowerCase().includes(searchParams.course?.toLowerCase() || '')
    )
    if (matched) {
      initialCourseTitle = matched.title
    }
  }

  const courseOptions = publishedCourses.map((c) => ({
    id: c.slug,
    title: c.title,
    category: c.category,
    price: c.price,
  }))

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Academic Intake Admissions"
        title={
          hasOpenBatch
            ? `Enroll in ${activeBatch.batchNumber}: All Practical Courses Open`
            : 'Upcoming Intakes: Opening Soon'
        }
        description={
          hasOpenBatch
            ? `${activeBatch.title}. Hands-on practical TVET training across all technical courses. Complete your 5-step registration below to secure your seat.`
            : 'All seats for the current intake cohort are full. Register below to join the priority admissions waitlist for the very next batch intake.'
        }
      />

      <main className="container mx-auto max-w-5xl px-5 py-12 lg:px-8">
        {hasOpenBatch ? (
          <div className="mb-8 rounded-3xl border border-blue-500/30 bg-blue-500/5 p-5 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white font-mono font-black text-sm shadow-md">
                {activeBatch.batchNumber.slice(-2)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{activeBatch.title}</h3>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    Open for Enrollment
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activeBatch.campus || 'Bahir Dar Campus'}
                  {activeBatch.startDate ? ` • Starts: ${new Date(activeBatch.startDate).toLocaleDateString()}` : ''}
                  {activeBatch.registrationDeadline
                    ? ` • Deadline: ${new Date(activeBatch.registrationDeadline).toLocaleDateString()}`
                    : ''}
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-sky-400 sm:text-right">
              <span>All Courses Under {activeBatch.batchNumber}</span>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-950 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <span className="size-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-ping" />
              <div>
                <h3 className="text-sm font-bold">Upcoming Intakes: Opening Soon</h3>
                <p className="mt-1 text-xs text-muted-foreground dark:text-amber-300/80">
                  Current cohort registrations are full. Submissions below are queued as priority reserves for the next intake batch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── 5-Step Course Registration Flow ─── */}
        <section aria-label="Course Registration Flow">
          <CourseRegistrationWizard
            courses={courseOptions}
            initialCourseId={initialCourseTitle}
          />
        </section>

        {/* ─── Information & Perks Below Form ─── */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* What happens after registration */}
          <div className="card-hover-lift rounded-3xl border bg-card p-7 shadow-sm md:p-8">
            <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
              <Calendar className="size-4" />
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
                What happens after registration?
              </h2>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              A transparent, supportive onboarding process for every new trainee:
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {[
                {
                  step: '01',
                  title: 'Payment & Receipt Verification',
                  desc: 'Our admissions desk verifies your CBE / Telebirr transaction within 24 hours.',
                },
                {
                  step: '02',
                  title: 'Batch Intake & Schedule Confirmation',
                  desc: 'Your cohort intake number, campus lab schedule, and seat are reserved.',
                },
                {
                  step: '03',
                  title: 'Welcome Kit & Syllabus Handout',
                  desc: 'Receive digital schematics, safety protocols, and student orientation guide.',
                },
                {
                  step: '04',
                  title: 'Day 1 Practical Workshop Training',
                  desc: 'Attend your lab workstation session and start diagnosing real circuit boards.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-xs font-bold text-blue-600 dark:text-sky-400">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-xs">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 border-t pt-5">
              <Link
                href="/courses"
                className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
              >
                <ArrowLeft className="mr-1.5 size-3.5" /> Review all course curriculums
              </Link>
            </div>
          </div>

          {/* Included with every enrollment */}
          <div className="card-hover-lift rounded-3xl border bg-card p-7 shadow-sm md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                <Sparkles className="size-4" />
                <h3 className="font-bold text-base uppercase tracking-wider text-foreground">
                  Included with enrollment
                </h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Everything you need to master diagnostic electronics without unexpected fees:
              </p>

              <ul className="mt-6 space-y-3.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Dedicated lab equipment & practical station</strong> for
                    the entire cohort duration with stereomicroscope and thermal camera access.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">All practice hardware provided</strong>: real donor
                    motherboards, scrap chips, solder wick, and flux supplies included.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Verified Certificate of Technical Competence</strong> upon
                    completing bench milestones.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Alumni technician community</strong> for parts sourcing,
                    diagnostic collaboration, and job referrals.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <HelpCircle className="size-3.5 text-blue-600 dark:text-sky-400" />
                Have questions before completing payment?
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Visit our campus at Signal Mall 4th Floor (in front of Papyrus Hotel, Bahir Dar), or call admissions at{' '}
                <a href="tel:+251947747070" className="font-semibold text-primary underline">
                  09 47 74 70 70
                </a>
                {' '}or{' '}
                <a href="tel:+251982484328" className="font-semibold text-primary underline">
                  09 82 48 43 28
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
