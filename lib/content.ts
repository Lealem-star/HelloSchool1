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
  category: string
  description: string
  format: string
  level: string
  status: string
  price: string
  pages: string
  fileUrl?: string | null
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
    fileUrl: item.fileUrl ?? null,
  }))
}

export async function getCategoryNames(type: 'course' | 'library'): Promise<string[]> {
  const items = await prisma.category.findMany({
    where: { type },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })
  return items.map((item) => item.name)
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
    description: 'Electronics lab technicians & hardware repair workbench cohorts.',
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
  } catch (err) {
    console.error('Error fetching trusted partners:', err)
  }

  return DEFAULT_PARTNERS
}
