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

const SECTORS = [
  {
    icon: Stethoscope,
    title: 'Hospitals & Healthcare',
    badge: 'Biomedical Tech',
    description:
      'Maintain patient monitors, ECG machines, power supplies, centrifuge boards, and diagnostic hospital equipment with internal biomedical engineering staff.',
    skills: ['Biomedical PCB repair', 'SMPS power supply diagnostics', 'Sensor board rework'],
    accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
  },
  {
    icon: Factory,
    title: 'Industries & Manufacturing',
    badge: 'Automation & PLCs',
    description:
      'Empower plant technicians to troubleshoot motor drive inverters, PLC input/output circuitry, optical sensor boards, and heavy industrial instrumentation on-site.',
    skills: ['PLC controller circuitry', 'VFD inverter diagnostics', 'Industrial sensor calibration'],
    accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
  },
  {
    icon: GraduationCap,
    title: 'Universities & Technical Colleges',
    badge: 'Lab Technicians',
    description:
      'Upskill laboratory technicians, electronics workshop instructors, and university campus engineering staff to maintain department benches and test instruments.',
    skills: ['Oscilloscope calibration', 'PCB prototyping & soldering', 'Lab equipment servicing'],
    accent: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
  },
  {
    icon: Server,
    title: 'Banks, Telecoms & Enterprises',
    badge: 'Enterprise Hardware',
    description:
      'Train IT hardware support engineers to diagnose server motherboards, telecom node units, enterprise UPS power circuitry, and automated teller electronics.',
    skills: ['Server motherboard repair', 'Telecom transceivers', 'UPS board diagnostics'],
    accent: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
  },
]

export function CompanyTrainingCTA() {
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
      setError(err.message || 'Something went wrong. Please try again.')
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
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-28 border-t border-slate-800">
        {/* Glow Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.18),transparent_70%),radial-gradient(circle_at_10%_90%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(99,102,241,0.12),transparent_40%)]" />
        <div className="tech-dot-bg absolute inset-0 opacity-20 pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Building2 className="size-3.5" />
              <span>Institutional & Enterprise Technical Workforce</span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
              Customized Technical Training for{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                Institutional Employees
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">
              Does your institution maintain its own specialized hardware? We build tailored, hands-on repair curriculums designed specifically for technicians in <strong>hospitals, factories, universities, telecoms, and financial institutions</strong>.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                className="group rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-7 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition-all duration-300 hover:from-cyan-300 hover:to-teal-300 hover:scale-[1.02] hover:shadow-cyan-400/30"
              >
                <Building2 className="size-4 mr-2" />
                Request Institutional Training
                <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <a
                href={`tel:+251${schoolConfig.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/50 hover:bg-slate-800 hover:text-white"
              >
                <PhoneCall className="size-4 text-cyan-400" />
                <span>Call Institutional Desk: {schoolConfig.phone}</span>
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
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-950/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 transition-colors">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        {sector.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sector.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-400">
                      {sector.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-800/80 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Core Modules Include:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {sector.skills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3 text-cyan-400 shrink-0" />
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
          <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  <Wrench className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Your Exact Hardware</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Custom labs built around your institutional machinery.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 border border-teal-400/20">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Flexible Location</h4>
                  <p className="text-xs text-slate-400 mt-0.5">On-site at your facility or in our Bahir Dar benches.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-400/10 text-indigo-400 border border-indigo-400/20">
                  <Clock className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tailored Scheduling</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Rotational shifts, weekend cohorts or intensive bootcamps.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Certified Competency</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Accredited certification and technical skill evaluations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL: COMPANY INQUIRY (DEDICATED, NOT MERGED WITH NORMAL CONTACT US) ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => !loading && setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl my-8 rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Customized Company Training Inquiry</h3>
                  <p className="text-xs text-slate-400">Dedicated institutional intake · Hello TVET Corporate Programs</p>
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center animate-scale-in">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                    <CheckCircle2 className="size-8" />
                  </span>
                  <h4 className="mt-5 text-2xl font-bold text-white">Institutional Inquiry Received!</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-md mx-auto">
                    Thank you, <strong>{form.contactPerson}</strong>. Your customized training request for <strong>{form.companyName}</strong> has been logged in our corporate admin desk. Our institutional training director will reach out to you within 24 hours.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      onClick={handleReset}
                      className="bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300"
                    >
                      Done
                    </Button>
                    <a
                      href={`tel:+251${schoolConfig.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-300"
                    >
                      <PhoneCall className="size-3.5" /> Urgent inquiry? Call {schoolConfig.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Organization / Institution Name *
                      <input
                        required
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Felege Hiwot Hospital, BDU, Dangote"
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Institution Sector *
                      <select
                        required
                        name="institutionType"
                        value={form.institutionType}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm font-normal text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                      >
                        <option value="Hospitals & Healthcare">Hospitals & Healthcare</option>
                        <option value="Industrial & Manufacturing">Industrial & Manufacturing</option>
                        <option value="Universities & Higher Ed">Universities & Higher Ed</option>
                        <option value="Telecom & Enterprise IT">Telecom & Enterprise IT</option>
                        <option value="Banking & Financial Systems">Banking & Financial Systems</option>
                        <option value="Government & Public Agency">Government & Public Agency</option>
                        <option value="Other Commercial Institution">Other Commercial Institution</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Contact Person Full Name *
                      <input
                        required
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Abebe / Eng. Martha"
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Job Title / Department
                      <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Maintenance Head / HR Director"
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Official Work Email *
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contact@institution.gov.et"
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Phone Number *
                      <input
                        required
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+251 9..."
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Trainees / Employees Count
                      <select
                        name="employeeCount"
                        value={form.employeeCount}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm font-normal text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                      >
                        <option value="1 - 5 staff">1 - 5 staff (Focused Team)</option>
                        <option value="6 - 15 staff">6 - 15 staff (Full Department Cohort)</option>
                        <option value="16 - 30 staff">16 - 30 staff (Multi-Shift Program)</option>
                        <option value="30+ staff">30+ staff (Institutional Scale)</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Training Delivery Location
                      <select
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm font-normal text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
                      >
                        <option value="At HelloSchool Advanced Labs (Bahir Dar)">At HelloSchool Advanced Labs (Bahir Dar)</option>
                        <option value="On-site at our Institution Facility">On-site at our Institution Facility</option>
                        <option value="Hybrid (Hands-on Labs + On-site Deployment)">Hybrid (Hands-on Labs + On-site Deployment)</option>
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Specific Hardware / Equipment Focus
                    <input
                      name="trainingFocus"
                      value={form.trainingFocus}
                      onChange={handleChange}
                      placeholder="e.g. Patient monitors, Siemens PLC boards, Dell enterprise servers..."
                      disabled={loading}
                      className="h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Additional Requirements or Maintenance Challenges
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe the devices your staff maintains, the technical obstacles you face, or timeline preferences..."
                      disabled={loading}
                      className="rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm font-normal text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </label>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <p className="text-[11px] text-slate-400">
                      * This inquiry route routes directly to the corporate training coordinator.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setModalOpen(false)}
                        disabled={loading}
                        className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold hover:from-cyan-300 hover:to-teal-300"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 size-4" /> Submit Inquiry
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
