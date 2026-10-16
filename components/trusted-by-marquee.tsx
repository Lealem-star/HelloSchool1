'use client'

import { PublicTrustedPartner } from '@/lib/content'
import { Building2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'

export function TrustedBySection({
  partners,
}: {
  partners: PublicTrustedPartner[]
}) {
  if (!partners || partners.length === 0) return null

  // Duplicate items for continuous seamless infinite marquee looping
  const marqueeItems = [...partners, ...partners]

  return (
    <section className="relative overflow-hidden border-b border-slate-800/90 bg-slate-950 py-16 text-white">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl px-5 text-center lg:px-8 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
          <ShieldCheck className="size-3.5" />
          <span>Institutional Trust & Partnerships</span>
        </div>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Trusted by Leading Hospitals, Industries & Universities
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Technical teams from regional healthcare networks, higher education institutions, manufacturing plants, and telecom enterprises rely on Hello TVET for workforce workbench competence.
        </p>
      </div>

      {/* Marquee Wrapper with left/right fade masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent" />

        {/* Animated Marquee Strip (Right to Left) */}
        <div className="animate-marquee-left flex items-center gap-6 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="group relative flex w-[320px] shrink-0 items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900 hover:shadow-cyan-950/50"
            >
              {/* Logo / Thumbnail */}
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-white/95 p-1.5 transition-transform duration-300 group-hover:scale-105">
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="size-full object-contain"
                    onError={(e) => {
                      // Fallback if image path does not exist
                      ;(e.target as any).style.display = 'none'
                      ;(e.target as any).nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="hidden size-full items-center justify-center bg-slate-900 text-cyan-400"
                  aria-hidden="true"
                >
                  <Building2 className="size-6" />
                </div>
              </div>

              {/* Partner Info */}
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/20">
                    {item.category || 'Institution'}
                  </span>
                  {item.websiteUrl && (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                      title="Visit website"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                <h4 className="mt-1 truncate text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
