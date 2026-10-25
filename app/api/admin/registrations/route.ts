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
          'Content-Disposition': `attachment; filename="hello_technology_registrations_${dateStr}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    // Auto-promote any legacy 'Pending' registrations to 'Enrolled'
    try {
      await p.registration.updateMany({
        where: { status: 'Pending' },
        data: {
          status: 'Enrolled',
          approvedAt: new Date(),
          approvedBy: 'Instant Online Enrollment',
        },
      })
    } catch {}

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

    // Also load digital purchases so online book & course purchases are visible under Self-Paced Enrollments
    try {
      const digitalPurchases = await p.digitalPurchase.findMany({
        include: {
          student: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 300,
      })

      const existingRefs = new Set(items.map((i) => i.transactionRef).filter(Boolean))

      const dpItems = digitalPurchases
        .filter((dp: any) => !dp.transactionRef || !existingRefs.has(dp.transactionRef))
        .map((dp: any) => ({
          id: `dp_${dp.id}`,
          registrationNumber: dp.transactionRef || `ENR-${dp.id.slice(-6).toUpperCase()}`,
          fullName: dp.student?.fullName || 'Online Student',
          phone: dp.student?.phone || '',
          email: dp.student?.personalEmail || dp.student?.institutionalEmail || null,
          telegramUsername: dp.student?.telegramUsername || null,
          city: dp.student?.city || 'Online',
          courseTitle: dp.title || dp.resourceId,
          shift: dp.resourceType === 'manual' || dp.resourceType === 'book' ? 'Digital Book / Manual' : '100% Self-Paced Video Course',
          education: null,
          experienceYears: null,
          paymentPlan: 'full',
          paymentMethod: dp.paymentMethod || 'chapa',
          basePrice: dp.amount || 0,
          discount: 0,
          finalPrice: dp.amount || 0,
          couponCode: null,
          transactionRef: dp.transactionRef,
          receiptUrl: null,
          confirmationLink: null,
          status: 'Enrolled', // Online Chapa payments are automatically enrolled
          adminNotes: `Instant Online ${dp.resourceType === 'manual' || dp.resourceType === 'book' ? 'Book Purchase' : 'Course Enrollment'} via Chapa (Auto-Approved)`,
          approvedAt: dp.createdAt,
          approvedBy: 'Chapa Instant Online Verification',
          createdAt: dp.createdAt,
          updatedAt: dp.updatedAt,
          batchId: null,
          batch: null,
        }))

      items = [...items, ...dpItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (e) {
      console.warn('Error loading digital purchases into registrations view:', e)
    }

    const totalCount = items.length
    const enrolledCount = items.filter((i) => i.status === 'Enrolled' || i.status === 'Approved').length
    const chapaCount = items.filter((i) => i.paymentMethod?.toLowerCase().includes('chapa') || i.transactionRef).length

    return NextResponse.json({
      items,
      overview: {
        total: totalCount,
        pending: 0, // No admin approval needed for automated online enrollments
        approved: chapaCount,
        rejected: items.filter((i) => i.status === 'Rejected').length,
        enrolled: enrolledCount,
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
      if (status === 'Approved' || status === 'Enrolled') {
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
      const regIds = ids.filter((x: string) => !x.startsWith('dp_'))
      const dpIds = ids.filter((x: string) => x.startsWith('dp_')).map((x: string) => x.replace('dp_', ''))
      if (regIds.length > 0) {
        await p.registration.updateMany({
          where: { id: { in: regIds } },
          data,
        })
      }
      if (dpIds.length > 0 && status) {
        await p.digitalPurchase.updateMany({
          where: { id: { in: dpIds } },
          data: { status: status === 'Enrolled' ? 'Active' : status },
        })
      }
      return NextResponse.json({ success: true, count: ids.length, status, batchId })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    if (id.startsWith('dp_')) {
      const realId = id.replace('dp_', '')
      if (status) {
        await p.digitalPurchase.update({
          where: { id: realId },
          data: { status: status === 'Enrolled' ? 'Active' : status },
        })
      }
      return NextResponse.json({ success: true, id })
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

  const p = getPrismaClient()

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const idsParam = searchParams.get('ids')

    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean)
      const regIds = ids.filter((x: string) => !x.startsWith('dp_'))
      const dpIds = ids.filter((x: string) => x.startsWith('dp_')).map((x: string) => x.replace('dp_', ''))
      if (regIds.length > 0) {
        await p.registration.deleteMany({ where: { id: { in: regIds } } })
      }
      if (dpIds.length > 0) {
        await p.digitalPurchase.deleteMany({ where: { id: { in: dpIds } } })
      }
      return NextResponse.json({ success: true, count: ids.length })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    if (id.startsWith('dp_')) {
      await p.digitalPurchase.delete({ where: { id: id.replace('dp_', '') } })
      return NextResponse.json({ success: true })
    }

    await p.registration.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting registration:', e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
