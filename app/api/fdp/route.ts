import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError, canModify } from '@/lib/session'
import { log } from '@/lib/audit'
import { SokajyType } from '@/types'

const include = { rows: { orderBy: { ordre: 'asc' as const } } }

export async function GET(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { searchParams } = new URL(req.url)
    const taom   = searchParams.get('taom')
    const sokajy = searchParams.get('sokajy') as SokajyType | null

    const effectiveSokajy = (!user!.isSuperAdmin && user!.sampana !== 'tonia')
      ? user!.sampana as SokajyType
      : sokajy

    const list = await prisma.fandaharamPanabeazana.findMany({
      where: {
        ...(taom            ? { taomPanabeazana: taom } : {}),
        ...(effectiveSokajy ? { sokajy: effectiveSokajy } : {}),
      },
      include,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(list)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const body = await req.json()
    const { rows, ...data } = body

    if (!canModify(user!, data.sokajy))
      return NextResponse.json({ error: 'Permission refusée pour cette sokajy' }, { status: 403 })

    const fdp = await prisma.fandaharamPanabeazana.create({
      data: {
        ...data,
        rows: {
          create: (rows ?? []).map((r: { daty?: string; lohahevitra?: string; sehatra?: string; fomba?: string; toerana?: string }, i: number) => ({
            ordre:       i,
            daty:        r.daty        ? new Date(r.daty) : null,
            lohahevitra: r.lohahevitra ?? null,
            sehatra:     r.sehatra     ?? null,
            fomba:       r.fomba       ?? null,
            toerana:     r.toerana     ?? null,
          })),
        },
      },
      include,
    })
    await log(user!, 'CREATE', 'fdp', fdp.id, { sokajy: fdp.sokajy, taomPanabeazana: fdp.taomPanabeazana })
    return NextResponse.json(fdp, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
