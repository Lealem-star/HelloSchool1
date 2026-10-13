import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET list of inquiries
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const where: any = {}
  if (status && status !== 'All') where.status = status

  const [items, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.$transaction([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'New' } }),
      prisma.inquiry.count({ where: { status: 'Converted' } }),
    ]),
  ])

  return NextResponse.json({
    items,
    overview: {
      total: counts[0],
      new: counts[1],
      converted: counts[2],
    },
  })
}

// PUT update inquiry status
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, status } = await request.json()
    if (!id || !status)
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    const updated = await prisma.inquiry.update({ where: { id }, data: { status } })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE inquiry
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
