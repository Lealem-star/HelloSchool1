import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'ems_admin_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/api/admin/login') return NextResponse.next()

  if (!request.cookies.get(ADMIN_COOKIE)?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
