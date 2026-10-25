import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentStudent } from '@/lib/student-auth'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

async function verifyAndActivateTransaction(
  tx_ref: string,
  resourceId?: string,
  ref_id?: string,
  paymentMethod?: string
) {
  const chapaSecret = process.env.CHAPA_SECRET_KEY
  const chapaPublic = process.env.CHAPA_PUBLIC_KEY || process.env.NEXT_PUBLIC_CHAPA_PUBLIC_KEY

  let paymentData: any = null
  let isSuccessful = false

  // 1. Try inline validate if ref_id and mobile payment method are present
  if (ref_id && chapaPublic && (paymentMethod === 'telebirr' || paymentMethod === 'cbebirr' || paymentMethod === 'ebirr')) {
    try {
      const inlineRes = await fetch('https://inline.chapaservices.net/v1/inline/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${chapaPublic}`,
        },
        body: new URLSearchParams({
          reference: ref_id,
          payment_method: paymentMethod,
        }),
      })
      const inlineJson = await inlineRes.json().catch(() => null)
      if (inlineJson?.data?.status === 'success') {
        isSuccessful = true
        paymentData = {
          amount: inlineJson.data.amount,
          method: paymentMethod,
          status: 'success',
        }
      } else if (inlineJson?.data?.status === 'failed/cancelled') {
        return {
          success: false,
          cancelled: true,
          error: inlineJson.message || 'Payment prompt was cancelled or timed out on your phone.',
        }
      } else if (inlineJson?.data?.status === 'pending') {
        return {
          success: false,
          pending: true,
          message: 'Waiting for PIN authorization on your mobile phone...',
        }
      }
    } catch {}
  }

  // 2. Query official Chapa verification API
  if (!isSuccessful && chapaSecret) {
    try {
      const checkRef = ref_id || tx_ref
      const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${checkRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${chapaSecret}`,
        },
      })

      const chapaData = await verifyRes.json().catch(() => null)
      if (chapaData?.status === 'success' && chapaData.data) {
        if (chapaData.data.status === 'success') {
          isSuccessful = true
          paymentData = chapaData.data
        } else if (chapaData.data.status === 'failed/cancelled' || chapaData.data.status === 'failed') {
          return {
            success: false,
            cancelled: true,
            error: chapaData.data.failure_reason || 'Payment was cancelled or rejected on mobile.',
          }
        } else if (chapaData.data.status === 'pending') {
          return {
            success: false,
            pending: true,
            message: 'Waiting for payment confirmation...',
          }
        }
      }
    } catch {}
  }

  if (!isSuccessful || !paymentData) {
    return {
      success: false,
      pending: true,
      message: 'Payment verification in progress. Please approve on your phone.',
    }
  }

  // 3. Identify the resource (from param or tx_ref prefix or meta)
  let resolvedResourceId = resourceId
  if (!resolvedResourceId) {
    const match = tx_ref.match(/^HT-([a-zA-Z0-9-_]+)-\d+$/)
    if (match) resolvedResourceId = match[1]
  }

  // 4. Resolve student from current session or email/phone from Chapa payload
  let student = await getCurrentStudent()
  if (!student && paymentData?.email) {
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
    student = await (prisma as any).student.findFirst({
      orderBy: { createdAt: 'desc' },
    }).catch(() => null)
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
  const recordedPaymentMethod = paymentData.method ? `chapa_${paymentData.method}` : (paymentMethod ? `chapa_${paymentMethod}` : 'chapa')

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
          paymentMethod: recordedPaymentMethod,
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
          paymentMethod: recordedPaymentMethod,
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
        recordedPaymentMethod,
        tx_ref,
        tx_ref
      )
      purchase = {
        studentId: student.id,
        resourceId: resolvedResourceId,
        status: 'Active',
      }
    }
  }

  // Also auto-record or update Registration record so it appears in Self-Paced Enrollments
  try {
    const existingReg = await (prisma as any).registration.findFirst({
      where: {
        OR: [
          { transactionRef: tx_ref },
          {
            studentId: student.id,
            courseTitle: title,
          },
        ],
      },
    })

    if (existingReg) {
      await (prisma as any).registration.update({
        where: { id: existingReg.id },
        data: {
          status: 'Enrolled',
          transactionRef: tx_ref,
          paymentMethod: recordedPaymentMethod,
          finalPrice: amount,
          approvedAt: new Date(),
          approvedBy: 'Chapa Online Verification',
        },
      })
    } else {
      const rand = Math.floor(1000 + Math.random() * 9000)
      const year = new Date().getFullYear().toString().slice(-2)
      const registrationNumber = `ENR-${year}-${rand}`
      await (prisma as any).registration.create({
        data: {
          registrationNumber,
          studentId: student.id,
          institutionalEmail: student.institutionalEmail,
          fullName: student.fullName,
          phone: student.phone,
          email: student.personalEmail || student.institutionalEmail,
          courseTitle: title,
          shift: '100% Self-Paced (24/7 Access)',
          paymentPlan: 'full',
          paymentMethod: recordedPaymentMethod,
          basePrice: amount,
          discount: 0,
          finalPrice: amount,
          transactionRef: tx_ref,
          status: 'Enrolled',
          approvedAt: new Date(),
          approvedBy: 'Chapa Online Verification',
        },
      })
    }
  } catch (regErr) {
    console.warn('Auto-enrolling registration on Chapa verify non-blocking error:', regErr)
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
    const { tx_ref, ref_id, resourceId, paymentMethod } = await request.json().catch(() => ({}))
    const reference = tx_ref || ref_id
    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 })
    }

    const result = await verifyAndActivateTransaction(reference, resourceId, ref_id, paymentMethod)
    if (!result.success) {
      // Return 200 so polling does not spam red HTTP 400 errors in browser console while customer is typing PIN
      return NextResponse.json(result, { status: 200 })
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
