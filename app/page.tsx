import Link from 'next/link'
import { ArrowRight, Check, CircuitBoard, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trainingHighlights } from '@/lib/data'
import { getPublishedCourses, getPublishedGallery } from '@/lib/content'
import { CourseIcon, CTASection, GalleryCard, SectionHeading, SiteShell, StatStrip } from '@/components/site'

export const revalidate = 60

export default async function HomePage() {
  const [courses, trainingGallery] = await Promise.all([
    getPublishedCourses(),
    getPublishedGallery(),
  ])

  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.16),transparent_28%),linear-gradient(115deg,rgba(2,6,23,0.98),rgba(15,23,42,0.85))]" />
          <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                <CircuitBoard className="size-3.5" /> Technical education, built around practice
              </div>
              <h1 className="max-w-2xl text-5xl font-bold tracking-[-0.04em] md:text-6xl lg:text-[4.35rem] lg:leading-[1.03]">
                Build practical skills. <span className="text-cyan-300">Repair with confidence.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                Learn mobile phone repair, computer maintenance, electronics troubleshooting, and more through focused, hands-on technical training.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/courses">
                  <Button size="lg" className="rounded-lg bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300">
                    Explore courses <ArrowRight data-icon="inline-end" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-lg border-slate-600 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                    Contact us
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-3 text-sm text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/10">
                  <Check className="size-4 text-cyan-300" />
                </span>
                A practical-first approach to technical learning
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-2xl shadow-cyan-950/30">
                <img
                  src="/images/ems-hero-workbench.png"
                  alt="Circuit board and electronic components on a workbench"
                  className="aspect-[4/3] w-full object-cover opacity-90"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                    <Wrench className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Learn by doing</p>
                    <p className="text-xs text-slate-300">Tools. Components. Confidence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <StatStrip />
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="What you can learn"
              title="Technical skills for real-world repairs"
              description="Start with the fundamentals, then develop the diagnostic thinking and practical habits that make a capable technician."
            />
            {courses.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="group flex flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
                  >
                    <CourseIcon name={course.icon as any} />
                    <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">{course.category}</p>
                    <h3 className="mt-2 text-lg font-bold">{course.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{course.description}</p>
                    <Link href={`/courses/${course.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View course <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Courses will appear here once they are published.</p>
            )}
          </div>
        </section>
        <section className="bg-muted/35 px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why practical matters"
              title="Confidence comes from doing the work"
              description="Our proposed learning approach connects clear instruction with time at the workbench, so technical concepts become usable skills."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {trainingHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl bg-background p-6">
                  <CourseIcon name={item.icon as any} />
                  <h3 className="mt-5 font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Inside the workshop"
                title="A closer look at practical training"
                description="Replace these sample images with your school’s actual workshop photography as your story grows."
              />
              <Link href="/training" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View training <ArrowRight className="size-4" />
              </Link>
            </div>
            {trainingGallery.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {trainingGallery.slice(0, 3).map((item) => (
                  <GalleryCard key={item.id} title={item.title} description={item.description} image={item.image} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Workshop photos will appear here once they are published.</p>
            )}
          </div>
        </section>
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
