import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Eye,
  GraduationCap,
  HeartHandshake,
  Layers,
  MapPin,
  ShieldCheck,
  Target,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTASection, PageIntro, SiteShell } from '@/components/site'
import { schoolConfig } from '@/lib/data'
import { getPublishedInstructors } from '@/lib/content'

export const revalidate = 60

export const metadata = {
  title: 'About Hello TVET | ሄሎ የቴክኒክና ሙያ ማሰልጠኛ',
  description:
    'Learn about ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET - Hello Technical and Vocational Training), Ethiopia’s accredited practical technical training academy.',
}

export default async function AboutPage() {
  const instructors = await getPublishedInstructors()
  return (
    <SiteShell>
      <PageIntro
        eyebrow="About Hello TVET"
        title="Technical learning with a practical-first point of view."
        description="We bridge the gap between abstract electrical theory and the reality of the workbench. ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET) prepares students to diagnose, troubleshoot, and restore the electronic devices and systems our society depends on every day."
      />
      <main>
        {/* ── OUR STORY & PURPOSE ── */}
        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <CircuitBoard className="size-3.5" /> Founded for practical excellence
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Why we built ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET) in Bahir Dar.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Across Ethiopia, hundreds of thousands of smartphones, laptops, appliances, and industrial machines require skilled technicians. Too often, perfectly fixable devices are discarded or deemed unfixable due to a shortage of technicians trained in practical diagnostics and COC-certified competence.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Most conventional trade courses spend weeks on blackboard equations while students never touch diagnostic equipment or rework stations. Hello TVET flips that equation: <strong>80% of your time is spent with tools in hand, probing live circuits and repairing actual hardware</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses">
                <Button className="rounded-lg px-6 font-semibold">
                  Explore our courses <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-lg px-6">
                  Visit our workshop
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-white shadow-2xl md:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300">
              <CircuitBoard className="size-6" />
            </span>
            <blockquote className="mt-8 text-2xl font-semibold leading-relaxed tracking-tight text-white md:text-3xl">
              “The most valuable repair skill is not solder speed — it is the patience and logic to diagnose the root cause before touching a tool.”
            </blockquote>
            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
              <div>
                <p className="font-semibold text-cyan-300">Core Training Principle</p>
                <p className="text-xs text-slate-400">Hello TVET Technical Faculty</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bahir Dar</span>
            </div>
          </div>
        </section>

        {/* ── METRICS / NUMBERS ── */}
        <section className="border-y border-border bg-muted/40 py-12">
          <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 md:grid-cols-4 lg:px-8">
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">80%</p>
              <p className="mt-2 text-sm font-semibold">Hands-On Practice</p>
              <p className="text-xs text-muted-foreground">Direct bench experience</p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">10:1</p>
              <p className="mt-2 text-sm font-semibold">Trainee-to-Mentor Ratio</p>
              <p className="text-xs text-muted-foreground">Dedicated instructor attention</p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">100%</p>
              <p className="mt-2 text-sm font-semibold">Real Hardware</p>
              <p className="text-xs text-muted-foreground">No pure software simulators</p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">1-on-1</p>
              <p className="mt-2 text-sm font-semibold">Workbench Allocation</p>
              <p className="text-xs text-muted-foreground">Personal station & equipment</p>
            </div>
          </div>
        </section>

        {/* ── MISSION, VISION, TRAINING VALUES ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Foundational commitments</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">What guides our curriculum</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-cyan-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                  <Target className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">Our Mission</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{schoolConfig.mission}</p>
              </div>

              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-cyan-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                  <Eye className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">Our Vision</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{schoolConfig.vision}</p>
              </div>

              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-cyan-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                  <Users className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">Training Methodology</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Circuit concept & schematics explanation → Live instructor demonstration under magnification → Guided hands-on trainee execution → Functional QA testing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTRUCTORS SECTION ── */}
        <section className="border-t bg-muted/30 px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Meet your mentors</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Experienced practitioners, dedicated to your growth
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Our faculty members are active repair specialists with decades of combined workbench experience solving real hardware failures.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {instructors.map((instructor) => (
                <div
                  key={instructor.name}
                  className="card-hover-lift group overflow-hidden rounded-3xl border bg-card shadow-sm hover:border-cyan-500/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <span className="inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      {instructor.experience}
                    </span>
                    <h3 className="mt-4 text-xl font-bold transition-colors group-hover:text-primary">{instructor.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{instructor.role}</p>
                    <p className="mt-4 text-xs leading-6 text-muted-foreground">{instructor.bio}</p>

                    <div className="mt-5 border-t pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Core Specialties</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {instructor.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="rounded-lg border bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAREER PATHWAYS ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 p-8 text-white shadow-2xl md:p-14 circuit-grid-bg">
              <div className="absolute -right-20 -bottom-20 size-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    <GraduationCap className="size-4" /> Career Opportunities
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-white">
                    Where Hello TVET training leads our graduates.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Technical repair is one of the fastest-growing trade sectors in East Africa. By mastering circuit diagnostics, our alumni enter high-demand roles or launch profitable businesses.
                  </p>
                  <div className="mt-8">
                    <Link href="/register">
                      <Button className="rounded-xl bg-cyan-400 px-6 font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-[1.02]">
                        Enroll in upcoming cohort <ArrowRight data-icon="inline-end" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Independent Repair Shop Owner',
                      desc: 'Launch your own workshop repairing consumer phones, laptops, and tablets.',
                    },
                    {
                      title: 'Telecom Service Technician',
                      desc: 'Work in authorized service centers and network operator warranty labs.',
                    },
                    {
                      title: 'Corporate IT Hardware Tech',
                      desc: 'Maintain and service enterprise computer fleets, servers, and power gear.',
                    },
                    {
                      title: 'Logic Board BGA Specialist',
                      desc: 'Offer high-margin sub-contract micro-soldering and chip-level diagnostics.',
                    },
                  ].map((path) => (
                    <div
                      key={path.title}
                      className="card-hover-lift rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner hover:border-cyan-500/40"
                    >
                      <h3 className="font-bold text-white text-base">{path.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{path.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </SiteShell>
  )
}
