import type { Metadata } from 'next'
import { LibraryCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedLibrary } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Online Courses & Learning Materials | Hello Technology Academy',
  description:
    'Register for self-paced practical online video courses, technical repair manuals, schematics, and diagnostic guides. Instant automated access via Chapa in Ethiopia.',
}

export default async function LibraryPage() {
  const [resources, categories] = await Promise.all([
    getPublishedLibrary(),
    getCategoryNames('library'),
  ])
  return <LibraryCatalog resources={resources} categories={categories} />
}
