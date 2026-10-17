import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentStudent } from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ student: null }, { status: 401 })
    }

    // Get all registrations for this student, including their linked Batch
    let registrations: any[] = []
    try {
      registrations = await (prisma as any).registration.findMany({
        where: {
          OR: [
            { studentId: student.id },
            { institutionalEmail: student.institutionalEmail },
            { phone: student.phone },
          ],
        },
        include: {
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch {
      registrations = await (prisma as any).registration.findMany({
        where: {
          OR: [
            { studentId: student.id },
            { institutionalEmail: student.institutionalEmail },
            { phone: student.phone },
          ],
        },
        orderBy: { createdAt: 'desc' },
      })
      try {
        const rawBatches = (await (prisma as any).$queryRaw`
          SELECT * FROM Batch
        `) as any[]
        const map = new Map(rawBatches.map((b) => [b.id, b]))
        registrations = registrations.map((r) => ({
          ...r,
          batch: r.batchId ? map.get(r.batchId) || null : null,
        }))
      } catch {}
    }

    // Get courses info for enrolled course syllabus & workshop specs
    const courses = await (prisma as any).course.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        level: true,
        duration: true,
        syllabus: true,
        skills: true,
        image: true,
        icon: true,
      },
    })

    // Get digital library resources that the student can study
    const libraryResources = await (prisma as any).libraryResource.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    })

    return NextResponse.json({
      student,
      registrations,
      courses,
      libraryResources,
    })
  } catch (error: any) {
    console.error('Error fetching student me:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
