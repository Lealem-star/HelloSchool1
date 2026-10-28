import prisma from './prisma'

function parseSkills(skills: string): string[] {
  try {
    const parsed = JSON.parse(skills)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export type SyllabusModule = {
  title: string
  duration?: string
  description?: string
  lessons: string[]
  labMilestone?: string
}

function parseSyllabus(syllabus: string | null | undefined): SyllabusModule[] {
  if (!syllabus) return []
  try {
    const parsed = JSON.parse(syllabus)
    return Array.isArray(parsed) ? parsed : []
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
  syllabus: SyllabusModule[]
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
  subtitle?: string
  category: string
  description: string
  format: string
  level: string
  status: string
  price: string
  priceETB?: number
  pages: string
  fileUrl?: string | null
  thumbnailUrl?: string | null
  instructor?: string
  instructorRole?: string
  rating?: number
  reviewCount?: number
  badgeText?: string
  skillsLearned?: string | null
  lessons?: any
  chapters?: any
}

export function getFallbackCourseImage(slug?: string | null, category?: string | null): string {
  const s = (slug || '').toLowerCase()
  const c = (category || '').toLowerCase()
  if (s.includes('mobile') || c.includes('mobile')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85'
  if (s.includes('tv') || c.includes('tv')) return 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=85'
  if (s.includes('computer') || s.includes('laptop') || c.includes('computer') || c.includes('laptop')) return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85'
  if (s.includes('refrigerator') || s.includes('fridge') || c.includes('appliance')) return 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=85'
  if (s.includes('electric') || c.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85'
  if (s.includes('network') || c.includes('network')) return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=85'
  if (s.includes('dish') || c.includes('dish')) return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=85'
  if (s.includes('video') || c.includes('video')) return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85'
  if (s.includes('animation') || c.includes('animation')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85'
  if (s.includes('coding') || s.includes('program') || c.includes('software')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85'
  if (s.includes('industrial') || c.includes('industrial')) return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=85'
  return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85'
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
  syllabus?: string | null
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
    syllabus: parseSyllabus(course.syllabus),
    audience: course.audience ?? '',
    prerequisites: course.prerequisites ?? '',
    duration: course.duration ?? '',
    price: course.price ?? '',
    image: course.image && course.image.trim().length > 0 ? course.image : getFallbackCourseImage(course.slug, course.category),
  }
}

export async function getPublishedCourses(): Promise<PublicCourse[]> {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    if (courses && courses.length > 0) {
      return courses.map(toPublicCourse)
    }
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  // Resilient fallback to seed-data.json
  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      if (Array.isArray(data.courses) && data.courses.length > 0) {
        return data.courses.map((c: any) => ({
          id: c.id,
          slug: c.id,
          title: c.title,
          category: c.category || 'Technical',
          level: c.level || 'Everyone',
          description: c.description || '',
          icon: c.icon || 'CircuitBoard',
          skills: Array.isArray(c.skills) ? c.skills : [],
          syllabus: Array.isArray(c.syllabus) ? c.syllabus : [],
          audience: c.audience || '',
          prerequisites: c.prerequisites || '',
          duration: c.duration || '6:00',
          price: c.price || 'Free',
          image: c.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
        }))
      }
    }
  } catch (fallbackErr) {
    console.warn('getPublishedCourses fallback error:', fallbackErr)
  }
  return []
}

export async function getPublishedCourseBySlug(slug: string): Promise<PublicCourse | null> {
  try {
    const course = await prisma.course.findFirst({
      where: { slug, published: true },
    })
    if (course) return toPublicCourse(course)
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      const found = data.courses?.find((c: any) => c.id === slug)
      if (found) {
        return {
          id: found.id,
          slug: found.id,
          title: found.title,
          category: found.category || 'Technical',
          level: found.level || 'Everyone',
          description: found.description || '',
          icon: found.icon || 'CircuitBoard',
          skills: Array.isArray(found.skills) ? found.skills : [],
          syllabus: Array.isArray(found.syllabus) ? found.syllabus : [],
          audience: found.audience || '',
          prerequisites: found.prerequisites || '',
          duration: found.duration || '6:00',
          price: found.price || 'Free',
          image: found.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
        }
      }
    }
  } catch (e) {}
  return null
}

export async function getPublishedGallery(): Promise<PublicGalleryItem[]> {
  try {
    const items = await prisma.trainingGallery.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    if (items && items.length > 0) {
      return items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? '',
        image: item.image,
      }))
    }
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      if (Array.isArray(data.trainingGallery) && data.trainingGallery.length > 0) {
        return data.trainingGallery.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description ?? '',
          image: item.image,
        }))
      }
    }
  } catch (e) {}
  return []
}

export async function getPublishedLibrary(): Promise<PublicLibraryItem[]> {
  try {
    const items = await prisma.libraryResource.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    if (items && items.length > 0) {
      return items.map((item: any) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle ?? '',
        category: item.category,
        description: item.description ?? '',
        format: item.format ?? 'Technical Repair Manual',
        level: item.level ?? '',
        status: item.status,
        price: item.price ?? (item.priceETB ? `${item.priceETB} ETB` : 'Free'),
        priceETB: item.priceETB ?? 0,
        pages: item.pages ?? '',
        fileUrl: item.fileUrl ?? null,
        thumbnailUrl: item.thumbnailUrl ?? null,
        instructor: item.instructor ?? '',
        instructorRole: item.instructorRole ?? '',
        rating: item.rating ?? 4.9,
        reviewCount: item.reviewCount ?? 120,
        badgeText: item.badgeText ?? '',
        skillsLearned: item.skillsLearned ?? null,
        lessons: item.lessons ?? null,
        chapters: item.chapters ?? null,
      }))
    }
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      if (Array.isArray(data.digitalLibraryResources) && data.digitalLibraryResources.length > 0) {
        return data.digitalLibraryResources.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle ?? '',
          category: item.category || 'General',
          description: item.description ?? '',
          format: item.format ?? 'Technical Repair Manual',
          level: item.level ?? '',
          status: item.status || 'Available',
          price: item.price ?? (item.priceETB ? `${item.priceETB} ETB` : 'Free'),
          priceETB: item.priceETB ?? 0,
          pages: item.pages ?? '',
          fileUrl: item.fileUrl ?? null,
          thumbnailUrl: item.thumbnailUrl ?? null,
          instructor: item.instructor ?? '',
          instructorRole: item.instructorRole ?? '',
          rating: item.rating ?? 4.9,
          reviewCount: item.reviewCount ?? 120,
          badgeText: item.badgeText ?? '',
          skillsLearned: item.skillsLearned ?? null,
          lessons: item.lessons ?? null,
          chapters: item.chapters ?? null,
        }))
      }
    }
  } catch (e) {}
  return []
}

export async function getPublishedLibraryItem(id: string): Promise<PublicLibraryItem | null> {
  try {
    const item = await prisma.libraryResource.findFirst({
      where: { id, published: true },
    })
    if (item) {
      return {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle ?? '',
        category: item.category,
        description: item.description ?? '',
        format: item.format ?? 'Technical Repair Manual',
        level: item.level ?? '',
        status: item.status,
        price: item.price ?? (item.priceETB ? `${item.priceETB} ETB` : 'Free'),
        priceETB: item.priceETB ?? 0,
        pages: item.pages ?? '',
        fileUrl: item.fileUrl ?? null,
        thumbnailUrl: item.thumbnailUrl ?? null,
        instructor: item.instructor ?? '',
        instructorRole: item.instructorRole ?? '',
        rating: item.rating ?? 4.9,
        reviewCount: item.reviewCount ?? 120,
        badgeText: item.badgeText ?? '',
        skillsLearned: item.skillsLearned ?? null,
        lessons: item.lessons ?? null,
        chapters: item.chapters ?? null,
      }
    }
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      const found = data.digitalLibraryResources?.find((item: any) => item.id === id)
      if (found) {
        return {
          id: found.id,
          title: found.title,
          subtitle: found.subtitle ?? '',
          category: found.category || 'General',
          description: found.description ?? '',
          format: found.format ?? 'Technical Repair Manual',
          level: found.level ?? '',
          status: found.status || 'Available',
          price: found.price ?? (found.priceETB ? `${found.priceETB} ETB` : 'Free'),
          priceETB: found.priceETB ?? 0,
          pages: found.pages ?? '',
          fileUrl: found.fileUrl ?? null,
          thumbnailUrl: found.thumbnailUrl ?? null,
          instructor: found.instructor ?? '',
          instructorRole: found.instructorRole ?? '',
          rating: found.rating ?? 4.9,
          reviewCount: found.reviewCount ?? 120,
          badgeText: found.badgeText ?? '',
          skillsLearned: found.skillsLearned ?? null,
          lessons: found.lessons ?? null,
          chapters: found.chapters ?? null,
        }
      }
    }
  } catch (e) {}
  return null
}

export async function getCategoryNames(type: 'course' | 'library'): Promise<string[]> {
  try {
    const items = await prisma.category.findMany({
      where: { type },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    if (items && items.length > 0) {
      return items.map((item) => item.name)
    }
  } catch (err: any) {
    console.warn('[Database offline, using local seed fallback]:', err?.message || err)
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json')
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      if (type === 'course' && Array.isArray(data.categories)) {
        return data.categories
      }
      if (type === 'library' && Array.isArray(data.libraryCategories)) {
        return data.libraryCategories
      }
    }
  } catch (e) {}

  return [
    'Mobile Repair',
    'Computer and Laptop Repair',
    'Electronics',
    'TV and Other Devices',
  ]
}

export type PublicInstructor = {
  id: string
  name: string
  role: string
  experience: string
  bio: string
  specialties: string[]
  image: string
}

export async function getPublishedInstructors(): Promise<PublicInstructor[]> {
  const instructors = await prisma.instructor.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return instructors.map((inst) => {
    let specialties: string[] = []
    try {
      const parsed = JSON.parse(inst.specialties)
      if (Array.isArray(parsed)) specialties = parsed.map(String)
    } catch {
      specialties = []
    }
    return {
      id: inst.id,
      name: inst.name,
      role: inst.role,
      experience: inst.experience || '',
      bio: inst.bio || '',
      specialties,
      image: inst.image || '',
    }
  })
}

export type PublicFacility = {
  id: string
  title: string
  description: string
  icon: string
  image?: string
}

export async function getPublishedFacilities(): Promise<PublicFacility[]> {
  const facilities = await prisma.workshopFacility.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return facilities.map((fac) => ({
    id: fac.id,
    title: fac.title,
    description: fac.description || '',
    icon: fac.icon || 'Wrench',
    image: fac.image || undefined,
  }))
}

export type PublicStudentProject = {
  id: string
  title: string
  category: string
  device: string
  fault: string
  diagnosticProcess: string
  solution: string
  outcome: string
  technician: string
  badge: string
  image?: string
}

export async function getPublishedStudentProjects(): Promise<PublicStudentProject[]> {
  const projects = await prisma.studentProject.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return projects.map((proj) => ({
    id: proj.id,
    title: proj.title,
    category: proj.category || 'Repair Project',
    device: proj.device || '',
    fault: proj.fault || '',
    diagnosticProcess: proj.diagnosticProcess || '',
    solution: proj.solution || '',
    outcome: proj.outcome || '',
    technician: proj.technician || '',
    badge: proj.badge || 'Case Study',
    image: proj.image || undefined,
  }))
}

export type PublicTrustedPartner = {
  id: string
  name: string
  category: string
  logoUrl: string
  websiteUrl?: string | null
  description?: string | null
}

const DEFAULT_PARTNERS: PublicTrustedPartner[] = [
  {
    id: 'default-1',
    name: 'Felege Hiwot Comprehensive Specialized Hospital',
    category: 'Hospitals & Biomedical',
    logoUrl: '/images/helloschool.jpg',
    description: 'Biomedical electronics & clinical equipment maintenance training.',
  },
  {
    id: 'default-2',
    name: 'Bahir Dar University (BDU)',
    category: 'Universities & Higher Ed',
    logoUrl: '/images/helloschool.jpg',
    description: 'Electronics lab technicians & hardware repair practical programs.',
  },
  {
    id: 'default-3',
    name: 'Ethio Telecom Regional Hub',
    category: 'Telecom & Enterprise IT',
    logoUrl: '/images/helloschool.jpg',
    description: 'Hardware diagnostics, PCB rework & telecom technician upskilling.',
  },
  {
    id: 'default-4',
    name: 'Amhara Industrial Parks Development',
    category: 'Industries & Manufacturing',
    logoUrl: '/images/helloschool.jpg',
    description: 'Factory automation electronics, sensory control & motor drive circuits.',
  },
  {
    id: 'default-5',
    name: 'Tana Drilling & Electro-Mechanical',
    category: 'Industrial Engineering',
    logoUrl: '/images/helloschool.jpg',
    description: 'Power electronics, instrumentation control & field diagnostic protocols.',
  },
  {
    id: 'default-6',
    name: 'Commercial Bank of Ethiopia',
    category: 'Banking & Corporate Systems',
    logoUrl: '/images/helloschool.jpg',
    description: 'Server hardware, automated teller boards & secure IT maintenance.',
  },
]

export async function getPublishedTrustedPartners(): Promise<PublicTrustedPartner[]> {
  try {
    const partners = await (prisma as any).trustedPartner.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    if (partners.length > 0) {
      return partners.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Institution',
        logoUrl: p.logoUrl,
        websiteUrl: p.websiteUrl,
        description: p.description,
      }))
    }
  } catch (err: any) {
    console.warn('[Database offline, using fallback trusted partners]:', err?.message || err)
  }

  return DEFAULT_PARTNERS
}
