import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, createStudentSession } from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { error: 'Please enter your student email or phone number' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const cleanIdentifier = identifier.trim().toLowerCase()

    // Find student by institutional email, phone, or student ID
    const student = await (prisma as any).student.findFirst({
      where: {
        OR: [
          { institutionalEmail: cleanIdentifier },
          { phone: cleanIdentifier },
          { studentId: cleanIdentifier.toUpperCase() },
          { personalEmail: cleanIdentifier },
        ],
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'No student account found with this email or phone. Please check your credentials or register.' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, student.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password. Please verify and try again.' },
        { status: 401 }
      )
    }

    if (student.status === 'Suspended') {
      return NextResponse.json(
        { error: 'Your student account is currently suspended. Please contact admissions.' },
        { status: 403 }
      )
    }

    await createStudentSession(student.id)

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        fullName: student.fullName,
        institutionalEmail: student.institutionalEmail,
        phone: student.phone,
        city: student.city,
      },
    })
  } catch (error: any) {
    console.error('Student login error:', error)
    return NextResponse.json(
      { error: 'Login failed: ' + (error.message || 'Server error') },
      { status: 500 }
    )
  }
}
