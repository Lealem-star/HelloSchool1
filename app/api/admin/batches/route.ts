import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function getPrismaClient() {
  let p: any = prisma
  if (!p.batch) {
    try {
      const { PrismaClient } = require('@prisma/client')
      p = new PrismaClient()
    } catch {
      p = prisma
    }
  }
  return p
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    let batches: any[] = []

    if (p.batch) {
      batches = await p.batch.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          registrations: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              registrationNumber: true,
              fullName: true,
              phone: true,
              email: true,
              courseTitle: true,
              shift: true,
              status: true,
              finalPrice: true,
              createdAt: true,
            },
          },
        },
      })
    } else {
      // Raw SQL fallback
      const rawBatches = await p.$queryRaw`
        SELECT * FROM Batch ORDER BY sortOrder ASC, createdAt DESC
      `
      batches = Array.isArray(rawBatches) ? rawBatches : []
      // Load registrations for each batch
      for (const b of batches) {
        const regs = await p.$queryRaw`
          SELECT id, registrationNumber, fullName, phone, email, courseTitle, shift, status, finalPrice, createdAt
          FROM Registration WHERE batchId = ${b.id}
          ORDER BY createdAt DESC
        `
        b.registrations = Array.isArray(regs) ? regs : []
      }
    }

    // Process batches to attach course and shift breakdown
    const enrichedBatches = batches.map((b: any) => {
      const regs = b.registrations || []

      // Course breakdown
      const courseMap: Record<string, any[]> = {}
      regs.forEach((r: any) => {
        const c = r.courseTitle || 'General Technical Track'
        if (!courseMap[c]) courseMap[c] = []
        courseMap[c].push(r)
      })

      const courseBreakdown = Object.entries(courseMap).map(([courseTitle, students]) => ({
        courseTitle,
        studentCount: students.length,
        students,
      })).sort((a, b) => b.studentCount - a.studentCount)

      // Shift breakdown
      const shiftMap: Record<string, number> = {}
      regs.forEach((r: any) => {
        const s = r.shift || 'General'
        shiftMap[s] = (shiftMap[s] || 0) + 1
      })

      const shiftBreakdown = Object.entries(shiftMap).map(([shift, count]) => ({
        shift,
        count,
      }))

      return {
        ...b,
        enrolledCount: regs.length,
        courseBreakdown,
        shiftBreakdown,
      }
    })

    // Compute overview
    const overview = {
      totalBatches: enrichedBatches.length,
      openBatches: enrichedBatches.filter((b) => b.status === 'Open').length,
      activeBatches: enrichedBatches.filter((b) => b.status === 'Active' || b.status === 'In Progress').length,
      completedBatches: enrichedBatches.filter((b) => b.status === 'Completed').length,
      upcomingBatches: enrichedBatches.filter((b) => b.status === 'Upcoming').length,
      totalEnrolledTrainees: enrichedBatches.reduce((acc, b) => acc + b.enrolledCount, 0),
    }

    // Available courses from all registrations & catalog
    const allCoursesSet = new Set<string>()
    enrichedBatches.forEach((b) =>
      b.courseBreakdown.forEach((cb: any) => allCoursesSet.add(cb.courseTitle))
    )

    // Also get unassigned students or all candidate students
    let candidateStudents: any[] = []
    try {
      const allRegs = await (p.registration || prisma.registration).findMany({
        where: { status: { in: ['Pending', 'Approved', 'Enrolled'] } },
        select: {
          id: true,
          registrationNumber: true,
          fullName: true,
          phone: true,
          email: true,
          courseTitle: true,
          shift: true,
          status: true,
          batchId: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      candidateStudents = allRegs
    } catch {
      // Raw fallback
      const rawRegs = await p.$queryRaw`
        SELECT id, registrationNumber, fullName, phone, email, courseTitle, shift, status, batchId
        FROM Registration
        ORDER BY createdAt DESC
      `
      candidateStudents = Array.isArray(rawRegs) ? rawRegs : []
    }

    candidateStudents.forEach((cs) => {
      if (cs.courseTitle) allCoursesSet.add(cs.courseTitle)
    })

    return NextResponse.json({
      batches: enrichedBatches,
      overview,
      courses: Array.from(allCoursesSet).filter(Boolean).sort(),
      candidateStudents,
    })
  } catch (err: any) {
    console.error('Error in GET /api/admin/batches:', err)
    return NextResponse.json({ error: 'Failed to fetch batches: ' + err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const body = await request.json()
    const {
      batchNumber,
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      status,
      capacity,
      campus,
      notes,
      sortOrder,
    } = body

    if (!batchNumber?.trim() || !title?.trim()) {
      return NextResponse.json(
        { error: 'Batch Number (e.g. "Batch 03") and Title are required' },
        { status: 400 }
      )
    }

    const cleanBatchNum = batchNumber.trim()
    const cleanTitle = title.trim()

    let newBatch: any = null

    if (p.batch) {
      newBatch = await p.batch.create({
        data: {
          batchNumber: cleanBatchNum,
          title: cleanTitle,
          description: description?.trim() || null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
          status: status || 'Open',
          capacity: Number(capacity) || 60,
          campus: campus?.trim() || 'Bahir Dar Campus',
          notes: notes?.trim() || null,
          sortOrder: Number(sortOrder) || 0,
        },
      })
    } else {
      const { randomUUID } = require('crypto')
      const newId = 'batch_' + randomUUID().replace(/-/g, '').slice(0, 16)
      await p.$executeRaw`
        INSERT INTO Batch (
          id, batchNumber, title, description, startDate, endDate, registrationDeadline,
          status, capacity, campus, notes, sortOrder, createdAt, updatedAt
        ) VALUES (
          ${newId},
          ${cleanBatchNum},
          ${cleanTitle},
          ${description?.trim() || null},
          ${startDate ? new Date(startDate) : null},
          ${endDate ? new Date(endDate) : null},
          ${registrationDeadline ? new Date(registrationDeadline) : null},
          ${status || 'Open'},
          ${Number(capacity) || 60},
          ${campus?.trim() || 'Bahir Dar Campus'},
          ${notes?.trim() || null},
          ${Number(sortOrder) || 0},
          NOW(),
          NOW()
        )
      `
      newBatch = { id: newId, batchNumber: cleanBatchNum, title: cleanTitle }
    }

    return NextResponse.json(newBatch, { status: 201 })
  } catch (err: any) {
    console.error('Error in POST /api/admin/batches:', err)
    return NextResponse.json({ error: 'Failed to create batch: ' + err.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const body = await request.json()
    const {
      id,
      batchNumber,
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      status,
      capacity,
      campus,
      notes,
      sortOrder,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 })
    }

    if (p.batch) {
      const updated = await p.batch.update({
        where: { id },
        data: {
          ...(batchNumber && { batchNumber: batchNumber.trim() }),
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description: description?.trim() || null }),
          ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
          ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
          ...(registrationDeadline !== undefined && {
            registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
          }),
          ...(status && { status }),
          ...(capacity !== undefined && { capacity: Number(capacity) || 60 }),
          ...(campus !== undefined && { campus: campus?.trim() || 'Bahir Dar Campus' }),
          ...(notes !== undefined && { notes: notes?.trim() || null }),
          ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        },
      })
      return NextResponse.json(updated)
    } else {
      await p.$executeRaw`
        UPDATE Batch SET
          batchNumber = COALESCE(${batchNumber ? batchNumber.trim() : null}, batchNumber),
          title = COALESCE(${title ? title.trim() : null}, title),
          status = COALESCE(${status || null}, status),
          capacity = COALESCE(${capacity ? Number(capacity) : null}, capacity),
          updatedAt = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ id, success: true })
    }
  } catch (err: any) {
    console.error('Error in PUT /api/admin/batches:', err)
    return NextResponse.json({ error: 'Failed to update batch: ' + err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 })
    }

    if (p.batch) {
      await p.batch.delete({ where: { id } })
    } else {
      // Unlink registrations from this batch
      await p.$executeRaw`UPDATE Registration SET batchId = NULL WHERE batchId = ${id}`
      await p.$executeRaw`DELETE FROM Batch WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/batches:', err)
    return NextResponse.json({ error: 'Failed to delete batch: ' + err.message }, { status: 500 })
  }
}
