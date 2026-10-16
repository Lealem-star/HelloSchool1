import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ')
  return `"${str}"`
}

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const format = searchParams.get('format')

  const where: any = {}
  if (status && status !== 'All') {
    where.status = status
  }

  // CSV export
  if (format === 'csv' || format === 'excel') {
    const allItems = await prisma.registration.findMany({
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

    const rows = allItems.map((r) => [
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

  const [items, counts] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    prisma.$transaction([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: 'Pending' } }),
      prisma.registration.count({ where: { status: 'Approved' } }),
      prisma.registration.count({ where: { status: 'Rejected' } }),
      prisma.registration.count({ where: { status: 'Enrolled' } }),
    ]),
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
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, ids, status, adminNotes } = body

    if (!status && adminNotes === undefined) {
      return NextResponse.json({ error: 'status or adminNotes required' }, { status: 400 })
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

    // Bulk update
    if (Array.isArray(ids) && ids.length > 0) {
      await prisma.registration.updateMany({
        where: { id: { in: ids } },
        data,
      })
      return NextResponse.json({ success: true, count: ids.length, status })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    const updated = await prisma.registration.update({
      where: { id },
      data,
    })

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
