import {
  Clock3,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react'
import {
  InquiryForm,
  PageIntro,
  SiteShell,
  TelegramButton,
  WhatsAppButton,
} from '@/components/site'
import { getPublishedCourses } from '@/lib/content'
import { faqs, schoolConfig } from '@/lib/data'

export const metadata = {
  title: 'Contact & Campus Location | Hello TVET',
  description:
    'Get in touch with Hello TVET (ሄሎ የቴክኒክና ሙያ ማሰልጠኛ) in Bahir Dar. Inquire about course registration, class schedules, or visit our training workshop.',
}

export default async function ContactPage() {
  const publishedCourses = await getPublishedCourses()
  const courseTitles = publishedCourses.map((c) => c.title)
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Get in touch"
        title="Let’s discuss your technical training journey."
        description="Whether you have questions regarding course prerequisites, registration fees, or want to visit our Bahir Dar repair workshop, our team is ready to assist you."
      />

      <main>
        {/* ── MAIN CONTACT SECTION ── */}
        <section className="container mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <aside className="flex flex-col gap-8">
            <div className="rounded-3xl border bg-card p-7 shadow-sm md:p-8 card-hover-lift">
              <h2 className="text-2xl font-bold">Campus Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visit our dedicated hardware laboratory in Bahir Dar.
              </p>

              <div className="mt-7 flex flex-col gap-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Direct Lines</p>
                    <p className="mt-1 font-semibold text-foreground">{schoolConfig.phone} / {schoolConfig.alternatePhone}</p>
                    <p className="text-xs text-muted-foreground">Admissions desk & technical inquiries</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="mt-1 font-semibold text-foreground">{schoolConfig.email}</p>
                    <p className="text-xs text-muted-foreground">Admissions & inquiries</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                    <p className="mt-1 font-semibold text-foreground">{schoolConfig.address}</p>
                    <a
                      href={schoolConfig.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      View on Google Maps <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                    <Clock3 className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lab & Office Hours</p>
                    <p className="mt-1 font-semibold text-foreground">{schoolConfig.businessHours}</p>
                    <p className="text-xs text-muted-foreground">Closed on public holidays</p>
                  </div>
                </div>
              </div>

              {/* Instant Chat Buttons */}
              <div className="mt-8 border-t pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fast Response via Messaging</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <TelegramButton />
                  <WhatsAppButton />
                </div>
              </div>
            </div>

            {/* Directions & Transit Card */}
            <div className="rounded-3xl border bg-muted/40 p-6 card-hover-lift">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                  <Navigation className="size-4" />
                </span>
                <h3 className="font-bold">Getting to Our Workshop</h3>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Our campus is conveniently located in Bahir Dar: Signal Mall Building, 4th Floor, Office No. 409, directly in front of Papyrus Hotel.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-2xl border bg-background/80 px-3.5 py-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                <span>Response guarantee: We reply to all inquiries within 24 hours.</span>
              </div>
            </div>
          </aside>

          {/* Inquiry Form */}
          <section className="rounded-3xl border bg-card p-7 shadow-xl dark:shadow-cyan-950/20 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <MessageSquare className="size-3.5" /> Admissions Desk
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">Send us an inquiry</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Fill out the form below with your training goals. Our admissions staff will reach out with cohort dates, syllabus details, and registration procedures.
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
                <HelpCircle className="size-3.5" /> Quick Answers
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Everything you need to know about joining Hello TVET training programs.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.q} className="card-hover-lift rounded-3xl border bg-card p-6 shadow-sm hover:border-cyan-500/40">
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
