import { createHmac, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import prisma from './prisma'

export const STUDENT_COOKIE = 'hellotvet_student_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days session

export type StudentInfo = {
  id: string
  studentId: string
  fullName: string
  institutionalEmail: string
  personalEmail: string | null
  phone: string
  telegramUsername: string | null
  city: string | null
  avatarUrl: string | null
  status: string
  createdAt: Date
}

function authSecret() {
  return process.env.ADMIN_SECRET || 'hellotvet-student-secret-key-production-ready-2026'
}

function hashToken(token: string) {
  return createHmac('sha256', authSecret()).update(token).digest('hex')
}

/**
 * Generates official institutional email: e.g. "Lealem Meseret" -> "lealem.meseret@hellotechnology.edu.et"
 */
export function generateInstitutionalEmail(fullName: string): string {
  const parts = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  const firstName = parts[0] || 'student'
  const fatherName = parts[1] || (parts.length > 2 ? parts[parts.length - 1] : 'tech')
  return `${firstName}.${fatherName}@hellotechnology.edu.et`
}

/**
 * Creates a unique student ID, e.g. STU-26-4821
 */
export function generateStudentId(): string {
  const yearCode = new Date().getFullYear().toString().slice(-2)
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `STU-${yearCode}-${rand}`
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}

export async function createStudentSession(studentId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

  await (prisma as any).studentSession.create({
    data: {
      tokenHash,
      studentId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(STUDENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  })

  return token
}

export async function getCurrentStudent(): Promise<StudentInfo | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(STUDENT_COOKIE)?.value
    if (!token) return null

    const tokenHash = hashToken(token)
    const session = await (prisma as any).studentSession.findUnique({
      where: { tokenHash },
      include: {
        student: true,
      },
    })

    if (!session) return null
    if (session.expiresAt.getTime() < Date.now()) {
      await (prisma as any).studentSession.delete({ where: { id: session.id } }).catch(() => {})
      return null
    }

    // Rolling session update if expiring in less than 3 days
    if (session.expiresAt.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000) {
      await (prisma as any).studentSession.update({
        where: { id: session.id },
        data: { expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000) },
      }).catch(() => {})
    }

    return {
      id: session.student.id,
      studentId: session.student.studentId,
      fullName: session.student.fullName,
      institutionalEmail: session.student.institutionalEmail,
      personalEmail: session.student.personalEmail,
      phone: session.student.phone,
      telegramUsername: session.student.telegramUsername,
      city: session.student.city,
      avatarUrl: session.student.avatarUrl,
      status: session.student.status,
      createdAt: session.student.createdAt,
    }
  } catch (err) {
    console.error('Error fetching current student:', err)
    return null
  }
}

export async function destroyStudentSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(STUDENT_COOKIE)?.value
    if (token) {
      const tokenHash = hashToken(token)
      await (prisma as any).studentSession.deleteMany({ where: { tokenHash } }).catch(() => {})
    }
    cookieStore.delete(STUDENT_COOKIE)
  } catch (err) {
    console.error('Error destroying student session:', err)
  }
}
