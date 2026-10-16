import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'

function parseSkills(skills: string | null | undefined): string[] {
  if (!skills) return []
  try {
    const parsed = JSON.parse(skills)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function parseSyllabus(syllabus: string | null | undefined): any[] {
  if (!syllabus) return []
  try {
    const parsed = JSON.parse(syllabus)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const courses = await prisma.course.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  // Deserialize skills and syllabus JSON strings -> arrays
  const serialized = courses.map((c) => ({
    ...c,
    skills: parseSkills(c.skills),
    syllabus: parseSyllabus(c.syllabus),
  }))
  return NextResponse.json({ items: serialized })
}

// POST create new course (admin only)
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const {
      slug,
      title,
      category,
      level,
      description,
      icon,
      audience,
      prerequisites,
      duration,
      price,
      image,
      skills,
      syllabus,
      published,
      sortOrder,
    } = body

    if (!slug || !title || !category) {
      return NextResponse.json(
        { error: 'slug, title, and category are required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        slug: String(slug),
        title: String(title),
        category: String(category),
        level: level ? String(level) : null,
        description: description ? String(description) : null,
        icon: icon ? String(icon) : null,
        audience: audience ? String(audience) : null,
        prerequisites: prerequisites ? String(prerequisites) : null,
        duration: duration ? String(duration) : null,
        price: price ? String(price) : null,
        image: image ? String(image) : null,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        syllabus: JSON.stringify(Array.isArray(syllabus) ? syllabus : []),
        published: typeof published === 'boolean' ? published : true,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    })

    revalidatePublicSite()
    return NextResponse.json(
      {
        ...course,
        skills: parseSkills(course.skills),
        syllabus: parseSyllabus(course.syllabus),
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error(e)
    if (e.code === 'P2002')
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Create failed: ' + e.message }, { status: 500 })
  }
}

// PUT update course (admin only)
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const updateData: any = {}
    const fields = [
      'slug',
      'title',
      'category',
      'level',
      'description',
      'icon',
      'audience',
      'prerequisites',
      'duration',
      'price',
      'image',
      'published',
      'sortOrder',
    ]
    for (const f of fields) {
      if (data[f] !== undefined) {
        if (f === 'published') updateData[f] = Boolean(data[f])
        else if (f === 'sortOrder') updateData[f] = Number(data[f])
        else updateData[f] = String(data[f])
      }
    }
    if (Array.isArray(data.skills)) {
      updateData.skills = JSON.stringify(data.skills)
    }
    if (Array.isArray(data.syllabus)) {
      updateData.syllabus = JSON.stringify(data.syllabus)
    }

    const updated = await prisma.course.update({
      where: { id },
      data: updateData,
    })
    revalidatePublicSite()
    return NextResponse.json({
      ...updated,
      skills: parseSkills(updated.skills),
      syllabus: parseSyllabus(updated.syllabus),
    })
  } catch (e: any) {
    console.error(e)
    if (e.code === 'P2002')
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE course (admin only)
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.course.delete({ where: { id } })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
