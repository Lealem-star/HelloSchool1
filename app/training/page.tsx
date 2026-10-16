import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Microscope,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTASection, GalleryCard, PageIntro, SectionHeading, SiteShell } from '@/components/site'
import { trainingHighlights } from '@/lib/data'
import { getPublishedFacilities, getPublishedGallery, getPublishedStudentProjects } from '@/lib/content'

export const revalidate = 60

export default async function TrainingPage() {
  const [trainingGallery, workshopFacilities, studentProjects] = await Promise.all([
    getPublishedGallery(),
    getPublishedFacilities(),
    getPublishedStudentProjects(),
  ])

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Practical Workbench Training"
        title="Real devices. Real tools. Confident repairs."
        description="At Hello TVET (ሄሎ የቴክኒክና ሙያ ማሰልጠኛ), we believe technical competence is forged with solder, schematics, and systematic diagnostics — not just lectures. Learn how to diagnose and repair real hardware under expert mentorship."
      />
      <main>
        {/* ── OUR APPROACH ── */}
        <section className="container mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeading
            eyebrow="Our approach"
            title="From first principles to confident diagnosis"
            description="Our structured 4-pillar methodology ensures you build systematic problem-solving habits that work on any electronic board."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trainingHighlights.map((item, index) => (
              <div
                key={item.title}
                className="group flex flex-col justify-between rounded-3xl border bg-card p-7 card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-xs font-black text-cyan-600 dark:text-cyan-400">
                      0{index + 1}
                    </span>
                    <Sparkles className="size-4 text-muted-foreground/40 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WORKSHOP FACILITIES ── */}
        <section className="border-y bg-muted/30 px-5 py-16 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Modern Workbench Facilities"
              title="Equipped for precision component-level training"
              description="Every enrolled trainee trains on dedicated professional-grade equipment in our Bahir Dar training center."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workshopFacilities.map((facility) => (
                <div
                  key={facility.title}
                  className="rounded-3xl border bg-card p-6 shadow-sm card-hover-lift group"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                    <Wrench className="size-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground transition-colors group-hover:text-primary">{facility.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{facility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORKSHOP GALLERY ── */}
        <section className="px-5 py-16 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Inside our workshop"
              title="Real-world learning at the bench"
              description="Moments from our hands-on labs: micro-soldering, thermal imaging, oscilloscope analysis, and motherboard repair."
            />
            {trainingGallery.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainingGallery.map((item) => (
                  <GalleryCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Gallery items will appear here once they are published.</p>
            )}
          </div>
        </section>

        {/* ── STUDENT PROJECTS SHOWCASE ── */}
        <section className="border-t bg-slate-950 px-5 py-20 text-white lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Bench Demonstrations
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Real trainee case studies & repair breakthroughs
                </h2>
                <p className="mt-4 max-w-2xl text-base text-slate-300">
                  Every trainee documents and completes real-world diagnostic case studies. Here is a sample of actual board-level repairs accomplished in our cohorts.
                </p>
              </div>
              <Link href="/register">
                <Button className="rounded-xl bg-cyan-400 px-6 font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]">
                  Start your training <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {studentProjects.map((project) => (
                <div
                  key={project.id}
                  className="card-hover-lift group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl hover:border-cyan-500/40 hover:shadow-cyan-950/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                        {project.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{project.category}</span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white transition-colors group-hover:text-cyan-300">{project.title}</h3>
                    <p className="mt-2 text-xs font-medium text-cyan-200">Device: {project.device}</p>

                    <div className="mt-5 space-y-4 text-sm leading-6">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Reported Symptom</p>
                        <p className="mt-1 text-slate-300">{project.fault}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Diagnostic Process</p>
                        <p className="mt-1 text-slate-300">{project.diagnosticProcess}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Workbench Solution</p>
                        <p className="mt-1 text-slate-300">{project.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                      <CheckCircle2 className="size-4 shrink-0" /> Tested & Fully Restored
                    </span>
                    <span className="text-slate-400">{project.technician}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SAFETY & QUALITY STANDARDS ── */}
        <section className="container mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="rounded-3xl border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12 shadow-sm">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <ShieldCheck className="size-4" /> Professional Standards
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                  Workplace safety and industry best practices from day one
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Being a great technician means respecting the components and your safety. We train every student to adhere to international repair and laboratory safety protocols.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/courses">
                    <Button variant="outline" className="rounded-xl">
                      Explore course curriculum
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'ESD Anti-Static Wristbands & Matting',
                  'Active Fume Extraction at Soldering Stations',
                  'High-Voltage Isolation & Capacitor Discharge Rules',
                  'Safe Chemical Handling (IPA, Flux, Lead-Free Solders)',
                  'Systematic Pre- and Post-Repair Functional QA',
                  'Customer Data Privacy & Safe Storage Protocols',
                ].map((rule) => (
                  <div key={rule} className="card-hover-lift flex items-start gap-3 rounded-2xl border bg-background/80 p-4 text-xs font-medium">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </SiteShell>
  )
}
