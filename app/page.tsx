import { getPublishedCourses, getPublishedTrustedPartners } from '@/lib/content'
import { HomePageClient } from '@/components/home-page-client'

export const revalidate = 60

export default async function HomePage() {
  const [courses, trustedPartners] = await Promise.all([
    getPublishedCourses(),
    getPublishedTrustedPartners(),
  ])

  return (
    <HomePageClient
      courses={courses}
      trustedPartners={trustedPartners}
    />
  )
}

