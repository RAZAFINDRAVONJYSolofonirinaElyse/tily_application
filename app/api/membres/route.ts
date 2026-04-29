import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError, canModify } from '@/lib/session'
import { log } from '@/lib/audit'
import { SokajyType } from '@/types'

const includeRelations = {
  ambaratonga: { orderBy: { ordre: 'asc' as const } },
  fanekena: true,
  fafi: { orderBy: { taomPanabeazana: 'desc' as const } },
}

export async function GET(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { searchParams } = new URL(req.url)
    const sokajy = searchParams.get('sokajy') as SokajyType | null
    const taom   = searchParams.get('taom')

    const effectiveSokajy = (!user!.isSuperAdmin && user!.sampana !== 'tonia')
      ? user!.sampana as SokajyType
      : sokajy

    const membres = await prisma.membre.findMany({
      where: {
        ...(effectiveSokajy ? { sokajy: effectiveSokajy } : {}),
        ...(taom             ? { taomPanabeazana: taom }   : {}),
      },
      include: includeRelations,
      orderBy: { anarana: 'asc' },
    })
    const data = membres.map(m => ({
      ...m, ambDone: m.ambaratonga.filter(a => a.daty !== null).length, ambTotal: m.ambaratonga.length,
    }))
    return NextResponse.json(data)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ambaratonga, fanekena, fiofanana, ambDone, ambTotal, fafi, ...data } = body

    if (!canModify(user!, data.sokajy))
      return NextResponse.json({ error: 'Permission refusée pour cette sokajy' }, { status: 403 })

    const membre = await prisma.$transaction(async tx => {
      const m = await tx.membre.create({
        data: {
          ...data,
          numeroCarte: data.numeroCarte || null,
          datyNahaterahana: data.datyNahaterahana ? new Date(data.datyNahaterahana) : null,
          ambaratonga: {
            create: (ambaratonga ?? []).map((a: { label: string; daty?: string; talenta?: string; talenDaty?: string }, i: number) => ({
              label: a.label, ordre: i,
              daty:      a.daty      ? new Date(a.daty)      : null,
              talenta:   a.talenta   ?? null,
              talenDaty: a.talenDaty ? new Date(a.talenDaty) : null,
            })),
          },
          fanekena: {
            create: (fanekena ?? []).map((f: { sokajyFane?: string; daty?: string; toerana?: string; andraikitra?: string }) => ({
              sokajyFane:  f.sokajyFane ?? 'fanekena',
              daty:        f.daty        ? new Date(f.daty) : null,
              toerana:     f.toerana     ?? null,
              andraikitra: f.andraikitra ?? null,
            })),
          },
        },
        include: includeRelations,
      })
      return m
    })

    await log(user!, 'CREATE', 'membre', membre.id, { anarana: membre.anarana, sokajy: membre.sokajy })
    return NextResponse.json(
      { ...membre, ambDone: membre.ambaratonga.filter(a => a.daty).length, ambTotal: membre.ambaratonga.length },
      { status: 201 }
    )
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
