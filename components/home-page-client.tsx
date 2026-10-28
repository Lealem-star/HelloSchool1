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
  ShieldCheck,
  Cpu,
  Laptop,
  Briefcase,
  Globe,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseIcon, CTASection, SectionHeading, SiteShell, StatStrip } from '@/components/site'
import { CompanyTrainingCTA } from '@/components/company-training-cta'
import { TrustedBySection } from '@/components/trusted-by-marquee'
import { TestimonialsSection } from '@/components/testimonials-section'
import { useLanguage } from '@/components/language-provider'
import { schoolConfig } from '@/lib/data'
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
                <Link href="/#courses">
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
        <section id="courses" className="scroll-mt-16 px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={isAm ? 'ምን መማር ይችላሉ' : 'What you can learn'}
              title={isAm ? 'ለገበያው ተፈላጊ የሆኑ የቴክኒክ ክህሎቶች' : 'Technical skills for real-world repairs'}
              description={
                isAm
                  ? 'ከመሰረቱ ይጀምሩ፤ በመቀጠል የዲያግኖስቲክስ አስተሳሰብን፣ የሰርኪውት ንድፎችን ማንበብ እና የተግባር የጥገና ልምዶችን በማዳበር የተካኑ ባለሙያ ይሁኑ።'
                  : 'Start with the fundamentals, then master the diagnostic thinking, schematic navigation, and practical soldering habits that make a confident technician.'
              }
              align="center"
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
            <div className="mx-auto max-w-3xl mb-12 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-200 backdrop-blur-md shadow-sm mb-4">
                <CircuitBoard className="size-3.5 text-sky-300" />
                <span>{isAm ? 'የተግባር ልህቀት' : 'The Practical Advantage'}</span>
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                {isAm ? 'ለምን ሄሎ ቴክኖሎጂን ይመርጣሉ?' : 'Why Choose Hello Technology'}
              </h2>
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
          </div>
        </section>


        {/* ── TESTIMONIALS & SUCCESS STORIES SECTION ── */}
        <TestimonialsSection />

        {/* ── CUSTOMIZED COMPANY TRAINING CTA ── */}
        <CompanyTrainingCTA />

        {/* ── TRUSTED BY SECTION (ANIMATED RIGHT TO LEFT MARQUEE) ── */}
        <TrustedBySection partners={trustedPartners} />

        {/* ── ONLINE LEARNING & DISTANCE STUDY CTA (SHORT & PRECISE) ── */}
        <section className="border-y bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] px-5 py-16 text-white lg:px-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.22),transparent_45%)] pointer-events-none" />

          <div className="container relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Short & Precise Copy + Action to Call */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-white/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-sky-200 mb-4 backdrop-blur-md shadow-sm">
                  <Globe className="size-3.5 text-amber-300 animate-pulse" />
                  <span>
                    {isAm
                      ? 'የርቀት እና የኦንላይን ትምህርት · ዲጂታል አካዳሚ'
                      : "Can't Attend In Person? Study Online Anywhere"}
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.65rem] text-white leading-tight">
                  {isAm
                    ? 'በባህር ዳር በአካል መገኘት አልቻሉም? ከየትኛውም ቦታ በኦንላይን ይማሩ።'
                    : "Can't Attend in Bahir Dar? Master Repair Skills Online at Your Own Pace."}
                </h2>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-blue-100 font-normal max-w-xl">
                  {isAm
                    ? 'ከየትኛውም ከተማ ሆነው በስልክዎ ወይም በኮምፒውተርዎ የተግባር ቪዲዮዎችንና የሰርኪውት ንድፎችን በራስዎ ምቹ ሰዓት ይማሩ። አሁኑኑ ይደውሉልን ወይም በመስመር ላይ መማር ይጀምሩ።'
                    : 'Study practical workbench video masterclasses and circuit schematics anywhere around your schedule. Call our admissions team today or start streaming online.'}
                </p>

                {/* Direct Action to Call & Start Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a href={`tel:${schoolConfig.phone.replace(/\s+/g, '')}`}>
                    <Button
                      size="lg"
                      className="rounded-xl bg-white px-6 font-bold text-[#155DFC] hover:bg-blue-50 shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <Phone className="size-4 mr-2 text-[#155DFC]" />
                      {isAm ? `በቀጥታ ይደውሉ፡ ${schoolConfig.phone}` : `Call Admissions: ${schoolConfig.phone}`}
                    </Button>
                  </a>

                  <Link href="/library">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-white/50 bg-white/10 text-white hover:border-white hover:bg-white/20 transition-all font-semibold"
                    >
                      {isAm ? 'ኦንላይን ኮርሶችን ይጀምሩ' : 'Start Online Courses'}
                      <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </Link>

                  <a
                    href={`https://wa.me/251947747070?text=${encodeURIComponent(
                      isAm
                        ? 'ሰላም! በአካል ባህር ዳር መገኘት ስለማልችል የኦንላይን ስልጠናዎችን መከታተል እፈልጋለሁ። ተጨማሪ መረጃ ቢሰጡኝ?'
                        : 'Hello! I cannot attend in Bahir Dar in person. I would like to inquire about online self-paced training programs.'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-emerald-400/40 bg-emerald-500/20 text-white hover:bg-emerald-500/30 transition-all font-semibold"
                    >
                      <MessageCircle className="size-4 mr-1.5 text-emerald-300" />
                      {isAm ? 'WhatsApp' : 'WhatsApp'}
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Column: Uploaded Image as the Trigger */}
              <div className="lg:col-span-5">
                <div className="relative group overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-2xl backdrop-blur-md">
                  <img
                    src="/images/online-learning-banner.png"
                    alt={
                      isAm
                        ? 'የኦንላይን ትምህርት በሄሎ ቴክኖሎጂ'
                        : "Can't Attend In Person? Study Online Anywhere"
                    }
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#155DFC]/90 px-3.5 py-1.5 font-bold backdrop-blur-md shadow-md text-white border border-white/20">
                      <Sparkles className="size-3.5 text-amber-300" />
                      {isAm ? '24/7 የዲጂታል መዳረሻ' : '24/7 Digital Access'}
                    </span>
                    <span className="rounded-lg bg-black/60 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md border border-white/15">
                      {isAm ? '100% በራስዎ ምቹ ሰዓት' : '100% Self-Paced'}
                    </span>
                  </div>
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

