import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.libraryResource.findMany({
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
    if (!body.title || !body.category)
      return NextResponse.json(
        { error: 'title and category required' },
        { status: 400 }
      )
    const priceETBVal = typeof body.priceETB === 'number' 
      ? body.priceETB 
      : parseInt(String(body.price || '').replace(/[^0-9]/g, ''), 10) || 0

    const item = await (prisma as any).libraryResource.create({
      data: {
        title: String(body.title),
        subtitle: body.subtitle ? String(body.subtitle) : null,
        category: String(body.category),
        description: body.description ? String(body.description) : null,
        format: body.format ? String(body.format) : 'Technical Repair Manual',
        level: body.level ? String(body.level) : 'All Skill Levels',
        status: body.status ? String(body.status) : 'Available',
        price: body.price ? String(body.price) : `${priceETBVal} ETB`,
        priceETB: priceETBVal,
        pages: body.pages ? String(body.pages) : null,
        fileUrl: body.fileUrl ? String(body.fileUrl) : null,
        thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : null,
        instructor: body.instructor ? String(body.instructor) : 'Hello Technology Faculty',
        instructorRole: body.instructorRole ? String(body.instructorRole) : 'Technical Instructor',
        rating: typeof body.rating === 'number' ? body.rating : 4.9,
        reviewCount: typeof body.reviewCount === 'number' ? body.reviewCount : 100,
        badgeText: body.badgeText ? String(body.badgeText) : null,
        skillsLearned: body.skillsLearned ? (typeof body.skillsLearned === 'string' ? body.skillsLearned : JSON.stringify(body.skillsLearned)) : null,
        lessons: body.lessons ? (typeof body.lessons === 'string' ? body.lessons : JSON.stringify(body.lessons)) : null,
        chapters: body.chapters ? (typeof body.chapters === 'string' ? body.chapters : JSON.stringify(body.chapters)) : null,
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
    const fields = [
      'title',
      'subtitle',
      'category',
      'description',
      'format',
      'level',
      'status',
      'price',
      'priceETB',
      'pages',
      'fileUrl',
      'thumbnailUrl',
      'instructor',
      'instructorRole',
      'badgeText',
      'rating',
      'reviewCount',
      'skillsLearned',
      'lessons',
      'chapters',
      'sortOrder',
      'published',
    ]
    for (const f of fields) {
      if (rest[f] !== undefined) {
        if (f === 'published') data[f] = Boolean(rest[f])
        else if (f === 'sortOrder' || f === 'priceETB' || f === 'reviewCount') data[f] = Number(rest[f])
        else if (f === 'rating') data[f] = parseFloat(String(rest[f])) || 4.9
        else if (f === 'lessons' || f === 'chapters' || f === 'skillsLearned') {
          data[f] = typeof rest[f] === 'string' ? rest[f] : JSON.stringify(rest[f])
        } else {
          data[f] = String(rest[f])
        }
      }
    }
    const updated = await (prisma as any).libraryResource.update({ where: { id }, data })
    revalidatePublicSite()
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed: ' + e.message }, { status: 500 })
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
    await prisma.libraryResource.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
