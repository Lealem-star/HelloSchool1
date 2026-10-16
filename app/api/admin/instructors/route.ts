import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

function serializeSpecialties(input: any): string {
  if (Array.isArray(input)) return JSON.stringify(input.map(String).map((s) => s.trim()).filter(Boolean))
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String))
    } catch {
      return JSON.stringify(input.split(',').map((s) => s.trim()).filter(Boolean))
    }
  }
  return JSON.stringify([])
}

function parseSpecialties(input: any): string[] {
  if (Array.isArray(input)) return input.map(String)
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      if (Array.isArray(parsed)) return parsed.map(String)
    } catch {
      return input.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.instructor.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  const formatted = items.map((i) => ({
    ...i,
    specialties: parseSpecialties(i.specialties),
  }))
  return NextResponse.json({ items: formatted })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'name and role required' }, { status: 400 })
    }

    const item = await prisma.instructor.create({
      data: {
        name: String(body.name),
        role: String(body.role),
        experience: body.experience ? String(body.experience) : null,
        bio: body.bio ? String(body.bio) : null,
        specialties: serializeSpecialties(body.specialties),
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
    if (rest.name !== undefined) data.name = String(rest.name)
    if (rest.role !== undefined) data.role = String(rest.role)
    if (rest.experience !== undefined) data.experience = rest.experience ? String(rest.experience) : null
    if (rest.bio !== undefined) data.bio = rest.bio ? String(rest.bio) : null
    if (rest.specialties !== undefined) data.specialties = serializeSpecialties(rest.specialties)
    if (rest.image !== undefined) data.image = rest.image ? String(rest.image) : null
    if (rest.published !== undefined) data.published = Boolean(rest.published)
    if (rest.sortOrder !== undefined) data.sortOrder = Number(rest.sortOrder)

    const updated = await prisma.instructor.update({ where: { id }, data })
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
    await prisma.instructor.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
