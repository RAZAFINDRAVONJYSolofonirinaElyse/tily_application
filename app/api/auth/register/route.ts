import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { requireMin, requireEmail, requirePassword, VALID_SAMPANA } from '@/lib/validators'
import type { UserSampana } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { nom, prenoms, email, password, sampana } = await req.json()

    // Validation des champs
    const errors: Record<string, string> = {}
    const nomErr     = requireMin(nom, 2)
    if (nomErr) errors.nom = nomErr
    const prenomsErr = requireMin(prenoms, 2)
    if (prenomsErr) errors.prenoms = prenomsErr
    const emailErr   = requireEmail(email)
    if (emailErr) errors.email = emailErr
    const pwdErr     = requirePassword(password)
    if (pwdErr) errors.password = pwdErr
    if (!sampana || !(VALID_SAMPANA as readonly string[]).includes(sampana))
      errors.sampana = 'Sampana tsy mety'

    if (Object.keys(errors).length > 0)
      return NextResponse.json({ error: 'Données invalides', fields: errors }, { status: 400 })

    const exists = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (exists) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })

    const isFirst = (await prisma.user.count()) === 0
    const hashed  = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        nom: nom.trim(),
        prenoms: prenoms.trim(),
        email: email.trim().toLowerCase(),
        password: hashed,
        sampana: sampana as UserSampana,
        isApproved:   isFirst,
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
