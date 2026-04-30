import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
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

    const existing = await prisma.fisyTeknika.findUnique({ where: { id }, select: { sokajy: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!canModify(user!, existing.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.fisyTeknika.update({
        where: { id },
        data:  { ...data, daty: data.daty ? new Date(data.daty) : null },
      })
      if (rows) {
        await tx.teknikaRow.deleteMany({ where: { teknikaId: id } })
        await tx.teknikaRow.createMany({
          data: rows.map((r: { ora?: string; atao?: string; fomba?: string; tomponAndraikitra?: string; fitaovana?: string; fanamarihana?: string }, i: number) => ({
            teknikaId:         id,
            ordre:             i,
            ora:               r.ora               ?? null,
            atao:              r.atao              ?? null,
            fomba:             r.fomba             ?? null,
            tomponAndraikitra: r.tomponAndraikitra ?? null,
            fitaovana:         r.fitaovana         ?? null,
            fanamarihana:      r.fanamarihana      ?? null,
          })),
        })
      }
    })

    const updated = await prisma.fisyTeknika.findUnique({ where: { id }, include })
    await log(user!, 'UPDATE', 'teknika', id, { sokajy: existing.sokajy })
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

    const existing = await prisma.fisyTeknika.findUnique({ where: { id }, select: { sokajy: true, taomPanabeazana: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!canModify(user!, existing.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })

    await prisma.fisyTeknika.delete({ where: { id } })
    await log(user!, 'DELETE', 'teknika', id, { sokajy: existing.sokajy })
    return NextResponse.json({ deleted: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
