'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Cpu,
  Mail,
  Menu,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  Smartphone,
  Sparkles,
  Wrench,
  X,
  Zap,
  Laptop,
  GraduationCap,
  Briefcase,
  Play,
  Send,
  MapPin,
  ShieldCheck,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { schoolConfig } from '@/lib/data'

const iconMap = { Smartphone, Laptop, Zap, Monitor, GraduationCap, Wrench, Cpu, Briefcase, CircuitBoard }

export function Icon({ name, className }: { name: keyof typeof iconMap; className?: string }) {
  const Component = iconMap[name] || CircuitBoard
  return <Component className={className} aria-hidden="true" />
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Electronics Maintenance School home">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <CircuitBoard className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-extrabold tracking-tight text-foreground">EMS</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Technical School</span>
      </span>
    </Link>
  )
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/training', label: 'Practical Training' },
  { href: '/library', label: 'Digital Library' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/register"><Button size="sm" className="rounded-lg px-5">Register Now <ArrowRight data-icon="inline-end" /></Button></Link>
        </div>
        <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-5 pb-5 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">{item.label}</Link>)}
            <Link href="/register" onClick={() => setOpen(false)}><Button className="mt-2 w-full rounded-lg">Register Now <ArrowRight data-icon="inline-end" /></Button></Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="container mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950"><CircuitBoard className="size-5" /></span><span className="font-bold text-white">Electronics Maintenance School</span></div>
          <p className="max-w-md text-sm leading-7 text-slate-400">Practical technical education for the next generation of electronics repair professionals in Ethiopia.</p>
          <div className="mt-6 flex gap-3"><a href="#" aria-label="Facebook" className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400">Facebook</a><a href="#" aria-label="Instagram" className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400">Instagram</a><a href="#" aria-label="LinkedIn" className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400">LinkedIn</a></div>
        </div>
        <div><h3 className="mb-4 text-sm font-semibold text-white">Explore</h3><div className="flex flex-col gap-3 text-sm text-slate-400"><Link href="/courses" className="hover:text-cyan-400">Our Courses</Link><Link href="/training" className="hover:text-cyan-400">Practical Training</Link><Link href="/library" className="hover:text-cyan-400">Digital Library</Link><Link href="/about" className="hover:text-cyan-400">About Us</Link></div></div>
        <div><h3 className="mb-4 text-sm font-semibold text-white">Contact</h3><div className="flex flex-col gap-3 text-sm text-slate-400"><span className="flex gap-2"><Phone className="size-4 text-cyan-400" />{schoolConfig.phone}</span><span className="flex gap-2"><Mail className="size-4 text-cyan-400" />{schoolConfig.email}</span><span className="flex gap-2"><MapPin className="size-4 text-cyan-400" />{schoolConfig.address}</span></div></div>
      </div>
      <div className="border-t border-slate-800"><div className="container mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row lg:px-8"><span>© 2024 Electronics Maintenance School. Editable prototype.</span><span>Built for practical learning.</span></div></div>
    </footer>
  )
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="border-b bg-muted/35 px-5 py-16 lg:px-8 lg:py-20"><div className="container mx-auto max-w-7xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p></div></section>
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return <div className={cn('mb-10', align === 'center' && 'mx-auto max-w-2xl text-center')}><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>{description && <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>}</div>
}

export function StatStrip() {
  return <div className="grid grid-cols-2 border-y border-border bg-background md:grid-cols-4"><div className="border-r border-border p-6 text-center"><Sparkles className="mx-auto mb-2 size-5 text-primary" /><p className="text-sm font-semibold">Practical first</p><p className="mt-1 text-xs text-muted-foreground">Learn by doing</p></div><div className="border-r border-border p-6 text-center"><Wrench className="mx-auto mb-2 size-5 text-primary" /><p className="text-sm font-semibold">Real tools</p><p className="mt-1 text-xs text-muted-foreground">Industry equipment</p></div><div className="border-r border-border p-6 text-center"><ShieldCheck className="mx-auto mb-2 size-5 text-primary" /><p className="text-sm font-semibold">Clear pathways</p><p className="mt-1 text-xs text-muted-foreground">Skills that build</p></div><div className="p-6 text-center"><BookOpen className="mx-auto mb-2 size-5 text-primary" /><p className="text-sm font-semibold">Keep learning</p><p className="mt-1 text-xs text-muted-foreground">Guides coming soon</p></div></div>
}

export function InquiryForm({ courseName }: { courseName?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const form = event.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const phone = data.get('phone') as string
    const consent = data.get('consent') as string | null

    if (!name?.trim() || !phone?.trim() || !consent) {
      setError('Please complete your name, phone number, and consent before sending.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: (data.get('email') as string)?.trim() || undefined,
          course: (data.get('course') as string)?.trim() || undefined,
          preferredContact: (data.get('preferredContact') as string)?.trim() || undefined,
          experience: (data.get('experience') as string)?.trim() || undefined,
          message: (data.get('message') as string)?.trim() || undefined,
          consent: !!consent,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({} as any))
        throw new Error(errData.error || `Failed to submit (HTTP ${res.status})`)
      }

      setSubmitted(true)
      form.reset()
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted)
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check />
        </span>
        <h3 className="mt-4 text-xl font-bold">Inquiry sent successfully!</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thank you! Your inquiry has been saved. The school will contact you shortly using the details you provided.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>
          Send another inquiry
        </Button>
      </div>
    )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Full name *
          <input
            name="name"
            disabled={loading}
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary disabled:opacity-60"
            placeholder="Your full name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Phone number *
          <input
            name="phone"
            disabled={loading}
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            placeholder="+251 ..."
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            disabled={loading}
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Preferred course
          <select
            name="course"
            defaultValue={courseName || ''}
            disabled={loading}
            className="h-11 rounded-lg border bg-background px-3 text-sm disabled:opacity-60"
          >
            <option value="">Select a course</option>
            <option>Mobile Phone Repair & Maintenance</option>
            <option>Computer & Laptop Maintenance</option>
            <option>Electronics Troubleshooting & Diagnostics</option>
            <option>TV & Electronic Device Repair</option>
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Message
        <textarea
          name="message"
          rows={4}
          disabled={loading}
          className="rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          placeholder="Tell us what you would like to learn..."
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          disabled={loading}
          className="mt-0.5 size-4 accent-primary"
        />
        I consent to the school using this information to respond to my inquiry.
      </label>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full sm:w-fit">
        {loading ? 'Sending...' : 'Send inquiry'}
        {!loading && <Send data-icon="inline-end" />}
      </Button>
    </form>
  )
}

export function CourseIcon({ name }: { name: keyof typeof iconMap }) { return <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon name={name} /></span> }

export function WhatsAppButton() { return <a href={`https://wa.me/${schoolConfig.whatsappPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"><MessageCircle className="size-4" /> Ask on WhatsApp</a> }

export function SearchField({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) { return <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary" /></div> }

export function CTASection() { return <section className="px-5 py-20 lg:px-8"><div className="container mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-primary px-7 py-10 text-primary-foreground md:flex-row md:items-center md:px-12 md:py-14"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/65">Your next step</p><h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">Ready to build practical repair skills?</h2><p className="mt-4 max-w-lg leading-7 text-primary-foreground/75">Explore our courses or send an inquiry. We will help you find the right path for your goals.</p></div><div className="flex flex-wrap gap-3"><Link href="/courses"><Button variant="secondary" className="rounded-lg">Explore courses <ArrowRight data-icon="inline-end" /></Button></Link><Link href="/contact"><Button variant="outline" className="rounded-lg border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">Contact us</Button></Link></div></div></section> }

export function GalleryCard({ title, description, image, className }: { title: string; description?: string | null; image: string; className?: string }) {
  return (
    <article className={cn('group overflow-hidden rounded-2xl border bg-card', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <img src={image} alt={title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
    </article>
  )
}

export { ChevronRight, ChevronDown, Clock3, Play, Phone, Mail, MapPin }

export function SiteShell({ children }: { children: React.ReactNode }) { return <><Header />{children}<Footer /></> }

export default SiteShell

export { cn }
