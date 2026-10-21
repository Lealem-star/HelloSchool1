'use client'

import { useState } from 'react'
import {
  Printer,
  X,
  Award,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'

export type CertificateData = {
  certificateNumber: string
  studentName: string
  studentId: string
  courseTitle: string
  courseLevel?: string
  batchNumber?: string
  completionDate?: string
  issueDate?: string
  grade?: string
  verificationUrl?: string
}

interface StudentCertificateProps {
  isOpen: boolean
  onClose: () => void
  data: CertificateData
}

export function StudentCertificate({ isOpen, onClose, data }: StudentCertificateProps) {
  const { language } = useLanguage()
  const [certLang, setCertLang] = useState<'bilingual' | 'am' | 'en'>('bilingual')

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const issueDateFormatted = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const verificationUrl =
    data.verificationUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/verify/certificate?id=${encodeURIComponent(data.certificateNumber || data.studentId)}`
      : `https://hellotechnology.edu.et/verify/certificate?id=${encodeURIComponent(data.certificateNumber || data.studentId)}`)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-amber-500/30 bg-card shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Screen only, hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b bg-muted/60 print:hidden gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Award className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Official Certificate of Technical Competence
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                Serial: {data.certificateNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language filter switch for certificate */}
            <div className="flex items-center rounded-xl border border-border/80 bg-background p-0.5 text-xs">
              <button
                onClick={() => setCertLang('bilingual')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  certLang === 'bilingual' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dual (ሁለቱም)
              </button>
              <button
                onClick={() => setCertLang('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  certLang === 'en' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCertLang('am')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  certLang === 'am' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                አማ
              </button>
            </div>

            <Button
              onClick={handlePrint}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Printer className="size-3.5" /> Print / Save as PDF
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* ─── PRINTABLE CERTIFICATE CANVAS ─── */}
        <div
          id="printable-certificate"
          className="relative p-6 sm:p-12 md:p-14 bg-gradient-to-br from-amber-50/40 via-white to-blue-50/20 dark:from-slate-950 dark:via-card dark:to-blue-950/20 text-slate-900 dark:text-slate-100 print:text-black print:bg-white print:p-8"
        >
          {/* Ornate Outer Border */}
          <div className="relative border-4 border-double border-amber-600/60 dark:border-amber-500/50 p-6 sm:p-10 rounded-2xl print:border-amber-700 print:p-8">
            
            {/* Decorative Corner Ornaments */}
            <div className="absolute -top-3 -left-3 size-6 border-t-4 border-l-4 border-blue-600" />
            <div className="absolute -top-3 -right-3 size-6 border-t-4 border-r-4 border-blue-600" />
            <div className="absolute -bottom-3 -left-3 size-6 border-b-4 border-l-4 border-blue-600" />
            <div className="absolute -bottom-3 -right-3 size-6 border-b-4 border-r-4 border-blue-600" />

            {/* Subtle Watermark in Center */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] print:opacity-[0.04]">
              <div className="text-center font-black tracking-widest text-8xl sm:text-9xl uppercase font-serif">
                HELLO TECH
              </div>
            </div>

            {/* Top Institutional Header */}
            <div className="text-center space-y-1.5 pb-6 border-b border-amber-500/20 print:border-neutral-300">
              <div className="flex items-center justify-center gap-2">
                <span className="h-0.5 w-12 sm:w-20 bg-amber-500/60" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 print:text-amber-800">
                  {certLang !== 'en' && 'በኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የቴክኒክና ሙያ ስልጠና ማዕቀፍ'}
                  {certLang === 'bilingual' && ' · '}
                  {certLang !== 'am' && 'FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA TVET FRAMEWORK'}
                </span>
                <span className="h-0.5 w-12 sm:w-20 bg-amber-500/60" />
              </div>

              {/* Main Institution Brand */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground print:text-black font-serif pt-1">
                {certLang !== 'en' && schoolConfig.name}
                {certLang === 'bilingual' && (
                  <span className="block text-xl sm:text-2xl text-blue-700 dark:text-sky-400 print:text-blue-900 font-sans font-black tracking-normal mt-0.5">
                    {schoolConfig.englishName}
                  </span>
                )}
                {certLang === 'en' && schoolConfig.englishName}
              </h1>

              <p className="text-xs text-muted-foreground print:text-neutral-600">
                Bahir Dar, Ethiopia · Accredited Vocational Training Institute
              </p>

              {/* Certificate Title Badge */}
              <div className="pt-3">
                <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/10 to-amber-500/20 border border-amber-500/30 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-900 dark:text-sky-300 print:text-black">
                  {certLang === 'am' && 'የቴክኒክና ሙያ ብቃት ማረጋገጫ ምስክር ወረቀት'}
                  {certLang === 'en' && 'Certificate of Technical Occupational Competence'}
                  {certLang === 'bilingual' && 'የቴክኒክና ሙያ ብቃት ማረጋገጫ ምስክር ወረቀት · Certificate of Technical Competence'}
                </span>
              </div>
            </div>

            {/* Recipient Presentation */}
            <div className="text-center my-8 space-y-4">
              <p className="text-xs sm:text-sm font-serif italic text-muted-foreground print:text-neutral-600">
                {certLang !== 'en' && 'ይህ ምስክር ወረቀት የተሰጠው ለ፦'}
                {certLang === 'bilingual' && ' / '}
                {certLang !== 'am' && 'This is to officially certify that:'}
              </p>

              <div className="my-2">
                <h2 className="text-3xl sm:text-5xl font-black text-foreground print:text-black tracking-tight font-serif underline decoration-amber-500/40 underline-offset-8">
                  {data.studentName}
                </h2>
                <p className="mt-2 text-xs font-mono font-bold text-blue-600 dark:text-sky-400 print:text-blue-800">
                  Trainee Portal ID: {data.studentId}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground print:text-neutral-700 max-w-2xl mx-auto leading-relaxed">
                {certLang !== 'en' && (
                  <span>
                    በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተዘጋጀውን የተግባር ላብራቶሪ ስልጠና፣ የመሳሪያዎች ዲያግኖስቲክስ እና የCOC ደረጃ ብቃት መስፈርቶችን በተሳካ ሁኔታ በማጠናቀቁ/ቋ ይህ የሙያ ብቃት ማረጋገጫ ተሰጥቷል።
                  </span>
                )}
                {certLang === 'bilingual' && <br />}
                {certLang !== 'am' && (
                  <span>
                    has demonstrated verified practical competence, diagnostic mastery, and hands-on occupational excellence in accordance with accredited TVET benchmarks in:
                  </span>
                )}
              </p>

              {/* Awarded Course Box */}
              <div className="inline-block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-amber-500/10 to-blue-600/10 border-2 border-blue-600/30 print:border-neutral-400 print:bg-neutral-50 max-w-xl mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 print:text-blue-900 block">
                  {data.courseLevel || 'Accredited Practical Specialty Track'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground print:text-black mt-0.5">
                  {data.courseTitle}
                </h3>
                {data.batchNumber && (
                  <p className="text-xs text-muted-foreground print:text-neutral-600 mt-1">
                    Academic Cohort: <strong>{data.batchNumber}</strong> · Grade: <strong>{data.grade || 'Excellence (Distinction)'}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Row: Official Gold Seal, QR Code, Signatures */}
            <div className="pt-6 border-t border-amber-500/20 print:border-neutral-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
              
              {/* Left: Gold Seal Graphic */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex size-20 sm:size-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 text-blue-950 font-black shadow-lg shadow-amber-500/30 border-4 border-amber-200">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-900/40" />
                  <div className="text-center">
                    <Sparkles className="size-4 mx-auto text-amber-950 mb-0.5" />
                    <span className="text-[8px] font-black uppercase tracking-tighter block leading-tight">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[7px] font-bold block opacity-80">
                      HELLO TECH
                    </span>
                  </div>
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 print:text-neutral-700">
                  Accredited TVET Seal
                </span>
              </div>

              {/* Center: Digital Verification QR & Serial */}
              <div className="flex flex-col items-center justify-center space-y-1">
                {/* Live Scannable QR Code linked to Verification URL */}
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white border border-neutral-300 shadow-sm inline-block group hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
                  title="Click or scan to verify credential"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verificationUrl)}`}
                    alt="Scan to verify certificate"
                    className="size-16 sm:size-18 object-contain mx-auto"
                    loading="eager"
                  />
                </a>

                <p className="font-mono text-[10px] font-bold text-foreground print:text-black">
                  {data.certificateNumber}
                </p>
                <p className="text-[9px] text-muted-foreground print:text-neutral-500">
                  Scan to verify online authenticity
                </p>
                <p className="text-[10px] text-muted-foreground print:text-neutral-600">
                  Issued: <strong>{issueDateFormatted}</strong>
                </p>
              </div>

              {/* Right: Authorizing Signatures */}
              <div className="flex flex-col justify-center space-y-4 text-xs">
                <div>
                  <div className="w-36 sm:w-44 border-b-2 border-slate-400 dark:border-slate-600 print:border-black mx-auto mb-1">
                    <span className="font-serif italic text-sm text-blue-700 dark:text-sky-300 print:text-black font-semibold">
                      Haile Haile
                    </span>
                  </div>
                  <p className="font-bold text-foreground print:text-black text-[11px]">
                    Managing Director &amp; Dean
                  </p>
                  <p className="text-[9px] text-muted-foreground print:text-neutral-500">
                    {schoolConfig.name}
                  </p>
                </div>

                <div>
                  <div className="w-36 sm:w-44 border-b-2 border-slate-400 dark:border-slate-600 print:border-black mx-auto mb-1">
                    <span className="font-serif italic text-sm text-blue-700 dark:text-sky-300 print:text-black font-semibold">
                      Worku Alemayehu
                    </span>
                  </div>
                  <p className="font-bold text-foreground print:text-black text-[11px]">
                    Head of Technical Training &amp; COC
                  </p>
                  <p className="text-[9px] text-muted-foreground print:text-neutral-500">
                    Lead Practical Workshop Instructor
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
