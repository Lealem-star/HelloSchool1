import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  getCurrentStudent,
  generateInstitutionalEmail,
  generateStudentId,
  hashPassword,
  createStudentSession,
  STUDENT_COOKIE,
} from '@/lib/student-auth'
import { DIGITAL_CATALOG } from '@/lib/digital-catalog'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const student = await getCurrentStudent()
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let purchases: any[] = []
    if ((prisma as any).digitalPurchase) {
      purchases = await (prisma as any).digitalPurchase.findMany({
        where: {
          studentId: student.id,
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      purchases = (await (prisma as any).$queryRawUnsafe(
        'SELECT * FROM DigitalPurchase WHERE studentId = ? ORDER BY createdAt DESC',
        student.id
      )) as any[]
    }

    return NextResponse.json({
      purchases,
    })
  } catch (error: any) {
    console.error('Error fetching student purchases:', error)
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      resourceId,
      paymentMethod = 'telebirr',
      transactionRef,
      fullName,
      phone,
      email,
      password,
    } = body

    if (!resourceId) {
      return NextResponse.json({ error: 'Missing resourceId' }, { status: 400 })
    }

    // 1. Resolve student (logged-in OR from input credentials)
    const existingSessionStudent = await getCurrentStudent()
    let student: any = null
    let isNewStudent = false

    const hasPhoneInput = Boolean(phone && typeof phone === 'string' && phone.trim().length >= 6)
    const hasNameInput = Boolean(fullName && typeof fullName === 'string' && fullName.trim().length >= 2)

    // Check if the user passed explicit contact info that doesn't match the existing session
    if (existingSessionStudent) {
      if (hasPhoneInput) {
        const inputDigits = (phone as string).replace(/\D/g, '').slice(-9)
        const sessionDigits = (existingSessionStudent.phone || '').replace(/\D/g, '').slice(-9)
        if (inputDigits && sessionDigits && inputDigits === sessionDigits) {
          student = existingSessionStudent
        } else {
          // Different phone number entered: user intends to checkout as another student
          student = null
        }
      } else {
        // No explicit new phone, proceed with current logged-in student
        student = existingSessionStudent
      }
    }

    if (!student) {
      if (!hasPhoneInput) {
        return NextResponse.json(
          { error: 'Valid phone number is required to link or create your student portal account' },
          { status: 400 }
        )
      }
      if (!hasNameInput) {
        return NextResponse.json(
          { error: 'Full student name is required' },
          { status: 400 }
        )
      }

      const cleanPhone = (phone as string).trim()
      const digitsOnly = cleanPhone.replace(/\D/g, '')
      const last9 = digitsOnly.length >= 9 ? digitsOnly.slice(-9) : digitsOnly

      // Check if student exists by phone variations or email
      const orConditions: any[] = [
        { phone: cleanPhone },
        { phone: digitsOnly },
      ]
      if (last9.length >= 8) {
        orConditions.push(
          { phone: `0${last9}` },
          { phone: `+251${last9}` },
          { phone: `251${last9}` },
          { phone: last9 },
          { phone: { contains: last9 } }
        )
      }
      if (email && typeof email === 'string' && email.trim().length > 3) {
        orConditions.push({ personalEmail: email.trim().toLowerCase() })
        orConditions.push({ institutionalEmail: email.trim().toLowerCase() })
      }

      student = await (prisma as any).student.findFirst({
        where: {
          OR: orConditions,
        },
      })

      if (!student) {
        // Generate unique official institutional email
        const baseEmail = generateInstitutionalEmail(fullName as string)
        let institutionalEmail = baseEmail
        let counter = 1
        while (true) {
          const existing = await (prisma as any).student.findUnique({
            where: { institutionalEmail },
          })
          if (!existing) break
          counter++
          const [localPart, domain] = baseEmail.split('@')
          institutionalEmail = `${localPart}${counter}@${domain}`
        }

        const rawPassword =
          password && typeof password === 'string' && password.trim().length >= 6
            ? password.trim()
            : 'Hello@2026'
        const hashedPassword = await hashPassword(rawPassword)

        student = await (prisma as any).student.create({
          data: {
            studentId: generateStudentId(),
            fullName: (fullName as string).trim(),
            institutionalEmail,
            personalEmail: email?.trim() || null,
            phone: cleanPhone,
            password: hashedPassword,
            city: 'Bahir Dar',
            status: 'Active',
          },
        })
        isNewStudent = true
      }
    }

    if (!student) {
      return NextResponse.json({ error: 'Failed to authenticate or register student account' }, { status: 400 })
    }

    // Always create/refresh active session for this specific student
    let sessionToken: string | null = null
    try {
      sessionToken = await createStudentSession(student.id)
    } catch (sessionErr) {
      console.error('Failed to create student session in purchase:', sessionErr)
    }

    // 2. Query dynamic resource from database first, fallback to catalog
    let dbResource: any = null
    try {
      dbResource = await (prisma as any).libraryResource.findUnique({
        where: { id: resourceId },
      })
    } catch {}

    const catalogItem = DIGITAL_CATALOG[resourceId]
    const title = dbResource?.title || catalogItem?.title || 'Hello Technology Digital Resource'
    const isVideo = (dbResource?.format || catalogItem?.format || '').toLowerCase().includes('video')
    const resourceType = isVideo ? 'video_course' : 'manual'
    const amount = typeof dbResource?.priceETB === 'number'
      ? dbResource.priceETB
      : (catalogItem?.priceETB || 0)

    // Paid resources require admin approval (status = 'Pending')
    // Free resources (0 ETB) are instantly active (status = 'Active')
    const initialStatus = amount === 0 ? 'Active' : 'Pending'
    const txnRef = transactionRef || `TXN-${Date.now().toString().slice(-6)}`

    // 3. Upsert or create digital purchase record
    let purchase: any = null
    if ((prisma as any).digitalPurchase) {
      purchase = await (prisma as any).digitalPurchase.upsert({
        where: {
          studentId_resourceId: {
            studentId: student.id,
            resourceId,
          },
        },
        update: {
          status: initialStatus,
          paymentMethod,
          transactionRef: txnRef,
          amount,
        },
        create: {
          studentId: student.id,
          resourceId,
          resourceType,
          title,
          amount,
          paymentMethod,
          transactionRef: txnRef,
          status: initialStatus,
          progress: 0,
          completedLessons: JSON.stringify([]),
        },
      })
    } else {
      const existing = (await (prisma as any).$queryRawUnsafe(
        'SELECT * FROM DigitalPurchase WHERE studentId = ? AND resourceId = ? LIMIT 1',
        student.id,
        resourceId
      )) as any[]

      if (existing && existing.length > 0) {
        await (prisma as any).$executeRawUnsafe(
          'UPDATE DigitalPurchase SET status = ?, paymentMethod = ?, transactionRef = ?, amount = ?, updatedAt = NOW(3) WHERE id = ?',
          initialStatus,
          paymentMethod,
          txnRef,
          amount,
          existing[0].id
        )
        purchase = {
          ...existing[0],
          status: initialStatus,
          paymentMethod,
          transactionRef: txnRef,
          amount,
        }
      } else {
        const id = 'dp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7)
        await (prisma as any).$executeRawUnsafe(
          'INSERT INTO DigitalPurchase (id, studentId, resourceId, resourceType, title, amount, paymentMethod, transactionRef, status, progress, completedLessons, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, "[]", NOW(3), NOW(3))',
          id,
          student.id,
          resourceId,
          resourceType,
          title,
          amount,
          paymentMethod,
          txnRef,
          initialStatus
        )
        purchase = {
          id,
          studentId: student.id,
          resourceId,
          resourceType,
          title,
          amount,
          paymentMethod,
          transactionRef: txnRef,
          status: initialStatus,
          progress: 0,
          completedLessons: '[]',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      purchase,
      student: {
        id: student.id,
        fullName: student.fullName,
        studentId: student.studentId,
        institutionalEmail: student.institutionalEmail,
        phone: student.phone,
      },
      isNewStudent,
      message:
        initialStatus === 'Pending'
          ? 'Payment submitted successfully! Your purchase is waiting for admin verification and will unlock on your dashboard shortly.'
          : 'Free gift unlocked! You can now study on the platform.',
    })

    if (sessionToken) {
      response.cookies.set(STUDENT_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('Error creating digital purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
