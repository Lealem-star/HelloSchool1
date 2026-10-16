'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  BookOpen,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, Footer } from '@/components/site'

export default function StudentLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
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
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.')
      }

      router.push('/student/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          {/* Top Brand Box */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <img
                src="/images/helloschool.jpg"
                alt="Hello TVET"
                className="h-12 w-auto rounded-xl object-contain bg-white/95 p-1 shadow-md transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
              <GraduationCap className="size-3.5" /> Hello TVET Student Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              Log In
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access your enrolled workbench, syllabus, and technical learning resources.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-border/80 bg-card/90 p-7 md:p-9 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive animate-shake">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Student Email or Phone Number
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. lealem.meseret@hellotvet.edu.et or 0911..."
                    className="h-11 w-full rounded-xl border border-input bg-background/80 pl-10 pr-3.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    required
                    autoFocus
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Portal Password
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-input bg-background/80 pl-10 pr-10 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Institutional Email Info Tip */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-3.5 flex items-start gap-3">
                <Sparkles className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">How your email is formatted:</span>
                  <br />
                  Your institutional login is automatically generated from your name and father&apos;s name:{' '}
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    firstname.fathername@hellotvet.edu.et
                  </span>
                  <br />
                  (e.g.{' '}
                  <span className="font-mono text-foreground font-semibold">
                    lealem.meseret@hellotvet.edu.et
                  </span>
                  )
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Don&apos;t have an enrolled student account yet?{' '}
              <Link
                href="/register"
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                Register for a Course <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
