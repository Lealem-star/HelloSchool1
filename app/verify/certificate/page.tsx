'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Search,
  Building,
  GraduationCap,
  Calendar,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, Footer } from '@/components/site'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'

function CertificateVerifierContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const isAm = language === 'am'

  const initialId = searchParams.get('id') || ''
  const [query, setQuery] = useState(initialId)
  const [searched, setSearched] = useState(Boolean(initialId))
  const [verifiedRecord, setVerifiedRecord] = useState<any | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (initialId) {
      lookupCertificate(initialId)
    }
  }, [initialId])

  const lookupCertificate = async (id: string) => {
    if (!id.trim()) return
    setSearching(true)
    setSearched(true)
    setNotFound(false)
    setVerifiedRecord(null)

    try {
      const res = await fetch(`/api/verify-certificate?id=${encodeURIComponent(id.trim())}`)
      const data = await res.json()
      if (res.ok && data.success && data.certificate) {
        setVerifiedRecord(data.certificate)
        setNotFound(false)
      } else {
        setVerifiedRecord(null)
        setNotFound(true)
      }
    } catch {
      setVerifiedRecord(null)
      setNotFound(true)
    } finally {
      setSearching(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lookupCertificate(query)
  }

  const handleTestSample = () => {
    setQuery('HTTC-2026-0001')
    lookupCertificate('HTTC-2026-0001')
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 container mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20">
            <ShieldCheck className="size-4" />
            {isAm ? 'ይፋዊ የብቃት ማረጋገጫ ፖርታል' : 'Official Certificate Verification Portal'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAm
              ? 'የሄሎ ቴክኖሎጂ የምስክር ወረቀት ማረጋገጫ'
              : 'Verify Trainee Certificate of Competence'}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {isAm
              ? 'በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተሰጡ የቴክኒክና ሙያ ብቃት ማረጋገጫ የምስክር ወረቀቶችን በኦፊሴላዊ መረጃ ቋታችን ውስጥ ትክክለኛነታቸውን ያረጋግጡ።'
              : 'Authenticate credentials, accredited TVET qualifications, and practical technical competency milestones issued by Hello Technology Training Center.'}
          </p>
        </div>

        {/* Verification Search Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl border border-border/80 bg-card shadow-lg"
          >
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAm ? 'የምስክር ወረቀት ወይም የተማሪ መለያ ቁጥር (ምሳሌ፦ HTTC-2026-0001)...' : 'Enter Certificate Serial or Student ID...'}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-transparent text-xs sm:text-sm font-mono outline-none focus:ring-0 placeholder:font-sans"
              />
            </div>
            <Button
              type="submit"
              disabled={searching || !query.trim()}
              className="w-full sm:w-auto h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 shadow-md shadow-blue-500/20"
            >
              {searching ? (isAm ? 'በማረጋገጥ ላይ...' : 'Verifying...') : (isAm ? 'አረጋግጥ' : 'Verify Certificate')}
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{isAm ? 'የሙከራ ምሳሌ፦' : 'Try sample serial:'}</span>
            <button
              type="button"
              onClick={handleTestSample}
              className="font-mono font-bold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              HTTC-2026-0001
            </button>
          </div>
        </div>

        {/* Not Found Alert Card */}
        {searched && notFound && !searching && (
          <div className="mt-10 rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:p-10 shadow-xl space-y-4 text-center max-w-xl mx-auto animate-scale-in">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isAm ? 'ምንም ይፋዊ የምስክር ወረቀት አልተገኘም' : 'No Official Credential Found'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {isAm
                ? `በዚህ መለያ ቁጥር (${query}) በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተመዘገበ ተማሪ ወይም የተሰጠ የምስክር ወረቀት የለም። እባክዎ ቁጥሩን በድጋሚ ያረጋግጡ ወይም አድሚሽን ቢሮውን ያነጋግሩ።`
                : `No accredited trainee record or certificate was found matching serial "${query}". Please check the spelling or contact the admissions registrar.`}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleTestSample}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 transition"
              >
                {isAm ? 'የሙከራ ሰርተፊኬት ይመልከቱ (HTTC-2026-0001)' : 'View Verified Sample (HTTC-2026-0001)'}
              </button>
              <a
                href={`tel:${schoolConfig.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted transition"
              >
                <Phone className="size-3.5 text-blue-600 dark:text-sky-400" />
                {schoolConfig.phone}
              </a>
            </div>
          </div>
        )}

        {/* Verified Result Card */}
        {searched && verifiedRecord && !notFound && (
          <div className="mt-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-blue-500/5 p-6 sm:p-10 shadow-xl space-y-6 animate-scale-in">
            {/* Top Verification Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      ✓ {isAm ? 'ትክክለኛ ይፋዊ የምስክር ወረቀት' : 'Authentic Accredited Credential'}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-foreground">
                    {verifiedRecord.studentName}
                  </h2>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {isAm ? 'የምስክር ወረቀት ቁጥር' : 'Certificate Serial No.'}
                </span>
                <span className="font-mono text-sm font-black text-blue-600 dark:text-sky-400">
                  {verifiedRecord.certificateNumber}
                </span>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {isAm ? 'የሙያ ስልጠና መስክ' : 'Occupational Specialty'}
                </span>
                <p className="text-base font-bold text-foreground">
                  {verifiedRecord.courseTitle}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {verifiedRecord.level}
                </p>
              </div>

              <div className="p-4 rounded-2xl border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {isAm ? 'ሰጪው የቴክኒክና ሙያ ተቋም' : 'Issuing Accredited Institution'}
                </span>
                <p className="text-base font-bold text-foreground">
                  {schoolConfig.name}
                </p>
                <p className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold">
                  {schoolConfig.englishName}
                </p>
              </div>

              <div className="p-4 rounded-2xl border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {isAm ? 'የተሰጠበት ቀን' : 'Date of Issuance'}
                </span>
                <p className="text-sm font-bold text-foreground font-mono">
                  {verifiedRecord.issueDate}
                </p>
              </div>

              <div className="p-4 rounded-2xl border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {isAm ? 'ካምፓስ እና አድራሻ' : 'Campus Location'}
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {schoolConfig.englishAddress}
                </p>
              </div>
            </div>

            {/* Official Validation Notice */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
              <ShieldCheck className="size-5 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">
                  {isAm
                    ? 'ይህ የምስክር ወረቀት በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተረጋገጠ ነው።'
                    : 'This credential is confirmed and registered with the Hello Technology Registrar in Bahir Dar.'}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  {isAm
                    ? 'አሰሪዎች ወይም ድርጅቶች ይህንን የምስክር ወረቀት ለስራ ቅጥር ወይም ለሙያ ፈቃድ ማረጋገጫ በቀጥታ ሊጠቀሙበት ይችላሉ።'
                    : 'Employers, technical contractors, and licensing authorities may accept this verification as authentic confirmation of practical vocational competence.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t text-xs">
              <span className="text-muted-foreground">
                Inquiries: <strong>{schoolConfig.phone}</strong> · {schoolConfig.email}
              </span>
              <Link href="/#courses">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                  {isAm ? 'ሁሉንም ስልጠናዎች ይመልከቱ' : 'Explore Technical Programs'} <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function CertificateVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-sm font-semibold text-muted-foreground">
          Loading certificate verification...
        </div>
      }
    >
      <CertificateVerifierContent />
    </Suspense>
  )
}
