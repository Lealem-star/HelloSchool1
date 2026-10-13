import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.trainingGallery.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ items })
}

// POST create (admin)
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body.title || !body.image)
      return NextResponse.json(
        { error: 'title and image required' },
        { status: 400 }
      )
    const item = await prisma.trainingGallery.create({
      data: {
        title: String(body.title),
        description: body.description ? String(body.description) : null,
        image: String(body.image),
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

// PUT update (admin)
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const data: any = {}
    const fields = ['title', 'description', 'image', 'sortOrder', 'published']
    for (const f of fields) {
      if (rest[f] !== undefined) {
        if (f === 'published') data[f] = Boolean(rest[f])
        else if (f === 'sortOrder') data[f] = Number(rest[f])
        else data[f] = String(rest[f])
      }
    }
    const updated = await prisma.trainingGallery.update({ where: { id }, data })
    revalidatePublicSite()
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE (admin)
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.trainingGallery.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
