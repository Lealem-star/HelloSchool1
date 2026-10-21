import { NextResponse } from 'next/server'
import { destroyStudentSession, STUDENT_COOKIE } from '@/lib/student-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  await destroyStudentSession()
  const response = NextResponse.json({ success: true })
  response.cookies.set(STUDENT_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
