import { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { SiteShell } from '@/components/site'
import { schoolConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Privacy Policy & Student Data Protection | Hello Technology Training Center',
  description:
    'Learn how Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል) protects student personal information, portal credentials, and registration records.',
}

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16">
        {/* Breadcrumb & Navigation */}
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
                <ShieldCheck className="size-4" /> Student Data Protection & Privacy
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                የግል መረጃ ጥበቃ ፖሊሲ (Privacy Policy)
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                At <strong>{schoolConfig.name} ({schoolConfig.englishName})</strong>, we are committed to protecting the privacy, security, and integrity of all student data, registration records, and communications.
              </p>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground bg-muted/40 p-4 rounded-2xl border border-border/60">
              <p className="font-semibold text-foreground">Last Updated:</p>
              <p className="font-mono mt-0.5 text-[#155DFC]">October 2026</p>
              <p className="mt-2 font-semibold text-foreground">Applies To:</p>
              <p>All Students, Applicants & Visitors</p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Summary Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#155DFC] mb-3">
              <Lock className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Encrypted Credentials</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Student portal passwords are encrypted using one-way bcrypt hashing. No plain-text passwords are ever stored.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
              <CheckCircle2 className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Zero Third-Party Selling</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              We never sell, rent, or trade your phone numbers, emails, or personal details with third-party advertisers.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 mb-3">
              <Server className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Essential Storage Only</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              We use local storage strictly for student sessions, language selection (አማርኛ/EN), and theme preferences.
            </p>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="mt-10 space-y-8 text-foreground text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                1
              </span>
              የምንሰበስባቸው መረጃዎች (Information We Collect)
            </h2>
            <p className="text-muted-foreground mb-4">
              When prospective students register online, submit an inquiry, or visit our admissions office in Bahir Dar, we collect the following essential educational data:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Personal Identification:</strong> Full Student Name (የተማሪው ሙሉ ስም), Phone Number (ስልክ ቁጥር), Personal Email, City/Town of residence, and Telegram handle.
              </li>
              <li>
                <strong className="text-foreground">Course & Cohort Shift Preferences:</strong> Selected technical course track (e.g., Mobile Phone Repair, Computer Maintenance), preferred shift (Morning, Afternoon, Evening, Weekend), and intake Batch code.
              </li>
              <li>
                <strong className="text-foreground">Official Verification Documents:</strong> Copy of Kebele ID card / Passport and 2 passport-size photographs submitted for TVET accreditation and graduation records.
              </li>
              <li>
                <strong className="text-foreground">Payment Records:</strong> Transaction reference numbers and deposit slips (e.g. Telebirr, CBE deposit slips). <em>Note: We do NOT collect or store credit/debit card numbers on this website.</em>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                2
              </span>
              መረጃውን ለምን እንጠቀምበታለን? (How We Use Your Information)
            </h2>
            <p className="text-muted-foreground mb-3">
              All collected student information is used strictly for legitimate technical education and training administration:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                <p className="font-bold text-foreground">🎓 Admissions & Student Accounts</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Generating official student IDs and institutional portal emails (<code className="text-[#155DFC]">@hellotechnology.edu.et</code>) so students can access assignments, digital libraries, and lab resources.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                <p className="font-bold text-foreground">📅 Academic Scheduling & Notifications</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Contacting students via SMS/phone regarding batch start dates, shift timings, orientation days, and practical workshop notices.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                <p className="font-bold text-foreground">📜 Certification & Verification</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Validating practical lab attendance (minimum 80% required) and printing official accredited TVET certificates upon successful graduation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                <p className="font-bold text-foreground">🛡️ Security & Support</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Responding to questions submitted via our admissions chat, phone lines, or Telegram channel.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                3
              </span>
              ኩኪዎችና የዳታ ማከማቻ (Cookies & Storage Policy)
            </h2>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              Hello Technology Training Center believes in clean, non-intrusive web technology. <strong>We do not use invasive third-party tracking cookies or sell your browsing activity.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm mt-2">
              Our site uses only <strong>Essential Functional Storage</strong>:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Authentication Tokens:</strong> Secure HTTP cookies that keep students and staff signed in to their dashboards.</li>
              <li><strong className="text-foreground">Language Preference:</strong> Remembering whether you view the site in Amharic (አማርኛ) or English.</li>
              <li><strong className="text-foreground">Display Theme:</strong> Remembering your Light or Dark Mode visual preference.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#155DFC] text-white text-xs font-bold">
                4
              </span>
              የተማሪዎች መብት (Your Rights as a Student)
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Every enrolled student or prospective applicant has the right to:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>Inspect and review the personal information kept in their student portal record.</li>
              <li>Request corrections or updates to their phone number, email, or chosen shift.</li>
              <li>Request password resets at any time through our admissions desk or student portal.</li>
            </ul>
          </section>

          {/* Section 5: Contact Card */}
          <section className="rounded-3xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
              <HelpCircle className="size-5 text-[#155DFC]" />
              ጥያቄ ወይም አስተያየት አለዎት? (Questions Regarding Privacy)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              If you have any questions about our privacy policy or how your student data is handled, feel free to visit our campus or contact us directly:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
              <a
                href={`tel:${schoolConfig.phone}`}
                className="inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-foreground hover:border-[#155DFC] hover:text-[#155DFC] transition"
              >
                <Phone className="size-3.5 text-[#155DFC]" /> {schoolConfig.phone}
              </a>
              <a
                href={`mailto:${schoolConfig.email}`}
                className="inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-foreground hover:border-[#155DFC] hover:text-[#155DFC] transition"
              >
                <Mail className="size-3.5 text-[#155DFC]" /> {schoolConfig.email}
              </a>
              <span className="inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-muted-foreground">
                <MapPin className="size-3.5 text-[#155DFC]" /> {schoolConfig.address}
              </span>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
