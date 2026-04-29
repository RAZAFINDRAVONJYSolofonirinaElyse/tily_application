// src/app/api/membres/generate-card/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SokajyType } from '@/types'

const PREFIX: Record<SokajyType, string> = {
  lovitao: 'LV', tily: 'TL', mpiandalana: 'MD', mpitarika: 'PT', mpiandraikitra: 'MA',
}

export async function POST(req: NextRequest) {
  try {
    const { sokajy, taomPanabeazana } = await req.json() as { sokajy: SokajyType; taomPanabeazana: string }
    const year   = (taomPanabeazana ?? String(new Date().getFullYear())).slice(0, 4)
    const count  = await prisma.membre.count({ where: { sokajy, taomPanabeazana } })
    const num    = String(count + 1).padStart(4, '0')
    const numeroCarte = `${PREFIX[sokajy]}${year}${num}`.slice(0, 12)
    return NextResponse.json({ numeroCarte })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
