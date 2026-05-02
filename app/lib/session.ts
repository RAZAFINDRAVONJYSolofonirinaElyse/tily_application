import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'
import type { SessionUser } from '@/types'

export const COOKIE = 'tily_session'

export async function getSession(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export function canModify(user: SessionUser, sokajy?: string | null): boolean {
  if (user.sampana === 'tonia' || user.isSuperAdmin) return true
  if (sokajy === 'mpiandraikitra') return true
  return user.sampana === sokajy
}

export function authError(user: SessionUser | null): Response | null {
  if (!user) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })
  if (!user.isApproved) return new Response(JSON.stringify({ error: 'Compte en attente de validation' }), { status: 403 })
  return null
}
