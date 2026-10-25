'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  CircuitBoard,
  Wrench,
  Clock3,
  Layers,
  Sparkles,
  Video,
  BookOpen,
  ShieldCheck,
  Lock,
  Cpu,
  Laptop,
  Briefcase,
  X,
  CheckCircle2,
  Globe,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseIcon, CTASection, SectionHeading, SiteShell, StatStrip } from '@/components/site'
import { CompanyTrainingCTA } from '@/components/company-training-cta'
import { TrustedBySection } from '@/components/trusted-by-marquee'
import { TestimonialsSection } from '@/components/testimonials-section'
import { useLanguage } from '@/components/language-provider'
import type { PublicCourse, PublicTrustedPartner } from '@/lib/content'

interface HomePageClientProps {
  courses: PublicCourse[]
  trustedPartners: PublicTrustedPartner[]
}

export function HomePageClient({
  courses,
  trustedPartners,
}: HomePageClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'


  const whyChooseUsUsps = [
    {
      badge: isAm ? '100% የግል መጠቀሚያ' : '1:1 Station Ratio',
      title: isAm ? 'የግል የተሟላ የላብራቶሪ ወንበር' : 'Dedicated 1:1 Lab Workstation',
      description: isAm
        ? 'በጋራ መጠባበቅ ወይም ከሩቅ ማየት የለም። እያንዳንዱ ሰልጣኝ የራሱ የሆነ የሙቀት መቆጣጠሪያ ሶልደር (SMD Rework Station)፣ ዲጂታል መልቲሜትር፣ ማይክሮስኮፕ እና መመርመሪያ ሰሌዳዎች የተሟላለት የግል ወንበር ይሰጠዋል።'
        : 'Zero crowding or waiting your turn. Every student is assigned their own diagnostic station equipped with SMD hot-air rework, digital multimeter, stereo microscope, and live motherboards.',
      icon: 'Wrench',
      feature: isAm ? 'የግል ማይክሮስኮፕና የጥገና መሳሪያዎች ለእያንዳንዱ ተማሪ' : 'Dedicated microscope & rework station per seat',
    },
    {
      badge: isAm ? 'ጥልቅ የሰርኪውት ምርመራ' : 'Component-Level Mastery',
      title: isAm ? 'የኮምፖነንት ደረጃ እና ማይክሮ-ሶልደሪንግ ጥገና' : 'Micro-Soldering & Schematic Diagnostics',
      description: isAm
        ? 'ቀላል ስክሪን ወይም ባትሪ ከመቀየር ባለፈ፣ የቦርድቪው (Boardview) እና የሰርኪውት ንድፍ (Schematic) ንባብን፣ አጫጭር ሰርኪውቶችን ማግኘት፣ የIC ቺፖችን ማንሳትና መትከልን (BGA Reballing) በጥልቀት ይማራሉ።'
        : 'We go far beyond modular part swapping. Master multi-layer PCB schematics, boardview signal tracing, short-circuit injection, IC chip reballing, and jumper wire micro-routing.',
      icon: 'Cpu',
      feature: isAm ? 'የሰርኪውት ንድፎች (Schematics) ንባብ እና የIC ጥገና' : 'Schematic tracing, IC reballing & jumper routing',
    },
    {
      badge: isAm ? 'መንግስታዊ እውቅና ያለው' : 'Official Accreditation',
      title: isAm ? 'መንግስታዊ እውቅና እና የCOC ብቃት ማረጋገጫ' : 'Accredited TVET & National COC Readiness',
      description: isAm
        ? 'በሁሉም የትምህርት እርከኖች ሙሉ ህጋዊ እውቅና ያለው ተቋም። ለብሄራዊ የCOC ፈተና (Basic Electronics & Industrial Electrical Machines) በከፍተኛ ውጤት የሚያልፉበት የተግባር ዝግጅት ይሰጣል።'
        : 'Accredited by regional and national technical education authorities. Intensive mock testing and hands-on drills tailored directly to pass national TVET & COC certification exams.',
      icon: 'ShieldCheck',
      feature: isAm ? 'ህጋዊ የሙያ ማረጋገጫ እና የCOC ዝግጅት' : 'Certified TVET credentials & guaranteed COC preparation',
    },
    {
      badge: isAm ? 'እውነተኛ ብልሽቶች' : 'Real-World Hardware',
      title: isAm ? 'በእውነተኛ የደንበኞች እቃዎች ላይ የሚደረግ ልምምድ' : 'Troubleshooting Real Consumer & Industrial Gear',
      description: isAm
        ? 'በህይወት ባሉ ስልኮች፣ ላፕቶፖች፣ የፍሪጅ ኮምፕረሰሮች እና የሞተር መቆጣጠሪያዎች ላይ የውሃ መግባት፣ የፓወር መጥፋትና የተቃጠሉ ክፍሎችን በቀጥታ ፈትሸው ይጠግናሉ።'
        : 'Practice on actual non-working smartphones, motherboards, refrigeration compressors, and motor control panels—diagnosing real-world water damage, dead power rails, and short circuits.',
      icon: 'Laptop',
      feature: isAm ? 'ከመጀመሪያው ሳምንት ጀምሮ በእውነተኛ እቃዎች ላይ መስራት' : 'Live hardware fault isolation from week one',
    },
    {
      badge: isAm ? 'የዕድሜ ልክ ዲጂታል መዳረሻ' : 'Lifetime Knowledge Vault',
      title: isAm ? 'የዕድሜ ልክ የዲጂታል ላይብረሪና የሰርኪውት ንድፎች' : 'Lifetime Schematics & Digital Studio Access',
      description: isAm
        ? 'ስልጠናው ከተጠናቀቀ በኋላም የማያቋርጥ የቪዲዮ ትምህርቶች፣ ጥራት ያላቸው የሰርኪውት ንድፎች (Schematics)፣ የቦርድቪው ፋይሎች እና የቴክኒክ ማኑዋሎች የዕድሜ ልክ መዳረሻ ያገኛሉ።'
        : 'Learning continues long after graduation. Access 4K video masterclasses, high-resolution schematics, boardview files, and technical manuals 24/7 on our protected student learning portal.',
      icon: 'BookOpen',
      feature: isAm ? '24/7 የዲጂታል ቤተ-መጽሐፍትና የሰርኪውት ፋይሎች' : '24/7 protected schematics vault & video library',
    },
    {
      badge: isAm ? 'የስራ ፈጠራ ድጋፍ' : 'Business Incubation',
      title: isAm ? 'የጥገና ሱቅ መክፈቻ፣ መለዋወጫ ማግኛና የስራ ፈጠራ ድጋፍ' : 'Shop Launch, Parts Sourcing & Business Mentorship',
      description: isAm
        ? 'የቴክኒክ ክህሎቱን ብቻ ሳይሆን የጥገና ሱቅ እንዴት እንደሚከፈት፣ አስተማማኝ የመለዋወጫ እቃዎች ከየት በጅምላ እንደሚገኙ እና ለደንበኞች የዋጋ አተማመን ላይ ቀጥተኛ ሙያዊ ድጋፍ ያገኛሉ።'
        : 'We prepare you for financial independence. Receive direct mentorship on wholesale spare parts supply channels in Addis Ababa & Bahir Dar, shop tooling, customer quotation, and business launch.',
      icon: 'Briefcase',
      feature: isAm ? 'የጅምላ መለዋወጫ አቅራቢዎች ግንኙነት እና የቢዝነስ ድጋፍ' : 'Wholesale vendor access & shop startup guidance',
    },
  ]

  return (
    <SiteShell>
      <main>
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.22),transparent_45%)]" />
          <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-28">
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white animate-float-slow backdrop-blur-md shadow-lg shadow-blue-900/20">
                <span className="flex size-2 rounded-full bg-white animate-ping mr-0.5" />
                <CircuitBoard className="size-3.5" />
                <span>
                  {isAm
                    ? 'ቴክኒካዊ ትምህርት · በተግባር ላይ የተመሠረተ'
                    : 'Technical Education · Built Around Practice'}
                </span>
              </div>
              <h1 className="max-w-2xl text-5xl font-extrabold tracking-[-0.04em] md:text-6xl lg:text-[4.35rem] lg:leading-[1.03]">
                {isAm ? 'ተግባራዊ ክህሎትን ያዳብሩ። ' : 'Build practical skills. '}
                <span className="text-white drop-shadow-sm">
                  {isAm ? 'በልበ ሙሉነት ይጠግኑ።' : 'Repair with confidence.'}
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-blue-50">
                {isAm
                  ? 'የሞባይል ስልክ ጥገናን፣ የኮምፒውተር ጥገናን፣ የኤሌክትሮኒክስ ዲያግኖስቲክስ እና የማይክሮ-ሶልደሪንግ ስራዎችን በባህር ዳር በተግባር ላይ ባተኮረ ጥራት ያለው ስልጠና ይማሩ።'
                  : 'Learn mobile phone repair, computer maintenance, electronics troubleshooting, and micro-soldering through focused, hands-on technical practical training in Bahir Dar.'}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="rounded-xl bg-white px-6 font-bold text-[#155DFC] transition duration-300 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]"
                  >
                    {isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore courses'} <ArrowRight data-icon="inline-end" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/50 bg-white/10 px-6 font-semibold text-white transition duration-300 hover:border-white hover:bg-white/20 hover:text-white"
                  >
                    {isAm ? 'ያግኙን' : 'Contact us'}
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white">
                    <Check className="size-3.5" />
                  </span>
                  <span>{isAm ? '100% የተግባር ላብራቶሪ ስልጠና' : '100% Practical Hands-on Labs'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white">
                    <Check className="size-3.5" />
                  </span>
                  <span>{isAm ? 'ሲግናል ሞል፣ ባህር ዳር' : 'Signal Mall, Bahir Dar Location'}</span>
                </div>
              </div>
            </div>

            {/* Hero Image Visual with Interactive Depth */}
            <div className="relative group">
              <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-2xl shadow-blue-950/30 transition duration-500 group-hover:border-white/60">
                <img
                  src="/images/ems-hero-workbench.png"
                  alt={isAm ? 'የኤሌክትሮኒክስ መመርመሪያ እና የጥገና ቤንች' : 'Circuit board and electronic components on a workbench'}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c3694]/80 via-transparent to-transparent" />
              </div>

              {/* Floating Benchmark Badge */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/25 bg-white/95 p-4.5 shadow-2xl backdrop-blur-md sm:block animate-float-slow text-slate-900">
                <div className="flex items-center gap-3.5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#155DFC] text-white shadow-md shadow-blue-500/30">
                    <Wrench className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-sm font-bold text-slate-900">
                        {isAm ? 'የዲያግኖስቲክስና ጥገና ላብራቶሪ' : 'Diagnostic Workshop Labs'}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {isAm
                        ? 'ትክክለኛ እቃዎች። ትክክለኛ ንድፎች። በራስ መተማመን።'
                        : 'Real tools. Real schematics. Confidence.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAT STRIP ── */}
        <StatStrip />

        {/* ── FEATURED COURSES SECTION ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={isAm ? 'ምን መማር ይችላሉ' : 'What you can learn'}
              title={isAm ? 'ለገበያው ተፈላጊ የሆኑ የቴክኒክ ክህሎቶች' : 'Technical skills for real-world repairs'}
              description={
                isAm
                  ? 'ከመሰረቱ ይጀምሩ፤ በመቀጠል የዲያግኖስቲክስ አስተሳሰብን፣ የሰርኪውት ንድፎችን ማንበብ እና የተግባር የጥገና ልምዶችን በማዳበር የተካኑ ባለሙያ ይሁኑ።'
                  : 'Start with the fundamentals, then master the diagnostic thinking, schematic navigation, and practical soldering habits that make a confident technician.'
              }
            />
            {courses.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md p-6 card-hover-lift hover:border-primary/50 shadow-sm transition-all"
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
                        {isAm ? 'ስልጠናውንና ካሪኩለሙን ይመልከቱ' : 'View course & curriculum'}{' '}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isAm ? 'ስልጠናዎች ሲታተሙ እዚህ ይታያሉ።' : 'Courses will appear here once they are published.'}
              </p>
            )}
          </div>
        </section>

        {/* ── WHY CHOOSE US / THE PRACTICAL ADVANTAGE (USP) ── */}
        <section className="relative overflow-hidden bg-[#091e54] bg-gradient-to-br from-[#091e54] via-[#0c2f86] to-[#1244b8] px-5 py-24 text-white lg:px-8 border-y border-blue-400/30 shadow-2xl">
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 circuit-grid-bg opacity-25 pointer-events-none" />
          {/* Ambient glow orbs */}
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 bottom-1/4 size-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

          <div className="container relative mx-auto max-w-7xl">
            {/* Header / Value Proposition Narrative */}
            <div className="max-w-3xl mb-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-200 backdrop-blur-md shadow-sm">
                <CircuitBoard className="size-3.5 text-sky-300" />
                <span>{isAm ? 'ለምን ሄሎ ቴክኖሎጂን ይመርጣሉ? · የተግባር ልህቀት' : 'Why Choose Hello Technology · The Practical Advantage'}</span>
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                {isAm
                  ? 'ለእውነተኛ የስራ ብቃት የታነፀ፤ በንድፈ-ሀሳብ ብቻ ያልተገደበ ልዩ ስልጠና'
                  : 'Engineered for Real Workbench Competence — Why We Stand Apart'}
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-blue-100/90 font-normal">
                {isAm
                  ? 'አብዛኛዎቹ የቴክኒክ ማዕከላት ጊዜ ያለፈባቸውን ስላይዶች በማንበብ ወይም በርካታ ተማሪዎችን በአንድ መሳሪያ ላይ በማጨናነቅ ይወሰናሉ። በሄሎ ቴክኖሎጂ ግን እውነተኛ የስራ ብቃት መለያችን ነው፡ እያንዳንዱ ሰልጣኝ የግል የላብራቶሪ ወንበር ተሰጥቶት፣ በህይወት ባሉ እቃዎች ላይ ይለማመዳል፣ የሰርኪውት ንድፎችን ይፈታል፣ በህጋዊ የCOC ብቃት ተረጋግጦ ወደ ስራ ይሰማራል።'
                  : 'Most vocational schools lecture from generic slides or crowd ten students around a single multimeter. At Hello Technology, practical competence is our founding standard: every student commands their own dedicated workstation, repairs real damaged devices, masters multi-layer schematics, and graduates with recognized national COC credentials ready to launch a career or independent repair business.'}
              </p>
            </div>

            {/* 6 Core USP Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whyChooseUsUsps.map((item, index) => (
                <div
                  key={item.title}
                  className="card-hover-lift group relative flex flex-col justify-between rounded-2xl border border-white/20 bg-white/[0.09] p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/[0.15] hover:border-sky-300/50 hover:shadow-2xl"
                >
                  <div>
                    {/* Top row: Icon + Number Index */}
                    <div className="flex items-center justify-between">
                      <CourseIcon
                        name={item.icon as any}
                        className="bg-white/20 text-white border border-white/30 shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-black tracking-widest text-sky-300/80 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                        0{index + 1}
                      </span>
                    </div>

                    {/* USP Badge Pill */}
                    <div className="mt-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-200">
                        <Sparkles className="size-3 text-amber-300" />
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-lg font-bold text-white transition-colors group-hover:text-sky-200">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-sm leading-relaxed text-blue-100/85">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature Check Pill */}
                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-sky-200">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>{item.feature}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── THE HELLO TECHNOLOGY DIFFERENCE (HEAD-TO-HEAD COMPARISON) ── */}
            <div className="mt-14 rounded-3xl border border-white/20 bg-white/[0.07] p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sky-300">
                    <CheckCircle2 className="size-4" />
                    {isAm ? 'የስልጠና ልዩነታችን በንፅፅር' : 'The Practical Differentiator'}
                  </span>
                  <h3 className="mt-1 text-xl md:text-2xl font-extrabold text-white">
                    {isAm ? 'ሄሎ ቴክኖሎጂ ከተለመዱት ማዕከላት በምን ይለያል?' : 'How Hello Technology Compares to Conventional Centers'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                    {isAm ? '100% የተረጋገጠ የተግባር ልህቀት' : '100% Verified Practical Standard'}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Conventional Centers */}
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="flex size-7 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <X className="size-4" />
                    </span>
                    <h4 className="font-bold text-slate-200">
                      {isAm ? 'የተለመዱ የሙያ ማሰልጠኛ ማዕከላት' : 'Conventional Training Centers'}
                    </h4>
                  </div>
                  <ul className="space-y-3 text-sm text-blue-100/75">
                    <li className="flex items-start gap-2.5">
                      <X className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{isAm ? 'በንድፈ-ሀሳብ የተሞሉ ንግግሮችና በስላይድ ላይ የተመሰረተ ማስተማር' : 'Theory-heavy lectures relying heavily on slides with minimal bench time'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{isAm ? 'ከ4 እስከ 8 ተማሪዎች በአንድ ሜትር ወይም ማይክሮስኮፕ ላይ መጠናነቅ' : '4 to 8 students crowded around a single meter or microscope to observe'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{isAm ? 'የሰርኪውት ሎጂክ ሳይገባ ስክሪን ወይም ባትሪ ብቻ የመቀየር ልምምድ' : 'Superficial module or screen swapping without schematic circuit understanding'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{isAm ? 'ስልጠናው ከተጠናቀቀ በኋላ ምንም አይነት የሰርኪውት ወይም የሱቅ መክፈቻ ድጋፍ አለመኖር' : 'Zero schematics access or shop-launch business guidance after graduation'}</span>
                    </li>
                  </ul>
                </div>

                {/* The Hello Technology Standard */}
                <div className="rounded-2xl border border-sky-400/40 bg-sky-950/40 p-5 backdrop-blur-sm shadow-lg shadow-sky-950/50">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
                      <Check className="size-4" />
                    </span>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span>{isAm ? 'የሄሎ ቴክኖሎጂ የስራ ብቃት ደረጃ' : 'The Hello Technology Standard'}</span>
                      <span className="rounded-full bg-sky-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase text-sky-200">
                        {isAm ? 'የእኛ መለያ' : 'Our USP'}
                      </span>
                    </h4>
                  </div>
                  <ul className="space-y-3 text-sm text-sky-100">
                    <li className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="font-medium">{isAm ? 'ከመጀመሪያው ቀን ጀምሮ 80%+ የተግባር የላብራቶሪ ብልሽት ፍተሻ' : '80%+ hands-on workbench troubleshooting on real live hardware from day one'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="font-medium">{isAm ? 'ለእያንዳንዱ ተማሪ 100% የግል ወንበር፣ የሙቀት ሶልደርና ማይክሮስኮፕ' : 'Guaranteed dedicated 1:1 workstation with stereo microscope and SMD hot-air rework'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="font-medium">{isAm ? 'ጥልቅ ማይክሮ-ሶልደሪንግ፣ ቦርድቪው፣ የሰርኪውት ንድፎች (Schematics) ንባብ እና IC ጥገና' : 'Master-level micro-soldering, boardview tracing, schematic analysis & IC reballing'}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="font-medium">{isAm ? 'የዕድሜ ልክ ዲጂታል ላይብረሪ መዳረሻ፣ የጅምላ መለዋወጫ አቅራቢዎች ግንኙነት እና የሱቅ መክፈቻ ድጋፍ' : 'Lifetime digital academy schematics vault, wholesale parts links & shop startup coaching'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Special Promotion Pill Banner inside the section */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 border border-amber-300/30">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {isAm ? 'ልዩ ማበረታቻ፦ 2+1 በነፃ + 10% የቅድመ ክፍያ ቅናሽ' : 'Special Enrollment Offer: Register for 2 Courses, Get 1 Free + 10% Off'}
                    </p>
                    <p className="text-xs text-blue-200">
                      {isAm
                        ? 'ከሁለት በላይ ስልጠናዎችን ለሚመዘገብ አንድ ተጨማሪ ኮርስ በነፃ ይሰጣል። ለሙሉ ቅድመ ክፍያ ተጨማሪ 10% ቅናሽ አለው።'
                        : 'Enroll in any 2 courses and unlock a third course completely free. Enjoy an extra 10% off for upfront full payment.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link href="/courses">
                    <Button
                      size="sm"
                      className="rounded-lg bg-white font-bold text-[#155DFC] hover:bg-blue-50 transition"
                    >
                      {isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore Courses'}
                      <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-white/40 bg-white/10 font-semibold text-white hover:bg-white/20 transition"
                    >
                      {isAm ? 'ማዕከላችንን ይጎብኙ' : 'Visit Campus'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── TESTIMONIALS & SUCCESS STORIES SECTION ── */}
        <TestimonialsSection />

        {/* ── CUSTOMIZED COMPANY TRAINING CTA ── */}
        <CompanyTrainingCTA />

        {/* ── TRUSTED BY SECTION (ANIMATED RIGHT TO LEFT MARQUEE) ── */}
        <TrustedBySection partners={trustedPartners} />

        {/* ── DIGITAL ACADEMY & SELF-PACED LIBRARY ── */}
        <section className="border-y bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] px-5 py-24 text-white lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.22),transparent_45%)]" />
          <div className="container relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              {/* Distance Learning & Online Invitation Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-sky-200 mb-4 backdrop-blur-md shadow-sm">
                <Globe className="size-3.5 text-amber-300 animate-pulse" />
                <span>
                  {isAm
                    ? 'የርቀት እና የኦንላይን ትምህርት · ዲጂታል አካዳሚ'
                    : "Can't Attend In Person? Study Online Anywhere"}
                </span>
              </div>

              {/* Bold Headline Addressing Remote / Non-Physical Attendees */}
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-[2.65rem] text-white leading-tight">
                {isAm
                  ? 'በባህር ዳር በአካል መገኘት አልቻሉም? ከየትኛውም ቦታ በኦንላይን በራስዎ ፍጥነት ይማሩ።'
                  : "Can't Attend in Bahir Dar? Master Repair Skills Online at Your Own Pace."}
              </h2>

              {/* Narrative Call for Online Self-Education */}
              <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-blue-100 font-normal">
                {isAm
                  ? 'የርቀት መራራቅ ወይም የስራ ጫና የጥገና ሙያ ከመማር አያግድዎትም! ከአዲስ አበባ፣ ከሌሎች ክልል ከተሞች ወይም ከሀገር ውጭ ሆነው፤ በስራ ጠረጴዛ ላይ ደረጃ በደረጃ የተቀረጹ የቪዲዮ ስልጠናዎችን፣ ከፍተኛ ጥራት ያላቸውን የሰርኪውት ንድፎች (Schematics) እና የተሟሉ የጥገና መመሪያዎችን በስልክዎ ወይም በኮምፒውተርዎ በራስዎ ምቹ ሰዓት ይማሩ።'
                  : 'Distance or a busy schedule shouldn’t stop you from building valuable hardware repair expertise. If you live outside Bahir Dar, work full-time, or prefer self-paced learning, our Digital Academy brings the real workbench straight to your screen with lifetime access to 4K video masterclasses, high-res schematics, and direct instructor mentorship.'}
              </p>

              {/* 4 Pillars for Online Self-Educators */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-blue-100">
                <div className="flex items-start gap-2.5 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                  <Globe className="size-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      {isAm ? 'ከየትኛውም ቦታ ይማሩ' : 'Learn From Anywhere'}
                    </p>
                    <p className="text-blue-100/80 mt-0.5 text-[11px] leading-relaxed">
                      {isAm ? 'ወደ ባህር ዳር መጓዝ ሳያስፈልግዎት ከቤትዎ ወይም ከሱቅዎ ይማሩ።' : 'Study from Addis Ababa, regional cities, or abroad without relocating.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                  <Clock3 className="size-4 text-sky-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      {isAm ? '100% በራስዎ ምቹ ሰዓት' : '100% Self-Paced Schedule'}
                    </p>
                    <p className="text-blue-100/80 mt-0.5 text-[11px] leading-relaxed">
                      {isAm ? 'ከስራዎት ጋር በማጣጣም ጠዋት፣ ማታ ወይም ቅዳሜና እሁድ ይከታተሉ።' : 'Watch & re-watch bench lessons anytime around your job or business.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                  <Lock className="size-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      {isAm ? 'የተጠበቀ የቪዲዮ ትምህርት ስቱዲዮ' : 'In-Platform Learning Studio'}
                    </p>
                    <p className="text-blue-100/80 mt-0.5 text-[11px] leading-relaxed">
                      {isAm ? 'ለስልክና ለኮምፒውተር ምቹ የሆነ ጥራት ያለው መድረክ።' : 'Zero piracy risk with crystal-clear streaming on phone or laptop.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                  <ShieldCheck className="size-4 text-sky-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      {isAm ? 'የአሰልጣኞች የኦንላይን ድጋፍ' : 'Direct Instructor Mentorship'}
                    </p>
                    <p className="text-blue-100/80 mt-0.5 text-[11px] leading-relaxed">
                      {isAm ? 'ለሚገጥምዎት የጥገና ጥያቄ ከአስተማሪዎቻችን ጋር በቀጥታ ይገናኙ።' : 'Troubleshooting guidance via our student community channels.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/library">
                  <Button size="lg" className="rounded-xl bg-white px-7 font-bold text-[#155DFC] shadow-xl hover:bg-blue-50 hover:scale-[1.02] transition-all">
                    {isAm ? 'የኦንላይን ስልጠናዎችን ያስሱ' : 'Start Online Self-Study'} <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/251947747070?text=${encodeURIComponent(
                    isAm
                      ? 'ሰላም! በአካል ባህር ዳር መገኘት ስለማልችል የኦንላይን ወይም የርቀት ስልጠናዎችን መከታተል እፈልጋለሁ። ተጨማሪ መረጃ ቢሰጡኝ?'
                      : 'Hello! I cannot attend in Bahir Dar in person. I would like to inquire about online self-paced training programs and distance learning options.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-white/50 bg-white/10 text-white hover:border-white hover:bg-white hover:text-[#155DFC] transition-all"
                  >
                    <MessageCircle className="size-4 mr-1.5 text-emerald-300" />
                    {isAm ? 'የርቀት ትምህርት በWhatsApp ይጠይቁ' : 'Ask Distance Study on WhatsApp'}
                  </Button>
                </a>
                <Link href="/student/dashboard">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white underline underline-offset-4 transition-colors">
                    {isAm ? 'የተማሪ ፖርታልን ክፈት →' : 'Open Student Portal →'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Showcase 3 Resource Cards */}
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-blue-200">
                <span className="font-bold uppercase tracking-wider text-sky-200">
                  {isAm ? 'ተወዳጅ የኦንላይን ይዘቶች' : 'Featured Self-Paced Library'}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-bold text-white">
                  {isAm ? 'ፈጣን ዲጂታል መዳረሻ' : 'Instant Digital Access'}
                </span>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 shadow-xl group">
                  <div className="flex items-center justify-between text-xs text-blue-200">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300">
                      <Video className="size-4" /> {isAm ? 'የቪዲዮ ስልጠና' : 'Video Masterclass'}
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">850 ETB</span>
                  </div>
                  <h3 className="mt-3 font-bold text-white text-base group-hover:text-amber-200 transition-colors">
                    {isAm ? 'የሞባይል ማይክሮ-ሶልደሪንግ መሰረታዊያን' : 'Mobile Micro-Soldering Fundamentals'}
                  </h3>
                  <p className="mt-1.5 text-xs text-blue-100 line-clamp-2">
                    {isAm
                      ? 'በ40x ስቲሪዮ ማይክሮስኮፕ ስር የተቀረጹ 18 ተግባራዊ የቤንች ትምህርቶች። ጃምፐር ማገናኘት እና BGA ሪቦሊንግ።'
                      : '18 HD recorded bench lessons under 40x stereo microscope. Jumper wire bridging and BGA reballing.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                    <span>{isAm ? '18 ትምህርቶች · 4ሰ 35ደ' : '18 Lessons · 4h 35m'}</span>
                    <Link href="/library" className="font-semibold text-white group-hover:underline">
                      {isAm ? 'በመድረኩ ይማሩ →' : 'Study Online →'}
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 shadow-xl group">
                  <div className="flex items-center justify-between text-xs text-blue-200">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sky-300">
                      <BookOpen className="size-4" /> {isAm ? 'ዲጂታል መመሪያ' : 'Digital Manual'}
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">450 ETB</span>
                  </div>
                  <h3 className="mt-3 font-bold text-white text-base group-hover:text-sky-200 transition-colors">
                    {isAm ? 'የሃርድዌር ዲያግኖስቲክስ ማስተር መመሪያ' : 'Hardware Diagnostic Master Manual'}
                  </h3>
                  <p className="mt-1.5 text-xs text-blue-100 line-clamp-2">
                    {isAm
                      ? '142 ገጾች የሰርኪውት ፍሰት፣ የፓወር-ኦን ቅደም ተከተሎች፣ የቻርጂንግ IC ግንኙነት እና የዲስፕሌይ ቡስት ሰርኪውቶች።'
                      : '142 pages of circuit flowcharts, power-on sequences, charging IC handshake, and display boost circuits.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                    <span>{isAm ? '142 ገጾች · ሙሉ ንድፎች' : '142 Pages · Full Schematics'}</span>
                    <Link href="/library" className="font-semibold text-white group-hover:underline">
                      {isAm ? 'በመድረኩ ይማሩ →' : 'Study Online →'}
                    </Link>
                  </div>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 shadow-xl group">
                  <div className="flex items-center justify-between text-xs text-blue-200">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-300">
                      <BookOpen className="size-4" /> {isAm ? 'የማዘርቦርድ አጋዥ መጽሐፍ' : 'Motherboard Handbook'}
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">550 ETB</span>
                  </div>
                  <h3 className="mt-2 font-bold text-white text-base group-hover:text-emerald-200 transition-colors">
                    {isAm
                      ? 'የላፕቶፕ ማዘርቦርድ ፓወር ቅደም ተከተልና የስታንድባይ ሬይል ንድፎች'
                      : 'Laptop Motherboard Power Sequencing & Standby Rail Schematics'}
                  </h3>
                  <p className="mt-1 text-xs text-blue-100">
                    {isAm
                      ? '19V VIN ስርጭት፣ ባለሁለት ኢንፑት MOSFETs፣ 3.3V/5V ስታንድባይ PWM ICs፣ እና የSuper I/O / EC ግንኙነት ሎጂክ።'
                      : '19V VIN distribution, dual input MOSFETs, 3.3V/5V Standby PWM ICs, and Super I/O / EC handshake logic.'}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                    <span>{isAm ? '88 ገጾች · ከፍተኛ ጥራት PDF DRM' : '88 Pages · High-Res PDF DRM'}</span>
                    <Link href="/library" className="font-semibold text-white group-hover:underline">
                      {isAm ? 'በራስዎ ፍጥነት ይማሩ →' : 'Self-Paced Learning →'}
                    </Link>
                  </div>
                </div>

                {/* Additional invite strip at bottom of card grid */}
                <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-blue-100 backdrop-blur-md">
                  <span className="flex items-center gap-2 font-medium">
                    <Sparkles className="size-3.5 text-amber-300 shrink-0" />
                    <span>{isAm ? 'በዲጂታል ላይብረሪያችን ከ20+ በላይ ሰርኪውቶችና ቪዲዮዎች ይገኛሉ' : '20+ schematics & recorded bench masterclasses available'}</span>
                  </span>
                  <Link href="/library" className="font-bold text-white hover:underline shrink-0 ml-3">
                    {isAm ? 'ሁሉንም ይመልከቱ →' : 'View All →'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <CTASection />
      </main>
    </SiteShell>
  )
}
