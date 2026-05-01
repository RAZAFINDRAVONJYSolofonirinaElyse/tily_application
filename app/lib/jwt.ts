// Edge-compatible — importable from middleware
import { SignJWT, jwtVerify } from 'jose'
import type { SessionUser } from '@/types'

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? 'tily-dev-secret-change-in-production')

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}
