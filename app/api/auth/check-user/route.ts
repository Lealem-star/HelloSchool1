import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json()

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { error: 'Please enter your email or phone number' },
        { status: 400 }
      )
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    const rawTrimmed = identifier.trim()
    const digitsOnly = identifier.replace(/\D/g, '')

    const orConditions: any[] = [
      { institutionalEmail: cleanIdentifier },
      { personalEmail: cleanIdentifier },
      { studentId: rawTrimmed.toUpperCase() },
      { phone: rawTrimmed },
      { phone: cleanIdentifier },
    ]

    if (digitsOnly.length >= 9) {
      const last9 = digitsOnly.slice(-9)
      orConditions.push(
        { phone: digitsOnly },
        { phone: `0${last9}` },
        { phone: `+251${last9}` },
        { phone: `251${last9}` },
        { phone: last9 },
        { phone: { contains: last9 } }
      )
    }

    const student = await (prisma as any).student.findFirst({
      where: {
        OR: orConditions,
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        institutionalEmail: true,
        personalEmail: true,
        status: true,
      },
    })

    if (!student) {
      return NextResponse.json({
        exists: false,
        identifier: rawTrimmed,
      })
    }

    return NextResponse.json({
      exists: true,
      student: {
        id: student.id,
        fullName: student.fullName,
        phone: student.phone,
        email: student.institutionalEmail || student.personalEmail,
        status: student.status,
      },
    })
  } catch (error: any) {
    console.error('Error checking user:', error)
    return NextResponse.json(
      { error: 'Failed to verify account: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
