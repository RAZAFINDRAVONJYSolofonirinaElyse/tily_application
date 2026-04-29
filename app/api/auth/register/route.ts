import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import type { UserSampana } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { nom, prenoms, email, password, sampana } = await req.json()
    if (!nom || !prenoms || !email || !password || !sampana)
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })

    const isFirst = (await prisma.user.count()) === 0
    const hashed  = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        nom, prenoms, email,
        password: hashed,
        sampana:     sampana as UserSampana,
        isApproved:  isFirst,
        isSuperAdmin: isFirst,
      },
    })

    return NextResponse.json({
      id: user.id, nom: user.nom, prenoms: user.prenoms,
      isApproved: user.isApproved, isSuperAdmin: user.isSuperAdmin,
    }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
