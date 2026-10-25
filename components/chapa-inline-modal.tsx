'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Smartphone,
  CreditCard,
  Check,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ChapaResourceProps {
  id: string
  title: string
  subtitle?: string | null
  format: string
  price: string
  priceETB: number
  instructor?: string | null
  thumbnailUrl?: string | null
}

interface ChapaInlineModalProps {
  resource: ChapaResourceProps | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (purchase: any) => void
}

type PaymentMethodType = 'telebirr' | 'cbebirr' | 'mpesa' | 'card'

export function ChapaInlineModal({
  resource,
  isOpen,
  onClose,
  onSuccess,
}: ChapaInlineModalProps) {
  const router = useRouter()

  // Student State
  const [student, setStudent] = useState<any>(null)
  const [loadingStudent, setLoadingStudent] = useState(true)

  // Payment Form States
  const [phone, setPhone] = useState('0934551781')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('telebirr')

  // Transaction States
  const [mode, setMode] = useState<'form' | 'processing' | 'waiting_ussd' | 'waiting_card' | 'success' | 'failed'>('form')
  const [txRef, setTxRef] = useState<string | null>(null)
  const [refId, setRefId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [verifiedPurchase, setVerifiedPurchase] = useState<any>(null)
  const [cardCheckoutUrl, setCardCheckoutUrl] = useState<string | null>(null)

  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const popupWindowRef = useRef<Window | null>(null)

  // Fetch student on modal open and reset states
  useEffect(() => {
    if (!isOpen) {
      if (pollingRef.current) clearInterval(pollingRef.current)
      setMode('form')
      setTxRef(null)
      setRefId(null)
      setErrorMessage(null)
      setVerifiedPurchase(null)
      setCardCheckoutUrl(null)
      return
    }

    let isMounted = true
    setLoadingStudent(true)
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.student) {
          setStudent(data.student)
          if (data.student.phone) {
            const raw = data.student.phone.replace(/\D/g, '')
            if (raw.startsWith('251') && raw.length === 12) {
              setPhone('0' + raw.slice(3))
            } else if (raw.length === 9) {
              setPhone('0' + raw)
            } else if (raw.length === 10) {
              setPhone(raw)
            }
          }
        } else {
          setStudent({
            id: 'cmvm82att0000gg2ebtahq73o',
            fullName: 'Mekonen Alemayehu',
            phone: '0934551781',
            personalEmail: 'mekonenalemayehu95@gmail.com',
          })
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudent({
            id: 'cmvm82att0000gg2ebtahq73o',
            fullName: 'Mekonen Alemayehu',
            phone: '0934551781',
            personalEmail: 'mekonenalemayehu95@gmail.com',
          })
        }
      })
      .finally(() => {
        if (isMounted) setLoadingStudent(false)
      })

    return () => {
      isMounted = false
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [isOpen, resource?.id])

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // Auto-polling for verification when in waiting states
  useEffect(() => {
    if ((mode !== 'waiting_ussd' && mode !== 'waiting_card') || !txRef || !resource) {
      if (pollingRef.current) clearInterval(pollingRef.current)
      return
    }

    const checkVerification = async () => {
      try {
        const res = await fetch('/api/chapa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tx_ref: txRef,
            ref_id: refId,
            resourceId: resource.id,
            paymentMethod: selectedMethod,
          }),
        })

        const data = await res.json().catch(() => null)
        if (!data) return

        if (data.success && (data.verified || data.purchase)) {
          if (pollingRef.current) clearInterval(pollingRef.current)
          if (popupWindowRef.current && !popupWindowRef.current.closed) {
            popupWindowRef.current.close()
          }
          setVerifiedPurchase(data.purchase)
          setMode('success')
          if (onSuccess) onSuccess(data.purchase)
        } else if (data.cancelled) {
          if (pollingRef.current) clearInterval(pollingRef.current)
          setErrorMessage(data.error || 'Payment request was cancelled or timed out on your mobile phone.')
          setMode('failed')
        } else if (data.pending) {
          setStatusMessage(data.message || 'Waiting for PIN approval on your mobile phone...')
        }
      } catch (err) {
        // Polling errors silently continue
      }
    }

    // Immediate check + poll every 2.5 seconds
    checkVerification()
    pollingRef.current = setInterval(checkVerification, 2500)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [mode, txRef, refId, resource, selectedMethod, onSuccess])

  if (!isOpen || !resource) return null

  const displayAmount = resource.priceETB || 0

  // Handle direct USSD Push payment for Telebirr / CBE Birr
  const handleInitiateMobilePayment = async () => {
    setErrorMessage(null)
    setMode('processing')

    // Clean phone number
    const cleanDigits = phone.replace(/\D/g, '')
    let formattedPhone = cleanDigits
    if (cleanDigits.startsWith('251') && cleanDigits.length === 12) {
      formattedPhone = '0' + cleanDigits.slice(3)
    } else if (cleanDigits.length === 9) {
      formattedPhone = '0' + cleanDigits
    }

    if (!formattedPhone || formattedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Ethiopian phone number (e.g. 09XXXXXXXX or 07XXXXXXXX)')
      setMode('form')
      return
    }

    try {
      const res = await fetch('/api/chapa/inline-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          phone: formattedPhone,
          paymentMethod: selectedMethod,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate mobile payment prompt.')
      }

      setTxRef(data.tx_ref)
      setRefId(data.ref_id)
      setStatusMessage(`Payment prompt sent to ${formattedPhone}. Please check your phone.`)
      setMode('waiting_ussd')
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to payment gateway.')
      setMode('form')
    }
  }

  // Handle Card / PayPal / Bank Hosted Checkout
  const handleInitiateCardPayment = async () => {
    setErrorMessage(null)
    setMode('processing')

    try {
      const res = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          phone: phone,
          email: student?.personalEmail || student?.institutionalEmail || 'mekonenalemayehu95@gmail.com',
          fullName: student?.fullName || 'Mekonen Alemayehu',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || 'Failed to initialize card checkout.')
      }

      setTxRef(data.tx_ref)
      setCardCheckoutUrl(data.checkout_url)

      // Open in focused top-level popup window (avoids 419 iframe CSRF token mismatch)
      const popup = window.open(
        data.checkout_url,
        'ChapaCardPayment',
        'width=520,height=720,menubar=no,toolbar=no,location=no,status=no'
      )
      popupWindowRef.current = popup

      setMode('waiting_card')
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to open card checkout.')
      setMode('form')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMethod === 'card') {
      handleInitiateCardPayment()
    } else {
      handleInitiateMobilePayment()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-[440px] sm:max-w-[460px] rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden my-auto flex flex-col text-foreground">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 size-8 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center"
        >
          <X className="size-4" />
        </button>

        {/* ──── SCREEN 1: SUCCESS CELEBRATION ──── */}
        {mode === 'success' ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="size-10 text-emerald-500" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="size-3" /> Payment Verified
              </span>
              <h3 className="text-2xl font-black text-foreground">
                Enrollment Activated!
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Your payment for{' '}
                <span className="font-semibold text-foreground">{resource.title}</span> has been confirmed.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {displayAmount.toLocaleString()} ETB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-mono text-[11px] text-foreground">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-semibold text-foreground">{student?.fullName || 'Mekonen Alemayehu'}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <Button
                onClick={() => router.push(`/student/dashboard?enrolled=${resource.id}&verified=1`)}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
              >
                Start Learning Now <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-11 rounded-xl text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        ) : mode === 'waiting_ussd' ? (
          /* ──── SCREEN 2: USSD PROMPT SENT TO PHONE ──── */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95">
            {/* Glowing radar phone animation */}
            <div className="relative size-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full bg-sky-500/10 border border-sky-500/30 animate-pulse" />
              <div className="relative size-16 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Smartphone className="size-8 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-2">
                <Loader2 className="size-3 animate-spin" /> USSD Push Sent
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Check Your Phone
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                A payment request of{' '}
                <span className="font-bold text-foreground">{displayAmount} ETB</span> has been sent to{' '}
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{phone}</span>.
              </p>
            </div>

            {/* Instruction Card */}
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs text-left space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-sky-500" /> What to do next:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                <li>Check your phone screen for the {selectedMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr'} prompt.</li>
                <li>Enter your PIN to confirm payment.</li>
                <li>This window will automatically detect and unlock your course.</li>
              </ol>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setMode('form')}
                className="w-full h-11 rounded-xl text-xs border-border/80"
              >
                Change Phone Number / Payment Method
              </Button>
            </div>
          </div>
        ) : mode === 'waiting_card' ? (
          /* ──── SCREEN 3: CARD CHECKOUT POPUP WAITING ──── */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="size-16 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center mx-auto">
              <CreditCard className="size-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">Complete Payment</h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
                Secure checkout window is open for{' '}
                <span className="font-bold text-foreground">{displayAmount} ETB</span>.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                <Loader2 className="size-3.5 animate-spin text-sky-500" />
                <span>Waiting for transaction completion...</span>
              </div>
              <p className="text-[11px]">Once complete, your course will activate immediately.</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {cardCheckoutUrl && (
                <Button
                  onClick={() => {
                    const popup = window.open(
                      cardCheckoutUrl,
                      'ChapaCardPayment',
                      'width=520,height=720,menubar=no,toolbar=no,location=no,status=no'
                    )
                    popupWindowRef.current = popup
                  }}
                  className="w-full h-11 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs"
                >
                  <ExternalLink className="mr-1.5 size-3.5" /> Reopen Payment Window
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setMode('form')}
                className="w-full h-11 rounded-xl text-xs"
              >
                Back to Methods
              </Button>
            </div>
          </div>
        ) : mode === 'failed' ? (
          /* ──── SCREEN 4: PAYMENT FAILED / CANCELLED ──── */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="size-16 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle className="size-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">Payment Notice</h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
                {errorMessage || 'The payment request was not completed.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                onClick={() => {
                  setErrorMessage(null)
                  handleInitiateMobilePayment()
                }}
                className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25"
              >
                <RefreshCw className="mr-1.5 size-3.5" /> Retry Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode('form')}
                className="w-full h-11 rounded-xl text-xs"
              >
                Change Details
              </Button>
            </div>
          </div>
        ) : (
          /* ──── SCREEN 5: CLEAN INLINE PAYMENT (BILICHO) ──── */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Top Security Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <Lock className="size-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-foreground">
                  Chapa Secure Checkout
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Live Gateway
              </span>
            </div>

            {/* Amount to Pay */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount to Pay
              </div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {displayAmount.toFixed(2)}{' '}
                <span className="text-base sm:text-lg font-bold text-muted-foreground">ETB</span>
              </div>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Phone Number Input (Only for mobile payments) */}
            {selectedMethod !== 'card' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Phone Number</span>
                  <span className="text-[11px] font-normal text-muted-foreground">Telebirr / CBE Birr</span>
                </label>
                <div className="flex items-center rounded-xl border border-border/80 bg-background focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition overflow-hidden shadow-sm">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted/40 border-r border-border/80 text-xs font-bold text-foreground">
                    <span className="text-sm">🇪🇹</span>
                    <span>+251</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XXXXXXXX"
                    maxLength={13}
                    required
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Payment Method Selector Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Telebirr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('telebirr')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    selectedMethod === 'telebirr'
                      ? 'border-cyan-500 bg-cyan-500/10 text-foreground ring-2 ring-cyan-500/30'
                      : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {selectedMethod === 'telebirr' && (
                    <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="size-8 rounded-full bg-cyan-500 text-white font-black text-xs flex items-center justify-center mb-1 shadow-sm">
                    tb
                  </div>
                  <span className="text-xs font-bold">telebirr</span>
                </button>

                {/* CBE Birr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('cbebirr')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    selectedMethod === 'cbebirr'
                      ? 'border-purple-500 bg-purple-500/10 text-foreground ring-2 ring-purple-500/30'
                      : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {selectedMethod === 'cbebirr' && (
                    <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="size-8 rounded-full bg-purple-600 text-amber-300 font-black text-xs flex items-center justify-center mb-1 shadow-sm">
                    CBE
                  </div>
                  <span className="text-xs font-bold">CBEBirr</span>
                </button>

                {/* Card / PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    selectedMethod === 'card'
                      ? 'border-sky-500 bg-sky-500/10 text-foreground ring-2 ring-sky-500/30'
                      : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {selectedMethod === 'card' && (
                    <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-sky-500 text-white flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="size-8 rounded-full bg-slate-800 text-white flex items-center justify-center mb-1 shadow-sm">
                    <CreditCard className="size-4" />
                  </div>
                  <span className="text-xs font-bold">Card/Bank</span>
                </button>
              </div>
            </div>

            {/* Action Pay Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={mode === 'processing'}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition"
              >
                {mode === 'processing' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Connecting...</span>
                  </span>
                ) : selectedMethod === 'telebirr' ? (
                  `Pay with telebirr`
                ) : selectedMethod === 'cbebirr' ? (
                  `Pay with CBEBirr`
                ) : (
                  `Pay with Card / Bank`
                )}
              </Button>
            </div>

            {/* Secured by Chapa Footer */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Secured By</span>
              <span className="font-bold text-foreground">Chapa</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
