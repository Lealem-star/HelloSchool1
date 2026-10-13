import { CoursesCatalog } from '@/components/catalog'
import { getCategoryNames, getPublishedCourses } from '@/lib/content'

export const revalidate = 60

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getPublishedCourses(),
    getCategoryNames('course'),
  ])
  return <CoursesCatalog courses={courses} categories={categories} />
}
