import { NextResponse } from 'next/server'
import { clientIp, login } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }
    const result = await login(String(email), String(password), clientIp(request))
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status ?? 401 }
      )
    }
    return NextResponse.json({ success: true, user: result.user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
