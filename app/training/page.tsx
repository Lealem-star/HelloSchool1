import { CTASection, GalleryCard, PageIntro, SectionHeading, SiteShell } from '@/components/site'
import { trainingHighlights } from '@/lib/data'
import { getPublishedGallery } from '@/lib/content'

export const revalidate = 60

export default async function TrainingPage() {
  const trainingGallery = await getPublishedGallery()

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Practical training"
        title="The workbench is where confidence grows."
        description="Our proposed training experience combines clear technical instruction with guided time on real components, tools, and repair projects."
      />
      <main>
        <section className="container mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeading eyebrow="Our approach" title="From first principles to confident diagnosis" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trainingHighlights.map((item, index) => (
              <div key={item.title} className="rounded-2xl border p-6">
                <p className="text-sm font-bold text-primary">0{index + 1}</p>
                <h2 className="mt-8 font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-muted/35 px-5 py-16 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Workshop gallery"
              title="Replaceable, real-world learning moments"
              description="Sample imagery is shown below. Replace it with consent-aware photography of your own facilities and student projects."
            />
            {trainingGallery.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {trainingGallery.map((item) => (
                  <GalleryCard key={item.id} title={item.title} description={item.description} image={item.image} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Gallery items will appear here once they are published.</p>
            )}
          </div>
        </section>
        <section className="container mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="rounded-2xl border bg-background p-7 md:p-10">
            <h2 className="text-2xl font-bold">Student projects</h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              A future showcase for repair demonstrations and student projects. Add project notes, device type, learning outcome, and consent status before publishing.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Project template</p>
                <p className="mt-3 text-sm font-semibold">Device and issue</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Project template</p>
                <p className="mt-3 text-sm font-semibold">Diagnostic process</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Project template</p>
                <p className="mt-3 text-sm font-semibold">Repair outcome</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </SiteShell>
  )
}
