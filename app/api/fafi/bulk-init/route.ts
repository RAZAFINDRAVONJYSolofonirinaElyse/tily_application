// src/app/api/fafi/bulk-init/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { taomPanabeazana } = await req.json() as { taomPanabeazana: string }

    // Find membres without a FAFI record for this year
    const membres = await prisma.membre.findMany({
      where: {
        taomPanabeazana,
        fafi: { none: { taomPanabeazana } },
      },
      select: { id: true },
    })

    if (membres.length > 0) {
      await prisma.fafi.createMany({
        data: membres.map(m => ({
          membreId:       m.id,
          taomPanabeazana,
          statut:         'tsy_nandoa' as const,
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({ created: membres.length })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
