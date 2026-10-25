'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseParam = searchParams.get('course')
  const redirectParam = searchParams.get('redirect')
  
  const defaultRedirect = courseParam
    ? `/cart?course=${encodeURIComponent(courseParam)}`
    : '/library'
  const redirectUrl = redirectParam || defaultRedirect
  const initialUsername = searchParams.get('username') || ''

  const [fullName, setFullName] = useState('')
  const [identifier, setIdentifier] = useState(initialUsername)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialUsername && !identifier) {
      setIdentifier(initialUsername)
    }
  }, [initialUsername, identifier])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !identifier.trim() || !password) return

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          identifier: identifier.trim(),
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.alreadyExists) {
          router.push(`/student/login?redirect=${encodeURIComponent(redirectUrl)}&identifier=${encodeURIComponent(identifier)}`)
          return
        }
        throw new Error(data.error || 'Failed to create student account')
      }

      router.push(redirectUrl)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[430px]">
      {/* Top Centered Circular Logo */}
      <div className="flex justify-center mb-6">
        <Link href="/" className="inline-block group transition-transform hover:scale-105">
          <div className="size-16 rounded-full bg-white dark:bg-card shadow-sm border border-slate-200/90 dark:border-slate-800 flex items-center justify-center p-2.5 overflow-hidden ring-4 ring-sky-500/10">
            <img
              src="/images/helloschool.jpg"
              alt="Hello Technology Academy"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Main White Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-card p-8 sm:p-9 shadow-sm">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-foreground leading-snug">
            Welcome, Sign up to
            <br />
            Hello Technology Academy
          </h1>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={`h-11 w-full rounded-md border px-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition ${
                fullName
                  ? 'bg-[#eff6ff] border-sky-300 dark:bg-sky-950/20 dark:border-sky-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              }`}
              required
              autoFocus
            />
          </div>

          {/* Email or phone number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Email or phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone number"
              className={`h-11 w-full rounded-md border px-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition ${
                identifier
                  ? 'bg-[#eff6ff] border-sky-300 dark:bg-sky-950/20 dark:border-sky-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`h-11 w-full rounded-md border px-3.5 pr-10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition ${
                  password
                    ? 'bg-[#eff6ff] border-sky-300 dark:bg-sky-950/20 dark:border-sky-700'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                }`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Next Button in vibrant blue */}
          <button
            type="submit"
            disabled={loading || !fullName.trim() || !identifier.trim() || !password}
            className="w-full h-11 rounded-md bg-[#00a8ff] hover:bg-[#0096e6] text-white font-semibold text-sm shadow-none transition mt-2 flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Processing...
              </>
            ) : (
              'Next'
            )}
          </button>

          {/* Link to Login */}
          <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
            Already have an account?{' '}
            <Link
              href={`/student/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-[#00a8ff] hover:underline font-semibold ml-0.5"
            >
              Login
            </Link>
          </div>

          {/* Terms Footnote */}
          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              Terms of Service
            </Link>
            ,{' '}
            <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-[#00a8ff]" />
            <span>Loading...</span>
          </div>
        }
      >
        <RegisterContent />
      </Suspense>
    </div>
  )
}
