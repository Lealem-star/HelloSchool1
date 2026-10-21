import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let purchases: any[] = []

    if ((prisma as any).digitalPurchase) {
      const where: any = {}
      if (status && status !== 'All') {
        where.status = status
      }

      purchases = await (prisma as any).digitalPurchase.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              studentId: true,
              phone: true,
              institutionalEmail: true,
              personalEmail: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      let rows: any[] = []
      if (status && status !== 'All') {
        rows = (await (prisma as any).$queryRawUnsafe(
          `SELECT dp.*, s.fullName, s.studentId as s_studentId, s.phone, s.institutionalEmail, s.personalEmail 
           FROM DigitalPurchase dp 
           LEFT JOIN Student s ON dp.studentId = s.id 
           WHERE dp.status = ? 
           ORDER BY dp.createdAt DESC`,
          status
        )) as any[]
      } else {
        rows = (await (prisma as any).$queryRawUnsafe(
          `SELECT dp.*, s.fullName, s.studentId as s_studentId, s.phone, s.institutionalEmail, s.personalEmail 
           FROM DigitalPurchase dp 
           LEFT JOIN Student s ON dp.studentId = s.id 
           ORDER BY dp.createdAt DESC`
        )) as any[]
      }

      purchases = rows.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        resourceId: r.resourceId,
        resourceType: r.resourceType,
        title: r.title,
        amount: r.amount,
        paymentMethod: r.paymentMethod,
        transactionRef: r.transactionRef,
        status: r.status,
        progress: r.progress,
        completedLessons: r.completedLessons,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        student: {
          id: r.studentId,
          fullName: r.fullName,
          studentId: r.s_studentId,
          phone: r.phone,
          institutionalEmail: r.institutionalEmail,
          personalEmail: r.personalEmail,
        },
      }))
    }

    return NextResponse.json({ purchases })
  } catch (error: any) {
    console.error('Error fetching admin digital purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Purchase ID and status are required' },
        { status: 400 }
      )
    }

    let updated: any = null

    if ((prisma as any).digitalPurchase) {
      updated = await (prisma as any).digitalPurchase.update({
        where: { id },
        data: { status },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              studentId: true,
              phone: true,
              institutionalEmail: true,
            },
          },
        },
      })
    } else {
      await (prisma as any).$executeRawUnsafe(
        'UPDATE DigitalPurchase SET status = ?, updatedAt = NOW(3) WHERE id = ?',
        status,
        id
      )
      const rows = (await (prisma as any).$queryRawUnsafe(
        `SELECT dp.*, s.fullName, s.studentId as s_studentId, s.phone, s.institutionalEmail 
         FROM DigitalPurchase dp 
         LEFT JOIN Student s ON dp.studentId = s.id 
         WHERE dp.id = ? LIMIT 1`,
        id
      )) as any[]

      if (rows && rows.length > 0) {
        const r = rows[0]
        updated = {
          ...r,
          status,
          student: {
            id: r.studentId,
            fullName: r.fullName,
            studentId: r.s_studentId,
            phone: r.phone,
            institutionalEmail: r.institutionalEmail,
          },
        }
      }
    }

    return NextResponse.json({ success: true, purchase: updated })
  } catch (error: any) {
    console.error('Error updating purchase status:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase: ' + error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Purchase ID is required' }, { status: 400 })
    }

    if ((prisma as any).digitalPurchase) {
      await (prisma as any).digitalPurchase.delete({
        where: { id },
      })
    } else {
      await (prisma as any).$executeRawUnsafe(
        'DELETE FROM DigitalPurchase WHERE id = ?',
        id
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting purchase:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase: ' + error.message },
      { status: 500 }
    )
  }
}
