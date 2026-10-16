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

export const revalidate = 60

export const metadata = {
  title: 'Course Registration & Cohort Admissions | Hello TVET',
  description:
    'Enroll in hands-on practical technical and vocational training at Hello TVET (ሄሎ የቴክኒክና ሙያ ማሰልጠኛ). Reserve your workbench station for the upcoming cohort.',
}

export default async function RegisterPage(props: {
  searchParams?: Promise<{ course?: string }>
}) {
  const searchParams = (await props.searchParams) || {}
  const publishedCourses = await getPublishedCourses()

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
        eyebrow="Cohort Admissions"
        title="Reserve your workbench for the next cohort."
        description="Seats are strictly capped at 10 trainees per cohort to ensure every student receives 1-on-1 mentorship and dedicated equipment time. Complete the 5-step registration to reserve your workbench station."
      />

      <main className="container mx-auto max-w-5xl px-5 py-12 lg:px-8">
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
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
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
                  title: 'Workbench Station Assignment',
                  desc: 'Your dedicated bench number, microscope, and power supply station are reserved.',
                },
                {
                  step: '03',
                  title: 'Welcome Kit & Syllabus Handout',
                  desc: 'Receive digital schematics, safety protocols, and student orientation guide.',
                },
                {
                  step: '04',
                  title: 'Day 1 Practical Workshop Training',
                  desc: 'Sit at your dedicated workbench and start diagnosing real circuit boards.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xs font-bold text-cyan-600 dark:text-cyan-400">
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
                className="inline-flex items-center text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <ArrowLeft className="mr-1.5 size-3.5" /> Review all course curriculums
              </Link>
            </div>
          </div>

          {/* Included with every enrollment */}
          <div className="card-hover-lift rounded-3xl border bg-card p-7 shadow-sm md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
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
                    <strong className="text-foreground">Dedicated personal workbench station</strong> for
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
                <HelpCircle className="size-3.5 text-cyan-500" />
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
