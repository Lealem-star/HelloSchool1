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
    const { fullName, identifier, password } = body

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (minimum 2 characters)' },
        { status: 400 }
      )
    }

    if (!identifier || typeof identifier !== 'string' || identifier.trim().length < 6) {
      return NextResponse.json(
        { error: 'Please enter a valid email or phone number' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const cleanIdentifier = identifier.trim()
    const isEmail = cleanIdentifier.includes('@')
    const phone = isEmail ? '' : cleanIdentifier
    const personalEmail = isEmail ? cleanIdentifier.toLowerCase() : null

    // Check if phone or email already registered
    const orConditions: any[] = []
    if (isEmail) {
      orConditions.push({ personalEmail }, { institutionalEmail: personalEmail })
    } else {
      const digitsOnly = cleanIdentifier.replace(/\D/g, '')
      const last9 = digitsOnly.length >= 9 ? digitsOnly.slice(-9) : digitsOnly
      orConditions.push({ phone: cleanIdentifier }, { phone: digitsOnly })
      if (last9.length >= 8) {
        orConditions.push(
          { phone: `0${last9}` },
          { phone: `+251${last9}` },
          { phone: `251${last9}` },
          { phone: last9 }
        )
      }
    }

    const existingStudent = await (prisma as any).student.findFirst({
      where: {
        OR: orConditions,
      },
    })

    if (existingStudent) {
      return NextResponse.json(
        {
          error: 'An account with this phone or email already exists. Please log in instead.',
          alreadyExists: true,
        },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const studentId = generateStudentId()

    // Store the real email directly, or a clean unique identifier if signed up by phone
    let institutionalEmail = personalEmail || `${(phone || cleanIdentifier).replace(/\D/g, '') || studentId}@student.helloschool.et`
    let counter = 1
    const baseEmail = institutionalEmail
    while (true) {
      const existing = await (prisma as any).student.findUnique({
        where: { institutionalEmail },
      })
      if (!existing) break
      counter++
      const [localPart, domain] = baseEmail.split('@')
      institutionalEmail = `${localPart}${counter}@${domain}`
    }

    const newStudent = await (prisma as any).student.create({
      data: {
        studentId,
        fullName: fullName.trim(),
        institutionalEmail,
        personalEmail: personalEmail || null,
        phone: phone || cleanIdentifier,
        password: hashedPassword,
        city: 'Bahir Dar',
        status: 'Active',
      },
    })

    // Establish student session
    await createStudentSession(newStudent.id)

    return NextResponse.json({
      success: true,
      student: {
        id: newStudent.id,
        studentId: newStudent.studentId,
        fullName: newStudent.fullName,
        institutionalEmail: newStudent.institutionalEmail,
        phone: newStudent.phone,
      },
      message: 'Account created successfully!',
    })
  } catch (error: any) {
    console.error('Error registering student:', error)
    return NextResponse.json(
      { error: 'Failed to create account: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
