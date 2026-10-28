'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Bell,
  CreditCard,
  Clock,
  Info,
  Trash2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Tag,
  Phone,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'
import type { PublicLibraryItem } from '@/lib/content'

interface CartPageClientProps {
  initialResources: PublicLibraryItem[]
}

export function CartPageClient({ initialResources }: CartPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const isAm = language === 'am'

  const courseParam = searchParams.get('course') || searchParams.get('id')

  // Student auth state
  const [student, setStudent] = useState<any>(null)
  const [loadingStudent, setLoadingStudent] = useState(true)

  // Selected resource in cart
  const [cartResource, setCartResource] = useState<PublicLibraryItem | null>(null)
  const [isRemoved, setIsRemoved] = useState(false)

  // Discount code state
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState<string | null>(null)

  // Countdown timer (e.g. 08h : 11m : 28s matching screenshot)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 11, seconds: 28 })

  // Chapa Hosted Checkout Redirect State
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Direct checkout handler (free enrollment or redirect to Chapa hosted checkout)
  const handlePayNow = async () => {
    if (!cartResource) return
    setIsRedirecting(true)
    setCheckoutError(null)

    // 1. Require student login before payment or free enrollment
    if (!student) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hellotvet_cart_course', cartResource.id)
        localStorage.setItem('hellotvet_pending_redirect', `/cart?course=${cartResource.id}`)
      }
      router.push(
        `/student/login?redirect=${encodeURIComponent(`/cart?course=${cartResource.id}`)}&course=${encodeURIComponent(cartResource.id)}`
      )
      return
    }

    // 2. Free Course: Direct instant unlock without Chapa
    if (finalPrice === 0) {
      try {
        const res = await fetch('/api/chapa/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceId: cartResource.id,
            amount: 0,
          }),
        })
        const data = await res.json()
        if (data.success || data.isFree) {
          if (typeof window !== 'undefined') {
            try {
              const newPurchase = data.purchase || {
                id: `DP-${Date.now()}`,
                studentId: student?.id,
                resourceId: cartResource.id,
                resourceType: isVideo ? 'video_course' : 'manual',
                title: cartResource.title,
                amount: 0,
                paymentMethod: 'Free Enrollment',
                status: 'Active',
                progress: 0,
                thumbnailUrl: cartResource.thumbnailUrl,
                createdAt: new Date().toISOString(),
              }
              const existing = JSON.parse(localStorage.getItem('hellotvet_student_purchases') || '[]')
              const filtered = existing.filter((p: any) => p.resourceId !== cartResource.id)
              filtered.unshift(newPurchase)
              localStorage.setItem('hellotvet_student_purchases', JSON.stringify(filtered))
            } catch {}
            localStorage.removeItem('hellotvet_cart_course')
            localStorage.removeItem('hellotvet_pending_redirect')
          }
          router.push(`/student/dashboard?enrolled=${cartResource.id}`)
          return
        } else {
          throw new Error(data.error || 'Failed to enroll free course')
        }
      } catch (err: any) {
        setCheckoutError(err.message || 'Free enrollment error. Please try again.')
        setIsRedirecting(false)
        return
      }
    }

    // 3. Paid Course: Initialize Chapa payment
    try {
      const res = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: cartResource.id,
          amount: finalPrice,
          phone: student?.phone || '0934551781',
          email:
            student?.personalEmail ||
            student?.institutionalEmail ||
            'mekonenalemayehu95@gmail.com',
          fullName: student?.fullName || 'Mekonen Alemayehu',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || 'Failed to initialize Chapa gateway')
      }

      // Redirect directly to Chapa's official hosted checkout page
      window.location.href = data.checkout_url
    } catch (err: any) {
      setCheckoutError(err.message || 'Payment gateway connection error. Please try again.')
      setIsRedirecting(false)
    }
  }

  // Fetch Student & Check Auth
  useEffect(() => {
    let isMounted = true
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.student) {
          setStudent(data.student)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingStudent(false)
      })

    return () => {
      isMounted = false
    }
  }, [router])

  // Resolve cart item
  useEffect(() => {
    let selectedId = courseParam
    if (!selectedId && typeof window !== 'undefined') {
      selectedId = localStorage.getItem('hellotvet_cart_course')
    }

    if (selectedId) {
      const found = initialResources.find((r) => r.id === selectedId)
      if (found) {
        setCartResource(found)
        if (typeof window !== 'undefined') {
          localStorage.setItem('hellotvet_cart_course', found.id)
        }
        return
      }
    }

    // Default to first resource if available
    if (initialResources.length > 0) {
      setCartResource(initialResources[0])
    }
  }, [courseParam, initialResources])

  // Live countdown timer ticking down
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Apply Coupon / Discount Code
  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    setDiscountError(null)

    const code = discountCode.trim().toUpperCase()
    if (!code) return

    // Valid sample discount codes
    if (code === 'WELCOME10' || code === 'HELLO2026' || code === 'CHAPA50') {
      const original = cartResource?.priceETB || 0
      const discount = Math.round(original * 0.1) // 10% discount
      setDiscountAmount(discount)
      setDiscountApplied(true)
    } else {
      setDiscountError(isAm ? 'ልክ ያልሆነ የቅናሽ ኮድ' : 'Invalid discount or affiliate code')
    }
  }

  const basePrice = cartResource?.priceETB || 0
  const finalPrice = Math.max(0, basePrice - discountAmount)

  const isVideo =
    cartResource?.format?.toLowerCase().includes('video') ||
    (cartResource?.pages && cartResource?.pages.toLowerCase().includes('hour'))

  // Metadata strings
  let durationOrPages = cartResource?.pages || (isVideo ? '6:00' : '250 Pages')
  let activityCount = isVideo ? '47 Activities' : '18 Chapters'
  if (cartResource?.pages && cartResource.pages.includes('·')) {
    const parts = cartResource.pages.split('·')
    durationOrPages = parts[0].trim()
    activityCount = parts[1].trim()
  }

  // Format two-digit numbers for countdown
  const fmt = (n: number) => n.toString().padStart(2, '0')

  if (loadingStudent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-sky-500" />
          <span className="text-sm font-medium">Loading checkout cart...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col justify-between">
      {/* ──── TOP HEADER ──── */}
      <header className="w-full bg-white dark:bg-card border-b border-border/70 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-10 rounded-full bg-white dark:bg-card shadow-sm border border-border/80 flex items-center justify-center p-1.5 overflow-hidden">
              <img
                src="/images/helloschool.jpg"
                alt="Hello Technology Academy"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sky-600 dark:text-sky-400 text-base leading-tight">
                Hello Technology
              </span>
              <span className="text-xs font-semibold text-foreground/80 leading-tight">
                Academy
              </span>
            </div>
          </Link>

          {/* User Info & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Bell notification */}
            <button
              type="button"
              className="p-2 rounded-full text-sky-600 dark:text-sky-400 hover:bg-muted transition"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>

            {/* User Profile Avatar with Name */}
            <Link
              href="/student/dashboard"
              className="flex items-center gap-2 rounded-full py-1 px-2 hover:bg-muted transition"
            >
              <div className="size-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-muted-foreground border border-border">
                <User className="size-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 max-w-[140px] truncate">
                {student?.fullName || 'Student'}
              </span>
            </Link>

            {/* Language Switcher */}
            <div className="scale-90 origin-right">
              <LanguageToggle size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* ──── MAIN CART CONTENT (EXACT 2-COLUMN LAYOUT) ──── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isRemoved || !cartResource ? (
          /* Empty Cart State */
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4 shadow-sm">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <ShoppingBag className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isAm ? 'የግዢ ጋሪዎ ባዶ ነው' : 'Your Cart is Empty'}
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {isAm
                ? 'ምንም የተመረጠ ኮርስ የለም። ከዲጂታል ቤተ-መጽሐፍቱ ኮርሶችን መርጠው መማር ይችላሉ።'
                : 'You have no items in your checkout cart. Explore our practical video masterclasses and repair manuals.'}
            </p>
            <div className="pt-2">
              <Button
                onClick={() => router.push('/library')}
                className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs"
              >
                <ArrowLeft className="mr-2 size-3.5" />
                {isAm ? 'ኮርሶችን ይመልከቱ' : 'Browse Courses & Books'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ──── LEFT COLUMN: CART (7 cols) ──── */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {isAm ? 'ጋሪ' : 'Cart'}
              </h1>

              {/* Course Item Card matching Screenshot */}
              <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-stretch transition-all">
                {/* Course Thumbnail Image */}
                <div className="sm:w-64 shrink-0 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-border/60 relative">
                  <img
                    src={
                      cartResource.thumbnailUrl ||
                      (isVideo ? '/images/course-preview-hero.jpg' : '/images/manual-book-cover.jpg')
                    }
                    alt={cartResource.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Course Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
                        {cartResource.title}
                      </h2>
                      <span className="shrink-0 rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-black tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                        FULL ACCESS
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground font-medium">
                      {isAm ? 'መምህር፦ ' : 'A course by '}
                      <span className="font-semibold text-foreground">
                        {cartResource.instructor || 'Hello Technology Academy'}
                      </span>
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {activityCount} • {cartResource.level || (isAm ? 'ለሁሉም' : 'Everyone')}
                    </p>
                  </div>

                  {/* Price and Remove Button Row */}
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsRemoved(true)}
                      className="text-xs font-semibold text-destructive hover:underline flex items-center gap-1 transition"
                    >
                      <Trash2 className="size-3.5" />
                      <span>{isAm ? 'አስወግድ' : 'Remove'}</span>
                    </button>

                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-foreground">
                        {basePrice.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ──── RIGHT COLUMN: PAYMENT & SUPPORT (4 cols) ──── */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              {/* Payment Card */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm space-y-5">
                {/* Header with Credit Card Icon */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    {isAm ? 'ክፍያ' : 'Payment'}
                  </h3>
                  <CreditCard className="size-5 text-sky-500" />
                </div>

                {/* Total Price */}
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">
                    {isAm ? 'አጠቃላይ ዋጋ' : 'Total Price'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      {finalPrice.toLocaleString()} ETB
                    </span>
                    {discountApplied && (
                      <span className="text-xs text-muted-foreground line-through">
                        {basePrice.toLocaleString()} ETB
                      </span>
                    )}
                  </div>
                </div>

                {/* Discount Code Section */}
                <div>
                  {!showDiscountInput && !discountApplied ? (
                    <button
                      type="button"
                      onClick={() => setShowDiscountInput(true)}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{isAm ? 'የቅናሽ ወይም የአፊሊየት ኮድ ያስገቡ +' : 'Add Discount or Affiliate Code +'}</span>
                    </button>
                  ) : discountApplied ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Tag className="size-3.5" /> Code &quot;{discountCode.toUpperCase()}&quot; Applied (-{discountAmount} ETB)
                      </span>
                      <button
                        onClick={() => {
                          setDiscountApplied(false)
                          setDiscountAmount(0)
                          setDiscountCode('')
                        }}
                        className="text-[11px] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyDiscount} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="e.g. WELCOME10"
                          className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-xs uppercase outline-none focus:border-sky-500 font-mono"
                          autoFocus
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3.5"
                        >
                          Apply
                        </Button>
                      </div>
                      {discountError && (
                        <p className="text-[11px] text-destructive">{discountError}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Sign-in prompt if not logged in */}
                {!student && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
                    <span>
                      {isAm
                        ? 'ኮርሱን ወደ አካውንትዎ ለማያያዝ እባክዎ ይግቡ ወይም ይመዝገቡ።'
                        : 'Sign in to link this course enrollment to your student account.'}
                    </span>
                    <Link
                      href={`/student/login?redirect=${encodeURIComponent(`/cart?course=${cartResource.id}`)}&course=${encodeURIComponent(cartResource.id)}`}
                      className="font-bold text-blue-600 dark:text-sky-400 hover:underline shrink-0"
                    >
                      {isAm ? 'ግባ' : 'Sign In'}
                    </Link>
                  </div>
                )}

                {/* Big Action Button (Pay Now or Free Instant Enrollment) */}
                <div className="space-y-2">
                  <Button
                    onClick={handlePayNow}
                    disabled={isRedirecting}
                    className="w-full h-13 rounded-xl bg-[#70c922] hover:bg-[#62b01e] text-white font-extrabold text-base shadow-md transition-all duration-200 cursor-pointer disabled:opacity-75"
                  >
                    {isRedirecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-5 animate-spin" />
                        <span>
                          {finalPrice === 0
                            ? isAm
                              ? 'በነጻ በመመዝገብ ላይ...'
                              : 'Enrolling free access...'
                            : isAm
                            ? 'ወደ ቻፓ በማቅናት ላይ...'
                            : 'Connecting to Chapa...'}
                        </span>
                      </span>
                    ) : !student ? (
                      isAm ? 'ይግቡና ይመዝገቡ (Sign In to Enroll)' : 'Sign In to Complete Enrollment'
                    ) : finalPrice === 0 ? (
                      isAm ? 'በነጻ ይመዝገቡ (Enroll for Free)' : 'Enroll for Free (Instant Access)'
                    ) : (
                      isAm ? 'አሁን ይክፈሉ (Pay Now)' : 'Pay Now'
                    )}
                  </Button>
                  {checkoutError && (
                    <p className="text-xs text-destructive text-center font-medium">{checkoutError}</p>
                  )}
                </div>

                {/* Offer Countdown Timer */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 pt-1">
                  <Clock className="size-3.5" />
                  <span>
                    {isAm ? 'ይህ ቅናሽ የሚያበቃው በ ' : 'This offer ends in '}
                    <span className="font-mono font-bold">
                      {fmt(timeLeft.hours)}h : {fmt(timeLeft.minutes)}m : {fmt(timeLeft.seconds)}s
                    </span>
                  </span>
                </div>
              </div>

              {/* Support / Help Card matching Screenshot */}
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-7 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="size-4" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAm
                      ? 'ክፍያው ካልሰራ እባክዎ ያግኙን። እርስዎን ለመርዳት ዝግጁ ነን።'
                      : 'If the payment is not working, please contact us. We are here to help.'}
                  </p>
                </div>

                {/* Clickable Hotline Phone Button */}
                <div>
                  <a
                    href="tel:+251947747070"
                    className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-sky-400 bg-sky-500/5 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-bold text-sm transition"
                  >
                    <Phone className="size-3.5" />
                    <span>+251947747070</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
