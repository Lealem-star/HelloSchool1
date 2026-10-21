import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { schoolConfig } from '@/lib/data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawId = (searchParams.get('id') || '').trim()

    if (!rawId) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 })
    }

    const cleanId = rawId.replace(/^HTTC-CERT-2026-/, '').replace(/^HTTC-/, '')
    const upperRaw = rawId.toUpperCase()
    const upperClean = cleanId.toUpperCase()

    // 1. Search Registration first
    let reg = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationNumber: rawId },
          { registrationNumber: cleanId },
          { registrationNumber: upperRaw },
          { registrationNumber: upperClean },
          { student: { studentId: rawId } },
          { student: { studentId: cleanId } },
          { student: { studentId: upperRaw } },
          { student: { studentId: upperClean } },
          { id: rawId },
        ],
      },
      include: {
        batch: true,
        student: true,
      },
    })

    // 2. If not found, try student table directly
    let student = null
    if (!reg) {
      student = await prisma.student.findFirst({
        where: {
          OR: [
            { studentId: rawId },
            { studentId: cleanId },
            { studentId: upperRaw },
            { studentId: upperClean },
            { institutionalEmail: rawId.toLowerCase() },
          ],
        },
        include: {
          registrations: {
            include: { batch: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      })

      if (student && student.registrations.length > 0) {
        reg = student.registrations[0] as any
      }
    }

    if (reg) {
      const certNumber = `HTTC-CERT-2026-${reg.registrationNumber || reg.id.slice(-4).toUpperCase()}`
      const studentName = reg.fullName || reg.student?.fullName || 'Enrolled Trainee'
      const studentId = reg.student?.studentId || reg.registrationNumber

      return NextResponse.json({
        success: true,
        certificate: {
          certificateNumber: certNumber,
          studentName,
          studentId,
          courseTitle: reg.courseTitle,
          level: 'TVET Practical Competence Level II / III Aligned',
          status: 'Accredited & Active in National TVET Registry',
          batchNumber: reg.batch?.batchNumber || 'Batch 01',
          institution: schoolConfig.name,
          institutionEn: schoolConfig.englishName,
          campus: schoolConfig.englishAddress,
          issueDate: new Date(reg.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      })
    }

    // 3. Check official demo exemplar ID (e.g. HTTC-2026-0001, HTTC-CERT-2026-0001)
    if (
      upperRaw === 'HTTC-2026-0001' ||
      upperRaw === 'HTTC-CERT-2026-0001' ||
      upperClean === '2026-0001' ||
      upperRaw === 'STU-26-0001'
    ) {
      return NextResponse.json({
        success: true,
        certificate: {
          certificateNumber: 'HTTC-CERT-2026-0001',
          studentName: 'Dawit Bekele Tadesse',
          studentId: 'STU-26-0001',
          courseTitle: 'Mobile Diagnostics & Board-Level Hardware Maintenance',
          level: 'TVET Practical Competence Level II / III Aligned',
          status: 'Accredited & Active in National TVET Registry',
          batchNumber: 'Batch 01 Intake',
          institution: schoolConfig.name,
          institutionEn: schoolConfig.englishName,
          campus: schoolConfig.englishAddress,
          issueDate: 'October 12, 2026',
        },
      })
    }

    // 4. Return genuine 404 if record is not found in registry
    return NextResponse.json(
      {
        success: false,
        notFound: true,
        error: 'No verified certificate or trainee record found matching this serial number in the accredited registry.',
      },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Certificate verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal verification server error' },
      { status: 500 }
    )
  }
}
