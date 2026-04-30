import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError, canModify } from '@/lib/session'
import { log } from '@/lib/audit'

type TX = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

type Params = { params: Promise<{ id: string }> }

const includeRelations = {
  ambaratonga: { orderBy: { ordre: 'asc' as const } },
  fanekena: true,
  fafi: { orderBy: { taomPanabeazana: 'desc' as const } },
}

export async function GET(_req: NextRequest, context: Params) {
  try {
    const { id: idParam } = await context.params
    const id = Number(idParam)
    const membre = await prisma.membre.findUnique({ where: { id }, include: includeRelations })
    if (!membre) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...membre, ambDone: membre.ambaratonga.filter(a => a.daty).length, ambTotal: membre.ambaratonga.length })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: Params) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { id: idParam } = await context.params
    const id   = Number(idParam)
    const body = await req.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _bodyId, ambaratonga, fanekena, fiofanana, ambDone, ambTotal, fafi, ...data } = body

    if (!canModify(user!, data.sokajy))
      return NextResponse.json({ error: 'Permission refusée pour cette sokajy' }, { status: 403 })

    await prisma.$transaction(async (tx: TX) => {
      await tx.membre.update({
        where: { id },
        data: { ...data, numeroCarte: data.numeroCarte || null, datyNahaterahana: data.datyNahaterahana ? new Date(data.datyNahaterahana) : null },
      })
      if (ambaratonga) {
        await tx.ambaratonga.deleteMany({ where: { membreId: id } })
        await tx.ambaratonga.createMany({
          data: ambaratonga.map((a: { label: string; daty?: string; talenta?: string; talenDaty?: string }, i: number) => ({
            membreId: id, label: a.label, ordre: i,
            daty:      a.daty      ? new Date(a.daty)      : null,
            talenta:   a.talenta   ?? null,
            talenDaty: a.talenDaty ? new Date(a.talenDaty) : null,
          })),
        })
      }
    })

    const full = await prisma.membre.findUnique({ where: { id }, include: includeRelations })
    await log(user!, 'UPDATE', 'membre', id, { anarana: full?.anarana, sokajy: full?.sokajy })
    return NextResponse.json({ ...full, ambDone: full!.ambaratonga.filter(a => a.daty).length, ambTotal: full!.ambaratonga.length })
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
    const id      = Number(idParam)
    const existing = await prisma.membre.findUnique({ where: { id }, select: { sokajy: true, anarana: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!canModify(user!, existing.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })
    await prisma.membre.delete({ where: { id } })
    await log(user!, 'DELETE', 'membre', id, { anarana: existing.anarana })
    return NextResponse.json({ deleted: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
