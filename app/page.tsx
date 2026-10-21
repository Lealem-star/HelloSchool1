import { getPublishedCourses, getPublishedGallery, getPublishedTrustedPartners } from '@/lib/content'
import { HomePageClient } from '@/components/home-page-client'

export const revalidate = 60

export default async function HomePage() {
  const [courses, trainingGallery, trustedPartners] = await Promise.all([
    getPublishedCourses(),
    getPublishedGallery(),
    getPublishedTrustedPartners(),
  ])

  return (
    <HomePageClient
      courses={courses}
      trainingGallery={trainingGallery}
      trustedPartners={trustedPartners}
    />
  )
}
