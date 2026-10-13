import { LibraryCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedLibrary } from '@/lib/content'

export const revalidate = 60

export default async function LibraryPage() {
  const [resources, categories] = await Promise.all([
    getPublishedLibrary(),
    getCategoryNames('library'),
  ])
  return <LibraryCatalog resources={resources} categories={categories} />
}
