import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.fafi.groupBy({
      by: ['taomPanabeazana', 'statut'],
      _count: { id: true },
      _sum: { volaNaloa: true },
    })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
