import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  ShieldAlert,
  GraduationCap,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Building,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { SiteShell } from '@/components/site'
import { schoolConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Terms of Training & Service | Hello Technology Training Center',
  description:
    'Official academic terms, workshop safety regulations, attendance requirements, and certification rules for Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል).',
}

export default function TermsOfServicePage() {
  return (
    <SiteShell>
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[#155DFC] transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-[#155DFC] dark:text-sky-400 mb-4">
                <FileText className="size-4" /> Academic & Training Agreement
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                የስልጠና ውልና ደንብ (Terms of Training & Service)
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                These terms establish the academic standards, workshop safety rules, attendance requirements, and certification criteria for all trainees at <strong>{schoolConfig.name} ({schoolConfig.englishName})</strong>.
              </p>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground bg-muted/40 p-4 rounded-2xl border border-border/60">
              <p className="font-semibold text-foreground">Status:</p>
              <p className="font-mono mt-0.5 text-emerald-600 dark:text-emerald-400">● Officially Active</p>
              <p className="mt-2 font-semibold text-foreground">Campus:</p>
              <p>Bahir Dar, Ethiopia</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <Clock className="size-5 text-[#155DFC] mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">80% Attendance</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Required in practical lab sessions to qualify for graduation and certificate.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <Wrench className="size-5 text-amber-500 mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Workshop Safety</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Strict adherence to micro-soldering, ESD, and electrical safety standards.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <GraduationCap className="size-5 text-emerald-500 mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Practical Exam</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Hands-on practical troubleshooting evaluation before certification issuance.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <ShieldAlert className="size-5 text-indigo-500 mb-2" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Student Portal</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Official institutional credentials (@hellotechnology.edu.et) for portal access.
            </p>
          </div>
        </div>

        {/* Detailed Articles */}
        <div className="mt-10 space-y-8 text-foreground text-sm leading-relaxed">
          {/* Article 1 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                1
              </span>
              የምዝገባና የመግቢያ መስፈርት (Admission & Enrollment)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              By completing online or in-person registration, the trainee agrees to participate fully in the technical curriculum. To finalize admission:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>Applicants must provide accurate contact and identity information (full name, valid phone number, residence).</li>
              <li>Trainees must submit copies of valid identification (Kebele ID or Passport) and 2 passport photos within the first week of enrollment.</li>
              <li>Seat reservation is confirmed upon completing registration and initial tuition payment according to the selected payment plan (Full or Installment).</li>
            </ul>
          </section>

          {/* Article 2 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                2
              </span>
              የመገኘትና የሰዓት አከባበር ደንብ (Attendance & Punctuality)
            </h2>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 mb-4 text-xs">
              <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="size-4" /> አስፈላጊ ማሳሰቢያ፡ 80% የመገኘት ግዴታ
              </p>
              <p className="text-muted-foreground mt-1">
                Because Hello Technology Training Center courses are 90%+ practical, consistent lab practice is mandatory. Trainees with unexcused attendance below 80% will not be eligible to sit for the final practical examination or receive the accredited certificate.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>Trainees must arrive punctually for their assigned cohort shift (Morning, Afternoon, Evening, or Weekend).</li>
              <li>Absences due to medical or personal emergencies must be reported in advance to the course instructor or admissions desk.</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                3
              </span>
              የላቦራቶሪና የመሳሪያዎች ደህንነት (Workshop & Lab Safety Rules)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              Hello Technology Training Center provides professional industry-grade testing tools, hot air soldering stations, microscopes, multimeters, and DC power supplies. Trainees must:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>Never operate high-temperature soldering equipment without prior instructor safety briefing.</li>
              <li>Keep workstations clean, organized, and free of food or beverages.</li>
              <li>Immediately notify instructors of any equipment malfunction, damaged cords, or electrical faults.</li>
              <li>Care for tools responsibly. Intentional damage or unauthorized removal of school equipment will result in disciplinary action and replacement costs.</li>
            </ul>
          </section>

          {/* Article 4 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                4
              </span>
              የምስክር ወረቀት አሰጣጥ (Assessment & Certification Criteria)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              To be awarded the official accredited Hello Technology Training Center completion certificate:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border bg-muted/20">
                <p className="font-bold text-foreground">1. Practical Competency</p>
                <p className="text-muted-foreground mt-1">Successfully pass the hands-on hardware/software repair exam on real devices.</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/20">
                <p className="font-bold text-foreground">2. Minimum 80% Attendance</p>
                <p className="text-muted-foreground mt-1">Completion of required lab training hours in your cohort.</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/20">
                <p className="font-bold text-foreground">3. Financial Clearance</p>
                <p className="text-muted-foreground mt-1">Full settlement of applicable course tuition fees.</p>
              </div>
            </div>
          </section>

          {/* Article 5 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                5
              </span>
              የተማሪዎች ስነ-ምግባር (Student Code of Conduct)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Hello Technology Training Center promotes a culture of mutual respect, teamwork, and professional ethics. Harassment, disruption of classes, academic dishonesty, or discrimination of any kind is strictly prohibited and grounds for immediate dismissal without refund.
            </p>
          </section>

          {/* Contact Box */}
          <section className="rounded-3xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-6 sm:p-8">
            <h2 className="text-base font-bold text-foreground mb-2">
              Questions Regarding Terms or Academic Regulations?
            </h2>
            <p className="text-xs text-muted-foreground">
              Contact our admissions and academic affairs department during working hours (Monday – Saturday, 8:30 AM – 6:00 PM):
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
              <a
                href={`tel:${schoolConfig.phone}`}
                className="inline-flex items-center gap-1.5 text-foreground hover:text-[#155DFC] transition"
              >
                <Phone className="size-3.5 text-[#155DFC]" /> {schoolConfig.phone}
              </a>
              <a
                href={`mailto:${schoolConfig.email}`}
                className="inline-flex items-center gap-1.5 text-foreground hover:text-[#155DFC] transition"
              >
                <Mail className="size-3.5 text-[#155DFC]" /> {schoolConfig.email}
              </a>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-[#155DFC]" /> {schoolConfig.address}
              </span>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
