'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Check,
  Copy,
  Lock,
  Loader2,
  Video,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Smartphone,
  Building2,
  CheckCircle2,
  Clock,
  UserCheck,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type PurchaseResourceData = {
  id: string
  title: string
  subtitle?: string | null
  category?: string
  format: string
  price: string
  priceETB: number
  instructor?: string | null
}

const PAYMENT_METHODS = {
  telebirr: {
    id: 'telebirr',
    name: 'Telebirr SuperApp',
    shortName: 'Telebirr',
    accountName: 'Hello Technology (ሄሎ ቴክኖሎጂ ማሰልጠኛ)',
    accountNumber: '0947747070',
    secondaryAccount: '0982484328',
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  cbe: {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    shortName: 'CBE Mobile Banking',
    accountName: 'Hello Technology (Hailu B.)',
    accountNumber: '1000535826033',
    color: 'from-purple-700 to-indigo-800',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  boa: {
    id: 'boa',
    name: 'Bank of Abyssinia (BOA)',
    shortName: 'Abyssinia Bank',
    accountName: 'Hello Technology (ሄሎ ቴክኖሎጂ ማሰልጠኛ)',
    accountNumber: '8492019384',
    color: 'from-amber-600 to-orange-700',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
} as const

type PaymentMethodKey = keyof typeof PAYMENT_METHODS

export function DigitalPurchaseModal({
  resource,
  isOpen,
  onClose,
}: {
  resource: PurchaseResourceData | null
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('telebirr')
  const [transactionRef, setTransactionRef] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Student auth state
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [loadingStudent, setLoadingStudent] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Success state
  const [successResult, setSuccessResult] = useState<{
    purchase: any
    student: any
    isNew: boolean
    message: string
  } | null>(null)

  // Check if student is already logged in
  useEffect(() => {
    if (!isOpen) {
      setSuccessResult(null)
      setErrorMsg(null)
      return
    }

    let isMounted = true
    async function checkAuth() {
      setLoadingStudent(true)
      try {
        const res = await fetch('/api/student/me')
        if (res.ok) {
          const data = await res.json()
          if (data.student && isMounted) {
            setCurrentStudent(data.student)
            setFullName(data.student.fullName || '')
            setPhone(data.student.phone || '')
            setEmail(data.student.personalEmail || data.student.institutionalEmail || '')
          }
        }
      } catch {}
      if (isMounted) setLoadingStudent(false)
    }

    checkAuth()
    return () => {
      isMounted = false
    }
  }, [isOpen])

  const handleLogoutAndSwitchAccount = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/student/logout', { method: 'POST' })
      setCurrentStudent(null)
      setFullName('')
      setPhone('')
      setEmail('')
      setPassword('')
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      setLoggingOut(false)
    }
  }

  if (!isOpen || !resource) return null

  const isVideo = (resource.format || '').toLowerCase().includes('video')
  const isFree = resource.priceETB === 0
  const activeMethod = PAYMENT_METHODS[paymentMethod]

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!currentStudent) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg('Please enter your full student name')
        return
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setErrorMsg('Please enter a valid Ethiopian phone number (e.g. 09... or 07...)')
        return
      }
    }

    if (!isFree && (!transactionRef.trim() || transactionRef.trim().length < 4)) {
      setErrorMsg('Please provide your Telebirr / Bank transaction reference code or receipt ID.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/student/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          paymentMethod,
          transactionRef: transactionRef.trim() || `TXN-${Date.now().toString().slice(-6)}`,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          password: password.trim() || 'Hello@2026',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process digital order')
      }

      setSuccessResult({
        purchase: data.purchase,
        student: data.student,
        isNew: data.isNewStudent,
        message: data.message,
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong processing your order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleProceedToDashboard = () => {
    onClose()
    // Hard navigate to ensure cookies and student profile are freshly loaded
    window.location.href = '/student/dashboard?tab=selflearning'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-2xl rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl animate-scale-in max-h-[92vh] flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* ─── SUCCESS SCREEN ─── */}
        {successResult ? (
          <div className="py-6 text-center space-y-5 animate-fade-in">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-lg">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {isFree ? 'Instant Unlock Complete' : 'Order Received & Awaiting Approval'}
              </span>
              <h2 className="mt-3 text-2xl font-black text-foreground">
                {isFree ? 'Resource Unlocked Successfully!' : 'Payment Receipt Submitted!'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {isFree
                  ? 'Your digital learning material is permanently available in your student portal.'
                  : 'Your payment verification has been forwarded to our admissions desk. Once approved, your course will unlock immediately.'}
              </p>
            </div>

            {/* Account Credentials Card */}
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                  <UserCheck className="size-4 text-blue-600 dark:text-sky-400" />
                  Student Portal Account
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {successResult.isNew ? 'New Account Created' : 'Linked Account'}
                </span>
              </div>
              <div className="space-y-1.5 text-muted-foreground pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px]">Student Name:</span>
                  <span className="font-bold text-foreground">{successResult.student.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px]">Student ID:</span>
                  <span className="font-mono font-bold text-foreground">{successResult.student.studentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px]">Portal Email:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-sky-400 truncate max-w-[220px]">
                    {successResult.student.institutionalEmail}
                  </span>
                </div>
                {successResult.student.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-[11px]">Phone:</span>
                    <span className="font-mono font-semibold text-foreground">{successResult.student.phone}</span>
                  </div>
                )}
              </div>
              {!isFree && (
                <div className="pt-2 border-t text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                  <Clock className="size-3.5 shrink-0" />
                  Status: <strong>Waiting for Admin Approval</strong> (approx. 5–15 mins)
                </div>
              )}
            </div>

            <div className="pt-3">
              <Button
                onClick={handleProceedToDashboard}
                className="w-full max-w-md rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Go to My Student Dashboard ({successResult.student.fullName.split(' ')[0]}) <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* ─── CHECKOUT & PAYMENT FORM ─── */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header with Resource Preview */}
            <div className="flex items-start gap-4 pb-5 border-b">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20 shadow-sm">
                {isVideo ? <Video className="size-6" /> : <BookOpen className="size-6" />}
              </div>
              <div className="flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                    {resource.category || 'Online Course'}
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20">
                    {resource.format}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl font-bold text-foreground leading-snug">
                  {resource.title}
                </h2>
                {resource.subtitle && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{resource.subtitle}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-extrabold text-blue-600 dark:text-sky-400 font-mono text-base">
                    {isFree ? 'Free Gift' : `${resource.priceETB} ETB`}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Lock className="size-3" /> In-Platform Learning Studio
                  </span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── Section 1: Student Identity ── */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-blue-600" />
                  1. Student Account &amp; DRM License Ownership
                </h3>
                {currentStudent ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ● Logged in
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    Instant Auto-Registration
                  </span>
                )}
              </div>

              {currentStudent ? (
                <div className="rounded-xl border border-emerald-500/30 bg-card p-3.5 text-xs space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                        {currentStudent.fullName}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        Student ID: <span className="font-bold text-foreground">{currentStudent.studentId}</span> • {currentStudent.phone}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {currentStudent.institutionalEmail}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ✓ Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                    <span className="text-muted-foreground">
                      This purchase will be saved to this portal account.
                    </span>
                    <button
                      type="button"
                      onClick={handleLogoutAndSwitchAccount}
                      disabled={loggingOut}
                      className="font-bold text-destructive hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {loggingOut ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-3" />}
                      Not you? Switch / Buy as new user
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-2.5 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <Sparkles className="size-4 shrink-0 text-blue-600 dark:text-sky-400 mt-0.5" />
                    <div>
                      <span className="font-bold">No prior account needed!</span> Enter your full name and phone number. An official student portal account and DRM license will be generated for you instantly.
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Full Name (የተማሪው ሙሉ ስም) *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Abebe Bekele"
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Phone Number (Telebirr Number) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0947747070"
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Personal Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. student@gmail.com"
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Portal Password (Optional)
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Default: Hello@2026"
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground text-right pt-0.5">
                    Already enrolled student?{' '}
                    <a
                      href="/student/login"
                      target="_blank"
                      className="font-bold text-blue-600 dark:text-sky-400 hover:underline"
                    >
                      Log in here &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 2: Payment Process (Like Course Payment) ── */}
            {!isFree ? (
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Smartphone className="size-4 text-emerald-600" />
                    2. Payment Method &amp; Tuition Deposit ({resource.priceETB} ETB)
                  </h3>
                </div>

                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PAYMENT_METHODS) as PaymentMethodKey[]).map((key) => {
                    const m = PAYMENT_METHODS[key]
                    const isSelected = paymentMethod === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaymentMethod(key)}
                        className={`rounded-xl border p-2.5 text-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold shadow-xs scale-[1.02]'
                            : 'border-border/80 bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="block text-xs truncate">{m.shortName}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Bank Account Details Display */}
                <div className="rounded-xl border border-blue-500/20 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Deposit Account ({activeMethod.name})
                      </span>
                      <p className="text-sm font-black text-foreground mt-0.5">
                        {activeMethod.accountName}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-600 dark:text-sky-400">
                      Amount: {resource.priceETB} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-2.5 font-mono text-xs">
                    <span className="font-bold text-foreground text-sm tracking-wider">
                      {activeMethod.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeMethod.accountNumber, 'acc')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-500 px-2 py-1 rounded-lg bg-blue-500/10"
                    >
                      {copiedKey === 'acc' ? (
                        <>
                          <Check className="size-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Instructions */}
                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1">
                    <p>1. Open your <strong>{activeMethod.name}</strong> app or mobile banking.</p>
                    <p>2. Transfer <strong>{resource.priceETB} ETB</strong> to account <strong>{activeMethod.accountNumber}</strong>.</p>
                    <p>3. Copy the SMS / Bank Confirmation transaction code and enter it below:</p>
                  </div>

                  {/* Transaction Ref Input */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-foreground block mb-1">
                      Transaction Reference Number / Receipt Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. FT2610... or Telebirr Trans ID (from SMS)"
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-mono font-bold outline-none focus:border-blue-500 uppercase"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  This resource is a <strong>Free Gift</strong> provided by Hello Technology Training Center. No payment or transaction code is required. Click below to unlock immediate access on your student dashboard.
                </span>
              </div>
            )}

            {/* DRM Protection Notice */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Lock className="size-3.5 text-blue-500 shrink-0" />
              <span>
                Protected DRM format: Studied in-platform only with floating student watermark (no downloads).
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-md shadow-blue-600/25"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing Order...
                  </>
                ) : isFree ? (
                  <>
                    Claim Free Access <ArrowRight className="size-4 ml-1.5" />
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4 mr-2" />
                    Submit Payment &amp; Wait for Approval ({resource.priceETB} ETB)
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
