import { NextResponse } from 'next/server'
import { destroyStudentSession } from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  await destroyStudentSession()
  return NextResponse.json({ success: true })
}
