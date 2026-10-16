import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ')
  return `"${str}"`
}

// GET list of inquiries or export to CSV
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const format = searchParams.get('format')

  const where: any = {}
  if (status && status !== 'All') {
    if (status === 'Enrolled') {
      where.status = { in: ['Enrolled', 'Converted'] }
    } else {
      where.status = status
    }
  }

  // If CSV export is requested, export all matching inquiries
  if (format === 'csv' || format === 'excel') {
    const allItems = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'ID',
      'Student Name',
      'Phone Number',
      'Email Address',
      'Selected Course',
      'Preferred Contact Method',
      'Experience Level',
      'Student Message',
      'Workflow Status',
      'Consent Given',
      'Submission Date',
    ]

    const rows = allItems.map((i) => [
      i.id,
      i.studentName,
      i.phone,
      i.email || '',
      i.course || '',
      i.preferredContact || '',
      i.experience || '',
      i.message || '',
      i.status === 'Converted' ? 'Enrolled' : i.status,
      i.consent ? 'Yes' : 'No',
      new Date(i.createdAt).toISOString().replace('T', ' ').slice(0, 19),
    ])

    const csvBody =
      '\uFEFF' +
      [headers, ...rows]
        .map((r) => r.map(escapeCsvCell).join(','))
        .join('\r\n')

    const dateStr = new Date().toISOString().slice(0, 10)
    return new Response(csvBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="helloschool_inquiries_${dateStr}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  const [items, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.$transaction([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'New' } }),
      prisma.inquiry.count({ where: { status: 'Contacted' } }),
      prisma.inquiry.count({ where: { status: { in: ['Enrolled', 'Converted'] } } }),
      prisma.inquiry.count({ where: { status: 'Archived' } }),
    ]),
  ])

  return NextResponse.json({
    items,
    overview: {
      total: counts[0],
      new: counts[1],
      contacted: counts[2],
      enrolled: counts[3],
      converted: counts[3],
      archived: counts[4],
    },
  })
}

// PUT update inquiry status (supports single ID or bulk array of IDs)
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, ids, status } = body
    if (!status) {
      return NextResponse.json({ error: 'status required' }, { status: 400 })
    }

    // Bulk status update
    if (Array.isArray(ids) && ids.length > 0) {
      await prisma.inquiry.updateMany({
        where: { id: { in: ids } },
        data: { status },
      })
      return NextResponse.json({ success: true, count: ids.length, status })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    const updated = await prisma.inquiry.update({ where: { id }, data: { status } })
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating inquiry:', e)
    return NextResponse.json({ error: 'Update failed: ' + e.message }, { status: 500 })
  }
}

// DELETE inquiry (supports single ID or bulk comma-separated IDs / payload)
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const idsParam = searchParams.get('ids')

    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean)
      await prisma.inquiry.deleteMany({ where: { id: { in: ids } } })
      return NextResponse.json({ success: true, count: ids.length })
    }

    if (!id) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }

    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting inquiry:', e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
