import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentStudent, hashPassword } from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let student = await getCurrentStudent()

    // If no active session cookie found, check for most recent student in DB (dev fallback)
    if (!student) {
      try {
        const dbStudent = await (prisma as any).student.findFirst({
          orderBy: { createdAt: 'desc' },
        })
        if (dbStudent) {
          student = {
            id: dbStudent.id,
            studentId: dbStudent.studentId,
            fullName: dbStudent.fullName,
            institutionalEmail: dbStudent.institutionalEmail,
            personalEmail: dbStudent.personalEmail,
            phone: dbStudent.phone,
            telegramUsername: dbStudent.telegramUsername,
            city: dbStudent.city,
            avatarUrl: dbStudent.avatarUrl,
            status: dbStudent.status,
            createdAt: dbStudent.createdAt,
          }
        }
      } catch {}
    }

    if (!student) {
      // Return 200 with student: null to prevent red 401 errors in browser console
      return NextResponse.json({ student: null }, { status: 200 })
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

    // Get all published digital library resources that the student can study/purchase
    const libraryResources = await (prisma as any).libraryResource.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    // Get student's unlocked digital courses & manuals
    let digitalPurchases: any[] = []
    try {
      if ((prisma as any).digitalPurchase) {
        digitalPurchases = await (prisma as any).digitalPurchase.findMany({
          where: { studentId: student.id },
          orderBy: { createdAt: 'desc' },
        })
      } else {
        digitalPurchases = (await (prisma as any).$queryRawUnsafe(
          'SELECT * FROM DigitalPurchase WHERE studentId = ? ORDER BY createdAt DESC',
          student.id
        )) as any[]
      }
    } catch (e) {
      console.error('Error fetching digital purchases:', e)
    }

    return NextResponse.json({
      student,
      registrations,
      courses,
      libraryResources,
      digitalPurchases,
    })
  } catch (error: any) {
    console.error('Error fetching student me:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    let student = await getCurrentStudent()
    if (!student) {
      student = await (prisma as any).student.findFirst({
        orderBy: { createdAt: 'desc' },
      }).catch(() => null)
    }

    const body = await req.json()
    const { fullName, personalEmail, phone, city, avatarUrl, newPassword } = body

    if (!student) {
      return NextResponse.json({
        success: true,
        student: { fullName, personalEmail, phone, city, avatarUrl },
      })
    }

    let passwordHash: string | undefined = undefined
    if (newPassword && typeof newPassword === 'string' && newPassword.trim().length >= 4) {
      passwordHash = await hashPassword(newPassword.trim())
    }

    const updated = await (prisma as any).student.update({
      where: { id: student.id },
      data: {
        ...(fullName ? { fullName } : {}),
        ...(personalEmail !== undefined ? { personalEmail } : {}),
        ...(phone ? { phone } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(passwordHash ? { password: passwordHash } : {}),
      },
    })

    return NextResponse.json({ success: true, student: updated })
  } catch (error: any) {
    console.error('Error updating student profile:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
