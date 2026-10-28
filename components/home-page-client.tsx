'use client'

import { useState, useRef } from 'react'
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
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseIcon, CTASection, SectionHeading, SiteShell, StatStrip } from '@/components/site'
import { CompanyTrainingCTA } from '@/components/company-training-cta'
import { TrustedBySection } from '@/components/trusted-by-marquee'
import { TestimonialsSection } from '@/components/testimonials-section'
import { useLanguage } from '@/components/language-provider'
import { schoolConfig } from '@/lib/data'
import { getFallbackCourseImage, type PublicCourse, type PublicTrustedPartner } from '@/lib/content'

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

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }


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
        {/* ── HERO SECTION WITH FULL-SCREEN VIDEO BACKGROUND & TEXT OVERLAY ── */}
        <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[calc(100vh-62px)] flex items-center">
          {/* Background Video (Hello.mp4) */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 size-full object-cover pointer-events-none"
            src="/videos/Hello.mp4"
          />

          {/* Cinematic Gradient Scrims for Perfect Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(21,93,252,0.35),transparent_65%)] pointer-events-none" />

          {/* Overlay Text Content */}
          <div className="relative z-10 container mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white animate-float-slow backdrop-blur-md shadow-lg shadow-black/40">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                <CircuitBoard className="size-3.5 text-sky-300" />
                <span>
                  {isAm
                    ? 'ቴክኒካዊ ትምህርት · በተግባር ላይ የተመሠረተ'
                    : 'Technical Education · Built Around Practice'}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg">
                {isAm ? 'ተግባራዊ ክህሎትን ያዳብሩ። ' : 'Build practical skills. '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-100 to-white">
                  {isAm ? 'በልበ ሙሉነት ይጠግኑ።' : 'Repair with confidence.'}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-blue-50 font-normal drop-shadow-md">
                {isAm
                  ? 'የሞባይል ስልክ ጥገናን፣ የኮምፒውተር ጥገናን፣ የኤሌክትሮኒክስ ዲያግኖስቲክስ እና የማይክሮ-ሶልደሪንግ ስራዎችን በባህር ዳር በተግባር ላይ ባተኮረ ጥራት ያለው ስልጠና ይማሩ።'
                  : 'Learn mobile phone repair, computer maintenance, electronics troubleshooting, and micro-soldering through focused, hands-on technical practical training in Bahir Dar.'}
              </p>

              {/* Direct Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Link href="/#courses">
                  <Button
                    size="lg"
                    className="rounded-xl bg-white px-6 font-bold text-[#155DFC] hover:bg-blue-50 shadow-2xl transition duration-300 hover:scale-[1.02]"
                  >
                    {isAm ? 'ስልጠናዎችን ይመልከቱ' : 'Explore courses'} <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/50 bg-white/10 px-6 font-semibold text-white transition duration-300 hover:border-white hover:bg-white/20 hover:text-white backdrop-blur-md"
                  >
                    {isAm ? 'ያግኙን' : 'Contact us'}
                  </Button>
                </Link>

                <a href={`tel:${schoolConfig.phone.replace(/\s+/g, '')}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-emerald-400/40 bg-emerald-500/20 px-5 font-semibold text-white hover:bg-emerald-500/30 transition backdrop-blur-md"
                  >
                    <Phone className="size-4 mr-2 text-emerald-300" />
                    {schoolConfig.phone}
                  </Button>
                </a>
              </div>

              {/* Trust Points */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-blue-100 font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    <Check className="size-3.5" />
                  </span>
                  <span>{isAm ? '100% የተግባር ላብራቶሪ ስልጠና' : '100% Practical Hands-on Labs'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white border border-white/25">
                    <Check className="size-3.5" />
                  </span>
                  <span>{isAm ? 'ሲግናል ሞል፣ ባህር ዳር' : 'Signal Mall, Bahir Dar Location'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ambient Sound / Unmute Control in Bottom Right */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/70 hover:border-white/40 transition shadow-lg"
          >
            {isMuted ? (
              <>
                <VolumeX className="size-4 text-white/80" />
                <span>{isAm ? 'ድምፅ ክፈት' : 'Unmute'}</span>
              </>
            ) : (
              <>
                <Volume2 className="size-4 text-emerald-400 animate-pulse" />
                <span>{isAm ? 'ድምፅ ዝጋ' : 'Mute'}</span>
              </>
            )}
          </button>
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
                {courses.map((course) => {
                  const courseImg =
                    course.image && course.image.trim().length > 0
                      ? course.image
                      : getFallbackCourseImage(course.slug, course.category)

                  return (
                    <article
                      key={course.id}
                      className="card-hover-lift group flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-white/50"
                    >
                      {/* Top of Card Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900/60">
                        <img
                          src={courseImg}
                          alt={course.title}
                          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f86] via-transparent to-black/25 pointer-events-none" />

                        {/* Category badge */}
                        <span className="absolute top-3 left-3 z-10 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                          {course.category}
                        </span>

                        {/* Period / Duration badge */}
                        {course.duration && (
                          <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-sky-200 border border-white/20">
                            <Clock3 className="size-3 text-sky-300" />
                            {course.duration}
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white transition-colors group-hover:text-blue-100 line-clamp-2 leading-snug">
                            {course.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-blue-100/85 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Footer with Level & View Details Button */}
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/20 pt-3">
                          {course.level ? (
                            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/25">
                              {course.level}
                            </span>
                          ) : (
                            <span />
                          )}
                          <Link
                            href={`/courses/${course.slug}`}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-950/40 border border-blue-300/40 transition-all duration-200 hover:scale-[1.03] group/btn"
                          >
                            <span>{isAm ? 'ዝርዝሩን ይመልከቱ' : 'View Details'}</span>
                            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isAm ? 'ስልጠናዎች ሲታተሙ እዚህ ይታያሉ።' : 'Courses will appear here once they are published.'}
              </p>
            )}
          </div>
        </section>

        {/* ── WHY CHOOSE US / THE PRACTICAL ADVANTAGE (USP) ── */}
        <section className="px-5 py-20 lg:px-8">
          <div className="container relative mx-auto max-w-7xl">
            {/* Header / Value Proposition Narrative */}
            <div className="mx-auto max-w-3xl mb-14 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary shadow-xs mb-4">
                <CircuitBoard className="size-3.5" />
                <span>{isAm ? 'የተግባር ልህቀት' : 'The Practical Advantage'}</span>
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-tight">
                {isAm ? 'ለምን ሄሎ ቴክኖሎጂን ይመርጣሉ?' : 'Why Choose Hello Technology'}
              </h2>
            </div>

            {/* 6 Core USP Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whyChooseUsUsps.map((item, index) => (
                <div
                  key={item.title}
                  className="card-hover-lift group relative flex flex-col justify-between rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] p-7 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-white/50"
                >
                  <div>
                    {/* Top row: Icon + Number Index */}
                    <div className="flex items-center justify-between">
                      <CourseIcon
                        name={item.icon as any}
                        className="bg-white/20 text-white border border-white/30 shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-black tracking-widest text-white/90 bg-white/20 px-2.5 py-1 rounded-full border border-white/25">
                        0{index + 1}
                      </span>
                    </div>

                    {/* USP Badge Pill */}
                    <div className="mt-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <Sparkles className="size-3 text-amber-300" />
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-xl font-bold text-white transition-colors group-hover:text-blue-100">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-sm leading-relaxed text-blue-100">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature Check Pill */}
                  <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 text-xs font-semibold text-white/95">
                    <Check className="size-3.5 text-emerald-300 shrink-0" />
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
        <section className="px-5 py-20 lg:px-8">
          <div className="container relative mx-auto max-w-7xl">
            {/* Centered Section Header on Transparent Page Background */}
            <div className="mx-auto max-w-3xl mb-12 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary shadow-xs mb-4">
                <Globe className="size-3.5 animate-pulse" />
                <span>
                  {isAm
                    ? 'የርቀት እና የኦንላይን ትምህርት · ዲጂታል አካዳሚ'
                    : "Can't Attend In Person? Study Online Anywhere"}
                </span>
              </span>

              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-tight">
                {isAm
                  ? 'በባህር ዳር በአካል መገኘት አልቻሉም? ከየትኛውም ቦታ በኦንላይን ይማሩ።'
                  : "Can't Attend in Bahir Dar? Master Repair Skills Online at Your Own Pace."}
              </h2>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-normal max-w-2xl mx-auto">
                {isAm
                  ? 'ከየትኛውም ከተማ ሆነው በስልክዎ ወይም በኮምፒውተርዎ የተግባር ቪዲዮዎችንና የሰርኪውት ንድፎችን በራስዎ ምቹ ሰዓት ይማሩ። አሁኑኑ ይደውሉልን ወይም በመስመር ላይ መማር ይጀምሩ።'
                  : 'Study practical workbench video masterclasses and circuit schematics anywhere around your schedule. Call our admissions team today or start streaming online.'}
              </p>
            </div>

            {/* Blue Action Card */}
            <div className="overflow-hidden rounded-3xl border border-blue-400/30 bg-[#0d2a75] bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] p-8 text-white shadow-2xl sm:p-12 lg:p-14 relative">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.22),transparent_45%)] pointer-events-none" />

              <div className="relative grid items-center gap-10 lg:grid-cols-12">
                {/* Left Column: Short & Precise Copy + Action to Call */}
                <div className="lg:col-span-7">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {isAm ? 'የቀጥታ ስልክ መስመር ወይም ኦንላይን ላይብረሪ' : 'Direct Admissions Helpline & Digital Vault'}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-blue-100 font-normal">
                    {isAm
                      ? 'የስልጠና አማካሪዎቻችን ዝርዝር መረጃዎችን ይሰጡዎታል። እንዲሁም በዲጂታል ላይብረሪያችን የተመዘገቡ የቪዲዮ ትምህርቶችን ማግኘት ይችላሉ።'
                      : 'Our admissions counselors are ready to answer your questions, or start learning immediately through our self-paced masterclasses.'}
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
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <CTASection />
      </main>
    </SiteShell>
  )
}

