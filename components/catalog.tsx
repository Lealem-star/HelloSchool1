'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PublicCourse, PublicLibraryItem } from '@/lib/content'
import { CourseIcon, PageIntro, SearchField, SiteShell, CTASection } from '@/components/site'

export function CoursesCatalog({
  courses,
  categories,
}: {
  courses: PublicCourse[]
  categories: string[]
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All courses')
  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (category === 'All courses' || c.category === category) &&
          `${c.title} ${c.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [courses, query, category]
  )

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Course catalog"
        title="Choose your technical path."
        description="Explore practical programs designed to help you understand, diagnose, and repair the devices people rely on every day."
      />
      <main className="container mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <div className="w-full md:max-w-sm">
            <SearchField value={query} onChange={setQuery} placeholder="Search courses..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All courses', ...categories].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  category === item
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:border-primary/50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-primary/35 hover:shadow-lg"
              >
                <div className="grid sm:grid-cols-[180px_1fr]">
                  {course.image ? (
                    <img src={course.image} alt="" className="h-full min-h-48 w-full object-cover" />
                  ) : (
                    <div className="min-h-48 bg-muted" />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <CourseIcon name={course.icon as any} />
                      {course.level ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {course.level}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">{course.category}</p>
                    <h2 className="mt-2 text-xl font-bold">{course.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
                      <span className="text-xs text-muted-foreground">{course.duration}</span>
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="outline" size="sm">
                          Details <ArrowRight data-icon="inline-end" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-14 text-center">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 font-bold">No courses found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or clear the category filter.</p>
          </div>
        )}
      </main>
      <CTASection />
    </SiteShell>
  )
}

export function LibraryCatalog({
  resources,
  categories,
}: {
  resources: PublicLibraryItem[]
  categories: string[]
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All resources')
  const filtered = resources.filter(
    (r) =>
      (category === 'All resources' || r.category === category) &&
      `${r.title} ${r.description}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Digital library"
        title="Keep learning beyond the workbench."
        description="A future collection of repair manuals, troubleshooting guides, and video lessons. The catalog is ready for your learning resources as they become available."
      />
      <main className="container mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-10 flex flex-col gap-4">
          <div className="max-w-sm">
            <SearchField value={query} onChange={setQuery} placeholder="Search guides and lessons..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('All resources')}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                category === 'All resources'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              All resources
            </button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                  category === item
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => (
              <article key={resource.id} className="flex flex-col rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText />
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {resource.status}
                  </span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">{resource.category}</p>
                <h2 className="mt-2 text-lg font-bold">{resource.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                  <span>
                    {resource.format}
                    {resource.pages ? ` · ${resource.pages}` : ''}
                  </span>
                  <Link href="/contact" className="font-semibold text-primary">
                    Ask about it <ArrowRight className="ml-1 inline size-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-14 text-center">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 font-bold">No resources found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or clear the category filter.</p>
          </div>
        )}
      </main>
      <section className="border-y bg-muted/35 px-5 py-16 lg:px-8">
        <div className="container mx-auto max-w-3xl text-center">
          <BookOpen className="mx-auto size-8 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Looking for a specific repair guide?</h2>
          <p className="mt-3 text-muted-foreground">
            Tell us what you want to learn and we will let you know when the right resource is available.
          </p>
          <Link href="/contact">
            <Button className="mt-6">
              Ask about a guide <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
