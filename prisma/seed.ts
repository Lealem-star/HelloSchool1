import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed from prisma/seed-data.json...')

  const seedFilePath = path.join(__dirname, 'seed-data.json')
  if (!fs.existsSync(seedFilePath)) {
    throw new Error(`Seed data file not found at ${seedFilePath}`)
  }

  const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'))

  // 1. Categories
  console.log('  → Syncing Categories')
  if (Array.isArray(seedData.categories)) {
    for (let i = 0; i < seedData.categories.length; i++) {
      const name = seedData.categories[i]
      await prisma.category.upsert({
        where: { name },
        update: { sortOrder: i },
        create: { name, type: 'course', sortOrder: i },
      })
    }
  }
  if (Array.isArray(seedData.libraryCategories)) {
    for (let i = 0; i < seedData.libraryCategories.length; i++) {
      const name = seedData.libraryCategories[i]
      await prisma.category.upsert({
        where: { name },
        update: { sortOrder: i },
        create: { name, type: 'library', sortOrder: i },
      })
    }
  }

  // 2. Courses
  console.log('  → Syncing Courses')
  if (Array.isArray(seedData.courses)) {
    for (let i = 0; i < seedData.courses.length; i++) {
      const c = seedData.courses[i]
      await prisma.course.upsert({
        where: { slug: c.id },
        update: {
          title: c.title,
          category: c.category,
          level: c.level || 'Beginner to Advanced',
          description: c.description,
          icon: c.icon || 'CircuitBoard',
          audience: c.audience || null,
          prerequisites: c.prerequisites || null,
          duration: c.duration || null,
          price: c.price || null,
          image: c.image || null,
          skills: JSON.stringify(Array.isArray(c.skills) ? c.skills : []),
          syllabus: JSON.stringify(Array.isArray(c.syllabus) ? c.syllabus : []),
          sortOrder: i,
          published: true,
        },
        create: {
          slug: c.id,
          title: c.title,
          category: c.category,
          level: c.level || 'Beginner to Advanced',
          description: c.description,
          icon: c.icon || 'CircuitBoard',
          audience: c.audience || null,
          prerequisites: c.prerequisites || null,
          duration: c.duration || null,
          price: c.price || null,
          image: c.image || null,
          skills: JSON.stringify(Array.isArray(c.skills) ? c.skills : []),
          syllabus: JSON.stringify(Array.isArray(c.syllabus) ? c.syllabus : []),
          sortOrder: i,
          published: true,
        },
      })
    }
  }

  // 3. Training Gallery
  console.log('  → Syncing Training Gallery')
  if (Array.isArray(seedData.trainingGallery)) {
    for (let i = 0; i < seedData.trainingGallery.length; i++) {
      const g = seedData.trainingGallery[i]
      await prisma.trainingGallery.upsert({
        where: { id: g.id },
        update: {
          title: g.title,
          description: g.description,
          image: g.image,
          sortOrder: i,
          published: true,
        },
        create: {
          id: g.id,
          title: g.title,
          description: g.description,
          image: g.image,
          sortOrder: i,
          published: true,
        },
      })
    }
  }

  // 4. Library Resources
  console.log('  → Syncing Library Resources')
  if (Array.isArray(seedData.digitalLibraryResources)) {
    for (let i = 0; i < seedData.digitalLibraryResources.length; i++) {
      const r = seedData.digitalLibraryResources[i]
      await prisma.libraryResource.upsert({
        where: { id: r.id },
        update: {
          title: r.title,
          category: r.category,
          description: r.description,
          format: r.format || 'PDF Manual',
          level: r.level || 'All Levels',
          status: r.status || 'Free Access',
          price: r.price || null,
          pages: r.pages || null,
          fileUrl: r.fileUrl || null,
          sortOrder: i,
          published: true,
        },
        create: {
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description,
          format: r.format || 'PDF Manual',
          level: r.level || 'All Levels',
          status: r.status || 'Free Access',
          price: r.price || null,
          pages: r.pages || null,
          fileUrl: r.fileUrl || null,
          sortOrder: i,
          published: true,
        },
      })
    }
  }

  // 5. Instructors
  if (Array.isArray(seedData.instructors)) {
    console.log('  → Syncing Instructors')
    for (let i = 0; i < seedData.instructors.length; i++) {
      const inst = seedData.instructors[i]
      const specialtiesStr = Array.isArray(inst.specialties)
        ? JSON.stringify(inst.specialties)
        : typeof inst.specialties === 'string'
        ? inst.specialties
        : JSON.stringify([])

      await prisma.instructor.upsert({
        where: { id: inst.id },
        update: {
          name: inst.name,
          role: inst.role,
          experience: inst.experience || null,
          bio: inst.bio || null,
          specialties: specialtiesStr,
          image: inst.image || null,
          sortOrder: typeof inst.sortOrder === 'number' ? inst.sortOrder : i,
          published: true,
        },
        create: {
          id: inst.id,
          name: inst.name,
          role: inst.role,
          experience: inst.experience || null,
          bio: inst.bio || null,
          specialties: specialtiesStr,
          image: inst.image || null,
          sortOrder: typeof inst.sortOrder === 'number' ? inst.sortOrder : i,
          published: true,
        },
      })
    }
  }

  // 6. Workshop Facilities
  if (Array.isArray(seedData.workshopFacilities)) {
    console.log('  → Syncing Workshop Facilities')
    for (let i = 0; i < seedData.workshopFacilities.length; i++) {
      const fac = seedData.workshopFacilities[i]
      await prisma.workshopFacility.upsert({
        where: { id: fac.id },
        update: {
          title: fac.title,
          description: fac.description || null,
          icon: fac.icon || 'Wrench',
          image: fac.image || null,
          sortOrder: typeof fac.sortOrder === 'number' ? fac.sortOrder : i,
          published: true,
        },
        create: {
          id: fac.id,
          title: fac.title,
          description: fac.description || null,
          icon: fac.icon || 'Wrench',
          image: fac.image || null,
          sortOrder: typeof fac.sortOrder === 'number' ? fac.sortOrder : i,
          published: true,
        },
      })
    }
  }

  // 7. Student Projects
  if (Array.isArray(seedData.studentProjects)) {
    console.log('  → Syncing Student Projects')
    for (let i = 0; i < seedData.studentProjects.length; i++) {
      const proj = seedData.studentProjects[i]
      await prisma.studentProject.upsert({
        where: { id: proj.id },
        update: {
          title: proj.title,
          category: proj.category || null,
          device: proj.device || null,
          fault: proj.fault || null,
          diagnosticProcess: proj.diagnosticProcess || null,
          solution: proj.solution || null,
          outcome: proj.outcome || null,
          technician: proj.technician || null,
          badge: proj.badge || null,
          image: proj.image || null,
          sortOrder: typeof proj.sortOrder === 'number' ? proj.sortOrder : i,
          published: true,
        },
        create: {
          id: proj.id,
          title: proj.title,
          category: proj.category || null,
          device: proj.device || null,
          fault: proj.fault || null,
          diagnosticProcess: proj.diagnosticProcess || null,
          solution: proj.solution || null,
          outcome: proj.outcome || null,
          technician: proj.technician || null,
          badge: proj.badge || null,
          image: proj.image || null,
          sortOrder: typeof proj.sortOrder === 'number' ? proj.sortOrder : i,
          published: true,
        },
      })
    }
  }

  // 8. Sample Inquiries
  if (seedData.adminMockData?.inquiries) {
    console.log('  → Syncing Inquiries')
    for (const inq of seedData.adminMockData.inquiries) {
      await prisma.inquiry.upsert({
        where: { id: inq.id },
        update: {},
        create: {
          id: inq.id,
          studentName: inq.studentName,
          email: inq.email,
          phone: inq.phone,
          course: inq.course,
          preferredContact: inq.preferredContact,
          experience: inq.experience,
          status: inq.status,
          consent: true,
          createdAt: new Date(inq.submittedAt),
        },
      })
    }
  }

  // 9. Default Admin User
  console.log('  → Default Admin User')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@hellotvet.edu.et' },
    update: {},
    create: {
      email: 'admin@hellotvet.edu.et',
      name: 'Site Administrator',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
