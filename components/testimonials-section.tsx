'use client'

import Link from 'next/link'
import {
  Star,
  Quote,
  Sparkles,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Smartphone,
  Laptop,
  Printer,
  Zap,
  Radio,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

interface TestimonialItem {
  id: string
  nameAm: string
  nameEn: string
  roleAm: string
  roleEn: string
  cohortAm: string
  cohortEn: string
  outcomeAm: string
  outcomeEn: string
  image: string
  trackIcon: any
  trackTagAm: string
  trackTagEn: string
  quoteAm: string
  quoteEn: string
  rating: number
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'yonas-alemu',
    nameAm: 'ዮናስ አለሙ',
    nameEn: 'Yonas Alemu',
    roleAm: 'የስማርትፎንና ቦርድ ጥገና ባለሙያ',
    roleEn: 'Smartphone Logic Board Specialist',
    cohortAm: 'የ 21ኛው ዙር ተመራቂ',
    cohortEn: 'Cohort 21 Graduate',
    outcomeAm: 'የ"ዮኒ ሞባይል ክሊኒክ" ጥገና ሱቅ ባለቤት (ባሕር ዳር)',
    outcomeEn: 'Founder, Yoni Mobile Clinic (Bahir Dar)',
    image: '/images/studentathellobench4.png',
    trackIcon: Smartphone,
    trackTagAm: 'የሞባይል ሃርድዌርና ማይክሮ-ሶልደሪንግ',
    trackTagEn: 'Mobile Hardware & Micro-Soldering',
    quoteAm:
      'ከዚህ በፊት የሞባይል ሶፍትዌር ብቻ ነበር የምሰራው፤ ሃርድዌር መበየድ እና አይሲ (IC) ማንሳት ያስፈራኝ ነበር። በሄሎ ቴክኖሎጂ ላብራቶሪ በማይክሮስኮፕ ስር 0.01mm ጃምፐር ማገናኘትና ቦርድ ዲያግኖስቲክስ በተግባር ሰርተን ስንጨርስ ፍርሃቴ ሙሉ በሙሉ ጠፋ። አሁን የራሴን የጥገና ሱቅ ከፍቼ በቀን ከ 8 በላይ ስልኮችን በሙሉ እምነት እጠግናለሁ።',
    quoteEn:
      'I used to fear motherboard rework and micro-soldering. Practicing trace jumping under 40x stereo microscopes at Hello Technology gave me the confidence to launch my own repair shop in Bahir Dar.',
    rating: 5,
  },
  {
    id: 'mikiyas-tadesse',
    nameAm: 'ሚኪያስ ታደሰ',
    nameEn: 'Mikiyas Tadesse',
    roleAm: 'የኮምፒውተርና ማዘርቦርድ ጥገና ቴክኒሻን',
    roleEn: 'Laptop & Computer Hardware Tech',
    cohortAm: 'የ 19ኛው ዙር ተመራቂ',
    cohortEn: 'Cohort 19 Graduate',
    outcomeAm: 'የአይቲ ሃርድዌር ጥገና ባለሙያ በሪጅናል ሆስፒታል',
    outcomeEn: 'IT Hardware Support Tech, Regional Hospital',
    image: '/images/studentathellobench3.png',
    trackIcon: Laptop,
    trackTagAm: 'የላፕቶፕና ፒሲ ማዘርቦርድ ጥገና',
    trackTagEn: 'Laptop & PC Motherboard Diagnostics',
    quoteAm:
      'በኮምፒውተር ጥገና ክፍል የነበረን እያንዳንዱ ቀን እውነተኛ ላፕቶፖችና ማዘርቦርዶች ላይ ነበር። የቮልቴጅ መለኪያ (Multimeter) እና ዲሲ ፓወር ሰፕላይን በመጠቀም ሾርት ሰርኪውት (Short circuit) እንዴት እንደሚለይ ያስተማሩን ዘዴ እጅግ አስደናቂ ነው። አሁን በሆስፒታል ውስጥ የኮምፒውተር መረብና ሃርድዌር አስተዳዳሪ ሆኜ ተቀጥሬያለሁ።',
    quoteEn:
      'Working on real dead motherboards with multimeters and DC bench power supplies taught me root-cause electrical tracing. I secured a hospital IT hardware technician role right after graduation.',
    rating: 5,
  },
  {
    id: 'tewodros-birhanu',
    nameAm: 'ቴዎድሮስ ብርሃኑ',
    nameEn: 'Tewodros Birhanu',
    roleAm: 'የቢሮ ማሽኖችና ፕሪንተር ቴክኒሻን',
    roleEn: 'Office Machine & Copier Specialist',
    cohortAm: 'የ 20ኛው ዙር ተመራቂ',
    cohortEn: 'Cohort 20 Graduate',
    outcomeAm: 'የቢሮ ማሽኖች ጥገና ቴክኒሻንና የኮንትራት አቅራቢ',
    outcomeEn: 'Enterprise Copier & Printer Field Engineer',
    image: '/images/studentathellobench2.png',
    trackIcon: Printer,
    trackTagAm: 'የፎቶኮፒና ፕሪንተር ማሽን ጥገና',
    trackTagEn: 'Heavy-Duty Copier & Printer Servicing',
    quoteAm:
      'ፎቶኮፒ እና ፕሪንተር ማሽኖችን ከነ መካኒካልና ኤሌክትሮኒክስ ክፍሎቻቸው ፈትተን ጠግነናል። በአካባቢያችን እጅግ ተፈላጊ ሙያ በመሆኑ ወዲያውኑ ወደ ስራ እንድገባ አስችሎኛል። የላብራቶሪው መሳሪያዎች ዘመናዊ መሆናቸው ለእውነተኛው የስራ አለም ሙሉ ለሙሉ ብቁ አድርጎናል።',
    quoteEn:
      'Disassembling and recalibrating heavy-duty copiers and printers down to the PCB driver boards made me stand out immediately. Hands-on workbench training is unmatched.',
    rating: 5,
  },
  {
    id: 'muluken-desalew',
    nameAm: 'ሙሉቀን ደሳለው',
    nameEn: 'Muluken Desalew',
    roleAm: 'የኤሌክትሪክ ተከላና ሰርኪውት ብሬከር ቴክኒሻን',
    roleEn: 'Electrical Wiring & Breaker Panel Tech',
    cohortAm: 'የ 22ኛው ዙር ተመራቂ',
    cohortEn: 'Cohort 22 Graduate',
    outcomeAm: 'የህንፃ ኤሌክትሪክና የፓነል ተከላ ስራ ተቋራጭ',
    outcomeEn: 'Licensed Electrical Installation Contractor',
    image: '/images/studentathellobench.png',
    trackIcon: Zap,
    trackTagAm: 'የኤሌክትሪካል ተከላና COC ዝግጅት',
    trackTagEn: 'Electrical Wiring & COC Certification',
    quoteAm:
      'የስዊች ቦርድና የሰርኪውት ብሬከር ገመድ ዝርጋታን በላብራቶሪ ሰሌዳ ላይ ደጋግመን ሰርተናል። አስተማሪዎቻችን በየቤንቹ እየመጡ የሚያስተካክሉን ክህሎት ለእውነተኛ ስራ ሙሉ ዝግጁ አድርጎናል። የCOC ብቃት ምዘናዬንም በመጀመሪያ ዙር በቀላሉ አልፌያለሁ።',
    quoteEn:
      'Repeated panel wiring, breaker testing, and load distribution on workshop boards prepared me completely. Passed my official COC electrical exam on the first attempt.',
    rating: 5,
  },
  {
    id: 'dawit-electronics',
    nameAm: 'ዳዊት ግርማ',
    nameEn: 'Dawit Girma',
    roleAm: 'የቴሌቪዥንና ሳተላይት ዲሽ ተከላ ቴክኒሻን',
    roleEn: 'Smart TV & Satellite Systems Specialist',
    cohortAm: 'የ 18ኛው ዙር ተመራቂ',
    cohortEn: 'Cohort 18 Graduate',
    outcomeAm: 'የዳዊት ኤሌክትሮኒክስ መሸጫና መጠገኛ ማዕከል (ደብረ ታቦር)',
    outcomeEn: 'Owner, Dawit Electronics Workshop (Debre Tabor)',
    image: '/images/studentathellobench5.png',
    trackIcon: Radio,
    trackTagAm: 'የSmart TV ቦርድና ሳተላይት ሲስተም',
    trackTagEn: 'Smart TV Panels & Satellite Alignments',
    quoteAm:
      'የ LED/Smart TV ባክላይት፣ የቲኮን (T-Con) ቦርድ እና የሳተላይት ዲሽ ሲግናል አሰላለፍን በእውነተኛ ሰሌዳዎች ላይ ሰርተናል። የሄሎ ቴክኖሎጂ አሰልጣኞች ያሳዩን ትዕግስትና ሙያዊ ብቃት ዛሬ የራሴን ሱቅ ከፍቼ ስኬታማ እንድሆን አስችሎኛል።',
    quoteEn:
      'Mastering Smart TV board repairs and satellite signal calibration directly in the lab enabled me to open my own electronics repair shop with full confidence.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const { language } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-slate-50/70 dark:bg-card/30 border-y border-border/80 px-5 py-20 lg:py-24 text-foreground lg:px-8">
      {/* Subtle tech dot pattern */}
      <div className="tech-dot-bg absolute inset-0 opacity-40 pointer-events-none" />

      {/* Subtle ambient lighting */}
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl">
        {/* ── Section Header ── */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>
              {language === 'am'
                ? 'ተጨባጭ የስራ ስኬቶችና የተመራቂዎች ምስክርነት'
                : 'Trainee Testimonials & Success Stories'}
            </span>
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl leading-tight">
            {language === 'am'
              ? 'ከመማሪያ ቤንች እስከ ስኬታማ የስራ ባለቤትነት'
              : 'From Hands-On Workbench Practice to Thriving Careers'}
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {language === 'am'
              ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል በተግባር የሰለጠኑ፣ የCOC ብቃት ማረጋገጫ የወሰዱ እና ዛሬ በባሕር ዳርና በመላው ኢትዮጵያ የራሳቸውን የጥገና ሱቆች የከፈቱ እንዲሁም በተለያዩ ተቋማት ውስጥ ተቀጥረው የሚሰሩ ሰልጣኞቻችንን እውነተኛ ታሪክ ይመልከቱ።'
              : 'Meet our graduates who mastered hands-on diagnostic workflows in Bahir Dar, earned accredited certifications, and now run profitable workshops or work in telecom and enterprise networks.'}
          </p>
        </div>

        {/* ── FEATURED COHORT GRADUATION HERO CARD ── */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10 shadow-lg mb-14 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Image Column */}
            <div className="relative lg:col-span-6 overflow-hidden rounded-2xl border border-border shadow-md group">
              <img
                src="/images/studentmemory@hello.png"
                alt="Hello Technology Graduating Cohort Memory"
                className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-1 font-bold backdrop-blur-sm shadow text-white">
                  <GraduationCap className="size-4 text-amber-300" />
                  {language === 'am' ? 'የተመራቂዎች የጋራ መታሰቢያ' : 'Official Graduating Alumni'}
                </span>
                <span className="font-semibold text-white/90 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
                  ባሕር ዳር ካምፓስ · Bahir Dar
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                  <CheckCircle2 className="size-3.5" />
                  <span>
                    {language === 'am' ? '1,200+ የተመረቁ ብቁ ቴክኒሻኖች' : '1,200+ Confident Technicians Trained'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {language === 'am'
                    ? 'በገበያው ተፈላጊ የሆኑ የጥገና ባለሙያዎችን የማብቃት ጉዞ'
                    : 'Forging Practical Competence with Solder, Schematics & Real Tools'}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {language === 'am'
                    ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ስልጠናው በወረቀት ላይ ብቻ የቀረ ሳይሆን፤ እያንዳንዱ ሰልጣኝ በራሱ የመስሪያ ቤንች ላይ እውነተኛ መሳሪያ በእጁ ይዞ ቦርዶችን፣ ስልኮችን፣ ኮምፒውተሮችንና ኤሌክትሪካል ሲስተሞችን እንዲጠግን ይደረጋል።'
                    : 'At Hello Technology Training Center, education is forged with hands-on practice. Trainees spend 90%+ of their self-paced training testing, probing, desoldering, and restoring live motherboards under the continuous mentorship of master technicians.'}
                </p>
              </div>

              {/* 3 Metric Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/80 pt-6 text-center">
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="text-xl sm:text-2xl font-black text-primary">94%+</p>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground leading-tight">
                    {language === 'am' ? 'የስራ ዕድል / የራስ ሱቅ' : 'Employed / Self-Employed'}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400">90%+</p>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground leading-tight">
                    {language === 'am' ? 'የተግባር ላብራቶሪ' : 'Workbench Practical Lab'}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">10:1</p>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground leading-tight">
                    {language === 'am' ? 'ሰልጣኝ ለአስተማሪ' : 'Trainee-to-Mentor Ratio'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── GRID OF DETAILED STUDENT TESTIMONIAL CARDS ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => {
            const TrackIcon = item.trackIcon
            return (
              <div
                key={item.id}
                className="card-hover-lift group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40"
              >
                <div>
                  {/* Photo & Track Tag Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
                      <img
                        src={item.image}
                        alt={language === 'am' ? item.nameAm : item.nameEn}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary mb-1 border border-primary/15">
                        <TrackIcon className="size-3 text-primary" />
                        <span className="truncate">
                          {language === 'am' ? item.trackTagAm : item.trackTagEn}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {language === 'am' ? item.nameAm : item.nameEn}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {language === 'am' ? item.cohortAm : item.cohortEn}
                      </p>
                    </div>
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-amber-600 dark:text-amber-400">5.0</span>
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="size-3" />
                      {language === 'am' ? 'የተረጋገጠ ተመራቂ' : 'Verified Alumni'}
                    </span>
                  </div>

                  {/* Quotation text */}
                  <div className="relative">
                    <Quote className="absolute -top-1.5 -left-1 size-6 text-primary/15 pointer-events-none" />
                    <p className="relative z-10 text-xs sm:text-sm leading-6 text-foreground/85 font-normal pl-3">
                      “{language === 'am' ? item.quoteAm : item.quoteEn}”
                    </p>
                  </div>
                </div>

                {/* Outcome Badge at Bottom */}
                <div className="mt-6 border-t border-border/80 pt-4">
                  <div className="flex items-start gap-2 text-xs">
                    <Award className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {language === 'am' ? 'የአሁኑ የስራ ውጤት' : 'Career Outcome'}
                      </p>
                      <p className="font-semibold text-foreground mt-0.5">
                        {language === 'am' ? item.outcomeAm : item.outcomeEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Bottom Call To Action Strip ── */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Users className="size-6 text-primary" />
            </span>
            <div>
              <h4 className="text-lg font-bold text-foreground">
                {language === 'am'
                  ? 'የቀጣይ ዙር ተመራቂ እና ስኬታማ የስራ ባለቤት ይሁኑ!'
                  : 'Be the Next Success Story in Practical Tech & Repair!'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {language === 'am'
                  ? 'የኦንላይን ቪዲዮ ኮርሶች እና ዲጂታል ማኑዋሎች በይፋ ክፍት ናቸው። አሁኑኑ መማር ይጀምሩ።'
                  : 'Online Video Courses & Technical Manuals are available now. Start learning today.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/#courses">
              <Button
                variant="outline"
                className="rounded-xl border-border px-5 font-semibold hover:bg-muted"
              >
                {language === 'am' ? 'ስልጠናዎችን ይመልከቱ' : 'Explore Courses'}
              </Button>
            </Link>
            <Link href="/library">
              <Button className="rounded-xl bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90 shadow-md">
                {language === 'am' ? 'ዲጂታል ላይብረሪ' : 'Digital Academy'}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
