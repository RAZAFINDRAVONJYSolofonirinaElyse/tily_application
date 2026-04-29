import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, authError, canModify } from '@/lib/session'
import { log } from '@/lib/audit'
import { SokajyType, FafiStatut } from '@/types'

export async function GET(req: NextRequest) {
  const user = await getSession(req)
  const err  = authError(user)
  if (err) return err

  try {
    const { searchParams } = new URL(req.url)
    const taom   = searchParams.get('taom')
    const sokajy = searchParams.get('sokajy') as SokajyType | null
    const statut = searchParams.get('statut') as FafiStatut | null

    const effectiveSokajy = (!user!.isSuperAdmin && user!.sampana !== 'tonia')
      ? user!.sampana as SokajyType
      : sokajy

    const list = await prisma.fafi.findMany({
      where: {
        ...(taom   ? { taomPanabeazana: taom } : {}),
        ...(statut ? { statut } : {}),
        membre: {
          ...(effectiveSokajy ? { sokajy: effectiveSokajy } : {}),
        },
      },
      include: {
        membre: {
          select: { anarana: true, fanampiny: true, sokajy: true, numeroCarte: true, finday: true },
        },
      },
      orderBy: [{ membre: { sokajy: 'asc' } }, { membre: { anarana: 'asc' } }],
    })

    const flat = list.map(f => ({
      id:              f.id,
      membreId:        f.membreId,
      taomPanabeazana: f.taomPanabeazana,
      datyFandoavana:  f.datyFandoavana?.toISOString().slice(0, 10) ?? '',
      volaNaloa:       f.volaNaloa?.toString() ?? '',
      statut:          f.statut,
      mpandray:        f.mpandray ?? '',
      fanamarihana:    f.fanamarihana ?? '',
      anarana:         f.membre.anarana,
      fanampiny:       f.membre.fanampiny ?? '',
      sokajy:          f.membre.sokajy,
      numeroCarte:     f.membre.numeroCarte ?? '',
    }))

    return NextResponse.json(flat)
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
    const { membreId, taomPanabeazana, datyFandoavana, volaNaloa, statut, mpandray, fanamarihana } = body

    const membre = await prisma.membre.findUnique({ where: { id: Number(membreId) }, select: { sokajy: true } })
    if (!membre) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
    if (!canModify(user!, membre.sokajy))
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })

    const fafi = await prisma.fafi.upsert({
      where:  { membreId_taomPanabeazana: { membreId: Number(membreId), taomPanabeazana } },
      update: {
        datyFandoavana: datyFandoavana ? new Date(datyFandoavana) : null,
        volaNaloa:      volaNaloa      ? Number(volaNaloa)        : null,
        statut:         statut         ?? 'tsy_nandoa',
        mpandray:       mpandray       ?? null,
        fanamarihana:   fanamarihana   ?? null,
      },
      create: {
        membreId:       Number(membreId),
        taomPanabeazana,
        datyFandoavana: datyFandoavana ? new Date(datyFandoavana) : null,
        volaNaloa:      volaNaloa      ? Number(volaNaloa)        : null,
        statut:         statut         ?? 'tsy_nandoa',
        mpandray:       mpandray       ?? null,
        fanamarihana:   fanamarihana   ?? null,
      },
    })
    await log(user!, 'UPDATE', 'fafi', fafi.id, { membreId, taomPanabeazana, statut })
    return NextResponse.json(fafi, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
