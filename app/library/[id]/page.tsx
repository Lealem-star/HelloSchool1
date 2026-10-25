import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedLibrary, getPublishedLibraryItem } from '@/lib/content'
import { LibraryDetailClient } from '@/components/library-detail-client'

export const revalidate = 60

export async function generateStaticParams() {
  const items = await getPublishedLibrary()
  return items.map((item) => ({ id: item.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const resource = await getPublishedLibraryItem(id)
  if (!resource) return { title: 'Resource Not Found' }

  return {
    title: `${resource.title} | Hello Technology Academy Online Courses`,
    description: resource.description,
    openGraph: {
      title: `${resource.title} | Hello Technology Academy`,
      description: resource.description,
      images: [
        {
          url: resource.thumbnailUrl || '/images/course-preview-hero.jpg',
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
  }
}

export default async function LibraryResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resource = await getPublishedLibraryItem(id)
  if (!resource) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LibraryDetailClient resource={resource} />
    </Suspense>
  )
}

