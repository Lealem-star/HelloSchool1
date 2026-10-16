import { NextResponse } from 'next/server'
import { getCurrentUser, hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: {
    name?: string
    avatarUrl?: string | null
    currentPassword?: string
    newPassword?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const updates: { name?: string; password?: string; avatarUrl?: string | null } = {}

  // Update display name
  if (body.name !== undefined) {
    const trimmed = body.name.trim()
    if (trimmed.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }
    updates.name = trimmed
  }

  // Update avatar URL
  if (body.avatarUrl !== undefined) {
    updates.avatarUrl = body.avatarUrl
  }

  // Change password
  if (body.newPassword !== undefined || body.currentPassword !== undefined) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
    }
    if (!body.newPassword || body.newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const dbUser = await prisma.adminUser.findUnique({ where: { id: user.id } })
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const passwordOk = await bcrypt.compare(body.currentPassword, dbUser.password)
    if (!passwordOk) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    updates.password = await hashPassword(body.newPassword)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: updates,
  })

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      avatarUrl: updated.avatarUrl ?? null,
    },
  })
}
