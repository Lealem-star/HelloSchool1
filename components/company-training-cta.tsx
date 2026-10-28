'use client'

import { useState } from 'react'
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  X,
  Loader2,
  Send,
  PhoneCall,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'

export function CompanyTrainingCTA() {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [form, setForm] = useState({
    companyName: '',
    institutionType: 'Hospitals & Healthcare',
    contactPerson: '',
    jobTitle: '',
    email: '',
    phone: '',
    employeeCount: '6 - 15 staff',
    trainingFocus: 'Biomedical & Medical Equipment Electronics',
    location: 'At HelloSchool Advanced Labs (Bahir Dar)',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/company-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(
        err.message ||
          (isAm
            ? 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።'
            : 'Something went wrong. Please try again.')
      )
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSubmitted(false)
    setError('')
    setForm({
      companyName: '',
      institutionType: 'Hospitals & Healthcare',
      contactPerson: '',
      jobTitle: '',
      email: '',
      phone: '',
      employeeCount: '6 - 15 staff',
      trainingFocus: 'Biomedical & Medical Equipment Electronics',
      location: 'At HelloSchool Advanced Labs (Bahir Dar)',
      message: '',
    })
    setModalOpen(false)
  }

  return (
    <>
      {/* ── MINIMIZED INSTITUTIONAL & ENTERPRISE TRAINING SECTION ── */}
      <section className="px-5 py-20 lg:px-8">
        <div className="container relative mx-auto max-w-7xl">
          {/* Centered Section Header on Transparent Page Background */}
          <div className="mx-auto max-w-3xl mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary shadow-xs mb-4">
              <Building2 className="size-3.5" />
              <span>
                {isAm
                  ? 'የተቋማትና የድርጅቶች የቴክኒክ ሰራተኞች'
                  : 'Institutional & Enterprise Technical Workforce'}
              </span>
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-tight">
              {isAm
                ? 'ለተቋማት ሰራተኞች የተዘጋጀ ብጁ የተግባር ስልጠና'
                : 'Customized Technical Training for Institutional Employees'}
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-normal max-w-2xl mx-auto">
              {isAm
                ? 'ተቋምዎ ልዩ ማሽነሪዎችን ይጠቀማል? በሆስፒታሎች፣ በፋብሪካዎች፣ በዩኒቨርሲቲዎች፣ በቴሌኮም እና በባንኮች ውስጥ ለሚሰሩ ቴክኒሻኖች በእርስዎ መሳሪያዎች ዙሪያ የተዘጋጀ ብጁ ስልጠና በቦታው ወይም በላባችን እንሰጣለን።'
                : 'Empower your technical workforce with tailor-made repair training built directly around your organization’s machinery, biomedical units, and IT hardware — delivered on-site or in our Bahir Dar labs.'}
            </p>
          </div>

          {/* Blue Action Card */}
          <div className="overflow-hidden rounded-3xl border border-blue-400/30 bg-[#0d2a75] bg-gradient-to-br from-[#0c2f86] via-[#1048ca] to-[#155DFC] p-8 text-white shadow-2xl sm:p-12 lg:p-14 relative">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(56,189,248,0.22),transparent_45%)] pointer-events-none" />
            <div className="tech-dot-bg absolute inset-0 opacity-15 pointer-events-none" />

            <div className="relative grid items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Short & Precise Action Call */}
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {isAm ? 'የተቋምዎን የጥገና አቅም ያሳድጉ' : 'Upgrade Your Technical Infrastructure Readiness'}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-blue-100 font-normal">
                  {isAm
                    ? 'በተቋምዎ ቅጥር ግቢ ወይም በባህር ዳር ማሰልጠኛ ላቦራቶሪያችን ለቴክኒክ ሰራተኞችዎ የተመቻቸ የፈረቃ ወይም የተጠናከረ ስልጠና እንሰጣለን።'
                    : 'Flexible on-site workshops at your facility or intensive cohort bootcamps at our Bahir Dar practical engineering labs.'}
                </p>

                {/* Sector Tags Strip */}
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/95">
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm border border-white/20">
                    🏥 {isAm ? 'ሆስፒታሎችና ባዮሜዲካል' : 'Hospitals & Healthcare'}
                  </span>
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm border border-white/20">
                    🏭 {isAm ? 'ፋብሪካዎችና PLCs' : 'Industries & PLCs'}
                  </span>
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm border border-white/20">
                    📡 {isAm ? 'ቴሌኮም፣ ሰርቨርና አይቲ' : 'Telecom & Enterprise IT'}
                  </span>
                  <span className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm border border-white/20">
                    🎓 {isAm ? 'ዩኒቨርሲቲዎችና ላብራቶሪዎች' : 'Universities & Labs'}
                  </span>
                </div>

              {/* Direct Action to Call & Request Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a href={`tel:${schoolConfig.phone.replace(/\s+/g, '')}`}>
                  <Button
                    size="lg"
                    className="rounded-xl bg-white px-6 font-bold text-[#155DFC] hover:bg-blue-50 shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <PhoneCall className="size-4 mr-2 text-[#155DFC]" />
                    {isAm
                      ? `ወደ ተቋማት ዴስክ ይደውሉ፡ ${schoolConfig.phone}`
                      : `Call Institutional Desk: ${schoolConfig.phone}`}
                  </Button>
                </a>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setModalOpen(true)}
                  className="rounded-xl border-white/50 bg-white/10 text-white hover:border-white hover:bg-white/20 transition-all font-semibold"
                >
                  <Building2 className="size-4 mr-2" />
                  {isAm ? 'የተቋም ስልጠና ይጠይቁ' : 'Request Institutional Training'}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>

                <a
                  href={`https://wa.me/${schoolConfig.whatsappPhone}?text=${encodeURIComponent(
                    isAm
                      ? 'ሰላም! ለተቋማችን ሰራተኞች የተዘጋጀ ብጁ የቴክኒክ ስልጠና መረጃ ማግኘት እንፈልጋለን።'
                      : 'Hello! Our institution would like to inquire about customized technical training programs for our engineering staff.'
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
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column: Image Trigger Card */}
            <div className="lg:col-span-5">
              <div className="relative group overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-2xl backdrop-blur-md">
                <img
                  src="/images/company-training-hero.jpg"
                  alt={
                    isAm
                      ? 'የተቋማትና የድርጅቶች የተግባር ስልጠና'
                      : 'Customized Company & Institutional Training'
                  }
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#155DFC]/90 px-3.5 py-1.5 font-bold backdrop-blur-md shadow-md text-white border border-white/20">
                    <ShieldCheck className="size-3.5 text-emerald-300" />
                    {isAm ? 'በቦታው ወይም በላባችን' : 'On-Site or In-Lab'}
                  </span>
                  <span className="rounded-lg bg-black/60 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md border border-white/15">
                    {isAm ? 'ብጁ የስልጠና ፕሮግራም' : 'Custom Cohorts'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ── MODAL: COMPANY INQUIRY (DEDICATED, NOT MERGED WITH NORMAL CONTACT US) ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => !loading && setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl my-8 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-card dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1048ca] via-[#155DFC] to-[#0c3694] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isAm ? 'የተቋማትና የድርጅቶች ስልጠና ጥያቄ ቅጽ' : 'Customized Company Training Inquiry'}
                  </h3>
                  <p className="text-xs text-blue-100">
                    {isAm
                      ? 'የተቋማት ቀጥታ ምዝገባ · የሄሎ ቴክኖሎጂ ኮርፖሬት ፕሮግራሞች'
                      : 'Dedicated institutional intake · Hello Technology Corporate Programs'}
                  </p>
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center animate-scale-in">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="size-8" />
                  </span>
                  <h4 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                    {isAm ? 'የተቋም ስልጠና ጥያቄዎ ደርሶናል!' : 'Institutional Inquiry Received!'}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    {isAm ? (
                      <>
                        እናመሰግናለን <strong>{form.contactPerson}</strong>! ለ<strong>{form.companyName}</strong> ያቀረቡት የተቋም ስልጠና ጥያቄ በኮርፖሬት አስተዳደር ዴስካችን ተመዝግቧል። የተቋማት ስልጠና ዳይሬክተራችን በ24 ሰዓታት ውስጥ ያነጋግርዎታል።
                      </>
                    ) : (
                      <>
                        Thank you, <strong>{form.contactPerson}</strong>. Your customized training request for <strong>{form.companyName}</strong> has been logged in our corporate admin desk. Our institutional training director will reach out to you within 24 hours.
                      </>
                    )}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      onClick={handleReset}
                      className="bg-[#155DFC] text-white font-bold hover:bg-[#0D4ECC] shadow-md shadow-blue-500/25"
                    >
                      {isAm ? 'ተጠናቋል' : 'Done'}
                    </Button>
                    <a
                      href={`tel:+251${schoolConfig.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#155DFC]"
                    >
                      <PhoneCall className="size-3.5" />
                      {isAm ? 'አስቸኳይ ጥያቄ ካለዎት ይደውሉ፡' : 'Urgent inquiry? Call'} {schoolConfig.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የተቋሙ / የድርጅቱ ስም *' : 'Organization / Institution Name *'}
                      <input
                        required
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder={isAm ? 'ለምሳሌ፡ ፈለገ ሕይወት ሆስፒታል፣ ባሕር ዳር ዩኒቨርሲቲ' : 'e.g. Felege Hiwot Hospital, BDU, Dangote'}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የተቋሙ የስራ ዘርፍ *' : 'Institution Sector *'}
                      <select
                        required
                        name="institutionType"
                        value={form.institutionType}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Hospitals & Healthcare">{isAm ? 'ሆስፒታሎችና የጤና ተቋማት' : 'Hospitals & Healthcare'}</option>
                        <option value="Industrial & Manufacturing">{isAm ? 'ኢንዱስትሪና ማምረቻ' : 'Industrial & Manufacturing'}</option>
                        <option value="Universities & Higher Ed">{isAm ? 'ዩኒቨርሲቲዎችና ከፍተኛ ትምህርት' : 'Universities & Higher Ed'}</option>
                        <option value="Telecom & Enterprise IT">{isAm ? 'ቴሌኮም እና የአይቲ ድርጅቶች' : 'Telecom & Enterprise IT'}</option>
                        <option value="Banking & Financial Systems">{isAm ? 'ባንኮችና የፋይናንስ ተቋማት' : 'Banking & Financial Systems'}</option>
                        <option value="Government & Public Agency">{isAm ? 'የመንግስት ተቋማት' : 'Government & Public Agency'}</option>
                        <option value="Other Commercial Institution">{isAm ? 'ሌላ የንግድ ተቋም' : 'Other Commercial Institution'}</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የተጠሪው / የስራ ኃላፊው ሙሉ ስም *' : 'Contact Person Full Name *'}
                      <input
                        required
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        placeholder={isAm ? 'ለምሳሌ፡ ዶ/ር አበበ / ኢንጂነር ማርታ' : 'e.g. Dr. Abebe / Eng. Martha'}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የስራ መደብ / ክፍል' : 'Job Title / Department'}
                      <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder={isAm ? 'ለምሳሌ፡ የጥገና ክፍል ኃላፊ / የሰው ኃይል ዳይሬክተር' : 'e.g. Maintenance Head / HR Director'}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'ኦፊሴላዊ የድርጅት ኢሜይል *' : 'Official Work Email *'}
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contact@institution.gov.et"
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'ስልክ ቁጥር *' : 'Phone Number *'}
                      <input
                        required
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+251 9..."
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የሰልጣኞች / የሰራተኞች ብዛት' : 'Trainees / Employees Count'}
                      <select
                        name="employeeCount"
                        value={form.employeeCount}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="1 - 5 staff">{isAm ? '1 - 5 ሰራተኞች' : '1 - 5 staff (Focused Team)'}</option>
                        <option value="6 - 15 staff">{isAm ? '6 - 15 ሰራተኞች' : '6 - 15 staff (Full Department Cohort)'}</option>
                        <option value="16 - 30 staff">{isAm ? '16 - 30 ሰራተኞች' : '16 - 30 staff (Multi-Shift Program)'}</option>
                        <option value="30+ staff">{isAm ? '30+ ሰራተኞች' : '30+ staff (Institutional Scale)'}</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isAm ? 'የስልጠናው አሰጣጥ ቦታ' : 'Training Delivery Location'}
                      <select
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="At HelloSchool Advanced Labs (Bahir Dar)">
                          {isAm ? 'በባህር ዳር ሄሎ ቴክኖሎጂ ላብራቶሪ' : 'At HelloSchool Advanced Labs (Bahir Dar)'}
                        </option>
                        <option value="On-site at our Institution Facility">
                          {isAm ? 'በተቋማችን ቅጥር ግቢ ውስጥ' : 'On-site at our Institution Facility'}
                        </option>
                        <option value="Hybrid (Hands-on Labs + On-site Deployment)">
                          {isAm ? 'የተቀላቀለ (ላብራቶሪ + በተቋሙ)' : 'Hybrid (Hands-on Labs + On-site Deployment)'}
                        </option>
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isAm ? 'ልዩ የሃርድዌር / የመሳሪያዎች ትኩረት' : 'Specific Hardware / Equipment Focus'}
                    <input
                      name="trainingFocus"
                      value={form.trainingFocus}
                      onChange={handleChange}
                      placeholder={isAm ? 'ለምሳሌ፡ የታካሚ ሞኒተሮች፣ ሲመንስ PLC ቦርዶች፣ የሰርቨር ማዘርቦርዶች...' : 'e.g. Patient monitors, Siemens PLC boards, Dell enterprise servers...'}
                      disabled={loading}
                      className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isAm ? 'ተጨማሪ ፍላጎቶች ወይም የጥገና ተግዳሮቶች' : 'Additional Requirements or Maintenance Challenges'}
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={isAm ? 'ሰራተኞችዎ የሚጠግኗቸውን እቃዎች፣ የሚያጋጥሟችሁን የቴክኒክ ችግሮች ወይም የጊዜ ምርጫዎን ይግለጹ...' : 'Describe the devices your staff maintains, the technical obstacles you face, or timeline preferences...'}
                      disabled={loading}
                      className="rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </label>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500">
                      {isAm
                        ? '* ይህ ቅጽ በቀጥታ ወደ ተቋማት ስልጠና አስተባባሪ ይላካል።'
                        : '* This inquiry routes directly to the corporate training coordinator.'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setModalOpen(false)}
                        disabled={loading}
                        className="border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {isAm ? 'ይቅር' : 'Cancel'}
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#155DFC] text-white font-bold hover:bg-[#0D4ECC] shadow-lg shadow-blue-500/25"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {isAm ? 'በመላክ ላይ...' : 'Submitting...'}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 size-4" />
                            {isAm ? 'ጥያቄውን ላክ' : 'Submit Inquiry'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
