import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError } from '@/lib/session'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, context: Params) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err
  if (!user!.isSuperAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { id: idParam } = await context.params
  const id   = Number(idParam)
  const body = await req.json()

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.isApproved  !== undefined ? { isApproved: body.isApproved }   : {}),
      ...(body.isSuperAdmin !== undefined ? { isSuperAdmin: body.isSuperAdmin } : {}),
      ...(body.isActive    !== undefined ? { isActive: body.isActive }       : {}),
    },
    select: { id: true, nom: true, prenoms: true, email: true, sampana: true, isApproved: true, isSuperAdmin: true, isActive: true },
  })
  return NextResponse.json(updated)
}
