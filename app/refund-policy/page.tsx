import { Metadata } from 'next'
import Link from 'next/link'
import {
  RefreshCw,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
} from 'lucide-react'
import { SiteShell } from '@/components/site'
import { schoolConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Refund, Shift Transfer & Batch Postponement Policy | Hello Technology Training Center',
  description:
    'Official policies for tuition refunds, cohort shift transfers, and batch postponement at Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል).',
}

export default function RefundPolicyPage() {
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
                <RefreshCw className="size-4" /> Flexibility & Student Fairness
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                የክፍያ ተመላሽ፣ ፈረቃ ቅያሬና የዙር ማስተላለፍ ደንብ
              </h1>
              <p className="mt-1 text-base font-semibold text-muted-foreground">
                Refund, Shift Transfer & Batch Postponement Policy
              </p>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                We understand that work schedules, personal emergencies, or family commitments may require changes. This policy explains your options for transferring shifts, postponing batches, or requesting refunds.
              </p>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground bg-muted/40 p-4 rounded-2xl border border-border/60">
              <p className="font-semibold text-foreground">Policy Type:</p>
              <p className="font-mono mt-0.5 text-[#155DFC]">Transparent & Fair</p>
              <p className="mt-2 font-semibold text-foreground">Batch Postponement:</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Free Option</p>
            </div>
          </div>
        </div>

        {/* 3 Core Options Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#155DFC] mb-3">
              <Layers className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">1. Batch Postponement</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Postpone your enrollment to the upcoming batch intake (ዙር) free of charge with advance notification.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
              <Clock className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">2. Shift Transfer</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Switch easily between Morning, Afternoon, Evening, or Weekend cohorts subject to lab station availability.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 mb-3">
              <FileCheck className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">3. Course Transfer Credit</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Apply paid tuition towards another course track (e.g. from Mobile Repair to Computer Maintenance).
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-10 space-y-8 text-foreground text-sm leading-relaxed">
          {/* Section 1: Batch Postponement */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                1
              </span>
              የስልጠና ዙር ማስተላለፍ (Postponing to a Future Batch)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              If an enrolled student cannot attend the current intake batch due to medical conditions, sudden travel, or employment conflicts:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Free Transfer:</strong> You can postpone your enrollment to the next scheduled batch intake (e.g., from Batch 01 to Batch 02) without paying any penalty or extra fee.
              </li>
              <li>
                <strong className="text-foreground">Notice Requirement:</strong> Notice must be given to the admissions office at least <strong>3 business days</strong> before batch orientation.
              </li>
              <li>
                <strong className="text-foreground">Tuition Validity:</strong> Tuition paid remains valid and credited in full towards your student account for up to <strong>6 months</strong>.
              </li>
            </ul>
          </section>

          {/* Section 2: Shift Transfer */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                2
              </span>
              የስልጠና ፈረቃ ቅያሬ (Cohort Shift Transfer)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3">
              Trainees who experience job or family schedule changes can request a cohort shift transfer:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs">
              <div className="p-3 rounded-xl border bg-muted/20 text-center">
                <span className="font-bold text-foreground block">ጠዋት (Morning)</span>
                <span className="text-[10px] text-muted-foreground">8:30 AM - 12:30 PM</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 text-center">
                <span className="font-bold text-foreground block">ከሰዓት (Afternoon)</span>
                <span className="text-[10px] text-muted-foreground">2:00 PM - 5:30 PM</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 text-center">
                <span className="font-bold text-foreground block">ማታ (Evening)</span>
                <span className="text-[10px] text-muted-foreground">6:00 PM - 8:30 PM</span>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 text-center">
                <span className="font-bold text-foreground block">ቅዳሜና እሁድ</span>
                <span className="text-[10px] text-muted-foreground">Saturday & Sunday</span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2">
              Shift transfers are granted smoothly provided bench workstation capacity is available in the desired shift cohort.
            </p>
          </section>

          {/* Section 3: Tuition Refund Terms */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                3
              </span>
              የክፍያ ተመላሽ ደንብ (Tuition Refund Schedule)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-4">
              When withdrawal from a course is requested, tuition refunds are calculated according to the schedule below:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-bold">
                  <tr>
                    <th className="p-3.5">Time of Request (የተጠየቀበት ጊዜ)</th>
                    <th className="p-3.5">Refund Percentage</th>
                    <th className="p-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground">
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Before Class Orientation</td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">100% Refund</td>
                    <td className="p-3.5">Minus minimal non-refundable registration processing fee (200 ETB).</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Within Days 1 – 7 of Classes</td>
                    <td className="p-3.5 font-bold text-blue-600 dark:text-sky-400">75% Refund</td>
                    <td className="p-3.5">25% retained for lab consumables and orientation kit.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Within Days 8 – 14 of Classes</td>
                    <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">50% Refund</td>
                    <td className="p-3.5">50% retained for workshop station reservation.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">After 14 Days of Training</td>
                    <td className="p-3.5 font-bold text-rose-600">Non-Refundable</td>
                    <td className="p-3.5">Workstation and lab materials fully allocated. Trainee can postpone to next batch or transfer credit.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: How to Submit a Request */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                4
              </span>
              ማመልከቻ እንዴት ማቅረብ ይቻላል? (How to Submit a Request)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3">
              To request a shift transfer, batch postponement, or refund:
            </p>
            <ol className="space-y-2 text-xs sm:text-sm text-muted-foreground list-decimal list-inside">
              <li>Visit our admissions office in person at Signal Mall 4th Floor, Office 409, Bahir Dar.</li>
              <li>Or email us at <code className="text-[#155DFC] font-semibold">{schoolConfig.email}</code> with your Student ID and Registration Number.</li>
              <li>Approved refund disbursements are processed back to your original payment method (Bank Transfer / Telebirr) within <strong>3 to 5 business days</strong>.</li>
            </ol>
          </section>

          {/* Contact Strip */}
          <section className="rounded-3xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-foreground">Need Assistance with Your Enrollment?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our admissions advisors are here to help you find the best shift or batch schedule.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${schoolConfig.phone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#155DFC] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                <Phone className="size-3.5" /> Call Admissions ({schoolConfig.phone})
              </a>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
