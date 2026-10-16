import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const db = prisma as any

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : ''
    const contactPerson = typeof body.contactPerson === 'string' ? body.contactPerson.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const institutionType = typeof body.institutionType === 'string' ? body.institutionType.trim() : 'Other'

    if (!companyName || companyName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your organization / institution name.' },
        { status: 400 }
      )
    }

    if (!contactPerson || contactPerson.length < 2) {
      return NextResponse.json(
        { error: 'Contact person name is required.' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid official email address is required.' },
        { status: 400 }
      )
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { error: 'A valid phone number is required.' },
        { status: 400 }
      )
    }

    const inquiry = await db.companyInquiry.create({
      data: {
        companyName,
        institutionType,
        contactPerson,
        jobTitle: body.jobTitle?.trim() || null,
        email,
        phone,
        employeeCount: body.employeeCount?.trim() || null,
        trainingFocus: body.trainingFocus?.trim() || null,
        location: body.location?.trim() || null,
        message: body.message?.trim() || null,
        status: 'New',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your institutional training inquiry has been received. Our corporate training coordinator will contact you shortly.',
        id: inquiry.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error submitting company inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry: ' + (error.message || 'Internal error') },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
