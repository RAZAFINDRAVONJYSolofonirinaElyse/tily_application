import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { COOKIE } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 400 })

    const user = await verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 })

    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, token, {
      httpOnly: true, sameSite: 'lax', path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
