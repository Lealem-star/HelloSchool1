import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic server-side validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length < 6) {
      return NextResponse.json(
        { error: 'Valid phone number is required' },
        { status: 400 }
      )
    }
    if (!body.consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        studentName: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone.trim(),
        course: body.course?.trim() || null,
        preferredContact: body.preferredContact?.trim() || null,
        experience: body.experience?.trim() || null,
        message: body.message?.trim() || null,
        status: 'New',
        consent: true,
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
