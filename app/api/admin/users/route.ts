import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError } from '@/lib/session'

export async function GET(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err
  if (!user!.isSuperAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: { id: true, nom: true, prenoms: true, email: true, sampana: true, isApproved: true, isSuperAdmin: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}
