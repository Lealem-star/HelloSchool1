'use client'

import { useState } from 'react'
import {
  Building2,
  Stethoscope,
  Factory,
  GraduationCap,
  Server,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  ShieldCheck,
  Wrench,
  Clock,
  X,
  Loader2,
  Send,
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
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

  const SECTORS = [
    {
      icon: Stethoscope,
      title: isAm ? 'ሆስፒታሎችና የጤና ተቋማት' : 'Hospitals & Healthcare',
      badge: isAm ? 'ባዮሜዲካል ቴክኒክ' : 'Biomedical Tech',
      description: isAm
        ? 'የታካሚ ሞኒተሮችን፣ የኢሲጂ (ECG) ማሽኖችን፣ የፓወር ሰፕላይ እና የሴንትሪፊውጅ ሰሌዳዎችን በሆስፒታሉ የውስጥ ባዮሜዲካል ኢንጂነሪንግ ሰራተኞች መጠገን።'
        : 'Maintain patient monitors, ECG machines, power supplies, centrifuge boards, and diagnostic hospital equipment with internal biomedical engineering staff.',
      skills: isAm
        ? ['የባዮሜዲካል PCB ጥገና', 'የSMPS ፓወር ሰፕላይ ዲያግኖስቲክስ', 'የሴንሰር ቦርድ ዳግም ስራ']
        : ['Biomedical PCB repair', 'SMPS power supply diagnostics', 'Sensor board rework'],
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      icon: Factory,
      title: isAm ? 'ኢንዱስትሪዎችና የማምረቻ ፋብሪካዎች' : 'Industries & Manufacturing',
      badge: isAm ? 'አውቶሜሽንና PLCs' : 'Automation & PLCs',
      description: isAm
        ? 'የፋብሪካ ቴክኒሻኖች የሞተር ድራይቭ ኢንቨርተሮችን፣ የPLC ኢንፑት/አውትፑት ሰርኪውቶችን፣ ኦፕቲካል ሴንሰሮችን እና ከባድ የኢንዱስትሪ መሳሪያዎችን በቦታው እንዲመረምሩ ማብቃት።'
        : 'Empower plant technicians to troubleshoot motor drive inverters, PLC input/output circuitry, optical sensor boards, and heavy industrial instrumentation on-site.',
      skills: isAm
        ? ['የPLC ኮንትሮለር ሰርኪውት', 'የVFD ኢንቨርተር ዲያግኖስቲክስ', 'የኢንዱስትሪ ሴንሰር ካሊብሬሽን']
        : ['PLC controller circuitry', 'VFD inverter diagnostics', 'Industrial sensor calibration'],
      accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      icon: GraduationCap,
      title: isAm ? 'ዩኒቨርሲቲዎችና ቴክኒክ ኮሌጆች' : 'Universities & Technical Colleges',
      badge: isAm ? 'የላብራቶሪ ቴክኒሻኖች' : 'Lab Technicians',
      description: isAm
        ? 'የላብራቶሪ ቴክኒሻኖችን፣ የኤሌክትሮኒክስ አውደ-ጥናት መምህራንን እና የካምፓስ ኢንጂነሪንግ ሰራተኞችን የመምሪያ መሳሪያዎችን እና መመርመሪያዎችን እንዲጠግኑ ማሰልጠን።'
        : 'Upskill laboratory technicians, electronics workshop instructors, and university campus engineering staff to maintain department equipment and test instruments.',
      skills: isAm
        ? ['የኦስሲሎስኮፕ ካሊብሬሽን', 'የPCB ፕሮቶታይፕና ብየዳ', 'የላብራቶሪ እቃዎች አገልግሎት']
        : ['Oscilloscope calibration', 'PCB prototyping & soldering', 'Lab equipment servicing'],
      accent: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-sky-400',
    },
    {
      icon: Server,
      title: isAm ? 'ባንኮች፣ ቴሌኮም እና ድርጅቶች' : 'Banks, Telecoms & Enterprises',
      badge: isAm ? 'የድርጅት ሃርድዌር' : 'Enterprise Hardware',
      description: isAm
        ? 'የአይቲ ሃርድዌር ድጋፍ ሰጪ ኢንጂነሮችን የሰርቨር ማዘርቦርዶችን፣ የቴሌኮም ኖዶችን፣ የድርጅት ዩፒኤስ (UPS) ፓወር ሰርኪውቶችን እና የኤቲኤም ኤሌክትሮኒክስን እንዲመረምሩ ማሰልጠን።'
        : 'Train IT hardware support engineers to diagnose server motherboards, telecom node units, enterprise UPS power circuitry, and automated teller electronics.',
      skills: isAm
        ? ['የሰርቨር ማዘርቦርድ ጥገና', 'የቴሌኮም ትራንስሲቨሮች', 'የUPS ቦርድ ዲያግኖስቲክስ']
        : ['Server motherboard repair', 'Telecom transceivers', 'UPS board diagnostics'],
      accent: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    },
  ]

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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1048ca] via-[#155DFC] to-[#0c3694] py-20 text-white lg:py-28 border-t border-blue-400/30">
        {/* Glow Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.18),transparent_70%),radial-gradient(circle_at_10%_90%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.12),transparent_40%)]" />
        <div className="tech-dot-bg absolute inset-0 opacity-15 pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              <Building2 className="size-3.5" />
              <span>
                {isAm
                  ? 'የተቋማትና የድርጅቶች የቴክኒክ ሰራተኞች'
                  : 'Institutional & Enterprise Technical Workforce'}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
              {isAm ? 'ለተቋማት ሰራተኞች የተዘጋጀ ' : 'Customized Technical Training for '}
              <span className="text-white drop-shadow-sm">
                {isAm ? 'ብጁ የተግባር ስልጠና' : 'Institutional Employees'}
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-blue-50">
              {isAm ? (
                <>
                  ተቋምዎ የራሱን ልዩ ሃርድዌርና ማሽነሪዎች ይጠቀማል? በ<strong>ሆስፒታሎች፣ በፋብሪካዎች፣ በዩኒቨርሲቲዎች፣ በቴሌኮም እና በፋይናንስ ተቋማት</strong> ውስጥ ለሚሰሩ ቴክኒሻኖች የተዘጋጀ ብጁ የተግባር ጥገና ስልጠና እንሰጣለን።
                </>
              ) : (
                <>
                  Does your institution maintain its own specialized hardware? We build tailored, hands-on repair curriculums designed specifically for technicians in <strong>hospitals, factories, universities, telecoms, and financial institutions</strong>.
                </>
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                className="group rounded-xl bg-white px-7 font-bold text-[#155DFC] shadow-xl transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02] hover:shadow-2xl"
              >
                <Building2 className="size-4 mr-2" />
                {isAm ? 'የተቋም ስልጠና ይጠይቁ' : 'Request Institutional Training'}
                <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <a
                href={`tel:+251${schoolConfig.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/20"
              >
                <PhoneCall className="size-4 text-white" />
                <span>
                  {isAm ? 'ወደ ተቋማት ዴስክ ይደውሉ፡' : 'Call Institutional Desk:'} {schoolConfig.phone}
                </span>
              </a>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((sector) => {
              const Icon = sector.icon
              return (
                <div
                  key={sector.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 hover:shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-white/20 border border-white/30 text-white transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-md border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        {sector.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-white transition-colors">
                      {sector.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-blue-100">
                      {sector.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-2">
                      {isAm ? 'ዋና ዋና ሞጁሎች፡' : 'Core Modules Include:'}
                    </p>
                    <ul className="space-y-1.5 text-xs text-white">
                      {sector.skills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3 text-emerald-300 shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Institutional Value Highlights Strip */}
          <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30">
                  <Wrench className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAm ? 'ትክክለኛው የእርስዎ ሃርድዌር' : 'Your Exact Hardware'}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {isAm
                      ? 'በተቋምዎ ማሽነሪዎች ዙሪያ የተገነቡ የተግባር ላቦራቶሪዎች።'
                      : 'Custom labs built around your institutional machinery.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAm ? 'ተለዋዋጭ የስልጠና ቦታ' : 'Flexible Location'}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {isAm
                      ? 'በእርስዎ ተቋም ቅጥር ግቢ ወይም በባህር ዳር ማሰልጠኛ ላቦራቶሪያችን።'
                      : 'On-site at your facility or in our Bahir Dar training labs.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30">
                  <Clock className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAm ? 'የተመቻቸ የጊዜ ሰሌዳ' : 'Tailored Scheduling'}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {isAm
                      ? 'በተዘዋዋሪ ፈረቃ፣ የሳምንት መጨረሻ ወይም የተጠናከረ የቡትካምፕ ክፍለ-ጊዜዎች።'
                      : 'Rotational shifts, weekend cohorts or intensive bootcamps.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white border border-white/30">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAm ? 'የተረጋገጠ የብቃት ማረጋገጫ' : 'Certified Competency'}
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {isAm
                      ? 'ዕውቅና ያለው ሰርተፍኬት እና የቴክኒክ ክህሎት ምዘና።'
                      : 'Accredited certification and technical skill evaluations.'}
                  </p>
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
