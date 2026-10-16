import type { Metadata } from 'next'
import { LibraryCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedLibrary } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Digital Library & Repair Manuals | Hello TVET',
  description:
    'Free technical repair manuals, multimeter cheat sheets, smartphone schematics, and laptop motherboard power rail diagnostic guides in Ethiopia.',
}

export default async function LibraryPage() {
  const [resources, categories] = await Promise.all([
    getPublishedLibrary(),
    getCategoryNames('library'),
  ])
  return <LibraryCatalog resources={resources} categories={categories} />
}
