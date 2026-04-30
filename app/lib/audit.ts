import { prisma } from './prisma'
import type { SessionUser } from '@/types'

export async function log(
  user: SessionUser,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: string,
  entityId?: number,
  details?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({ data: { userId: user.userId, action, entity, entityId, details: details as never } })
  } catch { /* log failure must never break the request */ }
}
