import Link from 'next/link'
import { ArrowRight, Check, CircuitBoard, Wrench, Clock3, Layers, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trainingHighlights } from '@/lib/data'
import { getPublishedCourses, getPublishedGallery, getPublishedTrustedPartners } from '@/lib/content'
import { CourseIcon, CTASection, GalleryCard, SectionHeading, SiteShell, StatStrip } from '@/components/site'
import { CompanyTrainingCTA } from '@/components/company-training-cta'
import { TrustedBySection } from '@/components/trusted-by-marquee'

export const revalidate = 60

export default async function HomePage() {
  const [courses, trainingGallery, trustedPartners] = await Promise.all([
    getPublishedCourses(),
    getPublishedGallery(),
    getPublishedTrustedPartners(),
  ])

  return (
    <SiteShell>
      <main>
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_15%_75%,rgba(59,130,246,0.12),transparent_40%),linear-gradient(115deg,rgba(2,6,23,0.98),rgba(15,23,42,0.85))]" />
          <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-28">
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 animate-float-slow backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <span className="flex size-2 rounded-full bg-cyan-400 animate-ping mr-0.5" />
                <CircuitBoard className="size-3.5" /> Technical Education · Built Around Practice
              </div>
              <h1 className="max-w-2xl text-5xl font-extrabold tracking-[-0.04em] md:text-6xl lg:text-[4.35rem] lg:leading-[1.03]">
                Build practical skills.{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                  Repair with confidence.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                Learn mobile phone repair, computer maintenance, electronics troubleshooting, and micro-soldering through focused, hands-on technical workbench training in Bahir Dar.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="rounded-xl bg-cyan-400 px-6 font-bold text-slate-950 transition duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]"
                  >
                    Explore courses <ArrowRight data-icon="inline-end" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-slate-600 bg-transparent px-6 font-semibold text-white transition duration-300 hover:border-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    Contact us
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                    <Check className="size-3.5" />
                  </span>
                  <span>100% Bench Hands-on Labs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                    <Check className="size-3.5" />
                  </span>
                  <span>Signal Mall, Bahir Dar Location</span>
                </div>
              </div>
            </div>

            {/* Hero Image Visual with Interactive Depth */}
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-cyan-950/40 transition duration-500 group-hover:border-cyan-500/40">
                <img
                  src="/images/ems-hero-workbench.png"
                  alt="Circuit board and electronic components on a workbench"
                  className="aspect-[4/3] w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating Benchmark Badge */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/15 bg-slate-900/85 p-4.5 shadow-2xl backdrop-blur-md sm:block animate-float-slow">
                <div className="flex items-center gap-3.5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20">
                    <Wrench className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-sm font-bold text-white">Diagnostic Workbench Labs</p>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">Real tools. Real schematics. Confidence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAT STRIP ── */}
        <StatStrip />

        {/* ── FEATURED COURSES SECTION ── */}
        <section className="px-5 py-20 lg:px-8 bg-background">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="What you can learn"
              title="Technical skills for real-world repairs"
              description="Start with the fundamentals, then master the diagnostic thinking, schematic navigation, and practical soldering habits that make a confident technician."
            />
            {courses.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="group flex flex-col justify-between rounded-2xl border bg-card p-6 card-hover-lift"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <CourseIcon name={course.icon as any} />
                        {course.duration && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                            <Clock3 className="size-3.5 text-primary" />
                            {course.duration}
                          </span>
                        )}
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                        {course.category}
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-6 text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      {course.level && (
                        <div className="mb-3">
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {course.level}
                          </span>
                        </div>
                      )}
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:underline"
                      >
                        View course & curriculum{' '}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Courses will appear here once they are published.</p>
            )}
          </div>
        </section>

        {/* ── WHY PRACTICAL MATTERS SECTION ── */}
        <section className="bg-muted/35 px-5 py-20 lg:px-8 border-y">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why practical matters"
              title="Confidence comes from doing the work"
              description="Our learning approach connects clear circuit instruction with extensive time at the workbench, transforming technical theory into reliable bench habits."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {trainingHighlights.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-card p-6 card-hover-lift group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <CourseIcon name={item.icon as any} />
                      <span className="text-xs font-black text-muted-foreground/60 tracking-wider">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORKSHOP GALLERY SECTION ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Inside the workshop"
                title="A closer look at practical training"
                description="Modern bench instrumentation, stereo inspection microscopes, and real boards prepared for diagnostic fault isolation."
              />
              <Link
                href="/training"
                className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-primary group hover:underline"
              >
                Explore practical training{' '}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            {trainingGallery.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainingGallery.slice(0, 3).map((item) => (
                  <GalleryCard key={item.id} title={item.title} description={item.description} image={item.image} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Workshop photos will appear here once they are published.</p>
            )}
          </div>
        </section>

        {/* ── CUSTOMIZED COMPANY TRAINING CTA ── */}
        <CompanyTrainingCTA />

        {/* ── TRUSTED BY SECTION (ANIMATED RIGHT TO LEFT MARQUEE) ── */}
        <TrustedBySection partners={trustedPartners} />

        <section className="border-y bg-slate-950 px-5 py-20 text-white lg:px-8">
          <div className="container mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Coming soon</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Keep learning beyond the workbench.</h2>
              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                We are designing a digital library of repair manuals, troubleshooting guides, and recorded lessons to support your growth at every stage.
              </p>
              <Link href="/library">
                <Button variant="outline" className="mt-7 border-slate-600 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  Explore digital library <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">01</p>
                <h3 className="mt-8 font-semibold">Repair manuals</h3>
                <p className="mt-2 text-sm text-slate-400">Step-by-step references for technicians.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">02</p>
                <h3 className="mt-8 font-semibold">Video lessons</h3>
                <p className="mt-2 text-sm text-slate-400">Learn techniques at your own pace.</p>
              </div>
            </div>
          </div>
        </section>
        <CTASection />
      </main>
    </SiteShell>
  )
}
