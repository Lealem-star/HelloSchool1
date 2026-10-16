import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.workshopFacility.findMany({
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

    const item = await prisma.workshopFacility.create({
      data: {
        title: String(body.title),
        description: body.description ? String(body.description) : null,
        icon: body.icon ? String(body.icon) : 'Wrench',
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
    if (rest.title !== undefined) data.title = String(rest.title)
    if (rest.description !== undefined) data.description = rest.description ? String(rest.description) : null
    if (rest.icon !== undefined) data.icon = rest.icon ? String(rest.icon) : 'Wrench'
    if (rest.image !== undefined) data.image = rest.image ? String(rest.image) : null
    if (rest.published !== undefined) data.published = Boolean(rest.published)
    if (rest.sortOrder !== undefined) data.sortOrder = Number(rest.sortOrder)

    const updated = await prisma.workshopFacility.update({ where: { id }, data })
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
    await prisma.workshopFacility.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
