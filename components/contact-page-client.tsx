'use client'

import {
  Clock3,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import {
  InquiryForm,
  PageIntro,
  SiteShell,
  TelegramButton,
  WhatsAppButton,
} from '@/components/site'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'

interface ContactPageClientProps {
  courseTitles: string[]
}

export function ContactPageClient({ courseTitles }: ContactPageClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const faqs = [
    {
      q: isAm
        ? 'ስልጠናውን ለመጀመር የኤሌክትሮኒክስ ወይም የጥገና ልምድ ያስፈልጋል?'
        : 'Do I need previous electronics background to enroll?',
      a: isAm
        ? 'ምንም አይነት ቅድመ ልምድ አያስፈልግዎትም! የመሰረታዊ ሞጁሎቻችን ከመሰረታዊ የኤሌክትሪክ ፅንሰ-ሀሳቦች፣ የመለኪያ መሳሪያዎች አጠቃቀም እና የላብራቶሪ ደህንነት በመጀመር ደረጃ በደረጃ ወደ ዲያግኖስቲክስ እና ማይክሮ-ሶልደሪንግ ያሸጋግሩዎታል።'
        : 'No prior experience is necessary. Our foundation modules start with core electrical concepts, meter measurements, and workshop safety before advancing to diagnosis and soldering.',
    },
    {
      q: isAm
        ? 'ማዕከሉ ሙሉ ዕውቅና ያለው እና ለCOC ብቃት ምዘና ያዘጋጃል?'
        : 'Are courses accredited and aligned with national COC exams?',
      a: isAm
        ? 'አዎ! ማዕከላችን በሁሉም የትምህርት ደረጃዎች ሙሉ ህጋዊ ዕውቅና ያለው ሲሆን፤ ለመሰረታዊ ኤሌክትሪካል ኤሌክትሮኒክስ እና የኢንዱስትሪ ኤሌክትሪካል ማሽኖች COC ፈተና ሙሉ የተግባር ዝግጅት ይሰጣል።'
        : 'Yes! Our training institute is fully accredited for all educational levels and provides specialized practical preparation for national Basic Electrical Electronics and Industrial Electrical Machines COC examinations.',
    },
    {
      q: isAm
        ? 'ልዩ የትምህርት ቅናሽ ወይም ማበረታቻ አለ?'
        : 'Is there a special tuition promotion or discount?',
      a: isAm
        ? 'አዎ! በነፃ፦ ከሁለት በላይ ትምህርት ለሚመዘገብ አንድ ተጨማሪ ስልጠና በነፃ ይሰጣል። እንዲሁም ክፍያውን ሙሉ ለሙሉ አስቀድመው ለሚከፍሉ 10% ልዩ ቅናሽ ይደረጋል።'
        : 'Yes! Register for more than two courses and get one additional course completely free! We also offer an upfront full tuition discount of 10%.',
    },
    {
      q: isAm
        ? 'በስልጠናው ወቅት እቃዎችና መለማመጃ ሰሌዳዎች ይሰጡናል?'
        : 'Are tools and practice boards provided during the workshop?',
      a: isAm
        ? 'አዎ! እያንዳንዱ ሰልጣኝ በሙያዊ የብየዳ እቃዎች፣ ዲጂታል መልቲሜትር፣ ስቲሪዮ ማይክሮስኮፕ እና እውነተኛ የልምምድ ማዘርቦርዶች በተሟላለት የግል የስራ ጠረጴዛ (Bench) ላይ ይሰለጥናል።'
        : 'Yes! Every enrolled student is assigned a dedicated practical training station with professional soldering gear, diagnostic meters, microscopes, and practice motherboards.',
    },
    {
      q: isAm
        ? 'ይህ ስልጠና በኢትዮጵያ የራሴን የጥገና ሱቅ ለመክፈት ይረዳኛል?'
        : 'Can this program help me start my own repair shop in Ethiopia?',
      a: isAm
        ? 'በእርግጥ! አብዛኛዎቹ ተመራቂዎቻችን ዛሬ የራሳቸውን የስልክና የኮምፒውተር ጥገና ሱቆች ከፍተው ስኬታማ ሆነዋል። የስልጠና ፕሮግራማችን መለዋወጫ እቃዎች ከየት እንደሚገዙ፣ ሱቅ እንዴት እንደሚደራጅ እና ደንበኞችን እንዴት ማስተናገድ እንደሚቻል ተግባራዊ መመሪያዎችን ያካትታል።'
        : 'Absolutely. Many alumni launch independent device repair shops or work as specialized hardware technicians. We include practical guidance on sourcing parts, shop tooling, and customer quotation.',
    },
    {
      q: isAm
        ? 'የስልጠና ክፍለ-ጊዜዎች እና የሰዓት አማራጮች እንዴት ናቸው?'
        : 'What are the class schedules and intake dates?',
      a: isAm
        ? 'የጠዋት (2:30 – 6:00)፣ የከሰዓት (7:30 – 11:00) እና የቅዳሜ የተጠናከረ (3:00 – 10:30) ፈረቃዎች አሉን። አዲስ ዙር በየወሩ የሚጀምር ሲሆን፤ ጥራቱን ለመጠበቅ በእያንዳንዱ ክፍል ከ10 ሰልጣኞች በላይ አንቀበልም።'
        : 'We run weekday morning (8:30 AM – 12:00 PM), afternoon (1:30 PM – 5:00 PM), and Saturday intensive (9:00 AM – 4:30 PM) cohorts. Cohorts start every month with limited seats of 10 students.',
    },
  ]

  return (
    <SiteShell>
      <PageIntro
        eyebrow={isAm ? 'ያግኙን' : 'Get in touch'}
        title={isAm ? 'ስለ ቴክኒክ ስልጠና ጉዞዎ እንነጋገር።' : 'Let’s discuss your technical training journey.'}
        description={
          isAm
            ? 'ስለ ስልጠና መስፈርቶች፣ ስለ ምዝገባ ክፍያዎች ጥያቄ ካለዎት ወይም በባህር ዳር የሚገኘውን የጥገና ላብራቶሪያችንን መጎብኘት ከፈለጉ፣ ቡድናችን እርስዎን ለመርዳት ዝግጁ ነው።'
            : 'Whether you have questions regarding course prerequisites, registration fees, or want to visit our Bahir Dar repair workshop, our team is ready to assist you.'
        }
      />

      <main>
        {/* ── MAIN CONTACT SECTION ── */}
        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <aside className="flex flex-col gap-8">
            <div className="rounded-3xl border bg-card p-7 shadow-sm md:p-8 card-hover-lift">
              <h2 className="text-2xl font-bold">
                {isAm ? 'የማዕከሉ አድራሻ' : 'Campus Details'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAm
                  ? 'በባህር ዳር የሚገኘውን የሃርድዌር ላብራቶሪያችንን ይጎብኙ።'
                  : 'Visit our dedicated hardware laboratory in Bahir Dar.'}
              </p>

              <div className="mt-7 flex flex-col gap-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isAm ? 'ቀጥታ ስልኮች' : 'Direct Lines'}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {schoolConfig.phone} / {schoolConfig.alternatePhone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAm ? 'የምዝገባ ዴስክና ቴክኒካል መረጃ' : 'Admissions desk & technical inquiries'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isAm ? 'ኢሜይል' : 'Email'}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">{schoolConfig.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {isAm ? 'የምዝገባና አጠቃላይ ጥያቄዎች' : 'Admissions & inquiries'}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isAm ? 'አድራሻ' : 'Location'}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {isAm ? schoolConfig.address : schoolConfig.englishAddress}
                    </p>
                    <a
                      href={schoolConfig.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline"
                    >
                      {isAm ? 'በGoogle Maps ይመልከቱ' : 'View on Google Maps'}{' '}
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                    <Clock3 className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isAm ? 'የላብራቶሪና የቢሮ ሰዓታት' : 'Lab & Office Hours'}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {isAm
                        ? 'ከሰኞ – አርብ፡ 2:30 ጠዋት – 11:30 ከሰዓት | ቅዳሜ፡ 3:00 ጠዋት – 7:00 ከሰዓት'
                        : schoolConfig.businessHours}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAm ? 'በህዝብ በዓላት ዝግ ነው' : 'Closed on public holidays'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Chat Buttons */}
              <div className="mt-8 border-t pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isAm ? 'በመልዕክት ፈጣን ምላሽ ያግኙ' : 'Fast Response via Messaging'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <TelegramButton />
                  <WhatsAppButton />
                </div>
              </div>
            </div>

            {/* Directions & Transit Card */}
            <div className="rounded-3xl border bg-muted/40 p-6 card-hover-lift">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                  <Navigation className="size-4" />
                </span>
                <h3 className="font-bold">
                  {isAm ? 'ወደ ላብራቶሪያችን እንዴት መምጣት ይቻላል?' : 'Getting to Our Workshop'}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {isAm
                  ? 'ማዕከላችን በባህር ዳር ከተማ፡ ፓፒረስ ሆቴል ፊት ለፊት በሚገኘው ሲግናል ሞል ህንፃ 4ኛ ፎቅ ቢሮ ቁጥር 409 ላይ ይገኛል።'
                  : 'Our campus is conveniently located in Bahir Dar: Signal Mall Building, 4th Floor, Office No. 409, directly in front of Papyrus Hotel.'}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-2xl border bg-background/80 px-3.5 py-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                <span>
                  {isAm
                    ? 'ፈጣን ምላሽ ዋስትና፡ ለሁሉም ጥያቄዎች በ24 ሰዓታት ውስጥ ምላሽ እንሰጣለን።'
                    : 'Response guarantee: We reply to all inquiries within 24 hours.'}
                </span>
              </div>
            </div>
          </aside>

          {/* Inquiry Form */}
          <section className="rounded-3xl border bg-card p-7 shadow-xl dark:shadow-blue-950/20 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <MessageSquare className="size-3.5" />
              <span>{isAm ? 'የምዝገባ ዴስክ' : 'Admissions Desk'}</span>
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              {isAm ? 'ጥያቄዎን ይላኩልን' : 'Send us an inquiry'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isAm
                ? 'የስልጠና ግብዎን ከዚህ በታች ባለው ቅጽ ይሙሉልን። የቅበላ ክፍላችን ስለ ቀጣይ ዙር ቀናት፣ ካሪኩለም እና የምዝገባ ሂደቶች ያነጋግርዎታል።'
                : 'Fill out the form below with your training goals. Our admissions staff will reach out with cohort dates, syllabus details, and registration procedures.'}
            </p>
            <div className="mt-8">
              <InquiryForm coursesList={courseTitles} />
            </div>
          </section>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ── */}
        <section className="border-t bg-muted/30 px-5 py-20 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <HelpCircle className="size-3.5" />
                <span>{isAm ? 'ፈጣን መልሶች' : 'Quick Answers'}</span>
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {isAm ? 'ተደጋግመው የሚጠየቁ ጥያቄዎች' : 'Frequently Asked Questions'}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {isAm
                  ? 'የሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል ፕሮግራሞችን ለመቀላቀል ማወቅ የሚገቡዎት ነገሮች።'
                  : 'Everything you need to know about joining Hello Technology Training Center programs.'}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.q} className="card-hover-lift rounded-3xl border bg-card p-6 shadow-sm hover:border-blue-500/40">
                  <h3 className="font-bold text-base text-foreground">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
