import type { Metadata } from 'next'
import { CoursesCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedCourses } from '@/lib/content'
import { getCourseListSchema, JsonLd } from '@/lib/schema'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Certified Repair Courses & Practical Curriculum',
  description:
    'Explore hands-on technical courses in smartphone hardware, laptop component maintenance, circuit diagnostics, and television repair in Bahir Dar, Ethiopia.',
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Certified Repair Courses & Practical Curriculum | Hello TVET',
    description:
      'Explore hands-on technical courses in smartphone hardware, laptop component maintenance, circuit diagnostics, and television repair in Bahir Dar.',
    url: '/courses',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certified Repair Courses & Practical Curriculum | Hello TVET',
    description:
      'Explore hands-on technical courses in smartphone hardware, laptop component maintenance, circuit diagnostics, and television repair in Bahir Dar.',
  },
}

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getPublishedCourses(),
    getCategoryNames('course'),
  ])

  const courseListSchema = getCourseListSchema(courses)

  return (
    <>
      <JsonLd data={courseListSchema} />
      <CoursesCatalog courses={courses} categories={categories} />
    </>
  )
}
