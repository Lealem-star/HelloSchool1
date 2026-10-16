import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.studentProject.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 })
    }

    const item = await prisma.studentProject.create({
      data: {
        title: String(body.title),
        category: body.category ? String(body.category) : null,
        device: body.device ? String(body.device) : null,
        fault: body.fault ? String(body.fault) : null,
        diagnosticProcess: body.diagnosticProcess ? String(body.diagnosticProcess) : null,
        solution: body.solution ? String(body.solution) : null,
        outcome: body.outcome ? String(body.outcome) : null,
        technician: body.technician ? String(body.technician) : null,
        badge: body.badge ? String(body.badge) : null,
        image: body.image ? String(body.image) : null,
        published: typeof body.published === 'boolean' ? body.published : true,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
      },
    })
    revalidatePublicSite()
    return NextResponse.json(item, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Create failed: ' + e.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = {}
    const textFields = ['title', 'category', 'device', 'fault', 'diagnosticProcess', 'solution', 'outcome', 'technician', 'badge', 'image']
    for (const f of textFields) {
      if (rest[f] !== undefined) data[f] = rest[f] ? String(rest[f]) : null
    }
    if (rest.published !== undefined) data.published = Boolean(rest.published)
    if (rest.sortOrder !== undefined) data.sortOrder = Number(rest.sortOrder)

    const updated = await prisma.studentProject.update({ where: { id }, data })
    revalidatePublicSite()
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed: ' + e.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.studentProject.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
