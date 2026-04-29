import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError, canModify } from '@/lib/session'
import { log } from '@/lib/audit'

type Params = { params: Promise<{ id: string }> }
const include = { rows: { orderBy: { ordre: 'asc' as const } } }

export async function PUT(req: NextRequest, context: Params) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { id: idParam } = await context.params
    const id = Number(idParam)
    const body = await req.json()
    const { rows, ...data } = body

    const existing = await prisma.fandaharamPanabeazana.findUnique({ where: { id }, select: { sokajy: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!canModify(user!, existing.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })

    await prisma.$transaction(async tx => {
      await tx.fandaharamPanabeazana.update({ where: { id }, data })
      if (rows) {
        await tx.fdpRow.deleteMany({ where: { fdpId: id } })
        await tx.fdpRow.createMany({
          data: rows.map((r: { daty?: string; lohahevitra?: string; sehatra?: string; fomba?: string; toerana?: string }, i: number) => ({
            fdpId:       id,
            ordre:       i,
            daty:        r.daty        ? new Date(r.daty) : null,
            lohahevitra: r.lohahevitra ?? null,
            sehatra:     r.sehatra     ?? null,
            fomba:       r.fomba       ?? null,
            toerana:     r.toerana     ?? null,
          })),
        })
      }
    })

    const updated = await prisma.fandaharamPanabeazana.findUnique({ where: { id }, include })
    await log(user!, 'UPDATE', 'fdp', id, { sokajy: existing.sokajy })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { id: idParam } = await context.params
    const id = Number(idParam)

    const existing = await prisma.fandaharamPanabeazana.findUnique({ where: { id }, select: { sokajy: true, taomPanabeazana: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!canModify(user!, existing.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })

    await prisma.fandaharamPanabeazana.delete({ where: { id } })
    await log(user!, 'DELETE', 'fdp', id, { sokajy: existing.sokajy })
    return NextResponse.json({ deleted: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
