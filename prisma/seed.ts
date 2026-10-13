import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  courses,
  trainingGallery,
  digitalLibraryResources,
  categories,
  libraryCategories,
  adminMockData,
} from '../lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Categories
  console.log('  → Categories')
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, type: 'course' },
    })
  }
  for (const name of libraryCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, type: 'library' },
    })
  }

  // 2. Courses
  console.log('  → Courses')
  for (let i = 0; i < courses.length; i++) {
    const c = courses[i]
    await prisma.course.upsert({
      where: { slug: c.id },
      update: {},
      create: {
        slug: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        description: c.description,
        icon: c.icon,
        audience: c.audience,
        prerequisites: c.prerequisites,
        duration: c.duration,
        price: c.price,
        image: c.image,
        skills: JSON.stringify(c.skills),
        sortOrder: i,
      },
    })
  }

  // 3. Training Gallery
  console.log('  → Training Gallery')
  for (let i = 0; i < trainingGallery.length; i++) {
    const g = trainingGallery[i]
    await prisma.trainingGallery.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        title: g.title,
        description: g.description,
        image: g.image,
        sortOrder: i,
      },
    })
  }

  // 4. Library Resources
  console.log('  → Library Resources')
  for (let i = 0; i < digitalLibraryResources.length; i++) {
    const r = digitalLibraryResources[i]
    await prisma.libraryResource.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        format: r.format,
        level: r.level,
        status: r.status,
        price: r.price,
        pages: r.pages,
        sortOrder: i,
      },
    })
  }

  // 5. Sample Inquiries
  console.log('  → Sample Inquiries')
  for (const inq of adminMockData.inquiries) {
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

  // 6. Default Admin User
  console.log('  → Default Admin User')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@emschool.edu.et' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@emschool.edu.et',
      name: 'Site Administrator',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('')
  console.log('✅ Seed complete!')
  console.log('')
  console.log('🔐 Default Admin Login:')
  console.log('   Email:    admin@emschool.edu.et')
  console.log('   Password: admin123')
  console.log('')
  console.log('⚠️  CHANGE THE DEFAULT PASSWORD AFTER FIRST LOGIN!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
