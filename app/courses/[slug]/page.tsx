import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedCourseBySlug, getPublishedCourses } from '@/lib/content'
import { getCourseSchema, JsonLd } from '@/lib/schema'
import { CourseDetailClient } from '@/components/course-detail-client'

export const revalidate = 60

export async function generateStaticParams() {
  const courses = await getPublishedCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getPublishedCourseBySlug(slug)
  if (!course) return { title: 'Course Not Found' }

  const ogImageUrl = `/courses/${slug}/opengraph-image`

  return {
    title: `${course.title} - Practical Workshop Training`,
    description: course.description,
    keywords: [
      course.title,
      course.category,
      course.level,
      ...course.skills,
      'electronics repair course Bahir Dar',
      'hands-on workshop training Ethiopia',
      'hardware troubleshooting EMS',
    ],
    alternates: {
      canonical: `/courses/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `/courses/${slug}`,
      title: `${course.title} | Hello Technology Training Center`,
      description: course.description,
      siteName: 'Hello Technology Training Center (ሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል)',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${course.title} Practical Curriculum`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} | Hello Technology Training Center`,
      description: course.description,
      creator: '@helloschool_et',
      images: [ogImageUrl],
    },
  }
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [course, allCourses] = await Promise.all([
    getPublishedCourseBySlug(slug),
    getPublishedCourses(),
  ])
  if (!course) notFound()

  const allCourseTitles = allCourses.map((c) => c.title)
  const courseSchema = getCourseSchema(course)

  return (
    <>
      <JsonLd data={courseSchema} />
      <CourseDetailClient course={course} allCourseTitles={allCourseTitles} />
    </>
  )
}
