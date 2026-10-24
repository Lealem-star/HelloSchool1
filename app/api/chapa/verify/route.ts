import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentStudent } from '@/lib/student-auth'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

async function verifyAndActivateTransaction(tx_ref: string, resourceId?: string) {
  const chapaSecret = process.env.CHAPA_SECRET_KEY
  if (!chapaSecret) {
    throw new Error('Chapa secret key is not configured in server environment')
  }

  // 1. Verify with official Chapa API
  const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${chapaSecret}`,
    },
  })

  const chapaData = await verifyRes.json()
  if (chapaData.status !== 'success' || !chapaData.data) {
    return {
      success: false,
      error: chapaData.message || 'Payment not verified by Chapa',
      status: chapaData.status,
    }
  }

  const paymentData = chapaData.data
  // Chapa payment status can be 'success'
  if (paymentData.status !== 'success') {
    return {
      success: false,
      error: `Transaction status is '${paymentData.status}'. Payment not completed yet.`,
    }
  }

  // 2. Identify the resource (from param or tx_ref prefix or meta)
  let resolvedResourceId = resourceId
  if (!resolvedResourceId) {
    // Check if tx_ref has resourceId encoded: e.g. HT-course-1-timestamp
    const match = tx_ref.match(/^HT-([a-zA-Z0-9-_]+)-\d+$/)
    if (match) resolvedResourceId = match[1]
  }

  // 3. Resolve student from current session or email/phone from Chapa payload
  let student = await getCurrentStudent()
  if (!student && paymentData.email) {
    student = await (prisma as any).student.findFirst({
      where: {
        OR: [
          { personalEmail: paymentData.email },
          { institutionalEmail: paymentData.email },
          paymentData.phone_number ? { phone: paymentData.phone_number } : { phone: '__impossible__' },
        ],
      },
    })
  }

  if (!student) {
    return {
      success: false,
      error: 'Could not associate verified payment with a student account. Please log in.',
    }
  }

  // 4. Fetch resource details from Prisma or catalog fallback
  let dbResource: any = null
  if (resolvedResourceId) {
    try {
      dbResource = await (prisma as any).libraryResource.findUnique({
        where: { id: resolvedResourceId },
      })
    } catch {}
  }

  const catalogItem = resolvedResourceId ? DIGITAL_CATALOG[resolvedResourceId] : null
  const title = dbResource?.title || catalogItem?.title || paymentData.customization?.description || 'Hello Technology Academy Course'
  const isVideo = (dbResource?.format || catalogItem?.format || '').toLowerCase().includes('video')
  const resourceType = isVideo ? 'video_course' : 'manual'
  const amount = Number(paymentData.amount) || dbResource?.priceETB || 0
  const paymentMethod = paymentData.method ? `chapa_${paymentData.method}` : 'chapa'

  // 5. Activate DigitalPurchase record in database
  let purchase: any = null
  if (resolvedResourceId) {
    try {
      purchase = await (prisma as any).digitalPurchase.upsert({
        where: {
          studentId_resourceId: {
            studentId: student.id,
            resourceId: resolvedResourceId,
          },
        },
        update: {
          status: 'Active',
          paymentMethod,
          transactionRef: tx_ref,
          amount,
          updatedAt: new Date(),
        },
        create: {
          studentId: student.id,
          resourceId: resolvedResourceId,
          resourceType,
          title,
          amount,
          paymentMethod,
          transactionRef: tx_ref,
          status: 'Active',
          progress: 0,
          completedLessons: JSON.stringify([]),
        },
      })
    } catch (e) {
      // Fallback raw query
      await (prisma as any).$executeRawUnsafe(
        'INSERT INTO DigitalPurchase (id, studentId, resourceId, resourceType, title, amount, paymentMethod, transactionRef, status, progress, completedLessons, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Active", 0, "[]", NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE status = "Active", transactionRef = ?, updatedAt = NOW(3)',
        'dp_' + Date.now().toString(36),
        student.id,
        resolvedResourceId,
        resourceType,
        title,
        amount,
        paymentMethod,
        tx_ref,
        tx_ref
      )
      purchase = {
        studentId: student.id,
        resourceId: resolvedResourceId,
        status: 'Active',
        transactionRef: tx_ref,
      }
    }
  }

  return {
    success: true,
    verified: true,
    purchase,
    payment: paymentData,
    student: {
      id: student.id,
      fullName: student.fullName,
      email: student.institutionalEmail,
    },
    resourceId: resolvedResourceId,
  }
}

// POST: called by frontend modal to verify real Chapa transaction
export async function POST(request: Request) {
  try {
    const { tx_ref, resourceId } = await request.json()
    if (!tx_ref) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 })
    }

    const result = await verifyAndActivateTransaction(tx_ref, resourceId)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Chapa verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}

// GET: handles Chapa return_url redirect
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tx_ref = searchParams.get('tx_ref') || searchParams.get('trx_ref')
    const resourceId = searchParams.get('resourceId') || searchParams.get('enrolled')

    if (!tx_ref) {
      return NextResponse.redirect(new URL('/library', request.url))
    }

    const result = await verifyAndActivateTransaction(tx_ref, resourceId || undefined)

    if (result.success && result.resourceId) {
      return NextResponse.redirect(
        new URL(`/student/dashboard?enrolled=${result.resourceId}&verified=1`, request.url)
      )
    }

    return NextResponse.redirect(
      new URL(`/student/dashboard?verified=1`, request.url)
    )
  } catch (error) {
    console.error('Chapa return handler error:', error)
    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  }
}
