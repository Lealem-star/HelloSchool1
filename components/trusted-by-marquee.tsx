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
    <section className="relative overflow-hidden border-b bg-slate-50/80 dark:bg-card/60 py-16 text-foreground">
      {/* Background subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(21,93,252,0.08),transparent_70%)] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl px-5 text-center lg:px-8 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#155DFC] dark:text-sky-400">
          <ShieldCheck className="size-3.5" />
          <span>Institutional Trust & Partnerships</span>
        </div>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Trusted by Leading Hospitals, Industries & Universities
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
          Technical teams from regional healthcare networks, higher education institutions, manufacturing plants, and telecom enterprises rely on Hello TVET for workforce practical competence.
        </p>
      </div>

      {/* Marquee Wrapper with left/right fade masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-slate-50 dark:from-card via-slate-50/80 dark:via-card/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-slate-50 dark:from-card via-slate-50/80 dark:via-card/80 to-transparent" />

        {/* Animated Marquee Strip (Right to Left) */}
        <div className="animate-marquee-left flex items-center gap-6 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="group relative flex w-[320px] shrink-0 items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#155DFC]/60 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Logo / Thumbnail */}
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 shadow-xs transition-transform duration-300 group-hover:scale-105">
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
                  className="hidden size-full items-center justify-center bg-blue-50 text-[#155DFC]"
                  aria-hidden="true"
                >
                  <Building2 className="size-6" />
                </div>
              </div>

              {/* Partner Info */}
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#155DFC] dark:text-sky-400 border border-blue-500/20">
                    {item.category || 'Institution'}
                  </span>
                  {item.websiteUrl && (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#155DFC] transition-colors"
                      title="Visit website"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                <h4 className="mt-1 truncate text-sm font-bold text-foreground group-hover:text-[#155DFC] transition-colors">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
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
