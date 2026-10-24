import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPublishedLibrary } from '@/lib/content'
import { CartPageClient } from '@/components/cart-page-client'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cart & Checkout | Hello Technology Academy',
  description: 'Complete your course enrollment and payment securely via Chapa.',
}

export default async function CartPage() {
  const libraryItems = await getPublishedLibrary()

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
      <CartPageClient initialResources={libraryItems} />
    </Suspense>
  )
}
