import { getPublishedCourses } from '@/lib/content'
import { ContactPageClient } from '@/components/contact-page-client'

export const metadata = {
  title: 'Contact & Campus Location | Hello Technology Training Center',
  description:
    'Get in touch with Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል) in Bahir Dar. Inquire about course registration, class schedules, or visit our training workshop.',
}

export default async function ContactPage() {
  const publishedCourses = await getPublishedCourses()
  const courseTitles = publishedCourses.map((c) => c.title)
  return <ContactPageClient courseTitles={courseTitles} />
}
