import type { Metadata } from 'next'
import { CoursesCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedCourses } from '@/lib/content'
import { getCourseListSchema, JsonLd } from '@/lib/schema'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'All Courses & Masterclasses | Donkey Academy',
  description:
    'Explore hands-on masterclasses and technical courses in video editing, smartphone repair, computer maintenance, and electronics.',
  alternates: {
    canonical: '/learn',
  },
}

export default async function LearnPage() {
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
