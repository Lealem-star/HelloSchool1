import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ')
  return `"${str}"`
}

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

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const format = searchParams.get('format')

  const where: any = {}
  if (status && status !== 'All') {
    where.status = status
  }

  try {
    // CSV export
    if (format === 'csv' || format === 'excel') {
      const allItems = await p.registration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      const headers = [
        'Registration Number',
        'Student Name',
        'Phone Number',
        'Email',
        'Telegram Username',
        'Course Title',
        'Shift & Schedule',
        'Education Level',
        'Experience',
        'Payment Plan',
        'Payment Method',
        'Final Fee (ETB)',
        'Transaction Ref',
        'Receipt URL',
        'Workflow Status',
        'Admin Notes',
        'Approved At',
        'Approved By',
        'Submission Date',
      ]

      const rows = allItems.map((r: any) => [
        r.registrationNumber,
        r.fullName,
        r.phone,
        r.email || '',
        r.telegramUsername || '',
        r.courseTitle,
        r.shift,
        r.education || '',
        r.experienceYears || '',
        r.paymentPlan,
        r.paymentMethod,
        r.finalPrice,
        r.transactionRef || '',
        r.receiptUrl || '',
        r.status,
        r.adminNotes || '',
        r.approvedAt ? new Date(r.approvedAt).toISOString() : '',
        r.approvedBy || '',
        new Date(r.createdAt).toISOString().replace('T', ' ').slice(0, 19),
      ])

      const csvBody =
        '\uFEFF' +
        [headers, ...rows]
          .map((row) => row.map(escapeCsvCell).join(','))
          .join('\r\n')

      const dateStr = new Date().toISOString().slice(0, 10)
      return new Response(csvBody, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="helloschool_registrations_${dateStr}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    let items: any[] = []
    try {
      items = await p.registration.findMany({
        where,
        include: {
          batch: {
            select: {
              id: true,
              batchNumber: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 300,
      })
    } catch (queryErr) {
      console.warn('Prisma include batch failed, falling back to raw query:', queryErr)
      items = await p.registration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 300,
      })
      try {
        const rawRegs = (await p.$queryRaw`
          SELECT id, batchId FROM Registration
        `) as any[]
        const regBatchMap = new Map(rawRegs.map((r) => [r.id, r.batchId]))

        const rawBatches = (await p.$queryRaw`
          SELECT id, batchNumber, title, status FROM Batch
        `) as any[]
        const batchMap = new Map(rawBatches.map((b) => [b.id, b]))

        items = items.map((it) => {
          const bId = it.batchId || regBatchMap.get(it.id) || null
          return {
            ...it,
            batchId: bId,
            batch: bId ? batchMap.get(bId) || null : null,
          }
        })
      } catch {}
    }

    const counts = await p.$transaction([
      p.registration.count(),
      p.registration.count({ where: { status: 'Pending' } }),
      p.registration.count({ where: { status: 'Approved' } }),
      p.registration.count({ where: { status: 'Rejected' } }),
      p.registration.count({ where: { status: 'Enrolled' } }),
    ])

    return NextResponse.json({
      items,
      overview: {
        total: counts[0],
        pending: counts[1],
        approved: counts[2],
        rejected: counts[3],
        enrolled: counts[4],
      },
    })
  } catch (err: any) {
    console.error('Error fetching registrations:', err)
    return NextResponse.json({ error: err.message || 'Failed to load registrations' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const body = await request.json()
    const { id, ids, status, adminNotes, batchId } = body

    if (!status && adminNotes === undefined && batchId === undefined) {
      return NextResponse.json({ error: 'status, adminNotes or batchId required' }, { status: 400 })
    }

    const data: any = {}
    if (status) {
      data.status = status
      if (status === 'Approved') {
        data.approvedAt = new Date()
        data.approvedBy = user.email || 'Admin'
      }
    }
    if (adminNotes !== undefined) {
      data.adminNotes = adminNotes ? String(adminNotes) : null
    }
    if (batchId !== undefined) {
      data.batchId = batchId || null
    }

    // Bulk update
    if (Array.isArray(ids) && ids.length > 0) {
      await p.registration.updateMany({
        where: { id: { in: ids } },
        data,
      })
      return NextResponse.json({ success: true, count: ids.length, status, batchId })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    let updated: any
    try {
      updated = await p.registration.update({
        where: { id },
        data,
        include: {
          batch: {
            select: {
              id: true,
              batchNumber: true,
              title: true,
              status: true,
            },
          },
        },
      })
    } catch {
      updated = await p.registration.update({
        where: { id },
        data,
      })
    }

    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating registration:', e)
    return NextResponse.json({ error: 'Update failed: ' + e.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const idsParam = searchParams.get('ids')

    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean)
      await prisma.registration.deleteMany({ where: { id: { in: ids } } })
      return NextResponse.json({ success: true, count: ids.length })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    await prisma.registration.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting registration:', e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
