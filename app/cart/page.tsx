import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPublishedLibrary, getPublishedCourses, type PublicLibraryItem } from '@/lib/content'
import { CartPageClient } from '@/components/cart-page-client'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cart & Checkout | Hello Technology Academy',
  description: 'Complete your course enrollment and payment securely via Chapa.',
}

export default async function CartPage() {
  const [libraryItems, courses] = await Promise.all([
    getPublishedLibrary(),
    getPublishedCourses(),
  ])

  // Map TVET practical courses so they can be enrolled via Cart as well
  const mappedCourses: PublicLibraryItem[] = courses.map((c) => {
    const numericPrice = parseInt(c.price.replace(/[^\d]/g, ''), 10) || 0
    return {
      id: c.slug,
      title: c.title,
      subtitle: c.description.slice(0, 80) + '...',
      category: c.category,
      format: 'Practical Lab Workshop',
      status: 'Active',
      price: c.price || 'Free',
      priceETB: numericPrice,
      priceDisplay: c.price || 'Free',
      isFreeForTVET: numericPrice === 0,
      level: c.level,
      rating: 5.0,
      reviewCount: 48,
      instructor: 'Hello Technology Training Center',
      instructorRole: 'Technical Instructor',
      language: 'Amharic / English',
      description: c.description,
      skillsLearned: c.skills.join(', '),
      thumbnailUrl: c.image,
      pages: c.duration,
    }
  })

  // Avoid duplicate IDs if a course has the same ID as a library item
  const allResources = [...libraryItems]
  for (const mc of mappedCourses) {
    if (!allResources.some((r) => r.id === mc.id)) {
      allResources.push(mc)
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Loader2 className="size-6 animate-spin text-sky-500" />
            <span>Loading cart...</span>
          </div>
        </div>
      }
    >
      <CartPageClient initialResources={allResources} />
    </Suspense>
  )
}
