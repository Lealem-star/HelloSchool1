'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CircuitBoard,
  GraduationCap,
  Target,
  Eye,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTASection, PageIntro, SiteShell } from '@/components/site'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'
import type { PublicInstructor } from '@/lib/content'

interface AboutPageClientProps {
  instructors: PublicInstructor[]
}

export function AboutPageClient({ instructors }: AboutPageClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const careerPaths = [
    {
      title: isAm ? 'የግል ጥገና ሱቅ ባለቤት' : 'Independent Repair Shop Owner',
      desc: isAm
        ? 'የስልኮች፣ የላፕቶፖች እና የታብሌቶች ጥገና ሱቅ በራስዎ ይክፈቱ።'
        : 'Launch your own workshop repairing consumer phones, laptops, and tablets.',
    },
    {
      title: isAm ? 'የቴሌኮም ሰርቪስ ቴክኒሻን' : 'Telecom Service Technician',
      desc: isAm
        ? 'በተፈቀደላቸው የአገልግሎት ማዕከላትና የቴሌኮም ዋስትና ላቦራቶሪዎች ውስጥ ይስሩ።'
        : 'Work in authorized service centers and network operator warranty labs.',
    },
    {
      title: isAm ? 'የድርጅቶች የአይቲ ሃርድዌር ቴክኒሻን' : 'Corporate IT Hardware Tech',
      desc: isAm
        ? 'የድርጅቶችን የኮምፒውተር መረቦች፣ ሰርቨሮች እና የሃይል መሳሪያዎችን ይጠግኑ።'
        : 'Maintain and service enterprise computer fleets, servers, and power gear.',
    },
    {
      title: isAm ? 'የሎጂክ ቦርድ BGA ስፔሻሊስት' : 'Logic Board BGA Specialist',
      desc: isAm
        ? 'ከፍተኛ ገቢ የሚያስገኙ የኮንትራት ማይክሮ-ሶልደሪንግ እና ቺፕ-ሌቭል ዲያግኖስቲክስ አገልግሎት ይስጡ።'
        : 'Offer high-margin sub-contract micro-soldering and chip-level diagnostics.',
    },
  ]

  return (
    <SiteShell>
      <PageIntro
        eyebrow={isAm ? 'ስለ ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል' : 'About Hello Technology Training Center'}
        title={isAm ? 'ለተግባር ቅድሚያ የሚሰጥ የቴክኒክ ትምህርት።' : 'Technical learning with a practical-first point of view.'}
        description={
          isAm
            ? 'በንድፈ-ሀሳብ እና በእውነተኛው የላብራቶሪ ስራ መካከል ያለውን ክፍተት እናገናኛለን። ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ተማሪዎች በየቀኑ የምንገለገልባቸውን የኤሌክትሮኒክስ መሳሪያዎች እንዲመረምሩ፣ እንዲጠግኑ እና ወደ ስራ እንዲመልሱ ያዘጋጃል።'
            : 'We bridge the gap between abstract electrical theory and the reality of the workshop lab. Hello Technology Training Center prepares students to diagnose, troubleshoot, and restore the electronic devices and systems our society depends on every day.'
        }
      />
      <main>
        {/* ── OUR STORY & PURPOSE ── */}
        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <CircuitBoard className="size-3.5" />
              <span>{isAm ? 'ለተግባራዊ ብቃት የተመሰረተ' : 'Founded for practical excellence'}</span>
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {isAm
                ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከልን በባህር ዳር ለምን አቋቋምን?'
                : 'Why we built Hello Technology Training Center in Bahir Dar.'}
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {isAm
                ? 'በመላው ኢትዮጵያ በመቶ ሺዎች የሚቆጠሩ ስማርትፎኖች፣ ላፕቶፖች፣ የቤት ውስጥ ኤሌክትሮኒክስ እና የኢንዱስትሪ ማሽኖች ብቁ ቴክኒሻን ይፈልጋሉ። ብዙ ጊዜ በቀላሉ ሊጠገኑ የሚችሉ እቃዎች በተግባር እና በCOC ብቃት ማረጋገጫ የሰለጠኑ ቴክኒሻኖች እጥረት የተነሳ ይጣላሉ ወይም እንደማይጠገኑ ይቆጠራሉ።'
                : 'Across Ethiopia, hundreds of thousands of smartphones, laptops, appliances, and industrial machines require skilled technicians. Too often, perfectly fixable devices are discarded or deemed unfixable due to a shortage of technicians trained in practical diagnostics and COC-certified competence.'}
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {isAm ? (
                <>
                  አብዛኛዎቹ ተለምዷዊ የሙያ ኮርሶች ተማሪዎች የመመርመሪያ መሳሪያዎችን ወይም የብየዳ ጣቢያዎችን ሳይነኩ ሳምንታትን በጥቁር ሰሌዳ ፎርሙላዎች ላይ ያሳልፋሉ። ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ያንን አካሄድ ይቀይረዋል፡ <strong>80%+ ጊዜዎ በእውነተኛ ሰርኪውቶች እና ሃርድዌሮች ላይ መሳሪያዎችን በእጅ ይዞ በመስራት ላይ ይውላል</strong>።
                </>
              ) : (
                <>
                  Most conventional trade courses spend weeks on blackboard equations while students never touch diagnostic equipment or rework stations. Hello Technology Training Center flips that equation: <strong>80% of your time is spent with tools in hand, probing live circuits and repairing actual hardware</strong>.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/#courses">
                <Button className="rounded-lg px-6 font-semibold">
                  {isAm ? 'ስልጠናዎቻችንን ይመልከቱ' : 'Explore our courses'} <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-lg px-6">
                  {isAm ? 'ላብራቶሪያችንን ይጎብኙ' : 'Visit our workshop'}
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] p-8 text-white shadow-2xl md:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30 shadow-md">
              <CircuitBoard className="size-6" />
            </span>
            <blockquote className="mt-8 text-2xl font-bold leading-relaxed tracking-tight text-white md:text-3xl">
              {isAm
                ? '“ዋጋ ያለው የጥገና ክህሎት የመበየድ ፍጥነት ሳይሆን — መሳሪያ ከመንካት በፊት ዋናውን የብልሽት መንስኤ በሎጂክና በትዕግስት መመርመር መቻል ነው።”'
                : '“The most valuable repair skill is not solder speed — it is the patience and logic to diagnose the root cause before touching a tool.”'}
            </blockquote>
            <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-6">
              <div>
                <p className="font-bold text-white">
                  {isAm ? 'ዋና የስልጠና መርህ' : 'Core Training Principle'}
                </p>
                <p className="text-xs text-blue-100">
                  {isAm ? 'የሄሎ ቴክኖሎጂ መምህራን ማህበር' : 'Hello Technology Training Center Faculty'}
                </p>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                {isAm ? 'ባሕር ዳር' : 'Bahir Dar'}
              </span>
            </div>
          </div>
        </section>

        {/* ── METRICS / NUMBERS ── */}
        <section className="border-y border-border bg-muted/40 py-12">
          <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 md:grid-cols-4 lg:px-8">
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">80%</p>
              <p className="mt-2 text-sm font-semibold">
                {isAm ? 'የተግባር ልምምድ' : 'Hands-On Practice'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAm ? 'በቀጥታ በቤንች ላይ የሚሰራ' : 'Direct bench experience'}
              </p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">10:1</p>
              <p className="mt-2 text-sm font-semibold">
                {isAm ? 'የሰልጣኝ ለአሰልጣኝ ጥምርታ' : 'Trainee-to-Mentor Ratio'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAm ? 'የቅርብ ክትትልና ድጋፍ' : 'Dedicated instructor attention'}
              </p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">100%</p>
              <p className="mt-2 text-sm font-semibold">
                {isAm ? 'እውነተኛ ሃርድዌር' : 'Real Hardware'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAm ? 'ምንም አይነት የኮምፒውተር ሲሙሌተር የለም' : 'No pure software simulators'}
              </p>
            </div>
            <div className="rounded-2xl border bg-card/60 p-5 text-center card-hover-lift">
              <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">1-on-1</p>
              <p className="mt-2 text-sm font-semibold">
                {isAm ? 'የስራ መቀመጫ ድልድል' : 'Station Allocation'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAm ? 'የግል መቀመጫና የተሟላ እቃዎች' : 'Personal station & equipment'}
              </p>
            </div>
          </div>
        </section>

        {/* ── MISSION, VISION, TRAINING VALUES ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {isAm ? 'መሰረታዊ መርሆዎቻችን' : 'Foundational commitments'}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {isAm ? 'ካሪኩለማችንን የሚመሩ እሴቶች' : 'What guides our curriculum'}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-blue-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
                  <Target className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">
                  {isAm ? 'ተልዕኮ' : 'Our Mission'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isAm
                    ? 'የኢትዮጵያ ወጣቶችና ባለሙያዎችን ዕውቅና ባለው፣ ለስራ ዝግጁ በሚያደርግ የቴክኒክ ክህሎት፣ በተግባር ላይ በተመሰረተ የዲያግኖስቲክስ ችግር ፈቺነት እና በላብራቶሪ ብቃት ማስታጠቅ።'
                    : schoolConfig.mission}
                </p>
              </div>

              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-blue-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
                  <Eye className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">
                  {isAm ? 'ራዕይ' : 'Our Vision'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isAm
                    ? 'በምስራቅ አፍሪካ ለዕውቅና ላለው የቴክኒክና ሙያ ትምህርት እንዲሁም ለሃርድዌር ጥገና ብቃት ቀዳሚና ታማኝ ማዕከል መሆን።'
                    : schoolConfig.vision}
                </p>
              </div>

              <div className="card-hover-lift group rounded-3xl border bg-card p-8 shadow-sm hover:border-blue-500/40">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
                  <Users className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-primary">
                  {isAm ? 'የስልጠና ዘዴ' : 'Training Methodology'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isAm
                    ? 'የሰርኪውት ፅንሰ-ሀሳብና የንድፍ ትንተና → በአሰልጣኝ የሚደረግ የቀጥታ ማሳያ በማጉያ ስር → ሰልጣኞች በቀጥታ በእጃቸው የሚሰሩት ስራ → የተግባር የጥራት ፍተሻ (QA)።'
                    : 'Circuit concept & schematics explanation → Live instructor demonstration under magnification → Guided hands-on trainee execution → Functional QA testing.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTRUCTORS SECTION ── */}
        <section className="border-t bg-muted/30 px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {isAm ? 'አሰልጣኞቻችንን ይተዋወቁ' : 'Meet your mentors'}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {isAm
                  ? 'ልምድ ያላቸው ባለሙያዎች፣ ለእድገትዎ ቁርጠኛ'
                  : 'Experienced practitioners, dedicated to your growth'}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {isAm
                  ? 'አሰልጣኞቻችን በእውነተኛ የጥገና አለም ውስጥ ለዓመታት የሰሩ እና እውነተኛ የሃርድዌር ብልሽቶችን በመፍታት የካበተ ልምድ ያላቸው ባለሙያዎች ናቸው።'
                  : 'Our faculty members are active repair specialists with decades of combined practical workshop experience solving real hardware failures.'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {instructors.map((instructor) => (
                <div
                  key={instructor.name}
                  className="card-hover-lift group overflow-hidden rounded-3xl border bg-card shadow-sm hover:border-blue-500/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7">
                    <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-sky-400">
                      {instructor.experience}
                    </span>
                    <h3 className="mt-4 text-xl font-bold transition-colors group-hover:text-primary">
                      {instructor.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">{instructor.role}</p>
                    <p className="mt-4 text-xs leading-6 text-muted-foreground">{instructor.bio}</p>

                    <div className="mt-5 border-t pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isAm ? 'ዋና ዋና ሙያዎች' : 'Core Specialties'}
                      </p>
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
            <div className="relative overflow-hidden rounded-3xl border border-blue-400/40 bg-[#0d2a75] bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] p-8 text-white shadow-2xl md:p-14">
              {/* Circuit pattern overlay */}
              <div className="absolute inset-0 circuit-grid-bg opacity-30 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 size-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 size-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <GraduationCap className="size-4" />
                    <span>{isAm ? 'የስራ ዕድሎች' : 'Career Opportunities'}</span>
                  </span>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl text-white">
                    {isAm
                      ? 'ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ተመራቂዎቹን ወዴት ያደርሳል?'
                      : 'Where Hello Technology Training Center leads our graduates.'}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-blue-100">
                    {isAm
                      ? 'የቴክኒክ ጥገና በምስራቅ አፍሪካ በፍጥነት እያደጉ ካሉ የሙያ ዘርፎች አንዱ ነው። የሰርኪውት ዲያግኖስቲክስን በመማር ተመራቂዎቻችን ተፈላጊ የስራ መደቦችን ይቀላቀላሉ ወይም የራሳቸውን አትራፊ ንግድ ይጀምራሉ።'
                      : 'Technical repair is one of the fastest-growing trade sectors in East Africa. By mastering circuit diagnostics, our alumni enter high-demand roles or launch profitable businesses.'}
                  </p>
                  <div className="mt-8">
                    <Link href="/library">
                      <Button className="rounded-xl bg-white px-6 font-bold text-[#155DFC] transition-all duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]">
                        {isAm ? 'ስልጠናዎችን በኦንላይን ይጀምሩ' : 'Explore Online Courses'} <ArrowRight data-icon="inline-end" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {careerPaths.map((path) => (
                    <div
                      key={path.title}
                      className="card-hover-lift rounded-2xl border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur-md hover:bg-white/15 hover:border-white/40"
                    >
                      <h3 className="font-bold text-white text-base">{path.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-blue-100">{path.desc}</p>
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
