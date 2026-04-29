'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { SokajyType, MembresState, Membre, NavPage, SessionUser } from '@/types'
import { CURRENT_YEAR } from '@/types'

interface ShellContextType {
  user:    SessionUser
  nav:     NavPage
  setNav:  (v: NavPage) => void
  cat:     SokajyType
  setCat:  (c: SokajyType) => void
  taom:    string
  setTaom: (t: string) => void
  members:    MembresState
  setMembers: (m: MembresState) => void
  form:    Membre | null
  setForm: (m: Membre | null) => void
  detail:  Membre | null
  setDetail: (m: Membre | null) => void
  saveMember:   (m: Membre) => Promise<void>
  deleteMember: (id: number) => Promise<void>
  filtered: (k: SokajyType) => Membre[]
  loading: boolean
}

const ShellContext = createContext<ShellContextType | undefined>(undefined)

const EMPTY_STATE: MembresState = {
  lovitao: [], tily: [], mpiandalana: [], mpitarika: [], mpiandraikitra: [],
}

export function ShellProvider({ children, user }: { children: ReactNode; user: SessionUser }) {
  const defaultCat: SokajyType = (user.sampana !== 'tonia' ? user.sampana : 'lovitao') as SokajyType
  const [nav, setNav]       = useState<NavPage>('dashboard')
  const [cat, setCat]       = useState<SokajyType>(defaultCat)
  const [taom, setTaom]     = useState(CURRENT_YEAR)
  const [members, setMembers] = useState<MembresState>(EMPTY_STATE)
  const [form, setForm]     = useState<Membre | null>(null)
  const [detail, setDetail] = useState<Membre | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = (user.sampana !== 'tonia' && !user.isSuperAdmin)
      ? `/api/membres?sokajy=${user.sampana}`
      : '/api/membres'
    fetch(url)
      .then(r => r.json())
      .then((data: Membre[]) => {
        const state: MembresState = { ...EMPTY_STATE }
        data.forEach(m => { if (state[m.sokajy]) state[m.sokajy].push(m) })
        setMembers(state)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user.sampana, user.isSuperAdmin])

  const saveMember = async (m: Membre) => {
    const isNew = !m.id
    try {
      const res = await fetch(
        isNew ? '/api/membres' : `/api/membres/${m.id}`,
        { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) }
      )
      if (!res.ok) { const e = await res.json().catch(() => ({ error: res.statusText })); throw new Error(e.error ?? res.statusText) }
      const saved: Membre = await res.json()
      const key = saved.sokajy as SokajyType
      setMembers(prev => ({
        ...prev,
        [key]: isNew ? [...prev[key], saved] : prev[key].map(x => x.id === saved.id ? saved : x),
      }))
    } catch (e) { alert((e as Error).message) }
    setForm(null)
  }

  const deleteMember = async (id: number) => {
    try {
      const res = await fetch(`/api/membres/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(res.statusText)
      setMembers(prev => {
        const next = { ...prev } as MembresState
        ;(Object.keys(next) as SokajyType[]).forEach(k => { next[k] = next[k].filter(x => x.id !== id) })
        return next
      })
    } catch (e) { alert((e as Error).message) }
  }

  const filtered = (k: SokajyType) => members[k].filter(m => m.taomPanabeazana === taom)

  return (
    <ShellContext.Provider value={{
      user, nav, setNav, cat, setCat, taom, setTaom,
      members, setMembers, form, setForm, detail, setDetail,
      saveMember, deleteMember, filtered, loading,
    }}>
      {children}
    </ShellContext.Provider>
  )
}

export function useShell() {
  const context = useContext(ShellContext)
  if (!context) throw new Error('useShell must be used within ShellProvider')
  return context
}
