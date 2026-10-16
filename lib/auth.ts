import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import prisma from './prisma'

export const ADMIN_COOKIE = 'ems_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES_PER_EMAIL = 5
const MAX_FAILURES_PER_IP = 20
const DUMMY_PASSWORD_HASH = '$2a$10$i7LXyEBoXKjg822EOynonOWIdDcDeDCsOmD34JeHxQQVioBQ3jc8e'

export type AdminUserInfo = {
  id: string
  email: string
  role: string
  name: string | null
  avatarUrl: string | null
}

function adminSecret() {
  const secret = process.env.ADMIN_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SECRET must be set to at least 16 characters')
  }
  if (
    process.env.NODE_ENV === 'production' &&
    secret.includes('change-me')
  ) {
    throw new Error('ADMIN_SECRET must be replaced before production use')
  }
  return secret
}

function hashToken(token: string) {
  return createHmac('sha256', adminSecret()).update(token).digest('hex')
}

function hashKey(value: string) {
  return createHash('sha256').update(value.toLowerCase()).digest('hex').slice(0, 32)
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

async function failureCount(key: string) {
  const since = new Date(Date.now() - LOGIN_WINDOW_MS)
  return prisma.loginAttempt.count({
    where: { key, failedAt: { gte: since } },
  })
}

async function recordFailure(key: string) {
  await prisma.loginAttempt.create({ data: { key } })
  await prisma.loginAttempt.deleteMany({
    where: { failedAt: { lt: new Date(Date.now() - LOGIN_WINDOW_MS) } },
  })
}

async function clearFailures(key: string) {
  await prisma.loginAttempt.deleteMany({ where: { key } })
}

export async function login(
  email: string,
  password: string,
  ip = 'unknown'
): Promise<{ user?: AdminUserInfo; error?: string; status?: number }> {
  const normalizedEmail = email.trim().toLowerCase()
  const emailKey = `email:${hashKey(normalizedEmail)}`
  const ipKey = `ip:${hashKey(ip)}`

  const [emailFailures, ipFailures] = await Promise.all([
    failureCount(emailKey),
    failureCount(ipKey),
  ])

  if (emailFailures >= MAX_FAILURES_PER_EMAIL || ipFailures >= MAX_FAILURES_PER_IP) {
    return {
      error: 'Too many login attempts. Try again in 15 minutes.',
      status: 429,
    }
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  })

  let passwordOk = false
  try {
    passwordOk = await bcrypt.compare(password, user?.password ?? DUMMY_PASSWORD_HASH)
  } catch {
    passwordOk = false
  }

  if (!user || !passwordOk) {
    await Promise.all([recordFailure(emailKey), recordFailure(ipKey)])
    return { error: 'Invalid credentials', status: 401 }
  }

  await Promise.all([clearFailures(emailKey), clearFailures(ipKey)])

  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

  await prisma.adminSession.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  })

  await prisma.adminSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })

  return {
    user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatarUrl ?? null },
  }
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (token) {
    try {
      await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } })
    } catch {
      // Secret misconfiguration should still clear the cookie.
    }
  }
  cookieStore.delete(ADMIN_COOKIE)
}

export async function getCurrentUser(): Promise<AdminUserInfo | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null

  let tokenHash: string
  try {
    tokenHash = hashToken(token)
  } catch {
    cookieStore.delete(ADMIN_COOKIE)
    return null
  }

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => { })
    }
    cookieStore.delete(ADMIN_COOKIE)
    return null
  }

  if (!safeEqual(session.tokenHash, tokenHash)) {
    cookieStore.delete(ADMIN_COOKIE)
    return null
  }

  await prisma.adminSession.update({
    where: { id: session.id },
    data: { expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000) },
  })

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name,
    avatarUrl: session.user.avatarUrl ?? null,
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}
