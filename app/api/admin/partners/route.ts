import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const db = prisma as any

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let partners = await db.trustedPartner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  // Auto-seed initial demo partners if table is empty
  if (partners.length === 0) {
    const initial = [
      {
        name: 'Felege Hiwot Comprehensive Specialized Hospital',
        category: 'Hospitals & Biomedical',
        logoUrl: '/images/helloschool.jpg',
        description: 'Biomedical electronics & clinical equipment maintenance training.',
        sortOrder: 1,
      },
      {
        name: 'Bahir Dar University (BDU)',
        category: 'Universities & Higher Ed',
        logoUrl: '/images/helloschool.jpg',
        description: 'Electronics lab technicians & hardware repair practical cohorts.',
        sortOrder: 2,
      },
      {
        name: 'Ethio Telecom Regional Hub',
        category: 'Telecom & Enterprise IT',
        logoUrl: '/images/helloschool.jpg',
        description: 'Hardware diagnostics, PCB rework & telecom technician upskilling.',
        sortOrder: 3,
      },
      {
        name: 'Amhara Industrial Parks Development',
        category: 'Industries & Manufacturing',
        logoUrl: '/images/helloschool.jpg',
        description: 'Factory automation electronics, sensory control & motor drive circuits.',
        sortOrder: 4,
      },
      {
        name: 'Tana Drilling & Electro-Mechanical',
        category: 'Industrial Engineering',
        logoUrl: '/images/helloschool.jpg',
        description: 'Power electronics, instrumentation control & field diagnostic protocols.',
        sortOrder: 5,
      },
      {
        name: 'Commercial Bank of Ethiopia',
        category: 'Banking & Corporate Systems',
        logoUrl: '/images/helloschool.jpg',
        description: 'Server hardware, automated teller boards & secure IT maintenance.',
        sortOrder: 6,
      },
    ]

    for (const item of initial) {
      await db.trustedPartner.create({ data: item })
    }

    partners = await db.trustedPartner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  }

  return NextResponse.json(partners)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const logoUrl = String(body.logoUrl || '').trim()

    if (!name) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 })
    }
    if (!logoUrl) {
      return NextResponse.json({ error: 'Partner logo is required' }, { status: 400 })
    }

    const partner = await db.trustedPartner.create({
      data: {
        name,
        category: body.category?.trim() || 'Institution',
        logoUrl,
        websiteUrl: body.websiteUrl?.trim() || null,
        description: body.description?.trim() || null,
        published: body.published !== false,
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error: any) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Failed to create partner: ' + error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const id = body.id
    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.category !== undefined) updateData.category = body.category.trim()
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl.trim()
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl?.trim() || null
    if (body.description !== undefined) updateData.description = body.description?.trim() || null
    if (body.published !== undefined) updateData.published = Boolean(body.published)
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder) || 0

    const updated = await db.trustedPartner.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ error: 'Failed to update partner: ' + error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    await db.trustedPartner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 })
  }
}
