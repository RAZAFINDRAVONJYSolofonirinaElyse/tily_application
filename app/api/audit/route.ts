import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError } from '@/lib/session'

export async function GET(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err
  if (user!.sampana !== 'tonia' && !user!.isSuperAdmin)
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const take = Number(searchParams.get('take') ?? 100)

  const logs = await prisma.auditLog.findMany({
    take,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { nom: true, prenoms: true, sampana: true } } },
  })
  return NextResponse.json(logs)
}
