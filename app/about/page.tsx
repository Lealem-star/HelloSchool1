import { getPublishedInstructors } from '@/lib/content'
import { AboutPageClient } from '@/components/about-page-client'

export const revalidate = 60

export const metadata = {
  title: 'About Hello Technology Training Center | ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል',
  description:
    'Learn about ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል (Hello Technology Training Center), Ethiopia’s accredited practical technical training academy.',
}

export default async function AboutPage() {
  const instructors = await getPublishedInstructors()
  return <AboutPageClient instructors={instructors} />
}
