'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Check,
  CheckCircle2,
  Copy,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  Sparkles,
  UploadCloud,
  FileText,
  X,
  Phone,
  Mail,
  User,
  Clock,
  BookOpen,
  Calendar,
  Send,
  MessageCircle,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type RegistrationCourseOption = {
  id: string
  title: string
  category?: string
  price?: string | null
}

interface CourseRegistrationWizardProps {
  courses: RegistrationCourseOption[]
  initialCourseId?: string
}

type PaymentPlan = 'full' | 'split'
type PaymentMethodKey = 'cbe' | 'telebirr' | 'boa'

const PAYMENT_METHODS: Record<
  PaymentMethodKey,
  {
    id: PaymentMethodKey
    name: string
    shortName: string
    accountName: string
    accountNumber: string
    badgeColor: string
    note?: string
  }
> = {
  cbe: {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    shortName: 'CBE',
    accountName: 'Hello TVET (Hailu B.)',
    accountNumber: '1000535826033',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  telebirr: {
    id: 'telebirr',
    name: 'Telebirr SuperApp',
    shortName: 'Telebirr',
    accountName: 'Hello TVET (ሄሎ የቴክኒክና ሙያ)',
    accountNumber: '0947747070',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    note: 'Telebirr: 09 47 74 70 70 / 09 82 48 43 28',
  },
  boa: {
    id: 'boa',
    name: 'Bank of Abyssinia (BOA)',
    shortName: 'Abyssinia',
    accountName: 'Hello TVET (ሄሎ የቴክኒክና ሙያ)',
    accountNumber: '8492019384',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
}

const SHIFT_OPTIONS = [
  {
    id: 'morning',
    title: 'Morning Shift',
    time: '8:30 AM – 12:00 PM',
    days: 'Monday – Friday',
  },
  {
    id: 'afternoon',
    title: 'Afternoon Shift',
    time: '1:30 PM – 5:00 PM',
    days: 'Monday – Friday',
  },
  {
    id: 'saturday',
    title: 'Saturday Intensive',
    time: '9:00 AM – 4:30 PM',
    days: 'Every Saturday',
  },
]

const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
]

const EXPERIENCE_YEARS = [
  'None',
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5+ years',
]

export function CourseRegistrationWizard({
  courses,
  initialCourseId,
}: CourseRegistrationWizardProps) {
  // Step tracker (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Step 1: Basic Info
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(
    initialCourseId || (courses.length > 0 ? courses[0].title : 'Mobile Phone Repair & Maintenance')
  )
  const [selectedShift, setSelectedShift] = useState('morning')
  const [preferredContact, setPreferredContact] = useState('Phone Call')

  const formatPreviewEmail = (name: string): string => {
    const parts = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
    const first = parts[0] || 'student'
    const father = parts[1] || (parts.length > 2 ? parts[parts.length - 1] : 'tvet')
    return `${first}.${father}@hellotvet.edu.et`
  }

  // Step 2: Content Sharing & Community Policy
  const [policyAccepted, setPolicyAccepted] = useState(false)

  // Step 3: Educational Background
  const [highestEducation, setHighestEducation] = useState('')
  const [experienceYears, setExperienceYears] = useState('')

  // Step 4: Payment
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('cbe')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')

  // Step 5: Confirmation
  const [transactionRef, setTransactionRef] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')
  const [receiptFileName, setReceiptFileName] = useState('')
  const [receiptUploading, setReceiptUploading] = useState(false)
  const [confirmationLink, setConfirmationLink] = useState('')

  // Submission & UI States
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registrationId, setRegistrationId] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pricing calculations
  // Default base price: 2999 Birr
  const basePrice = 2999
  const planDiscountPercent = paymentPlan === 'full' ? 10 : 0
  const planDiscountAmount = Math.round((basePrice * planDiscountPercent) / 100)
  const priceAfterPlan = basePrice - planDiscountAmount
  const finalPrice = Math.max(0, priceAfterPlan - couponDiscount)

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    if (code === 'HELLO10' || code === 'WELCOME10' || code === 'GTST10') {
      const discount = Math.round(priceAfterPlan * 0.1)
      setCouponDiscount(discount)
      setCouponApplied(true)
      setCouponMessage(`Coupon applied: 10% extra discount (-${discount} Birr)`)
    } else if (code === 'EARLYBIRD') {
      const discount = 200
      setCouponDiscount(discount)
      setCouponApplied(true)
      setCouponMessage(`Early Bird discount applied: -${discount} Birr`)
    } else {
      setCouponApplied(false)
      setCouponDiscount(0)
      setCouponMessage('Invalid coupon code. Try WELCOME10')
    }
  }

  // Receipt File upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setValidationError('File exceeds the 5MB size limit.')
      return
    }

    setReceiptUploading(true)
    setValidationError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload receipt')
      }

      setReceiptUrl(data.url)
      setReceiptFileName(file.name)
    } catch (err: any) {
      console.error(err)
      setValidationError(err.message || 'Error uploading file')
    } finally {
      setReceiptUploading(false)
    }
  }

  // Validation before step change
  const validateStep = (step: number): boolean => {
    setValidationError(null)

    if (step === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setValidationError('Please enter your full name (at least 2 characters).')
        return false
      }
      if (!phone.trim() || phone.trim().length < 9) {
        setValidationError('Please enter a valid phone number (at least 9 digits).')
        return false
      }
      if (!password.trim() || password.trim().length < 6) {
        setValidationError('Please choose a student portal password (at least 6 characters) so you can log into your student dashboard.')
        return false
      }
      if (!selectedCourse) {
        setValidationError('Please choose a course.')
        return false
      }
      return true
    }

    if (step === 2) {
      if (!policyAccepted) {
        setValidationError('You must read and accept the Content Sharing & Community Policy to proceed.')
        return false
      }
      return true
    }

    if (step === 3) {
      if (!highestEducation) {
        setValidationError('Please select your highest education level.')
        return false
      }
      if (!experienceYears) {
        setValidationError('Please select your years of professional experience.')
        return false
      }
      return true
    }

    if (step === 4) {
      if (!paymentPlan) {
        setValidationError('Please select a payment plan.')
        return false
      }
      if (!paymentMethod) {
        setValidationError('Please select a payment method.')
        return false
      }
      return true
    }

    return true
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setValidationError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  // Final Submission
  const handleSubmitRegistration = async () => {
    if (!validateStep(5)) return

    if (!transactionRef.trim() && !receiptUrl && !confirmationLink.trim()) {
      setValidationError(
        'Please provide at least a Transaction Reference Number, receipt upload, or payment confirmation link.'
      )
      return
    }

    setSubmitting(true)
    setValidationError(null)

    const shiftLabel =
      SHIFT_OPTIONS.find((s) => s.id === selectedShift)?.title || selectedShift

    const paymentMethodLabel = PAYMENT_METHODS[paymentMethod]?.name || paymentMethod

    const contactMethodLabel =
      preferredContact === 'Telegram' && telegramUsername
        ? `Telegram (${telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}`})`
        : preferredContact

    const structuredMessage = [
      '📋 COURSE REGISTRATION APPLICATION',
      `• Course: ${selectedCourse}`,
      `• Shift: ${shiftLabel}`,
      `• Preferred Contact: ${contactMethodLabel}`,
      `• Telegram Handle: ${telegramUsername ? (telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}`) : 'Not provided'}`,
      `• Education Level: ${highestEducation}`,
      `• Professional Experience: ${experienceYears}`,
      '',
      '💳 PAYMENT SUMMARY:',
      `• Plan: ${paymentPlan === 'full' ? 'Pay once and unlock full access (10% Discount)' : 'Pay in two parts with limited features'}`,
      `• Total Fee: ${finalPrice} Birr ${couponApplied ? `(Coupon applied: -${couponDiscount} Birr)` : ''}`,
      `• Payment Method: ${paymentMethodLabel}`,
      `• Transaction Reference: ${transactionRef || 'N/A'}`,
      `• Receipt Upload: ${receiptUrl || 'None provided'}`,
      `• Confirmation Link: ${confirmationLink || 'None provided'}`,
      `• Content & Community Policy Accepted: Yes`,
    ].join('\n')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email || undefined,
          phone,
          password: password.trim() || undefined,
          telegramUsername: telegramUsername ? (telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}`) : undefined,
          courseTitle: selectedCourse,
          shift: shiftLabel,
          education: highestEducation,
          experienceYears,
          paymentPlan,
          paymentMethod: paymentMethodLabel,
          basePrice,
          discount: planDiscountAmount + couponDiscount,
          finalPrice,
          couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
          transactionRef: transactionRef.trim() || undefined,
          receiptUrl: receiptUrl || undefined,
          confirmationLink: confirmationLink.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration')
      }

      setRegistrationId(data.registrationNumber || data.id || `HS-${Date.now().toString().slice(-6)}`)
      setCreatedEmail(data.institutionalEmail || formatPreviewEmail(fullName))
      setSubmitted(true)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } catch (err: any) {
      console.error(err)
      setValidationError(err.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Step definitions
  const stepsList = [
    { num: 1, label: 'BASIC INFO' },
    { num: 2, label: 'Content Sharing & Community Policy' },
    { num: 3, label: 'BACKGROUND' },
    { num: 4, label: 'PAYMENT' },
    { num: 5, label: 'CONFIRMATION' },
  ]

  // Success view
  if (submitted) {
    return (
      <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-xl text-center max-w-3xl mx-auto animate-fade-in-up">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400">
          <CheckCircle2 className="size-10" />
        </div>
        <span className="mt-4 inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-600 dark:text-sky-400">
          Registration Submitted
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
          Welcome to ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET), {fullName.split(' ')[0]}!
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-6">
          Your course registration application and payment verification have been received. Our admissions
          office is validating your cohort intake enrollment.
        </p>

        <div className="mt-8 rounded-2xl border bg-muted/30 p-6 text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b text-sm">
            <span className="text-muted-foreground">Application ID:</span>
            <span className="font-mono font-bold text-primary">{registrationId}</span>
          </div>

          {/* Student Account Credentials Box */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-sky-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="size-4" /> Official Student Account Created
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm pt-1">
              <span className="text-muted-foreground">Student Portal Email:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-sky-400">
                {createdEmail || formatPreviewEmail(fullName)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Portal Password:</span>
              <span className="font-semibold text-foreground">•••••••• (Your chosen password)</span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1 border-t border-blue-500/20">
              Use this institutional email and your chosen password to log into your student dashboard anytime.
            </p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Enrolled Course:</span>
            <span className="font-semibold text-foreground">{selectedCourse}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Cohort Shift:</span>
            <span className="font-semibold text-foreground">
              {SHIFT_OPTIONS.find((s) => s.id === selectedShift)?.title}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Payment Plan:</span>
            <span className="font-semibold text-foreground">
              {paymentPlan === 'full' ? 'Full Access (10% Discount)' : 'Two-Part Installment'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-blue-600 dark:text-sky-400">{finalPrice} Birr</span>
          </div>
          {telegramUsername && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Telegram Handle:</span>
              <span className="font-semibold text-blue-600 dark:text-sky-400">
                {telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}`}
              </span>
            </div>
          )}
          {transactionRef && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Transaction Reference:</span>
              <span className="font-mono text-xs">{transactionRef}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/student/dashboard">
            <Button className="w-full sm:w-auto rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">
              <Sparkles className="mr-2 size-4" /> Access Student Dashboard
            </Button>
          </Link>
          <a href="https://t.me/helloschool_et" target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl">
              <Send className="mr-2 size-4" /> Connect with Admissions on Telegram
            </Button>
          </a>
          <Link href="/courses">
            <Button variant="ghost" className="w-full sm:w-auto rounded-xl">
              <ArrowLeft className="mr-2 size-4" /> Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border bg-card shadow-2xl overflow-hidden transition-all duration-300">
      {/* ─── Top Header & Progress Stepper ─── */}
      <div className="border-b bg-muted/20 px-6 py-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase text-foreground">
              Course Registration
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure your seat for the upcoming technical cohort intake.
            </p>
            {/* Flyer Promotions & Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <Sparkles className="size-3" /> በነፃ፦ ከ2 በላይ ሲመዘገቡ 1 በነፃ! (2+1 Free Offer)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-sky-400 border border-blue-500/20">
                <ShieldCheck className="size-3" /> ሙሉ ዕውቅና ያለው & COC Level Aligned
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Progress Bar Line */}
        <div className="relative mt-6">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step Labels */}
          <div className="mt-3 hidden md:grid grid-cols-5 text-center text-xs font-semibold">
            {stepsList.map((step) => {
              const isPast = step.num < currentStep
              const isCurrent = step.num === currentStep
              return (
                <div
                  key={step.num}
                  className={`flex items-center justify-center gap-1.5 transition-colors ${
                    isCurrent
                      ? 'text-blue-600 dark:text-sky-400 font-bold'
                      : isPast
                        ? 'text-foreground'
                        : 'text-muted-foreground opacity-60'
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                        : isPast
                          ? 'bg-blue-500/20 text-blue-600 dark:text-sky-400'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isPast ? <Check className="size-3" /> : step.num}
                  </span>
                  <span className="truncate">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Main Form Step Content ─── */}
      <div className="p-6 md:p-10">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Basic Information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your contact details and select the training cohort you want to join.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Full Name *
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Phone Number *
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0911234567 or +251 9..."
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Telegram Username
                <div className="relative">
                  <Send className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-sky-500" />
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="e.g. @username"
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Your Telegram handle for cohort admissions & schedule notifications
                </span>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Email Address (Optional)
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abebe@example.com"
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  For receipts and enrollment documentation
                </span>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Create Portal Password *
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-sky-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters (e.g. Pass@123)"
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Choose a password to log into your student dashboard & course resources
                </span>
              </label>

              {/* Dynamic Institutional Email Preview */}
              {fullName.trim().length >= 2 && (
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 md:col-span-2 flex items-start gap-3.5 animate-fade-in shadow-sm">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-sky-400">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-sky-300">
                        Official Student Portal Email (Auto-Generated)
                      </span>
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-sky-300">
                        Hello TVET Institutional ID
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-sm sm:text-base font-bold text-foreground">
                      {formatPreviewEmail(fullName)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Your institutional account will be created automatically with this email. You will use it with your chosen password to access your Student Dashboard.
                    </p>
                  </div>
                </div>
              )}

              <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
                Select Course Track *
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background/90 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    {courses.length === 0 && (
                      <option value="Mobile Phone Repair & Maintenance">
                        Mobile Phone Repair & Maintenance
                      </option>
                    )}
                  </select>
                </div>
              </label>
            </div>

            {/* Shift Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Preferred Cohort Shift *
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {SHIFT_OPTIONS.map((shift) => {
                  const selected = selectedShift === shift.id
                  return (
                    <button
                      key={shift.id}
                      type="button"
                      onClick={() => setSelectedShift(shift.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        selected
                          ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-500/30'
                          : 'border-border/80 bg-muted/20 hover:border-blue-500/40 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-foreground">{shift.title}</span>
                        {selected && <CheckCircle2 className="size-4 text-blue-600 dark:text-sky-400" />}
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">{shift.time}</p>
                      <span className="mt-1 block text-[11px] font-medium text-blue-600 dark:text-sky-400">
                        {shift.days}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
              <div className="flex flex-wrap gap-2">
                {['Phone Call', 'Telegram', 'WhatsApp'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold border transition ${
                      preferredContact === method
                        ? 'border-blue-600 bg-blue-500/15 text-blue-600 dark:text-sky-400'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content Sharing & Community Policy */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Content Sharing & Community Policy</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET) is dedicated to high-standard practical trade training. Please read and accept our
                workshop safety and curriculum guidelines.
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-5 md:p-6 space-y-5 text-sm leading-6 max-h-[360px] overflow-y-auto">
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-blue-600 dark:text-sky-400" />
                  1. Proprietary Course Content & Technical Schematics
                </h3>
                <p className="mt-1 text-xs text-muted-foreground pl-6">
                  All laboratory handouts, motherboard boardview files, micro-soldering schematics, and video
                  recordings provided during your cohort are intellectual property of ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET). Reproduction,
                  redistribution, or unauthorized resale without explicit written consent is strictly prohibited.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-blue-600 dark:text-sky-400" />
                  2. Laboratory Safety & Workstation Protocols
                </h3>
                <p className="mt-1 text-xs text-muted-foreground pl-6">
                  Trainees must adhere strictly to workshop ESD (Electrostatic Discharge) grounding, safe hot-air
                  rework temperatures, thermal mat care, and chemical ventilation procedures. Protective eyewear
                  must be worn during desoldering exercises.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="size-4 text-blue-600 dark:text-sky-400" />
                  3. Community Respect & Peer Mentorship
                </h3>
                <p className="mt-1 text-xs text-muted-foreground pl-6">
                  ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET) promotes collaborative peer problem-solving. All trainees are expected to treat
                  instructors, lab assistants, and classmates with mutual respect, constructive communication, and
                  professional trade etiquette.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-sky-400" />
                  4. Technical Assessment & Certification Integrity
                </h3>
                <p className="mt-1 text-xs text-muted-foreground pl-6">
                  The ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET) Certificate of Technical Competence requires personal, verified completion of
                  hands-on diagnostic milestones. Plagiarism or proxy project submission is not permitted.
                </p>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <label className="flex items-start gap-3 rounded-2xl border p-4 bg-card hover:bg-muted/30 cursor-pointer transition">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="mt-1 size-5 rounded accent-blue-600 cursor-pointer shrink-0"
              />
              <span className="text-sm font-medium text-foreground">
                I have read, understood, and agree to ሄሎ የቴክኒክና ሙያ ማሰልጠኛ (Hello TVET)&apos;s Content Sharing & Community Policy.
              </span>
            </label>
          </div>
        )}

        {/* Step 3: BACKGROUND (Educational Background) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Educational Background</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your background so our workshop instructors can customize hands-on mentoring to your
                experience level.
              </p>
            </div>

            <div className="space-y-6">
              {/* Field 1: Highest Education Level */}
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Highest Education Level *
                <div className="relative">
                  <select
                    value={highestEducation}
                    onChange={(e) => setHighestEducation(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-input bg-background/90 px-4 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="">Select your education level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>

              {/* Field 2: Years of Professional Experience */}
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Years of Professional Experience *
                <div className="relative">
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-input bg-background/90 px-4 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="">Select your experience</option>
                    {EXPERIENCE_YEARS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: PAYMENT (Payment Information) */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Payment Information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please Select a Payment Plan and Method. The final price will be calculated based on your selections
                and any applicable discounts.
              </p>
            </div>

            {/* Plan Cards Comparison */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Select Your Payment Plan *
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                {/* Plan 1: Full Access */}
                <div
                  onClick={() => setPaymentPlan('full')}
                  className={`relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                    paymentPlan === 'full'
                      ? 'border-blue-600 bg-blue-500/5 ring-2 ring-blue-500/30 shadow-md'
                      : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground">
                      Pay once and unlock full access
                    </h3>
                    <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-sky-400">
                      10% Discount
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-sm line-through text-muted-foreground">
                      {basePrice} Birr
                    </span>
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-sky-400">
                      {priceAfterPlan} Birr
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Full 4-Month Course Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Lifetime Class Record & Schematics Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Lifetime Learning Module Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Lifetime Learning Community Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Private Access to Mentors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-foreground">
                        One-Time Payment, Full Access Guaranteed
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Plan 2: Two-Part Installment */}
                <div
                  onClick={() => setPaymentPlan('split')}
                  className={`relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                    paymentPlan === 'split'
                      ? 'border-blue-600 bg-blue-500/5 ring-2 ring-blue-500/30 shadow-md'
                      : 'border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground">
                      Pay in two parts with limited features
                    </h3>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      No Discount
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {basePrice} Birr
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      (each 1500 Birr)
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>2-Month Access Per Payment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span>Private Access to Mentors</span>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <X className="size-4 text-rose-500 shrink-0" />
                      <span>Classroom Access Only While Paid</span>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <X className="size-4 text-rose-500 shrink-0" />
                      <span>Module Access Only While Paid</span>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <X className="size-4 text-rose-500 shrink-0" />
                      <span>Community Access Only While Paid</span>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <X className="size-4 text-rose-500 shrink-0" />
                      <span>Removed if Second Payment Not Made</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Method Dropdown & Account Box */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Payment Method *</label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodKey)}
                  className="h-12 w-full appearance-none rounded-xl border border-input bg-background/90 px-4 pr-10 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="telebirr">Telebirr SuperApp</option>
                  <option value="boa">Bank of Abyssinia (BOA)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              {/* Bank Account Details Card */}
              {PAYMENT_METHODS[paymentMethod] && (
                <div className="rounded-2xl border bg-muted/20 p-5 space-y-4 transition-all">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold ${PAYMENT_METHODS[paymentMethod].badgeColor}`}
                    >
                      {PAYMENT_METHODS[paymentMethod].shortName}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {PAYMENT_METHODS[paymentMethod].name}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    {/* Account Name */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                      <div>
                        <span className="block text-muted-foreground font-medium">Account Name</span>
                        <span className="font-semibold text-foreground">
                          {PAYMENT_METHODS[paymentMethod].accountName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(PAYMENT_METHODS[paymentMethod].accountName, 'accountName')
                        }
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        title="Copy account name"
                      >
                        {copiedKey === 'accountName' ? (
                          <span className="text-[11px] font-bold text-emerald-500">Copied!</span>
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                      <div>
                        <span className="block text-muted-foreground font-medium">
                          {PAYMENT_METHODS[paymentMethod].note || 'Account Number'}
                        </span>
                        <span className="font-mono font-bold text-foreground tracking-wider text-sm">
                          {PAYMENT_METHODS[paymentMethod].accountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(PAYMENT_METHODS[paymentMethod].accountNumber, 'accountNumber')
                        }
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        title="Copy account number"
                      >
                        {copiedKey === 'accountNumber' ? (
                          <span className="text-[11px] font-bold text-emerald-500">Copied!</span>
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Code Section */}
            <div>
              <label className="block text-sm font-semibold mb-2">Coupon Code (optional)</label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code if you have one"
                  className="h-11 flex-1 rounded-xl border border-input bg-background/90 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 uppercase"
                />
                <Button type="submit" variant="outline" className="rounded-xl px-5">
                  Apply
                </Button>
              </form>
              {couponMessage && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    couponApplied ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 5: CONFIRMATION (Payment Confirmation) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Payment Confirmation</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Provide proof of payment to finalize your registration and secure your cohort seat.
              </p>
            </div>

            {/* Info / Notice Banner */}
            <div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-4 sm:p-5 text-sm">
              <div className="flex gap-3">
                <AlertCircle className="size-5 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground">Payment Verification:</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    To complete your registration, please provide evidence of your payment. You can upload a
                    screenshot of your receipt, or provide a payment link or transaction reference.
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Reference Number */}
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Transaction Reference Number
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g., FT2123456789 or Telebirr Trans ID"
                className="h-11 rounded-xl border border-input bg-background/90 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            {/* Upload Payment Receipt */}
            <div>
              <label className="block text-sm font-semibold mb-2">Upload Payment Receipt</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0])
                  }
                }}
              />

              {!receiptUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0])
                    }
                  }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                    receiptUploading
                      ? 'opacity-60 border-blue-500 bg-blue-500/5'
                      : 'border-border/80 hover:border-blue-500 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400">
                    <UploadCloud className="size-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {receiptUploading ? 'Uploading file...' : 'Drop file here or click to upload'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    (Max size: 5MB, Formats: JPG, PNG, PDF)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-sky-400">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground truncate max-w-xs sm:max-w-md">
                        {receiptFileName || 'payment-receipt.jpg'}
                      </p>
                      <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                        <Check className="size-3" /> Uploaded successfully
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptUrl('')
                      setReceiptFileName('')
                    }}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    title="Remove file"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Payment Confirmation Link */}
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Payment Confirmation Link (optional)
              <input
                type="url"
                value={confirmationLink}
                onChange={(e) => setConfirmationLink(e.target.value)}
                placeholder="e.g., https://payment-provider.com/confirmation/abc123"
                className="h-11 rounded-xl border border-input bg-background/90 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-shake">
            <AlertCircle className="size-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* ─── Persistent Bottom Summary & Navigation Bar ─── */}
      <div className="border-t bg-muted/20 px-6 py-5 md:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Summary: Course Name & Price */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">{selectedCourse}</span>
              <span className="text-xs text-muted-foreground">
                {SHIFT_OPTIONS.find((s) => s.id === selectedShift)?.title} ·{' '}
                {paymentPlan === 'full' ? 'Full Access' : 'Installment'}
              </span>
            </div>

            <div className="sm:border-l sm:pl-4 text-left">
              <div className="flex items-center gap-2">
                {paymentPlan === 'full' && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    10% Off
                  </span>
                )}
                {couponApplied && (
                  <span className="text-xs font-bold text-blue-600 dark:text-sky-400">
                    + Coupon
                  </span>
                )}
              </div>
              <span className="text-base font-extrabold text-blue-600 dark:text-sky-400">
                {finalPrice} Birr{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  {paymentPlan === 'full' ? '(10% off)' : '(Part 1)'}
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={submitting}
                className="rounded-xl px-5 font-bold uppercase tracking-wider text-xs"
              >
                Previous
              </Button>
            )}

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="rounded-xl px-6 font-bold uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
              >
                Next Step <ArrowRight className="ml-1.5 size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitRegistration}
                disabled={submitting || receiptUploading}
                className="rounded-xl px-6 font-bold uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
                {!submitting && <CheckCircle2 className="ml-1.5 size-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
