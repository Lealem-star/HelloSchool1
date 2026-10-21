import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentStudent } from '@/lib/student-auth'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resourceId, lessonId } = await req.json()
    if (!resourceId || !lessonId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const existing = await (prisma as any).digitalPurchase.findUnique({
      where: {
        studentId_resourceId: {
          studentId: student.id,
          resourceId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Resource not unlocked' }, { status: 404 })
    }

    let completed: string[] = []
    try {
      if (existing.completedLessons) {
        completed = JSON.parse(existing.completedLessons)
      }
    } catch {
      completed = []
    }

    if (completed.includes(lessonId)) {
      completed = completed.filter((id) => id !== lessonId)
    } else {
      completed.push(lessonId)
    }

    const totalLessons = DIGITAL_CATALOG[resourceId]?.lessons?.length || 1
    const progress = Math.min(100, Math.round((completed.length / totalLessons) * 100))

    const updated = await (prisma as any).digitalPurchase.update({
      where: { id: existing.id },
      data: {
        completedLessons: JSON.stringify(completed),
        progress,
      },
    })

    return NextResponse.json({
      success: true,
      completed,
      progress,
    })
  } catch (error: any) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
