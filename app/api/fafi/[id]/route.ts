// src/app/api/fafi/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, context: Params) {
  try {
    const { id: idParam } = await context.params
    const id = Number(idParam)
    const body = await req.json()
    const { datyFandoavana, volaNaloa, statut, mpandray, fanamarihana } = body

    const updated = await prisma.fafi.update({
      where: { id },
      data: {
        datyFandoavana: datyFandoavana ? new Date(datyFandoavana) : null,
        volaNaloa:      volaNaloa      ? Number(volaNaloa)        : null,
        statut:         statut         ?? 'tsy_nandoa',
        mpandray:       mpandray       ?? null,
        fanamarihana:   fanamarihana   ?? null,
      },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const { id: idParam } = await context.params
    const id = Number(idParam)
    await prisma.fafi.delete({ where: { id } })
    return NextResponse.json({ deleted: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
