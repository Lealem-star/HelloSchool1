import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

// GET all categories, optionally filtered by ?type=course or ?type=library
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const where: any = {}
  if (type && (type === 'course' || type === 'library')) {
    where.type = type
  }

  const items = await prisma.category.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ items })
}

// POST create new category
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const name = body.name?.trim()
    const type = body.type?.trim().toLowerCase()
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : 0

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Category name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!type || (type !== 'course' && type !== 'library')) {
      return NextResponse.json(
        { error: 'Category type must be either "course" or "library"' },
        { status: 400 }
      )
    }

    const item = await prisma.category.create({
      data: {
        name,
        type,
        sortOrder,
      },
    })

    revalidatePublicSite()
    return NextResponse.json(item, { status: 201 })
  } catch (e: any) {
    console.error('Error creating category:', e)
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Create failed: ' + e.message }, { status: 500 })
  }
}

// PUT update category
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, name, type, sortOrder } = body

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const updateData: any = {}
    if (name !== undefined) {
      const trimmed = String(name).trim()
      if (trimmed.length < 2) {
        return NextResponse.json(
          { error: 'Category name must be at least 2 characters' },
          { status: 400 }
        )
      }
      updateData.name = trimmed
    }

    if (type !== undefined) {
      const trimmedType = String(type).trim().toLowerCase()
      if (trimmedType !== 'course' && trimmedType !== 'library') {
        return NextResponse.json(
          { error: 'Category type must be either "course" or "library"' },
          { status: 400 }
        )
      }
      updateData.type = trimmedType
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = Number(sortOrder) || 0
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    revalidatePublicSite()
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating category:', e)
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Update failed: ' + e.message }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await prisma.category.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting category:', e)
    return NextResponse.json({ error: 'Delete failed: ' + e.message }, { status: 500 })
  }
}
