'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, Footer } from '@/components/site'
import { useLanguage } from '@/components/language-provider'

function StudentLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const courseParam = searchParams.get('course')
  const identifierParam = searchParams.get('identifier')
  const { language } = useLanguage()
  const isAm = language === 'am'

  const [identifier, setIdentifier] = useState(identifierParam || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.error ||
            (isAm
              ? 'መግባት አልተቻለም። እባክዎ መረጃዎን በትክክል ያስገቡ።'
              : 'Failed to sign in. Please verify your credentials.')
        )
      }

      // Check stored or passed redirect to resume enrollment
      const savedRedirect =
        typeof window !== 'undefined'
          ? localStorage.getItem('hellotvet_pending_redirect')
          : null
      const savedCourse =
        typeof window !== 'undefined'
          ? localStorage.getItem('hellotvet_cart_course')
          : null

      const targetRedirect =
        redirectParam ||
        savedRedirect ||
        (courseParam ? `/cart?course=${encodeURIComponent(courseParam)}` : null) ||
        (savedCourse ? `/cart?course=${encodeURIComponent(savedCourse)}` : null)

      if (typeof window !== 'undefined') {
        localStorage.removeItem('hellotvet_pending_redirect')
      }

      if (targetRedirect && targetRedirect.startsWith('/')) {
        router.push(targetRedirect)
      } else {
        router.push('/student/dashboard')
      }
    } catch (err: any) {
      setError(
        err.message ||
          (isAm
            ? 'መግባት አልተቻለም። እባክዎ ኢሜይልዎን ወይም የይለፍ ቃልዎን ያረጋግጡ።'
            : 'Login failed. Please check your email and password.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          {/* Top Brand Box */}
          <div className="text-center mb-3">
            <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
              <img
                src="/images/helloschool.jpg"
                alt="Hello Technology Training Center"
                className="h-10 w-auto rounded-xl object-contain bg-white/95 p-1 shadow-sm transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-0.5 text-[11px] font-bold text-blue-600 dark:text-sky-400 border border-blue-500/20 mb-1">
              <GraduationCap className="size-3.5" />
              {isAm ? 'የሄሎ ቴክኖሎጂ የተማሪ ፖርታል' : 'Hello Technology Student Portal'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {isAm ? 'ይግቡ' : 'Log In'}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isAm
                ? 'የተመዘገቡበትን የስልጠና መርሃግብር እና ማቴሪያሎች ለማግኘት ይግቡ።'
                : 'Access your enrolled courses, syllabus, and learning resources.'}
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xl backdrop-blur-md">
            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <label className="block space-y-1">
                <span className="text-xs font-semibold text-foreground">
                  {isAm ? 'ኢሜይል፣ ስልክ ቁጥር ወይም የተማሪ መለያ' : 'Email, Phone Number, or Student ID'}
                </span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      isAm ? '0912345678 ወይም ስም@hellotvet.com' : '0912345678 or name@hellotvet.com'
                    }
                    className="w-full h-10 rounded-xl border border-input bg-background/80 pl-10 pr-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {isAm ? 'የይለፍ ቃል' : 'Password'}
                  </span>
                  <a
                    href="tel:+251947747070"
                    className="text-[11px] font-medium text-blue-600 dark:text-sky-400 hover:underline"
                  >
                    {isAm ? 'የይለፍ ቃል ረሱ?' : 'Forgot Password?'}
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 rounded-xl border border-input bg-background/80 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/25 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />{' '}
                    {isAm ? 'ማረጋገጫ በመፈተሽ ላይ...' : 'Verifying Credentials...'}
                  </>
                ) : (
                  <>
                    {isAm ? 'ይግቡ' : 'Sign In'}{' '}
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Registration CTA */}
            <div className="mt-4 text-center text-xs text-muted-foreground">
              {isAm ? 'እስካሁን የተመዘገበ አካውንት የለዎትም?' : 'Don\'t have an account yet?'}{' '}
              <Link
                href={
                  redirectParam
                    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
                    : courseParam
                    ? `/register?course=${encodeURIComponent(courseParam)}`
                    : '/register'
                }
                className="font-bold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                {isAm ? 'አዲስ አካውንት ይክፈቱ' : 'Create an Account'} <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-sky-500" />
        </div>
      }
    >
      <StudentLoginForm />
    </Suspense>
  )
}
