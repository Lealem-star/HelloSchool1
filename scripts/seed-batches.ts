import prisma from '../lib/prisma'

async function main() {
  console.log('--- Seeding Initial Batches (ዙር / Cohort Intakes) ---')

  const existing = await prisma.$queryRaw<any[]>`SELECT * FROM Batch`
  if (existing.length > 0) {
    console.log(`Found ${existing.length} batches already in database:`)
    existing.forEach((b) => console.log(` - ${b.batchNumber}: ${b.title} [${b.status}]`))
    return
  }

  // Create Batch 01 (Open for Enrollment)
  await prisma.$executeRaw`
    INSERT INTO Batch (
      id, batchNumber, title, description, startDate, endDate, registrationDeadline,
      status, capacity, campus, notes, sortOrder, createdAt, updatedAt
    ) VALUES (
      'batch_01',
      'Batch 01',
      '2026 Practical TVET Intake · Bahir Dar Campus',
      'Comprehensive practical workshop training across Smartphone Hardware, Laptop & Computer Motherboard Repair, Electronics, and Diagnostics.',
      '2026-11-01 00:00:00',
      '2027-02-01 00:00:00',
      '2026-10-31 23:59:59',
      'Open',
      80,
      'Bahir Dar Campus (Main Lab)',
      'All technical courses open for enrollment. Morning, Afternoon, Evening & Weekend shifts available.',
      1,
      NOW(),
      NOW()
    )
  `

  // Create Batch 02 (Upcoming / Opening Soon)
  await prisma.$executeRaw`
    INSERT INTO Batch (
      id, batchNumber, title, description, startDate, endDate, registrationDeadline,
      status, capacity, campus, notes, sortOrder, createdAt, updatedAt
    ) VALUES (
      'batch_02',
      'Batch 02',
      '2027 Winter Intake · Advanced Diagnostics & Repair',
      'Next intake opening soon for advanced technical tracks and weekend professionals.',
      '2027-02-15 00:00:00',
      '2027-05-15 00:00:00',
      '2027-02-10 23:59:59',
      'Upcoming',
      80,
      'Bahir Dar Campus',
      'Pre-registration list preparing.',
      2,
      NOW(),
      NOW()
    )
  `

  // Link existing registrations to Batch 01
  await prisma.$executeRaw`
    UPDATE Registration SET batchId = 'batch_01' WHERE batchId IS NULL
  `

  console.log('Successfully seeded Batch 01 (Open) and Batch 02 (Upcoming)!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
