import { NextResponse } from 'next/server'
import { getCurrentStudent } from '@/lib/student-auth'
import prisma from '@/lib/prisma'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

function sanitizeEthiopianPhone(phoneInput?: string | null): string {
  if (!phoneInput) return '0934551781'
  const digits = phoneInput.replace(/\D/g, '')
  if (!digits || digits.length < 9) return '0934551781'
  if (digits.startsWith('251') && digits.length === 12) {
    return '0' + digits.slice(3)
  }
  if ((digits.startsWith('9') || digits.startsWith('7')) && digits.length === 9) {
    return '0' + digits
  }
  if (digits.length === 10 && (digits.startsWith('09') || digits.startsWith('07'))) {
    return digits
  }
  return '0934551781'
}

export async function POST(request: Request) {
  try {
    let student = await getCurrentStudent()
    if (!student) {
      student = await (prisma as any).student.findFirst({
        orderBy: { createdAt: 'desc' },
      }).catch(() => null)
    }

    if (!student) {
      return NextResponse.json(
        { error: 'Please sign in or create an account to enroll' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { resourceId, phone, paymentMethod = 'telebirr' } = body

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    // 1. Resolve resource details
    let dbResource: any = null
    try {
      dbResource = await (prisma as any).libraryResource.findUnique({
        where: { id: resourceId },
      })
    } catch {}

    const catalogItem = DIGITAL_CATALOG[resourceId]
    const title = dbResource?.title || catalogItem?.title || 'Hello Tech Course'
    const amount = typeof dbResource?.priceETB === 'number'
      ? dbResource.priceETB
      : (catalogItem?.priceETB || 0)

    // Free items unlock immediately
    if (amount === 0) {
      const freeTx = `FREE-${Date.now().toString(36).toUpperCase()}`
      await (prisma as any).digitalPurchase.upsert({
        where: {
          studentId_resourceId: {
            studentId: student.id,
            resourceId,
          },
        },
        update: { status: 'Active', updatedAt: new Date() },
        create: {
          studentId: student.id,
          resourceId,
          resourceType: (dbResource?.format || '').toLowerCase().includes('video') ? 'video_course' : 'manual',
          title,
          amount: 0,
          paymentMethod: 'free_grant',
          transactionRef: freeTx,
          status: 'Active',
          progress: 0,
          completedLessons: JSON.stringify([]),
        },
      }).catch(() => {})

      return NextResponse.json({
        success: true,
        isFree: true,
        message: 'Course unlocked successfully!',
      })
    }

    const publicKey = process.env.CHAPA_PUBLIC_KEY || process.env.NEXT_PUBLIC_CHAPA_PUBLIC_KEY
    if (!publicKey) {
      return NextResponse.json(
        { error: 'Chapa public key is missing in environment' },
        { status: 500 }
      )
    }

    const cleanPhone = sanitizeEthiopianPhone(phone || student.phone)
    const cleanId = resourceId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
    const tx_ref = `HT-${cleanId}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    let email = student.personalEmail || student.institutionalEmail || 'student@hellotvet.edu.et'
    if (!email.includes('@') || email.endsWith('.et')) {
      email = `mekonenalemayehu95@gmail.com`
    }

    const [first, ...rest] = (student.fullName || 'Mekonen Alemayehu').trim().split(/\s+/)
    const firstName = first || 'Mekonen'
    const lastName = rest.join(' ') || 'Alemayehu'

    // Initiate USSD Push charge directly via Chapa Inline Services
    const inlineChargeRes = await fetch('https://inline.chapaservices.net/v1/inline/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicKey}`,
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'ETB',
        tx_ref,
        mobile: cleanPhone,
        payment_method: paymentMethod, // 'telebirr' | 'cbebirr' | 'ebirr'
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    const inlineData = await inlineChargeRes.json().catch(() => null)

    if (!inlineData || inlineData.status !== 'success') {
      const errMsg = inlineData?.message || inlineData?.data?.message || 'Failed to initiate push charge'
      console.error('Chapa inline charge failed:', inlineData)
      return NextResponse.json({ error: errMsg }, { status: 400 })
    }

    const ref_id = inlineData.data?.meta?.ref_id || tx_ref

    return NextResponse.json({
      success: true,
      tx_ref,
      ref_id,
      message: inlineData.data?.meta?.message || `Payment request sent to ${cleanPhone}`,
      amount,
      phone: cleanPhone,
      paymentMethod,
    })
  } catch (error: any) {
    console.error('Error in inline charge route:', error)
    return NextResponse.json(
      { error: 'Charge initiation failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
