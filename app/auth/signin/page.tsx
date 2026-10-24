'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/library'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'identifier' | 'password'>('identifier')
  const [existingUser, setExistingUser] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    fetch('/api/student/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          const dest = redirectUrl.includes('cart')
            ? redirectUrl
            : redirectUrl.includes('?')
            ? `${redirectUrl}&checkout=1`
            : `${redirectUrl}?checkout=1`
          router.replace(dest)
        }
      })
      .catch(() => {})
  }, [redirectUrl, router])

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to check account')
      }

      if (data.exists) {
        // User exists -> Ask for password
        setExistingUser(data.student)
        setStep('password')
      } else {
        // User does not exist -> Redirect to /auth/signup
        const signupUrl = `/register?redirect=${encodeURIComponent(
          redirectUrl
        )}&username=${encodeURIComponent(identifier.trim())}`
        router.push(signupUrl)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid password. Please try again.')
      }

      // Successful login -> Redirect to cart or course with checkout query
      const dest = redirectUrl.includes('cart')
        ? redirectUrl
        : redirectUrl.includes('?')
        ? `${redirectUrl}&checkout=1`
        : `${redirectUrl}?checkout=1`
      router.push(dest)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Top Circular Logo */}
      <div className="flex justify-center mb-6">
        <Link href="/" className="inline-block group transition-transform hover:scale-105">
          <div className="size-16 rounded-full bg-white dark:bg-card shadow-lg border border-border/80 flex items-center justify-center p-2.5 overflow-hidden ring-4 ring-sky-500/10">
            <img
              src="/images/helloschool.jpg"
              alt="Hello Technology Academy"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-border/70 bg-card p-8 md:p-10 shadow-xl backdrop-blur-xl">
        {step === 'identifier' ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome to Hello Technology Academy,
              </h1>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Let&apos;s get started
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleContinue} className="space-y-6">
              <label className="flex flex-col gap-2 text-xs font-semibold text-foreground/90">
                <span>
                  Email or phone number <span className="text-destructive">*</span>
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or phone number"
                  className="h-12 w-full rounded-xl border border-input bg-background/90 px-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  required
                  autoFocus
                />
              </label>

              <Button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition shadow-sky-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Checking account...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              <Link href={redirectUrl} className="hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="size-3" /> Back to Course
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {existingUser?.fullName?.split(' ')[0] || 'Trainee'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your password to sign in and proceed to payment
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div className="rounded-xl bg-muted/40 p-3 border border-border/50 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{identifier}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('identifier')
                    setPassword('')
                    setError(null)
                  }}
                  className="text-sky-500 hover:underline font-semibold"
                >
                  Change
                </button>
              </div>

              <label className="flex flex-col gap-2 text-xs font-semibold text-foreground/90">
                <span>
                  Password <span className="text-destructive">*</span>
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-input bg-background/90 px-4 pr-11 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition shadow-sky-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  'Log In & Continue'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('identifier')
                  setPassword('')
                  setError(null)
                }}
                className="hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="size-3" /> Back
              </button>

              <Link
                href={`/register?redirect=${encodeURIComponent(
                  redirectUrl
                )}&username=${encodeURIComponent(identifier)}`}
                className="text-sky-500 hover:underline font-semibold"
              >
                Create new account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-sky-500" />
            <span>Loading...</span>
          </div>
        }
      >
        <SignInContent />
      </Suspense>
    </div>
  )
}
