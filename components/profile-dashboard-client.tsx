'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SiteShell } from '@/components/site'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import {
  Compass,
  User,
  ShoppingBag,
  Shield,
  PanelLeft,
  ArrowLeft,
  Scan,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  Upload,
  AlertCircle,
} from 'lucide-react'

export type TabType = 'dashboard' | 'account' | 'purchase' | 'security'

interface ProfileDashboardClientProps {
  initialTab?: TabType
}

export function ProfileDashboardClient({ initialTab = 'dashboard' }: ProfileDashboardClientProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Account Form State (Screenshots 1 & 2)
  const [fullName, setFullName] = useState('Mekonen Alemayehu')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+251934551781')
  const [birthDate, setBirthDate] = useState('')
  const [calendarType, setCalendarType] = useState<'EC' | 'GC'>('EC')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('Ethiopia')
  const [city, setCity] = useState('Bahir Dar')
  const [address, setAddress] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('Amharic')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Security Expandable Cards State (Screenshots 4 & 5)
  const [expandedCard, setExpandedCard] = useState<'password' | 'phone' | 'email' | null>(null)
  const [oldPassword, setOldPassword] = useState('0934551781')
  const [newPassword, setNewPassword] = useState('••••••••••••••••')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [currentPhone, setCurrentPhone] = useState('+251934551781')
  const [newPhone, setNewPhone] = useState('0934551781')

  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null)

  // Fetch student info
  useEffect(() => {
    try {
      const cachedAvatar = localStorage.getItem('hellotvet_student_avatar')
      if (cachedAvatar) setAvatarPreview(cachedAvatar)
      const cachedName = localStorage.getItem('hellotvet_student_name')
      if (cachedName) setFullName(cachedName)
    } catch {}

    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          setStudent(data.student)
          if (data.student.fullName) setFullName(data.student.fullName)
          if (data.student.personalEmail || data.student.institutionalEmail) {
            setEmail(data.student.personalEmail || data.student.institutionalEmail)
          }
          if (data.student.phone) {
            const rawPhone = data.student.phone
            const validPhone = rawPhone.includes('@') ? '+251934551781' : rawPhone
            setPhone(validPhone)
            setCurrentPhone(validPhone)
            setOldPassword(validPhone.replace(/[^0-9]/g, ''))
          }
          if (data.student.city) setCity(data.student.city)
          if (data.student.avatarUrl) {
            setAvatarPreview(data.student.avatarUrl)
            try {
              localStorage.setItem('hellotvet_student_avatar', data.student.avatarUrl)
            } catch {}
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const targetUrl = `/profile/${tab}`
      window.history.pushState(null, '', targetUrl)
    }
  }

  const compressImage = (file: File, maxDim = 400, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(e.target?.result as string)
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await compressImage(file)
        if (dataUrl) {
          setAvatarPreview(dataUrl)
          try {
            localStorage.setItem('hellotvet_student_avatar', dataUrl)
            window.dispatchEvent(new Event('storage'))
            window.dispatchEvent(
              new CustomEvent('student-avatar-updated', {
                detail: { avatarUrl: dataUrl, fullName },
              })
            )
          } catch (err) {
            console.error('Failed to save avatar to localStorage:', err)
          }

          // Also asynchronously save to backend if user is authenticated
          fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarUrl: dataUrl }),
          }).catch(() => {})
        }
      } catch (err) {
        console.error('Image compression failed:', err)
      }
    }
  }

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let cleanPhone = phone.trim()
      let cleanEmail = email.trim()
      if (cleanPhone.includes('@')) {
        if (!cleanEmail) cleanEmail = cleanPhone
        cleanPhone = '+251934551781'
        setPhone(cleanPhone)
      }

      if (fullName) {
        localStorage.setItem('hellotvet_student_name', fullName)
      }
      if (avatarPreview) {
        localStorage.setItem('hellotvet_student_avatar', avatarPreview)
      }
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(
        new CustomEvent('student-avatar-updated', {
          detail: { avatarUrl: avatarPreview, fullName },
        })
      )

      await fetch('/api/student/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          personalEmail: cleanEmail,
          phone: cleanPhone,
          city,
          avatarUrl: avatarPreview,
        }),
      }).catch(() => {})
    } catch {}

    setSaveSuccessMsg(isAm ? 'መረጃዎ በተሳካ ሁኔታ ተቀምጧል!' : 'Your profile has been saved successfully!')
    setTimeout(() => setSaveSuccessMsg(null), 4000)
  }

  const handleSaveSecurity = async (section: 'Password' | 'Phone Number' | 'Email Address') => {
    try {
      if (section === 'Password') {
        if (newPassword && newPassword !== '••••••••••••••••') {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword }),
          })
        }
      } else if (section === 'Phone Number') {
        if (newPhone) {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: newPhone }),
          })
          setCurrentPhone(newPhone)
          setPhone(newPhone)
        }
      } else if (section === 'Email Address') {
        if (newEmail) {
          await fetch('/api/student/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ personalEmail: newEmail }),
          })
          setCurrentEmail(newEmail)
          setEmail(newEmail)
        }
      }
    } catch (err) {
      console.error('Error saving security setting:', err)
    }

    setSecuritySuccessMsg(
      isAm ? `${section} በተሳካ ሁኔታ ተቀይሯል!` : `${section} updated successfully!`
    )
    setTimeout(() => setSecuritySuccessMsg(null), 4000)
    setExpandedCard(null)
  }

  return (
    <SiteShell>
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left Sidebar: Menu (matching all screenshots) ── */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* ── Left Sidebar Menu ── */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-card p-4 shadow-sm">
              {/* Header: Menu + Sidebar Collapse Icon */}
              <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-base text-foreground tracking-tight">
                  {isAm ? 'ሜኑ (Menu)' : 'Menu'}
                </span>
                <PanelLeft className="size-4 text-sky-500" />
              </div>

              {/* Navigation Items (Student Left Side Tabs with rich blue color) */}
              <nav className="mt-3 flex flex-col gap-1.5" aria-label="Profile navigation">
                {[
                  { id: 'dashboard' as TabType, label: isAm ? 'ዳሽቦርድ' : 'Dashboard', icon: Compass },
                  { id: 'account' as TabType, label: isAm ? 'አካውንት' : 'Account', icon: User },
                  { id: 'purchase' as TabType, label: isAm ? 'የግዢ ታሪክ' : 'Purchase History', icon: ShoppingBag },
                  { id: 'security' as TabType, label: isAm ? 'ደህንነት' : 'Security', icon: Shield },
                ].map((item) => {
                  const isActive = activeTab === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`group relative flex items-center gap-3 w-full rounded-xl px-3.5 py-3 text-sm font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-500'
                          : 'bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 border border-sky-100/80 dark:border-sky-900/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 hover:text-sky-950 dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-white shadow-xs" />
                      )}
                      <Icon
                        className={`size-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* ── Right Content Area ── */}
          <div className="flex-1 w-full">
            {/* ────────────────────────────────────────────────────────
                TAB 1: DASHBOARD
                ──────────────────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-10 md:p-16 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xs animate-fade-in">
                {/* Circular light cyan icon with ! */}
                <div className="size-20 rounded-full bg-[#e0f2fe] dark:bg-sky-950/70 flex items-center justify-center">
                  <span className="text-[#38bdf8] font-bold text-4xl select-none leading-none">!</span>
                </div>

                <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                  No Data Available
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  There is no data available for user dashboard
                </p>

                <Link href="/courses" className="mt-6">
                  <Button
                    variant="outline"
                    className="rounded-xl border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-6 py-2.5 font-semibold text-sm transition"
                  >
                    Enroll in a course
                  </Button>
                </Link>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 2: ACCOUNT (matching Screenshots 1 & 2)
                ──────────────────────────────────────────────────────── */}
            {activeTab === 'account' && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-6 md:p-8 shadow-2xs animate-fade-in text-left">
                {/* Header: <- Your Profile */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="flex items-center gap-2 text-sky-500 hover:text-sky-600 font-bold text-base transition-colors"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Your Profile</span>
                  </button>
                  {saveSuccessMsg && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full animate-fade-in">
                      <CheckCircle2 className="size-3.5" />
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveAccount} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (Inputs) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Full Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                        />
                        <Scan className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-sky-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Email
                        </label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="-"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251934551781"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                    </div>

                    {/* Birth Date & Gender Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Birth Date
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="flex-1 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                          />
                          {/* Calendar Type Pill Buttons: E.C & G.C (matching Screenshot 1) */}
                          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shrink-0 bg-muted/40">
                            <button
                              type="button"
                              onClick={() => setCalendarType('EC')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                calendarType === 'EC'
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-foreground'
                              }`}
                            >
                              E.C
                            </button>
                            <button
                              type="button"
                              onClick={() => setCalendarType('GC')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                calendarType === 'GC'
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-foreground'
                              }`}
                            >
                              G.C
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full h-11 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 transition"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Country & City Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Country"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>
                    </div>

                    {/* Address * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your residential / work address"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background p-3 text-sm text-foreground outline-none focus:border-sky-500 transition"
                      />
                    </div>

                    {/* Preferred Language * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Language <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={preferredLanguage}
                          onChange={(e) => setPreferredLanguage(e.target.value)}
                          className="w-full h-11 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-3.5 pr-10 text-sm text-foreground outline-none focus:border-sky-500 transition"
                        >
                          <option value="Amharic">Amharic (አማርኛ)</option>
                          <option value="English">English</option>
                          <option value="Afaan Oromoo">Afaan Oromoo</option>
                          <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Save Button (Screenshot 2) */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-7 py-2.5 font-semibold text-sm transition shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Avatar Upload (Screenshots 1 & 2) */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <span className="self-start text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Avatar
                    </span>

                    {/* Circular Upload Box matching Screenshot 1 */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="size-44 md:size-52 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="size-full object-cover rounded-full"
                        />
                      ) : (
                        <>
                          <User className="size-16 text-sky-400 stroke-1 mb-2" />
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[120px] leading-tight">
                            Click here or drag image to add
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                            className="mt-3 rounded-lg border border-sky-400 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-3.5 py-1 text-xs font-semibold transition"
                          >
                            Select File
                          </button>
                        </>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 3: PURCHASE HISTORY (matching Screenshot 3)
                ──────────────────────────────────────────────────────── */}
            {activeTab === 'purchase' && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-10 md:p-16 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xs animate-fade-in">
                {/* Circular light cyan icon with ! matching Screenshot 3 */}
                <div className="size-20 rounded-full bg-[#e0f2fe] dark:bg-sky-950/70 flex items-center justify-center">
                  <span className="text-[#38bdf8] font-bold text-4xl select-none leading-none">!</span>
                </div>

                {/* Title matching Screenshot 3: No Data Available */}
                <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
                  No Data Available
                </h2>

                {/* Subtitle matching Screenshot 3: There is no data available for purchased course. */}
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  There is no data available for purchased course.
                </p>

                {/* Button matching Screenshot 3: Start Purchasing */}
                <Link href="/courses" className="mt-6">
                  <Button
                    variant="outline"
                    className="rounded-xl border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-6 py-2.5 font-semibold text-sm transition"
                  >
                    Start Purchasing
                  </Button>
                </Link>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────
                TAB 4: SECURITY (matching Screenshots 4 & 5)
                ──────────────────────────────────────────────────────── */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-fade-in text-left">
                {securitySuccessMsg && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    {securitySuccessMsg}
                  </div>
                )}

                {/* Card 1: Change Password (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Change Password
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'password' ? null : 'password')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'password' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content (Screenshot 5) */}
                  {expandedCard === 'password' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Old password
                        </label>
                        <input
                          type="text"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="0934551781"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 pr-10 text-xs text-foreground outline-none focus:border-sky-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Password')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Card 2: Change Your Phone Number (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Change Your Phone Number
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'phone' ? null : 'phone')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'phone' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content (Screenshot 5) */}
                  {expandedCard === 'phone' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Current Phone Number
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentPhone}
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-muted/40 px-3 text-xs text-muted-foreground outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New Phone Number
                        </label>
                        <input
                          type="text"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="0934551781"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Phone Number')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Card 3: Add Your Email Address (Screenshots 4 & 5) */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-5 md:p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      Add Your Email Address
                    </h3>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 'email' ? null : 'email')
                      }
                      className="rounded-md border border-[#38bdf8] text-[#0284c7] hover:bg-sky-50 dark:hover:bg-sky-950/40 px-4 py-1 text-xs font-semibold transition"
                    >
                      {expandedCard === 'email' ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedCard === 'email' && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 max-w-xl animate-fade-in">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20 px-3 text-xs text-foreground outline-none focus:border-sky-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveSecurity('Email Address')}
                        className="rounded-md bg-[#00adef] hover:bg-[#0096ce] text-white px-6 py-2 text-xs font-semibold transition mt-2 shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  )
}
