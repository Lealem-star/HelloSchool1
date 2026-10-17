import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import {
  generateInstitutionalEmail,
  generateStudentId,
  hashPassword,
} from '@/lib/student-auth'

function getPrismaClient() {
  let p: any = prisma
  if (!p.batch) {
    try {
      const { PrismaClient } = require('@prisma/client')
      p = new PrismaClient()
    } catch {
      p = prisma
    }
  }
  return p
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const body = await request.json()
    const {
      batchId,
      registrationId,
      studentName,
      phone,
      email,
      city,
      telegramUsername,
      password,
      courseTitle,
      shift,
      status,
    } = body

    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 })
    }

    // If existing registration is being linked / moved to this batch:
    if (registrationId) {
      try {
        await p.registration.update({
          where: { id: registrationId },
          data: {
            batchId,
            ...(shift && { shift }),
            ...(courseTitle && { courseTitle }),
            ...(status && { status }),
          },
        })
      } catch {
        await p.$executeRaw`
          UPDATE Registration SET
            batchId = ${batchId},
            shift = COALESCE(${shift || null}, shift),
            courseTitle = COALESCE(${courseTitle || null}, courseTitle),
            updatedAt = NOW()
          WHERE id = ${registrationId}
        `
      }
      return NextResponse.json({ success: true, registrationId, batchId })
    }

    // If creating a new registration directly into this batch:
    if (!studentName?.trim() || !courseTitle?.trim()) {
      return NextResponse.json(
        { error: 'Student Name and Course Title are required' },
        { status: 400 }
      )
    }

    const cleanPhone = phone?.trim() || '0900000000'
    const cleanName = studentName.trim()
    const cleanCity = city?.trim() || 'Bahir Dar'
    const rawPassword = password?.trim() || 'Hello@2026'
    const hashedPassword = await hashPassword(rawPassword)

    let student: any = null
    try {
      if (p.student) {
        student = await p.student.findFirst({
          where: {
            OR: [
              { phone: cleanPhone },
              email?.trim() ? { personalEmail: email.trim() } : { phone: '__not_matched__' },
            ],
          },
        })

        if (!student) {
          const baseEmail = generateInstitutionalEmail(cleanName)
          let institutionalEmail = baseEmail
          let counter = 1
          while (true) {
            const existing = await p.student.findUnique({
              where: { institutionalEmail },
            })
            if (!existing) break
            counter++
            const [localPart, domain] = baseEmail.split('@')
            institutionalEmail = `${localPart}${counter}@${domain}`
          }

          student = await p.student.create({
            data: {
              studentId: generateStudentId(),
              fullName: cleanName,
              institutionalEmail,
              personalEmail: email?.trim() || null,
              phone: cleanPhone,
              telegramUsername: telegramUsername?.trim() || null,
              password: hashedPassword,
              city: cleanCity,
              status: 'Active',
            },
          })
        }
      }
    } catch (e) {
      console.warn('Student account auto-creation note:', e)
    }

    const { randomUUID } = require('crypto')
    const yearCode = new Date().getFullYear().toString().slice(-2)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const regNumber = `HTV-${yearCode}-${randomSuffix}`
    const newRegId = 'reg_' + randomUUID().replace(/-/g, '').slice(0, 16)

    try {
      const created = await p.registration.create({
        data: {
          id: newRegId,
          registrationNumber: regNumber,
          studentId: student?.id || null,
          institutionalEmail: student?.institutionalEmail || null,
          fullName: cleanName,
          phone: cleanPhone,
          email: email?.trim() || null,
          telegramUsername: telegramUsername?.trim() || null,
          city: cleanCity,
          courseTitle: courseTitle.trim(),
          shift: shift?.trim() || 'Morning (8:30 AM - 12:30 PM)',
          batchId,
          status: status || 'Enrolled',
          paymentPlan: 'full',
          paymentMethod: 'in_person',
        },
      })
      return NextResponse.json(
        {
          ...created,
          institutionalEmail: student?.institutionalEmail,
          studentId: student?.studentId,
          defaultPassword: rawPassword,
        },
        { status: 201 }
      )
    } catch {
      await p.$executeRaw`
        INSERT INTO Registration (
          id, registrationNumber, studentId, institutionalEmail, fullName, phone, email, telegramUsername, city, courseTitle, shift, batchId, status, paymentPlan, paymentMethod, basePrice, discount, finalPrice, createdAt, updatedAt
        ) VALUES (
          ${newRegId},
          ${regNumber},
          ${student?.id || null},
          ${student?.institutionalEmail || null},
          ${cleanName},
          ${cleanPhone},
          ${email?.trim() || null},
          ${telegramUsername?.trim() || null},
          ${cleanCity},
          ${courseTitle.trim()},
          ${shift?.trim() || 'Morning (8:30 AM - 12:30 PM)'},
          ${batchId},
          ${status || 'Enrolled'},
          'full',
          'in_person',
          2999,
          0,
          2999,
          NOW(),
          NOW()
        )
      `
      return NextResponse.json(
        {
          id: newRegId,
          registrationNumber: regNumber,
          fullName: cleanName,
          batchId,
          institutionalEmail: student?.institutionalEmail,
          studentId: student?.studentId,
          defaultPassword: rawPassword,
        },
        { status: 201 }
      )
    }
  } catch (err: any) {
    console.error('Error in POST /api/admin/batches/assign:', err)
    return NextResponse.json({ error: 'Failed to assign student to batch: ' + err.message }, { status: 500 })
  }
}

// Release/Unlink a registration from a batch
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const p = getPrismaClient()

  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('registrationId')

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    try {
      await p.registration.update({
        where: { id: registrationId },
        data: { batchId: null },
      })
    } catch {
      await p.$executeRaw`UPDATE Registration SET batchId = NULL, updatedAt = NOW() WHERE id = ${registrationId}`
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error in DELETE /api/admin/batches/assign:', err)
    return NextResponse.json({ error: 'Failed to remove from batch: ' + err.message }, { status: 500 })
  }
}
