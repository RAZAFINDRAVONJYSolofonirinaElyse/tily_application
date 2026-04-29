// Règles de validation partagées (client + serveur)

export const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const VALID_SAMPANA = ['lovitao', 'tily', 'mpiandalana', 'mpitarika', 'tonia'] as const

export function isValidEmail(v: string | null | undefined): boolean {
  return RE_EMAIL.test((v ?? '').trim())
}

export function isValidPhone(v: string | null | undefined): boolean {
  return /^\+?[\d\s\-]{7,15}$/.test((v ?? '').trim())
}

// Retourne un message d'erreur ou null
export function requireMin(v: string | null | undefined, min: number): string | null {
  const s = (v ?? '').trim()
  if (!s) return 'Tsy maintsy feno'
  if (s.length < min) return `Litera ${min} farafahakeliny`
  return null
}

export function requireEmail(v: string | null | undefined): string | null {
  const s = (v ?? '').trim()
  if (!s) return 'Tsy maintsy feno'
  if (!RE_EMAIL.test(s)) return 'Mila endrika: email@exemple.com'
  return null
}

export function optionalEmail(v: string | null | undefined): string | null {
  const s = (v ?? '').trim()
  if (!s) return null
  if (!RE_EMAIL.test(s)) return 'Mila endrika: email@exemple.com'
  return null
}

export function optionalPhone(v: string | null | undefined): string | null {
  const s = (v ?? '').trim()
  if (!s) return null
  if (!isValidPhone(s)) return 'Laharana finday tsy mety'
  return null
}

export function requirePassword(v: string | null | undefined): string | null {
  if (!v) return 'Tsy maintsy feno'
  if (v.length < 6) return 'Litera 6 farafahakeliny'
  return null
}
