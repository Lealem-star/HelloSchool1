import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting data sync from prisma/seed-data.json to MySQL database...')

  const seedFilePath = path.join(process.cwd(), 'prisma', 'seed-data.json')
  if (!fs.existsSync(seedFilePath)) {
    throw new Error(`Seed data file not found at ${seedFilePath}`)
  }

  const rawData = fs.readFileSync(seedFilePath, 'utf8')
  const seedData = JSON.parse(rawData)

  // 1. Sync Course Categories
  console.log('  → Syncing Course Categories...')
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

  // 2. Sync Library Categories
  console.log('  → Syncing Library Categories...')
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

  // 3. Sync Courses
  console.log('  → Syncing Courses...')
  if (Array.isArray(seedData.courses)) {
    for (let i = 0; i < seedData.courses.length; i++) {
      const c = seedData.courses[i]
      const skillsStr = JSON.stringify(Array.isArray(c.skills) ? c.skills : [])
      const syllabusStr = JSON.stringify(Array.isArray(c.syllabus) ? c.syllabus : [])

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
          skills: skillsStr,
          syllabus: syllabusStr,
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
          skills: skillsStr,
          syllabus: syllabusStr,
          sortOrder: i,
          published: true,
        },
      })
      console.log(`    ✓ Course synced: [${c.id}] ${c.title}`)
    }
  }

  // 4. Sync Training Gallery
  console.log('  → Syncing Training Gallery...')
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
      console.log(`    ✓ Gallery item synced: [${g.id}] ${g.title}`)
    }
  }

  // 5. Sync Digital Library Resources
  console.log('  → Syncing Digital Library Resources...')
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
          priceETB: typeof r.priceETB === 'number' ? r.priceETB : 0,
          pages: r.pages || null,
          fileUrl: r.fileUrl || null,
          thumbnailUrl: r.thumbnailUrl || null,
          instructor: r.instructor || null,
          badgeText: r.badgeText || null,
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
          priceETB: typeof r.priceETB === 'number' ? r.priceETB : 0,
          pages: r.pages || null,
          fileUrl: r.fileUrl || null,
          thumbnailUrl: r.thumbnailUrl || null,
          instructor: r.instructor || null,
          badgeText: r.badgeText || null,
          sortOrder: i,
          published: true,
        },
      })
      console.log(`    ✓ Library resource synced: [${r.id}] ${r.title}`)
    }
  }

  // 6. Sync Instructors
  if (Array.isArray(seedData.instructors)) {
    console.log('  → Syncing Instructors...')
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
      console.log(`    ✓ Instructor synced: [${inst.id}] ${inst.name}`)
    }
  }

  // 7. Sync Workshop Facilities
  if (Array.isArray(seedData.workshopFacilities)) {
    console.log('  → Syncing Workshop Facilities...')
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
      console.log(`    ✓ Facility synced: [${fac.id}] ${fac.title}`)
    }
  }

  // 8. Sync Student Projects
  if (Array.isArray(seedData.studentProjects)) {
    console.log('  → Syncing Student Projects...')
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
      console.log(`    ✓ Student project synced: [${proj.id}] ${proj.title}`)
    }
  }

  // 9. Ensure Default Admin User Exists
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@hellotvet.edu.et'
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@HelloTVET2026!'
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    console.log('  → Creating Default Admin User...')
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Lead Admissions Administrator',
        password: hashedPassword,
        role: 'superadmin',
      },
    })
    console.log(`    ✓ Admin user created: ${adminEmail}`)
  } else {
    console.log(`    ✓ Admin user already exists: ${adminEmail}`)
  }

  const [courseCount, galleryCount, libraryCount, categoryCount, instructorCount, facilityCount, projectCount] =
    await Promise.all([
      prisma.course.count(),
      prisma.trainingGallery.count(),
      prisma.libraryResource.count(),
      prisma.category.count(),
      prisma.instructor.count(),
      prisma.workshopFacility.count(),
      prisma.studentProject.count(),
    ])

  console.log('\n✅ Database synchronization completed successfully!')
  console.log(`   • Courses in DB: ${courseCount}`)
  console.log(`   • Gallery Items in DB: ${galleryCount}`)
  console.log(`   • Library Resources in DB: ${libraryCount}`)
  console.log(`   • Categories in DB: ${categoryCount}`)
  console.log(`   • Instructors in DB: ${instructorCount}`)
  console.log(`   • Workshop Facilities in DB: ${facilityCount}`)
  console.log(`   • Student Projects in DB: ${projectCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Sync failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
