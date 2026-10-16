import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const db = prisma as any

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
  const search = searchParams.get('search')?.trim()

  const where: any = {}
  if (status && status !== 'All') {
    where.status = status
  }
  if (search) {
    where.OR = [
      { companyName: { contains: search } },
      { contactPerson: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { institutionType: { contains: search } },
      { trainingFocus: { contains: search } },
    ]
  }

  // CSV export
  if (format === 'csv' || format === 'excel') {
    const allItems = await db.companyInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'Inquiry ID',
      'Organization / Company',
      'Institution Sector',
      'Contact Person',
      'Job Title',
      'Official Email',
      'Phone Number',
      'Trainees Count',
      'Training Focus',
      'Preferred Location',
      'Message / Scope',
      'Status',
      'Admin Notes',
      'Submission Date',
    ]

    const rows = allItems.map((item: any) => [
      item.id,
      item.companyName,
      item.institutionType,
      item.contactPerson,
      item.jobTitle || '',
      item.email,
      item.phone,
      item.employeeCount || '',
      item.trainingFocus || '',
      item.location || '',
      item.message || '',
      item.status,
      item.adminNotes || '',
      new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19),
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
        'Content-Disposition': `attachment; filename="helloschool_company_inquiries_${dateStr}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  const [items, counts] = await Promise.all([
    db.companyInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.$transaction([
      db.companyInquiry.count(),
      db.companyInquiry.count({ where: { status: 'New' } }),
      db.companyInquiry.count({ where: { status: 'Contacted' } }),
      db.companyInquiry.count({ where: { status: 'Proposal Sent' } }),
      db.companyInquiry.count({ where: { status: 'In Discussion' } }),
      db.companyInquiry.count({ where: { status: 'Converted' } }),
      db.companyInquiry.count({ where: { status: 'Archived' } }),
    ]),
  ])

  return NextResponse.json({
    items,
    overview: {
      total: counts[0],
      new: counts[1],
      contacted: counts[2],
      proposalSent: counts[3],
      inDiscussion: counts[4],
      converted: counts[5],
      archived: counts[6],
    },
  })
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, ids, status, adminNotes } = body

    if (Array.isArray(ids) && ids.length > 0 && status) {
      await db.companyInquiry.updateMany({
        where: { id: { in: ids } },
        data: { status },
      })
      return NextResponse.json({ success: true, count: ids.length, status })
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes

    const updated = await db.companyInquiry.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating company inquiry:', error)
    return NextResponse.json({ error: 'Update failed: ' + error.message }, { status: 500 })
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
      await db.companyInquiry.deleteMany({
        where: { id: { in: ids } },
      })
      return NextResponse.json({ success: true, count: ids.length })
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.companyInquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting company inquiry:', error)
    return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 })
  }
}
