// Server-only — do NOT import from middleware
import bcrypt from 'bcryptjs'
export { signToken, verifyToken } from './jwt'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
