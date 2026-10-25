import { NextResponse } from 'next/server'
import { getCurrentStudent } from '@/lib/student-auth'
import prisma from '@/lib/prisma'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

function sanitizeEthiopianPhone(phoneInput?: string | null): string {
  if (!phoneInput) return '0934551781'
  // Remove non-digit characters
  const digits = phoneInput.replace(/\D/g, '')
  // If user entered an email or fewer than 9 digits
  if (!digits || digits.length < 9) {
    return '0934551781'
  }
  // If 12 digits starting with 2519 or 2517 -> convert to 09... or 07...
  if (digits.startsWith('251') && digits.length === 12) {
    return '0' + digits.slice(3)
  }
  // If 9 digits starting with 9 or 7 -> convert to 09... or 07...
  if ((digits.startsWith('9') || digits.startsWith('7')) && digits.length === 9) {
    return '0' + digits
  }
  // If 10 digits starting with 09 or 07
  if (digits.length === 10 && (digits.startsWith('09') || digits.startsWith('07'))) {
    return digits
  }
  // Default to valid fallback
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
    const { resourceId } = body
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
    const amount = typeof body.amount === 'number' && body.amount >= 0
      ? body.amount
      : (typeof dbResource?.priceETB === 'number'
          ? dbResource.priceETB
          : (catalogItem?.priceETB || 0))

    // Free resources can be unlocked directly without Chapa gateway
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
        message: 'Free resource unlocked successfully!',
      })
    }

    const chapaSecret = process.env.CHAPA_SECRET_KEY
    if (!chapaSecret) {
      return NextResponse.json(
        { error: 'Chapa payment gateway secret key is missing in .env' },
        { status: 500 }
      )
    }

    // Unique transaction reference
    const cleanId = resourceId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
    const tx_ref = `HT-${cleanId}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    // Ensure valid email for Chapa validation
    let email = body.email || student.personalEmail || student.institutionalEmail
    if (!email || !email.includes('@') || email.endsWith('.et')) {
      const cleanPhone = (body.phone || student.phone || 'student').replace(/\D/g, '')
      email = `student_${cleanPhone || 'tech'}@gmail.com`
    }

    const [first, ...rest] = (body.fullName || student.fullName || 'Trainee Student').trim().split(/\s+/)
    const firstName = first || 'Student'
    const lastName = rest.join(' ') || 'Trainee'

    const phone_number = sanitizeEthiopianPhone(body.phone || student.phone)
    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Call Chapa's official Transaction Initialize endpoint
    const chapaPayload = {
      amount: amount.toString(),
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number,
      tx_ref,
      callback_url: `${origin}/api/chapa/callback`,
      return_url: `${origin}/api/chapa/verify?tx_ref=${tx_ref}&resourceId=${encodeURIComponent(resourceId)}`,
      customization: {
        title: 'HelloTechnology', // Must not exceed 16 characters per Chapa API
        description: title.slice(0, 50),
      },
    }

    const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chapaSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapaPayload),
    })

    const chapaResult = await chapaResponse.json()

    if (chapaResult.status !== 'success' || !chapaResult.data?.checkout_url) {
      const errMsg = typeof chapaResult.message === 'object'
        ? JSON.stringify(chapaResult.message)
        : (chapaResult.message || 'Chapa initialization failed')
      console.error('Chapa init failure:', chapaResult, 'Payload:', chapaPayload)
      return NextResponse.json({ error: errMsg }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      checkout_url: chapaResult.data.checkout_url,
      tx_ref,
      amount,
      title,
      student: {
        fullName: student.fullName,
        email,
        phone: phone_number,
      },
    })
  } catch (error: any) {
    console.error('Chapa initialization server error:', error)
    return NextResponse.json(
      { error: 'Payment gateway initialization failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
