import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { COOKIE } from '@/lib/session'

const PUBLIC = ['/login', '/register', '/pending', '/api/auth']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get(COOKIE)?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  const user = await verifyToken(token)
  if (!user) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete(COOKIE)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)'],
}
