import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { COOKIE } from '@/lib/session'
import { isValidEmail } from '@/lib/validators'
import type { SessionUser } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    if (!isValidEmail(email))
      return NextResponse.json({ error: 'Format email invalide' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!user || !user.isActive)
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const ok = await comparePassword(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

    const session: SessionUser = {
      userId: user.id, email: user.email,
      nom: user.nom, prenoms: user.prenoms,
      sampana: user.sampana as SessionUser['sampana'],
      isSuperAdmin: user.isSuperAdmin,
      isApproved:  user.isApproved,
    }

    const token = await signToken(session)
    const res   = NextResponse.json({ ...session, _token: token })
    res.cookies.set(COOKIE, token, {
      httpOnly: true, sameSite: 'lax', path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
