'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen,
  Video,
  Check,
  Copy,
  RefreshCw,
  AlertCircle,
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

export function ChapaInlineModal({
  resource,
  isOpen,
  onClose,
  onSuccess,
}: ChapaInlineModalProps) {
  const router = useRouter()

  // Student & Auth State
  const [student, setStudent] = useState<any>(null)
  const [loadingStudent, setLoadingStudent] = useState(true)

  // Real Chapa Gateway States
  const [initializing, setInitializing] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [txRef, setTxRef] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [verifiedPurchase, setVerifiedPurchase] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copiedTxn, setCopiedTxn] = useState(false)

  // Fetch current student profile
  useEffect(() => {
    if (!isOpen) {
      setCheckoutUrl(null)
      setTxRef(null)
      setPaymentComplete(false)
      setVerifiedPurchase(null)
      setErrorMessage(null)
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
          // Initiate real Chapa payment session immediately
          initiateRealChapaSession(data.student)
        } else {
          setStudent(null)
          setLoadingStudent(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudent(null)
          setLoadingStudent(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, resource?.id])

  // Call real Chapa API on backend
  const initiateRealChapaSession = async (currentStudent: any) => {
    if (!resource) return
    setInitializing(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize Chapa gateway')
      }

      // If free item, immediately mark complete
      if (data.isFree) {
        setPaymentComplete(true)
        if (onSuccess) onSuccess({ isFree: true })
        return
      }

      if (data.checkout_url) {
        setCheckoutUrl(data.checkout_url)
        setTxRef(data.tx_ref)
      } else {
        throw new Error('Chapa did not return a valid checkout link')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment gateway connection error')
    } finally {
      setInitializing(false)
      setLoadingStudent(false)
    }
  }

  // Verify real transaction with Chapa API
  const handleVerifyPayment = async () => {
    if (!txRef || !resource) return
    setVerifying(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/chapa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_ref: txRef,
          resourceId: resource.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Payment not yet confirmed by Chapa. Please complete the transaction on your phone/card.')
      }

      setVerifiedPurchase(data.purchase)
      setPaymentComplete(true)
      if (onSuccess) onSuccess(data.purchase)
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not verify payment status with Chapa')
    } finally {
      setVerifying(false)
    }
  }

  if (!isOpen || !resource) return null

  const isVideo = resource.format.toLowerCase().includes('video')
  const displayAmount = resource.priceETB || 0

  // 1. If not logged in, prompt sign in with return redirect
  if (!loadingStudent && !student) {
    const redirectUrl = `/auth/signin?redirect=${encodeURIComponent(
      `/library/${resource.id}?checkout=1`
    )}`

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md rounded-3xl bg-card border border-border/80 p-8 shadow-2xl relative text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>

          <div className="size-16 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-5 border border-sky-500/20">
            <Lock className="size-8" />
          </div>

          <h2 className="text-xl font-bold text-foreground">Sign In Required</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Please log in or create your student account to complete payment for{' '}
            <span className="font-semibold text-foreground">{resource.title}</span>.
          </p>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => router.push(redirectUrl)}
              className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold"
            >
              Sign In / Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 rounded-xl border-border/80"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Real Chapa Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-5 sm:px-7 py-3.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="size-3.5" />
                <span>Chapa Payment Gateway</span>
              </div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>Live Gateway · Telebirr, CBE Birr & Cards</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-[11px] font-semibold text-white transition"
              >
                <span>Open in Tab</span>
                <ExternalLink className="size-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {paymentComplete ? (
            /* ──── VERIFIED SUCCESS SCREEN ──── */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <CheckCircle2 className="size-10 text-emerald-500" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                  <Sparkles className="size-3" /> Chapa Payment Confirmed
                </span>
                <h3 className="text-2xl font-black text-foreground">
                  Enrollment Activated!
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Your payment for{' '}
                  <span className="font-semibold text-foreground">{resource.title}</span> has been verified by Chapa and unlocked on your account.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-left space-y-2 text-xs max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {displayAmount.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chapa Reference:</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                    <span>{txRef}</span>
                    <button
                      onClick={() => {
                        if (txRef) navigator.clipboard.writeText(txRef)
                        setCopiedTxn(true)
                        setTimeout(() => setCopiedTxn(false), 2000)
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      {copiedTxn ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <span className="font-semibold text-foreground">{student?.fullName}</span>
                </div>
              </div>

              <div className="pt-3 max-w-md mx-auto space-y-2.5">
                <Button
                  onClick={() => router.push(`/student/dashboard?enrolled=${resource.id}`)}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                  Start Learning Now <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-11 rounded-xl text-xs"
                >
                  Close Window
                </Button>
              </div>
            </div>
          ) : initializing ? (
            /* ──── INITIALIZING GATEWAY LOADER ──── */
            <div className="py-20 text-center space-y-4">
              <Loader2 className="size-10 animate-spin text-emerald-500 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-foreground">Connecting to Chapa Gateway...</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Generating secure real-time transaction for {displayAmount} ETB
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            /* ──── ERROR STATE WITH RETRY ──── */
            <div className="py-10 text-center space-y-4">
              <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto border border-destructive/20">
                <AlertCircle className="size-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-destructive">Chapa Payment Error</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  {errorMessage}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button
                  onClick={() => initiateRealChapaSession(student)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  <RefreshCw className="mr-1.5 size-3.5" /> Retry Payment
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : checkoutUrl ? (
            /* ──── REAL LIVE CHAPA INLINE CHECKOUT IFRAME ──── */
            <div className="space-y-3">
              {/* Top Compact Summary Bar */}
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    {isVideo ? <Video className="size-4" /> : <BookOpen className="size-4" />}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-foreground truncate block">
                      {resource.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Student: {student?.fullName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {displayAmount.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              {/* Embedded Real Chapa Checkout Iframe */}
              <div className="relative w-full rounded-2xl border border-border/80 overflow-hidden bg-white shadow-inner h-[460px] sm:h-[500px]">
                <iframe
                  src={checkoutUrl}
                  title="Chapa Real Payment Gateway"
                  className="w-full h-full border-0"
                  allow="payment"
                />
              </div>

              {/* Action Bar: Verification Check Button */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Lock className="size-3 text-emerald-500" />
                  <span>After completing payment with Telebirr/CBE/Card, click Verify below:</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleVerifyPayment}
                    disabled={verifying}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" /> Verifying with Chapa...
                      </>
                    ) : (
                      'I Have Completed Payment'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
