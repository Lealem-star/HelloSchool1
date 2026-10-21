import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  generateInstitutionalEmail,
  generateStudentId,
  hashPassword,
  createStudentSession,
} from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate essential student details
    if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full student name is required' }, { status: 400 })
    }
    if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length < 6) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 })
    }
    if (!body.courseTitle || typeof body.courseTitle !== 'string') {
      return NextResponse.json({ error: 'Selected course is required' }, { status: 400 })
    }

    // Password validation: must be at least 6 characters
    const rawPassword = body.password && typeof body.password === 'string' && body.password.trim().length >= 6
      ? body.password.trim()
      : 'Hello@2026' // Sensible default if not provided

    const hashedPassword = await hashPassword(rawPassword)

    // Generate readable registration number, e.g. HS-26-4829
    const yearCode = new Date().getFullYear().toString().slice(-2)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const registrationNumber = `HS-${yearCode}-${randomSuffix}`

    // Generate unique official institutional email, e.g. lealem.meseret@hellotechnology.edu.et
    const baseEmail = generateInstitutionalEmail(body.fullName)
    let institutionalEmail = baseEmail
    let counter = 1

    // Check if institutional email exists
    while (true) {
      const existing = await (prisma as any).student.findUnique({
        where: { institutionalEmail },
      })
      if (!existing) break
      counter++
      const [localPart, domain] = baseEmail.split('@')
      institutionalEmail = `${localPart}${counter}@${domain}`
    }

    // Find existing student by phone or personal email
    let student = await (prisma as any).student.findFirst({
      where: {
        OR: [
          { phone: body.phone.trim() },
          body.email ? { personalEmail: body.email.trim() } : { phone: '__impossible__' },
        ],
      },
    })

    if (!student) {
      student = await (prisma as any).student.create({
        data: {
          studentId: generateStudentId(),
          fullName: body.fullName.trim(),
          institutionalEmail,
          personalEmail: body.email?.trim() || null,
          phone: body.phone.trim(),
          telegramUsername: body.telegramUsername?.trim() || null,
          password: hashedPassword,
          city: body.city?.trim() || 'Bahir Dar',
          status: 'Active',
        },
      })
    } else {
      // Keep existing student account, update password and telegram
      await (prisma as any).student.update({
        where: { id: student.id },
        data: {
          password: hashedPassword,
          telegramUsername: body.telegramUsername?.trim() || student.telegramUsername,
        },
      })
    }

    // Automatically associate with the current active/open Batch
    let activeBatchId: string | null = body.batchId || null
    if (!activeBatchId) {
      try {
        if ((prisma as any).batch) {
          const openBatch = await (prisma as any).batch.findFirst({
            where: { status: { in: ['Open', 'Active'] } },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          })
          if (openBatch) {
            activeBatchId = openBatch.id
          }
        }
        if (!activeBatchId) {
          const openBatches = await prisma.$queryRaw<any[]>`
            SELECT id FROM Batch WHERE status IN ('Open', 'Active') ORDER BY sortOrder ASC, createdAt DESC LIMIT 1
          `
          if (Array.isArray(openBatches) && openBatches.length > 0) {
            activeBatchId = openBatches[0].id
          }
        }
      } catch (e) {
        console.warn('Batch auto-assignment lookup error:', e)
      }
    }

    // Create course registration linked to student and batch
    const regPayload: any = {
      registrationNumber,
      studentId: student.id,
      institutionalEmail: student.institutionalEmail,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || null,
      telegramUsername: body.telegramUsername?.trim() || null,
      city: body.city?.trim() || 'Bahir Dar',
      courseTitle: body.courseTitle.trim(),
      shift: body.shift?.trim() || 'Morning Cohort',
      batchId: activeBatchId,
      education: body.education?.trim() || null,
      experienceYears: body.experienceYears?.trim() || null,
      paymentPlan: body.paymentPlan || 'full',
      paymentMethod: body.paymentMethod || 'telebirr',
      basePrice: typeof body.basePrice === 'number' ? body.basePrice : 2999,
      discount: typeof body.discount === 'number' ? body.discount : 0,
      finalPrice: typeof body.finalPrice === 'number' ? body.finalPrice : 2999,
      couponCode: body.couponCode?.trim() || null,
      transactionRef: body.transactionRef?.trim() || null,
      receiptUrl: body.receiptUrl?.trim() || null,
      confirmationLink: body.confirmationLink?.trim() || null,
      status: 'Pending', // Pending approval by admission admin
    }

    let registration: any
    try {
      registration = await (prisma as any).registration.create({
        data: regPayload,
      })
    } catch (createErr: any) {
      console.warn('registration.create with batchId failed, attempting fallback:', createErr.message)
      const { batchId: _b, ...payloadWithoutBatch } = regPayload
      registration = await (prisma as any).registration.create({
        data: payloadWithoutBatch,
      })
      if (activeBatchId) {
        try {
          await prisma.$executeRaw`
            UPDATE Registration SET batchId = ${activeBatchId} WHERE id = ${registration.id}
          `
          registration.batchId = activeBatchId
        } catch {}
      }
    }

    // Establish student session so they are logged in right away
    await createStudentSession(student.id).catch(() => {})

    return NextResponse.json(
      {
        success: true,
        id: registration.id,
        registrationNumber: registration.registrationNumber,
        studentId: student.studentId,
        institutionalEmail: student.institutionalEmail,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      { error: 'Failed to process course registration: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
