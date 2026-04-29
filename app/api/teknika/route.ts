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

    const list = await prisma.fisyTeknika.findMany({
      where: {
        ...(taom            ? { taomPanabeazana: taom } : {}),
        ...(effectiveSokajy ? { sokajy: effectiveSokajy } : {}),
      },
      include,
      orderBy: { daty: 'desc' },
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

    const tek = await prisma.fisyTeknika.create({
      data: {
        ...data,
        daty: data.daty ? new Date(data.daty) : null,
        rows: {
          create: (rows ?? []).map((r: { ora?: string; atao?: string; fomba?: string; tomponAndraikitra?: string; fitaovana?: string; fanamarihana?: string }, i: number) => ({
            ordre:              i,
            ora:                r.ora               ?? null,
            atao:               r.atao              ?? null,
            fomba:              r.fomba             ?? null,
            tomponAndraikitra:  r.tomponAndraikitra ?? null,
            fitaovana:          r.fitaovana         ?? null,
            fanamarihana:       r.fanamarihana      ?? null,
          })),
        },
      },
      include,
    })
    await log(user!, 'CREATE', 'teknika', tek.id, { sokajy: tek.sokajy, taomPanabeazana: tek.taomPanabeazana })
    return NextResponse.json(tek, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
