import prisma from './prisma'

function parseSkills(skills: string): string[] {
  try {
    const parsed = JSON.parse(skills)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export type PublicCourse = {
  id: string
  slug: string
  title: string
  category: string
  level: string
  description: string
  icon: string
  skills: string[]
  audience: string
  prerequisites: string
  duration: string
  price: string
  image: string
}

export type PublicGalleryItem = {
  id: string
  title: string
  description: string
  image: string
}

export type PublicLibraryItem = {
  id: string
  title: string
  category: string
  description: string
  format: string
  level: string
  status: string
  price: string
  pages: string
}

function toPublicCourse(course: {
  id: string
  slug: string
  title: string
  category: string
  level: string | null
  description: string | null
  icon: string | null
  skills: string
  audience: string | null
  prerequisites: string | null
  duration: string | null
  price: string | null
  image: string | null
}): PublicCourse {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    category: course.category,
    level: course.level ?? '',
    description: course.description ?? '',
    icon: course.icon ?? 'CircuitBoard',
    skills: parseSkills(course.skills),
    audience: course.audience ?? '',
    prerequisites: course.prerequisites ?? '',
    duration: course.duration ?? '',
    price: course.price ?? '',
    image: course.image ?? '',
  }
}

export async function getPublishedCourses(): Promise<PublicCourse[]> {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return courses.map(toPublicCourse)
}

export async function getPublishedCourseBySlug(slug: string): Promise<PublicCourse | null> {
  const course = await prisma.course.findFirst({
    where: { slug, published: true },
  })
  return course ? toPublicCourse(course) : null
}

export async function getPublishedGallery(): Promise<PublicGalleryItem[]> {
  const items = await prisma.trainingGallery.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    image: item.image,
  }))
}

export async function getPublishedLibrary(): Promise<PublicLibraryItem[]> {
  const items = await prisma.libraryResource.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description ?? '',
    format: item.format ?? '',
    level: item.level ?? '',
    status: item.status,
    price: item.price ?? '',
    pages: item.pages ?? '',
  }))
}

export async function getCategoryNames(type: 'course' | 'library'): Promise<string[]> {
  const items = await prisma.category.findMany({
    where: { type },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })
  return items.map((item) => item.name)
}
