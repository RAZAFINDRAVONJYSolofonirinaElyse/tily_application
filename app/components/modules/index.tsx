'use client'
// app/components/modules/index.tsx — All feature modules

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  LuPlus, LuSave, LuX, LuTrash2, LuEye, LuPencil, LuPrinter,
  LuChevronLeft, LuRefreshCw, LuLock, LuLockOpen, LuCalendar,
  LuFileText, LuShield, LuUserCheck, LuUserX, LuHistory,
} from 'react-icons/lu'
import {
  CATS, AMB, YEARS, CURRENT_YEAR, newMembre,
  Membre, FDP, FDPRowItem, Teknika, TeknikaRowItem,
  FafiEntry, SokajyType, MembresState, AmbaratongaItem, FanekenaItem, FiofananaItem,
  FIOFANANA_DINGAM, UserRecord, AuditEntry, UserSampana,
} from '@/types'
import {
  Field, TI, Sel, TA, CB, RadioGroup, Grid, Sec, Btn, CatBtn,
  Badge, CatBadge, FafiBadge, ProgressBar, YearSel,
  PageHeader, Empty, ConfirmModal, StatCard,
} from '@/components/atoms'
import { printFiche, printFDP, printTeknika, printFafiList } from '@/lib/print'
import { optionalEmail, optionalPhone, requireMin } from '@/lib/validators'

// ============================================================
//  API helpers
// ============================================================
async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) { const e = await res.json().catch(() => ({ error: res.statusText })); throw new Error((e as { error: string }).error) }
  return res.json()
}

// ============================================================
//  SHARED CONSTANTS (Defined once)
// ============================================================
const SAMPANA_LABELS: Record<string, string> = {
  lovitao: 'Lovitao', tily: 'Tily', mpiandalana: 'Mpiandalana',
  mpitarika: 'Mpitarika', tonia: 'Tonia',
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  CREATE: { label: 'Namorona',  color: '#27500A' },
  UPDATE: { label: 'Nanova',    color: '#0C447C' },
  DELETE: { label: 'Namafa',    color: '#791F1F' },
}

const ENTITY_LABELS: Record<string, string> = {
  membre: 'Mpikambana', fdp: 'FDP', teknika: 'Fisy Teknika', fafi: 'FAFI',
}

// ============================================================
//  DASHBOARD
// ============================================================
interface DashboardProps {
  members: MembresState; taom: string; setTaom: (v: string) => void
  setNav: (v: string) => void; setCat: (v: SokajyType) => void
}
export function Dashboard({ members, taom, setTaom, setNav, setCat }: DashboardProps) {
  const total = Object.values(members).reduce((s, a) => s + a.filter(m => m.taomPanabeazana === taom).length, 0)
  return (
    <div className="fade-in">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Tily Eto Madagasikara</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Tableau de bord</h1>
      </div>
      <div className="mb-6 max-w-xs">
        <YearSel value={taom} onChange={setTaom} />
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card col-span-1 flex flex-col items-center justify-center gap-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Total</p>
          <p className="text-4xl font-bold text-gray-900">{total}</p>
          <p className="text-[10px] text-gray-400">Mpikambana</p>
        </div>
        {(Object.entries(CATS) as [SokajyType, typeof CATS[SokajyType]][]).map(([k, v]) => {
          const count = members[k]?.filter(m => m.taomPanabeazana === taom).length ?? 0
          return (
            <button key={k} onClick={() => { setNav('membres'); setCat(k) }}
              className="card cursor-pointer text-left transition-shadow hover:shadow-md"
              style={{ borderLeft: `3px solid ${v.dot}` }}>
              <p className="mb-1 text-[10px] text-gray-400">{v.label}</p>
              <p className="text-3xl font-bold" style={{ color: v.color }}>{count}</p>
            </button>
          )
        })}
      </div>
      <Sec title="Fidirana haingana">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATS) as [SokajyType, typeof CATS[SokajyType]][]).map(([k, v]) => (
            <CatBtn key={k} color={v.color} light={v.light} size="sm"
              onClick={() => { setNav('membres'); setCat(k) }}>
              <LuPlus size={13} /> {v.label}
            </CatBtn>
          ))}
          <Btn size="sm" style={{ background: '#0C447C', color: '#fff', border: 'none' }}
            onClick={() => setNav('fdp')}><LuCalendar size={13} /> Fandaharam-panabeazana</Btn>
          <Btn size="sm" style={{ background: '#534AB7', color: '#fff', border: 'none' }}
            onClick={() => setNav('teknika')}><LuFileText size={13} /> Fisy Teknika</Btn>
          <Btn size="sm" style={{ background: '#27500A', color: '#fff', border: 'none' }}
            onClick={() => setNav('fafi')}><LuShield size={13} /> FAFI Assurance</Btn>
        </div>
      </Sec>
    </div>
  )
}

// ============================================================
//  MEMBRES LIST
// ============================================================
interface MembresListProps {
  cat: SokajyType; members: Membre[]; taom: string
  onAdd: () => void; onEdit: (m: Membre) => void
  onDelete: (id: number) => void; onView: (m: Membre) => void
}
export function MembresList({ cat, members, taom, onAdd, onEdit, onDelete, onView }: MembresListProps) {
  const v = CATS[cat]
  const [conf, setConf] = useState<number | null>(null)

  return (
    <div className="fade-in">
      <PageHeader
        title={v.label}
        subtitle={`Taom-panabeazana: ${taom}`}
        actions={<CatBtn color={v.color} light={v.light} onClick={onAdd}><LuPlus size={14} /> Manampy</CatBtn>}
      />
      {conf !== null && (
        <ConfirmModal
          title="Hamafa mpikambana?"
          message="Tsy azo averina intsony ny fandidiana io. Tena hamafa io mpikambana io ve ianao?"
          confirmLabel="Hamafa"
          variant="danger"
          onConfirm={() => { onDelete(conf); setConf(null) }}
          onCancel={() => setConf(null)}
        />
      )}
      {members.length === 0 ? (
        <Empty
          message={`Tsy misy mpikambana mandraka izao (${taom})`}
          action={<CatBtn color={v.color} light={v.light} onClick={onAdd}><LuPlus size={14} /> Manampy voalohany</CatBtn>}
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['N° Kara', 'Anarana',
                  cat === 'mpiandraikitra' ? 'Finday' : 'Daty',
                  cat === 'mpiandraikitra' ? 'Andraikitra' : 'Kilasy',
                  cat === 'mpiandraikitra' ? 'Fiofanana' : 'Ambaratonga', ''].map(h => (
                  <th key={h} className="table-th whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(m => {
                const done = cat === 'mpiandraikitra'
                  ? (m.fiofanana ?? []).filter(fi => fi.fotoana).length
                  : (m.ambaratonga ?? []).filter(a => a.daty).length
                const tot = cat === 'mpiandraikitra'
                  ? FIOFANANA_DINGAM.length
                  : (m.ambaratonga ?? []).length
                const pct  = tot > 0 ? Math.round(done / tot * 100) : 0
                return (
                  <tr key={m.id ?? m.anarana} className="hover:bg-gray-50/50">
                    <td className="table-td font-mono text-[11px]" style={{ color: v.color }}>
                      {m.numeroCarte || '—'}
                    </td>
                    <td className="table-td">
                      <p className="font-semibold">{m.anarana} {m.fanampiny}</p>
                      <p className="text-[10px] text-gray-400">{m.sex === 'lahy' ? 'Lahy' : 'Vavy'}</p>
                    </td>
                    <td className="table-td text-gray-500">
                      {cat === 'mpiandraikitra' ? (m.finday || '—') : (m.datyNahaterahana || '—')}
                    </td>
                    <td className="table-td">
                      {cat === 'mpiandraikitra' ? (m.andraikitrePoste || '—') : (m.kilasy || '—')}
                    </td>
                    <td className="table-td min-w-[110px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1"><ProgressBar pct={pct} color={v.dot} /></div>
                        <span className="text-[10px] text-gray-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-1">
                        <Btn size="sm" onClick={() => onView(m)}><LuEye size={13} /> Jereo</Btn>
                        <Btn size="sm" onClick={() => onEdit(m)}><LuPencil size={13} /> Ovao</Btn>
                        <Btn size="sm" onClick={() => printFiche(m, v.label, v.color)}><LuPrinter size={13} /> PDF</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConf(m.id as number)}><LuTrash2 size={13} /></Btn>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
//  ADMIN MODULE
// ============================================================
export function AdminModule() {
  const [users, setUsers]     = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState<number | null>(null)

  useEffect(() => {
    apiFetch<UserRecord[]>('/api/admin/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const patch = async (id: number, body: Partial<UserRecord>) => {
    setSaving(id)
    try {
      const updated = await apiFetch<UserRecord>(`/api/admin/users/${id}`, {
        method: 'PUT', body: JSON.stringify(body),
      })
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
    } catch (e) { alert((e as Error).message) }
    setSaving(null)
  }

  return (
    <div className="fade-in">
      <PageHeader title="Administration — Mpampiasa" />
      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Miandry...</p>
      ) : users.length === 0 ? (
        <Empty message="Tsy misy mpampiasa voasoratra" />
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Anarana', 'Email', 'Sampana', 'Statut', 'Super Admin', 'Daty', ''].map(h => (
                  <th key={h} className="table-th whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="table-td">
                    <p className="font-semibold">{u.nom} {u.prenoms}</p>
                    {!u.isActive && <span className="text-[10px] text-red-400">Tsy mavitrika</span>}
                  </td>
                  <td className="table-td text-gray-500">{u.email}</td>
                  <td className="table-td">{SAMPANA_LABELS[u.sampana] ?? u.sampana}</td>
                  <td className="table-td">
                    {u.isApproved
                      ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Voaraisina</span>
                      : <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Miandry</span>
                    }
                  </td>
                  <td className="table-td">
                    {u.isSuperAdmin
                      ? <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Super Admin</span>
                      : <span className="text-gray-300">—</span>
                    }
                  </td>
                  <td className="table-td text-gray-400 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString('fr-MG')}
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {!u.isApproved && u.isActive && (
                        <Btn size="sm" disabled={saving === u.id}
                          onClick={() => patch(u.id, { isApproved: true })}>
                          <LuUserCheck size={13} /> Raisina
                        </Btn>
                      )}
                      {u.isApproved && u.isActive && !u.isSuperAdmin && (
                        <Btn size="sm" variant="danger" disabled={saving === u.id}
                          onClick={() => patch(u.id, { isActive: false })}>
                          <LuUserX size={13} /> Antsojy
                        </Btn>
                      )}
                      {!u.isActive && (
                        <Btn size="sm" disabled={saving === u.id}
                          onClick={() => patch(u.id, { isActive: true, isApproved: true })}>
                          <LuUserCheck size={13} /> Averina
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================
//  AUDIT MODULE
// ============================================================
export function AuditModule() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    apiFetch<AuditEntry[]>('/api/audit')
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const slice  = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const pages  = Math.ceil(entries.length / PAGE_SIZE)

  return (
    <div className="fade-in">
      <PageHeader
        title="Historique des actions"
        subtitle={`${entries.length} entrée${entries.length !== 1 ? 's' : ''} au total`}
      />
      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Miandry...</p>
      ) : entries.length === 0 ? (
        <Empty message="Tsy misy tantara voatahiry" />
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Daty', 'Mpampiasa', 'Sampana', 'Hetsika', 'Zavatra', 'Antsipiriany'].map(h => (
                    <th key={h} className="table-th whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {slice.map(e => {
                  const act = ACTION_LABELS[e.action] ?? { label: e.action, color: '#6b7280' }
                  return (
                    <tr key={e.id} className="hover:bg-gray-50/50">
                      <td className="table-td text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(e.createdAt).toLocaleString('fr-MG')}
                      </td>
                      <td className="table-td">
                        <p className="font-semibold text-xs">{e.user.nom} {e.user.prenoms}</p>
                      </td>
                      <td className="table-td text-[11px] text-gray-500">
                        {SAMPANA_LABELS[e.user.sampana] ?? e.user.sampana}
                      </td>
                      <td className="table-td">
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{ background: `${act.color}18`, color: act.color }}>
                          {act.label}
                        </span>
                      </td>
                      <td className="table-td text-[11px]">
                        {ENTITY_LABELS[e.entity] ?? e.entity}
                        {e.entityId && <span className="ml-1 text-gray-400">#{e.entityId}</span>}
                      </td>
                      <td className="table-td text-[11px] text-gray-500 max-w-[200px] truncate">
                        {e.details ? Object.entries(e.details).map(([k, v]) => `${k}: ${v}`).join(', ') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Btn size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <LuChevronLeft size={13} /> Teo aloha
              </Btn>
              <span className="text-sm text-gray-500">{page + 1} / {pages}</span>
              <Btn size="sm" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>
                Manaraka <LuChevronLeft size={13} className="rotate-180" />
              </Btn>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
//  MEMBRE FORM
// ============================================================
interface MembreFormProps {
  cat: SokajyType; initial: Membre; onSave: (m: Membre) => void; onCancel: () => void
}
export function MembreForm({ cat, initial, onSave, onCancel }: MembreFormProps) {
  const [m, setM] = useState<Membre>(() => {
    if (cat !== 'mpiandraikitra') return initial
    const fiofanana = initial.fiofanana?.length
      ? initial.fiofanana
      : FIOFANANA_DINGAM.map(d => ({ dingam: d, fotoana: '', toerana: '', tomponAndraikitra: '', fanamarihana: '' }))
    const fanekena = initial.fanekena.length >= 6
      ? initial.fanekena
      : [
          initial.fanekena[0] ?? { daty: '', toerana: '', andraikitra: '' },
          initial.fanekena[1] ?? { daty: '', toerana: '', andraikitra: '' },
          ...Array(4).fill(null).map((_, i) => initial.fanekena[i + 2] ?? { daty: '', toerana: '', andraikitra: '', sokajyFane: '' }),
        ]
    return { ...initial, fiofanana, fanekena }
  })
  const [genLoading, setGenLoading] = useState(false)
  const v = CATS[cat]

  const f = <K extends keyof Membre>(k: K) => (val: Membre[K]) => setM(p => ({ ...p, [k]: val }))
  const setAmb = (i: number, k: keyof AmbaratongaItem, val: string) =>
    setM(p => ({ ...p, ambaratonga: p.ambaratonga.map((a, j) => j === i ? { ...a, [k]: val } : a) }))
  const setFane = (k: keyof FanekenaItem, val: string) =>
    setM(p => ({ ...p, fanekena: [{ ...(p.fanekena[0] ?? {}), [k]: val } as FanekenaItem, ...p.fanekena.slice(1)] }))
  const setFane1 = (k: keyof FanekenaItem, val: string) =>
    setM(p => ({ ...p, fanekena: [p.fanekena[0], { ...(p.fanekena[1] ?? {}), [k]: val } as FanekenaItem, ...p.fanekena.slice(2)] }))
  const setFaneN = (i: number, k: keyof FanekenaItem, val: string) =>
    setM(p => ({ ...p, fanekena: p.fanekena.map((fn, j) => j === i + 2 ? { ...fn, [k]: val } as FanekenaItem : fn) }))
  const setFiof = (i: number, k: keyof FiofananaItem, val: string) =>
    setM(p => ({ ...p, fiofanana: (p.fiofanana ?? []).map((fi, j) => j === i ? { ...fi, [k]: val } : fi) }))
  const addFaneN = () =>
    setM(p => ({ ...p, fanekena: [...p.fanekena, { andraikitra: '', sokajyFane: '', toerana: '', daty: '' } as FanekenaItem] }))
  const setFaneAll = (i: number, k: keyof FanekenaItem, val: string) =>
    setM(p => ({ ...p, fanekena: p.fanekena.map((fn, j) => j === i ? { ...fn, [k]: val } as FanekenaItem : fn) }))
  const addFaneRow = () =>
    setM(p => ({ ...p, fanekena: [...p.fanekena, { daty: '', toerana: '', andraikitra: '' } as FanekenaItem] }))

  const generateCard = async () => {
    setGenLoading(true)
    try {
      const { numeroCarte } = await apiFetch<{ numeroCarte: string }>('/api/membres/generate-card', {
        method: 'POST', body: JSON.stringify({ sokajy: cat, taomPanabeazana: m.taomPanabeazana }),
      })
      setM(p => ({ ...p, numeroCarte }))
    } catch { setM(p => ({ ...p, numeroCarte: `${cat.slice(0,2).toUpperCase()}${Date.now().toString().slice(-6)}` })) }
    setGenLoading(false)
  }

  const isMpit = cat === 'mpitarika'
  const isMpia = cat === 'mpiandraikitra'
  const hasExtra = ['tily', 'mpiandalana', 'mpitarika'].includes(cat)
  const fane0: FanekenaItem = m.fanekena[0] ?? { daty: '', toerana: '', andraikitra: '' }
  const fane1: FanekenaItem = m.fanekena[1] ?? { daty: '', toerana: '', andraikitra: '' }
  const faneN = m.fanekena.slice(2)

  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = () => {
    const errs: string[] = []
    const anarana = requireMin(m.anarana, 2)
    if (anarana) errs.push(`Anarana: ${anarana}`)
    const emailErr = optionalEmail(m.email)
    if (emailErr) errs.push(`Email: ${emailErr}`)
    const findayErr = optionalPhone(m.finday)
    if (findayErr) errs.push(`Finday: ${findayErr}`)
    if ((m.zanakaIsa ?? 0) < 0) errs.push('Isan\'ny zanaka: tsy afaka negatifa')
    if (errs.length > 0) { setSaveError(errs.join(' · ')); return }
    setSaveError(null)
    onSave(m)
  }

  const commonHeader = (
    <>
      <PageHeader
        title={`FISIN'NY ${cat.toUpperCase()}`}
        subtitle={m.id ? 'Hanova mpikambana' : 'Manampy mpikambana vaovao'}
        actions={
          <>
            <Btn onClick={onCancel}><LuX size={14} /> Hiala</Btn>
            <CatBtn color={v.color} light={v.light} onClick={handleSave}><LuSave size={14} /> Hitahiry</CatBtn>
          </>
        }
      />
      {saveError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {saveError}
        </div>
      )}
      <Sec title="Taom-panabeazana & Numero kara">
        <Grid cols={2}>
          <YearSel value={m.taomPanabeazana} onChange={f('taomPanabeazana') as (v: string) => void} />
          <Field label="Numero kara (max 12 caractères)" hint={`${m.numeroCarte.length}/12`}>
            <div className="flex gap-2">
              <input
                value={m.numeroCarte}
                onChange={e => setM(p => ({ ...p, numeroCarte: e.target.value.slice(0, 12) }))}
                maxLength={12} placeholder="Ex: MP20240001"
                className="flex-1 font-mono tracking-wider"
              />
              <CatBtn color={v.color} light={v.light} size="sm" onClick={generateCard} disabled={genLoading}>
                {genLoading ? '...' : <><LuRefreshCw size={12} /> Auto</>}
              </CatBtn>
            </div>
          </Field>
        </Grid>
      </Sec>
    </>
  )

  if (isMpia) {
    return (
      <div className="fade-in">
        {commonHeader}
        <Sec title="Momba ny Tena">
          <Grid cols={2}>
            <TI label="Anarana" value={m.anarana} onChange={f('anarana') as (v: string) => void} />
            <TI label="Fanampiny" value={m.fanampiny} onChange={f('fanampiny') as (v: string) => void} />
            <TI label="Fiantso" value={m.fiantso} onChange={f('fiantso') as (v: string) => void} />
            <TI label="Andraikitra" value={m.andraikitrePoste} onChange={f('andraikitrePoste') as (v: string) => void} />
            <TI label="Daty nahaterahana" value={m.datyNahaterahana} onChange={f('datyNahaterahana') as (v: string) => void} type="date" />
            <TI label="Toerana nahaterahana" value={m.toeraNahaterahana} onChange={f('toeraNahaterahana') as (v: string) => void} />
            <CB label="Manambady" checked={m.manambady} onChange={val => setM(p => ({ ...p, manambady: val }))} />
            <TI label="Isan'ny zanaka" value={String(m.zanakaIsa)} onChange={val => setM(p => ({ ...p, zanakaIsa: parseInt(val) || 0 }))} type="number" />
            <TI label="Asa" value={m.asaAtao} onChange={f('asaAtao') as (v: string) => void} />
            <TI label="Kilasy (raha mpianatra)" value={m.kilasy} onChange={f('kilasy') as (v: string) => void} />
            <TI label="Adiresy mazava" value={m.adiresy} onChange={f('adiresy') as (v: string) => void} />
            <TI label="Adiresy mailaka" value={m.email} onChange={f('email') as (v: string) => void} type="email" />
            <TI label="Finday" value={m.finday} onChange={f('finday') as (v: string) => void} />
            <TI label="Fiangonana" value={m.fiangonana} onChange={f('fiangonana') as (v: string) => void} />
            <TI label="Fivondronana efa niandraiketana" value={m.fivondronana} onChange={f('fivondronana') as (v: string) => void} />
            <TI label="Sampana sy andraikitra hafa raisina ao am-piangonana" value={m.sampanaPiangonana} onChange={f('sampanaPiangonana') as (v: string) => void} />
            <TI label="Fikambanana hafa" value={m.sampanaRaisina} onChange={f('sampanaRaisina') as (v: string) => void} />
            <CB label="Mpandray ny fanasan'ny Tompo" checked={m.fanasan} onChange={val => setM(p => ({ ...p, fanasan: val }))} />
            <CB label="Mpanatona" checked={m.mpanantona} onChange={val => setM(p => ({ ...p, mpanantona: val }))} />
          </Grid>
        </Sec>

        <Sec title="Mpiandraikitra sy ny Fikambanana">
          <p className="mb-2 text-xs text-gray-500">Taona nidirana ho :</p>
          <Grid cols={2}>
            <TI label="Sampana Mavo" value={m.lidiRaLovitao} onChange={f('lidiRaLovitao') as (v: string) => void} />
            <TI label="Sampana Maitso" value={m.tilyMaitso} onChange={f('tilyMaitso') as (v: string) => void} />
            <TI label="Sampana Mena" value={m.mpiandalanaGrade} onChange={f('mpiandalanaGrade') as (v: string) => void} />
            <TI label="Menafify" value={m.menafifyGrade} onChange={f('menafifyGrade') as (v: string) => void} />
          </Grid>
          <p className="section-title mt-4">Fanekena</p>
          <Grid cols={4}>
            <TI label="Fanekena Tily — Daty" value={fane0.daty} onChange={val => setFane('daty', val)} type="date" />
            <TI label="Tao" value={fane0.toerana} onChange={val => setFane('toerana', val)} />
            <TI label="Fanekena Mpiandraikitra — Daty" value={fane1.daty} onChange={val => setFane1('daty', val)} type="date" />
            <TI label="Tao" value={fane1.toerana} onChange={val => setFane1('toerana', val)} />
          </Grid>
        </Sec>

        <Sec title="Momba ny Fiofanana Arahina">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {['Dingam-piofanana', 'Fotoana', 'Toerana', "Tompon'andraikitra", 'Fanamarihana'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(m.fiofanana ?? []).map((fi, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="table-td bg-gray-50 text-xs italic whitespace-nowrap">{fi.dingam}</td>
                    <td className="border border-gray-200 p-0">
                      <input type="date" value={fi.fotoana} onChange={e => setFiof(i, 'fotoana', e.target.value)} className="table-input" />
                    </td>
                    <td className="border border-gray-200 p-0">
                      <input value={fi.toerana} onChange={e => setFiof(i, 'toerana', e.target.value)} className="table-input" />
                    </td>
                    <td className="border border-gray-200 p-0">
                      <input value={fi.tomponAndraikitra} onChange={e => setFiof(i, 'tomponAndraikitra', e.target.value)} className="table-input" />
                    </td>
                    <td className="border border-gray-200 p-0">
                      <input value={fi.fanamarihana} onChange={e => setFiof(i, 'fanamarihana', e.target.value)} className="table-input" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        <Sec title="Andraikitra efa Noraisina teo amin'ny Sehatry ny Fanabeazana Skoto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {['Andraikitra', 'Sampana', 'Tao', 'Taona'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faneN.map((fn, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {(['andraikitra', 'sokajyFane', 'toerana', 'daty'] as (keyof FanekenaItem)[]).map(k => (
                      <td key={String(k)} className="border border-gray-200 p-0">
                        <input value={String(fn[k] ?? '')} onChange={e => setFaneN(i, k, e.target.value)} className="table-input" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2"><Btn size="sm" onClick={addFaneN}><LuPlus size={13} /> Hanampy andalana</Btn></div>
        </Sec>
        <Sec title="Talenta na Fahaiza-manao Manokana">
          <TA value={m.fahaizana} onChange={f('fahaizana') as (v: string) => void} rows={4} />
        </Sec>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {commonHeader}
      <Sec title="Momba ny tena">
        <Grid cols={2}>
          <TI label="Anarana" value={m.anarana} onChange={f('anarana') as (v: string) => void} />
          <TI label="Fanampiny" value={m.fanampiny} onChange={f('fanampiny') as (v: string) => void} />
          <TI label="Daty nahaterahana" value={m.datyNahaterahana} onChange={f('datyNahaterahana') as (v: string) => void} type="date" />
          <TI label="Toerana nahaterahana" value={m.toeraNahaterahana} onChange={f('toeraNahaterahana') as (v: string) => void} />
          <RadioGroup label="Lahy / Vavy" value={m.sex}
            options={[{ value: 'lahy', label: 'Lahy' }, { value: 'vavy', label: 'Vavy' }]}
            onChange={val => setM(p => ({ ...p, sex: val as 'lahy' | 'vavy' }))} />
          <TI label="Isan'ny iraitampo" value={m.iraitampo} onChange={f('iraitampo') as (v: string) => void} />
          <TI label="Anaran'ny Ray" value={m.rayAnarana} onChange={f('rayAnarana') as (v: string) => void} />
          <TI label="Asa (Ray)" value={m.rayAsa} onChange={f('rayAsa') as (v: string) => void} />
          <TI label="Anaran'ny Reny" value={m.renyAnarana} onChange={f('renyAnarana') as (v: string) => void} />
          <TI label="Asa (Reny)" value={m.renyAsa} onChange={f('renyAsa') as (v: string) => void} />
          <TI label="Laharana finday (RAD)" value={m.finday} onChange={f('finday') as (v: string) => void} />
          <TI label="Adiresy mazava" value={m.adiresy} onChange={f('adiresy') as (v: string) => void} />
          <TI label="Kilasy" value={m.kilasy} onChange={f('kilasy') as (v: string) => void} />
          <TI label="Ao amin'ny piangonana" value={m.piangonanaKilasy} onChange={f('piangonanaKilasy') as (v: string) => void} />
          <CB label="Mpianatra Sekoly Alahady" checked={m.sekolyAlahady} onChange={val => setM(p => ({ ...p, sekolyAlahady: val }))} />
          <TI label="Sampana hafa ao am-piangonana" value={m.sampanaPiangonana} onChange={f('sampanaPiangonana') as (v: string) => void} />
        </Grid>
        {hasExtra && (
          <Grid cols={2}>
            <CB label="Mpandray ny fanasan'ny Tompo" checked={m.fanasan} onChange={val => setM(p => ({ ...p, fanasan: val }))} />
            <CB label="Mpanantona" checked={m.mpanantona} onChange={val => setM(p => ({ ...p, mpanantona: val }))} />
            <TI label="Sampana hafa raisina" value={m.sampanaRaisina} onChange={f('sampanaRaisina') as (v: string) => void} />
          </Grid>
        )}
        <Grid cols={2}>
          <TI label="Daty/Taona nidirana Lovitao" value={m.lidiRaLovitao} onChange={f('lidiRaLovitao') as (v: string) => void} />
          {cat !== 'lovitao' && <TI label="Tily Maitso" value={m.tilyMaitso} onChange={f('tilyMaitso') as (v: string) => void} />}
        </Grid>
        {isMpit && (
          <Grid cols={2}>
            <TI label="Asa atao (raha miasa)" value={m.asaAtao} onChange={f('asaAtao') as (v: string) => void} />
            <TI label="Fahaizana manokana" value={m.fahaizana} onChange={f('fahaizana') as (v: string) => void} />
            <TI label="Traikefa ananana" value={m.traikefa} onChange={f('traikefa') as (v: string) => void} />
            <TI label="Mpiandalana" value={m.mpiandalanaGrade} onChange={f('mpiandalanaGrade') as (v: string) => void} />
            <TI label="Menafify" value={m.menafifyGrade} onChange={f('menafifyGrade') as (v: string) => void} />
          </Grid>
        )}
        <Grid cols={1}>
          <TI label="Misy aretina mitaiza ve? Inona? Fanafodiny?" value={m.aretina} onChange={f('aretina') as (v: string) => void} />
          <TI label="Misy sakafo tsy zaka ve? Inona?" value={m.sakafo} onChange={f('sakafo') as (v: string) => void} />
          <TI label="Misy toetra manokana ananany ve?" value={m.toetraManokana} onChange={f('toetraManokana') as (v: string) => void} />
          <TI label="Teny avy amin'ny Ray aman-dReny" value={m.tenyRaaman} onChange={f('tenyRaaman') as (v: string) => void} />
        </Grid>
      </Sec>

      <Sec title="Fanekena & Ambaratonga">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Daty fanekena', 'Toerana', 'Andraikitra'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.fanekena.map((fn, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="border border-gray-200 p-0">
                    <input type="date" value={String(fn.daty ?? '')} onChange={e => setFaneAll(i, 'daty', e.target.value)} className="table-input" />
                  </td>
                  <td className="border border-gray-200 p-0">
                    <input value={String(fn.toerana ?? '')} onChange={e => setFaneAll(i, 'toerana', e.target.value)} className="table-input" />
                  </td>
                  <td className="border border-gray-200 p-0">
                    <input value={String(fn.andraikitra ?? '')} onChange={e => setFaneAll(i, 'andraikitra', e.target.value)} className="table-input" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2"><Btn size="sm" onClick={addFaneRow}><LuPlus size={13} /> Hanampy andalana</Btn></div>
        <p className="section-title mt-4">Ambaratonga</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Ambaratonga', 'Daty', 'Talenta', 'Daty talenta'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.ambaratonga.map((a, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="table-td bg-gray-50 italic">{a.label}</td>
                  {(['daty', 'talenta', 'talenDaty'] as (keyof AmbaratongaItem)[]).map(k => (
                    <td key={String(k)} className="p-0 border border-gray-200">
                      <input
                        type={String(k).includes('aty') ? 'date' : 'text'}
                        value={String(a[k] ?? '')}
                        onChange={e => setAmb(i, k, e.target.value)}
                        className="table-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>
    </div>
  )
}

// ============================================================
//  MEMBRE DETAIL
// ============================================================
interface MembreDetailProps {
  member: Membre; cat: SokajyType; onBack: () => void; onEdit: (m: Membre) => void
}
export function MembreDetail({ member: m, cat, onBack, onEdit }: MembreDetailProps) {
  const v = CATS[cat]
  const isMpia = cat === 'mpiandraikitra'
  const done = isMpia
    ? (m.fiofanana ?? []).filter(fi => fi.fotoana).length
    : (m.ambaratonga ?? []).filter(a => a.daty).length
  const tot = isMpia ? FIOFANANA_DINGAM.length : (m.ambaratonga ?? []).length
  const pct  = tot > 0 ? Math.round(done / tot * 100) : 0

  return (
    <div className="fade-in">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700"><LuChevronLeft size={15} /> Hiverina</button>
        <h1 className="text-xl font-bold">{m.anarana} {m.fanampiny}</h1>
        <CatBadge sokajy={cat} />
        {m.numeroCarte && (
          <span className="rounded-md border px-2 py-0.5 font-mono text-xs" style={{ color: v.color, borderColor: v.dot }}>
            N° {m.numeroCarte}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <Btn onClick={() => printFiche(m, v.label, v.color)}><LuPrinter size={14} /> PDF / Imprimé</Btn>
          <CatBtn color={v.color} light={v.light} onClick={() => onEdit(m)}><LuPencil size={14} /> Hanova</CatBtn>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Sec title="Momba ny tena">
          <div className="mb-3"><Badge label={`Taom: ${m.taomPanabeazana}`} color={v.color} light={v.light} /></div>
          {([
            ['Daty nahaterahana', m.datyNahaterahana], ['Toerana', m.toeraNahaterahana],
            ['Lahy/Vavy', m.sex === 'lahy' ? 'Lahy' : 'Vavy'],
            ["Anaran'ny Ray", m.rayAnarana], ['Asa Ray', m.rayAsa],
            ["Anaran'ny Reny", m.renyAnarana], ['Asa Reny', m.renyAsa],
            ['Finday', m.finday], ['Adiresy', m.adiresy], ['Kilasy', m.kilasy],
            ['Sekoly Alahady', m.sekolyAlahady ? 'Eny' : 'Tsia'],
            ['Lovitao nidirana', m.lidiRaLovitao], ['Tily Maitso', m.tilyMaitso],
          ] as [string, string | boolean | null | undefined][]).map(([k, val]) => (
            <div key={k} className="flex justify-between border-b border-gray-100 py-1.5 text-sm">
              <span className="text-gray-500">{k}</span>
              <span className={`font-medium ${!val ? 'text-gray-300' : ''}`}>{String(val) || '—'}</span>
            </div>
          ))}
        </Sec>
        <Sec title={isMpia ? 'Fiofanana' : 'Ambaratonga'}>
          <div className="mb-4 text-center">
            <p className="text-5xl font-bold" style={{ color: v.color }}>{pct}%</p>
            <p className="mt-1 text-sm text-gray-400">{done} / {tot} {isMpia ? 'fiofanana' : 'ambaratonga'}</p>
          </div>
          <ProgressBar pct={pct} color={v.dot} height={8} />
          <div className="mt-4 space-y-2">
            {isMpia
              ? (m.fiofanana ?? []).map((fi, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: fi.fotoana ? v.dot : '#d1d5db' }} />
                    <span className="flex-1 italic text-gray-700">{fi.dingam}</span>
                    {fi.fotoana && <span className="text-xs text-gray-400">{fi.fotoana}</span>}
                  </div>
                ))
              : (m.ambaratonga ?? []).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: a.daty ? v.dot : '#d1d5db' }} />
                    <span className="flex-1 italic text-gray-700">{a.label}</span>
                    {a.daty && <span className="text-xs text-gray-400">{a.daty}</span>}
                  </div>
                ))
            }
          </div>
        </Sec>
      </div>

      {isMpia && (
        <>
          <Sec title="Mpiandraikitra sy ny Fikambanana">
            <p className="mb-2 text-xs text-gray-400 uppercase tracking-widest">Taona nidirana ho</p>
            {([
              ['Sampana Mavo', m.lidiRaLovitao],
              ['Sampana Maitso', m.tilyMaitso],
              ['Sampana Mena', m.mpiandalanaGrade],
              ['Menafify', m.menafifyGrade],
              ['Fanekena Tily — Daty', m.fanekena[0]?.daty],
              ['Fanekena Tily — Tao', m.fanekena[0]?.toerana],
              ['Fanekena Mpiandraikitra — Daty', m.fanekena[1]?.daty],
              ['Fanekena Mpiandraikitra — Tao', m.fanekena[1]?.toerana],
            ] as [string, string | undefined][]).map(([k, val]) => (
              <div key={k} className="flex justify-between border-b border-gray-100 py-1.5 text-sm">
                <span className="text-gray-500">{k}</span>
                <span className={`font-medium ${!val ? 'text-gray-300' : ''}`}>{val || '—'}</span>
              </div>
            ))}
          </Sec>
          <Sec title="Andraikitra hafa teo amin'ny fanabeazana SKOTO">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {['Andraikitra', 'Sampana', 'Tao', 'Taona'].map(h => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {m.fanekena.slice(2).map((fn, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="table-td">{fn.andraikitra || '—'}</td>
                      <td className="table-td">{fn.sokajyFane || '—'}</td>
                      <td className="table-td">{fn.toerana || '—'}</td>
                      <td className="table-td">{fn.daty || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sec>
          <Sec title="Talenta na Fahaiza-manao Manokana">
            {m.fahaizana
              ? <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.fahaizana}</p>
              : <p className="text-sm text-gray-300">—</p>
            }
          </Sec>
        </>
      )}
    </div>
  )
}

// ============================================================
//  SURVEILLANCE
// ============================================================
export function Surveillance({ cat, members }: { cat: SokajyType; members: Membre[] }) {
  const v = CATS[cat]
  return (
    <div className="fade-in">
      <PageHeader title={`Fanaraha-maso — ${v.label}`} />
      {members.length === 0
        ? <Empty message="Tsy misy mpikambana mandraka izao" />
        : (
          <div className="space-y-3">
            {members.map(m => {
              const isMpia = cat === 'mpiandraikitra'
              const done = isMpia
                ? (m.fiofanana ?? []).filter(fi => fi.fotoana).length
                : (m.ambaratonga ?? []).filter(a => a.daty).length
              const tot = isMpia ? FIOFANANA_DINGAM.length : (m.ambaratonga ?? []).length
              const pct  = tot > 0 ? Math.round(done / tot * 100) : 0
              return (
                <div key={m.id ?? m.anarana} className="card">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold">
                        {m.anarana} {m.fanampiny}
                        {m.numeroCarte && (
                          <span className="ml-2 font-mono text-xs" style={{ color: v.color }}>{m.numeroCarte}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">Taom: {m.taomPanabeazana}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: pct === 100 ? '#00911B' : v.color }}>{pct}%</span>
                  </div>
                  <div className="mb-2"><ProgressBar pct={pct} color={v.dot} /></div>
                  <div className="flex flex-wrap gap-1.5">
                    {isMpia
                      ? (m.fiofanana ?? []).map((fi, i) => (
                          <span key={i} className="rounded-full border px-2 py-0.5 text-[10px] italic"
                            style={{
                              background: fi.fotoana ? v.light : '#f9fafb',
                              color: fi.fotoana ? v.color : '#9ca3af',
                              borderColor: fi.fotoana ? v.dot : '#e5e7eb',
                            }}>
                            {fi.dingam}
                          </span>
                        ))
                      : (m.ambaratonga ?? []).map((a, i) => (
                          <span key={i} className="rounded-full border px-2 py-0.5 text-[10px] italic"
                            style={{
                              background: a.daty ? v.light : '#f9fafb',
                              color: a.daty ? v.color : '#9ca3af',
                              borderColor: a.daty ? v.dot : '#e5e7eb',
                            }}>
                            {a.label}
                          </span>
                        ))
                    }
                  </div>
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}

// ============================================================
//  FDP MODULE
// ============================================================
function normalizeFdpRow(r: Record<string, unknown>): FDPRowItem {
  return {
    daty:        r.daty        ? String(r.daty).slice(0, 10) : '',
    lohahevitra: String(r.lohahevitra ?? ''),
    sehatra:     String(r.sehatra     ?? ''),
    fomba:       String(r.fomba       ?? ''),
    toerana:     String(r.toerana     ?? ''),
  }
}
function normalizeFDP(raw: Record<string, unknown>): FDP {
  return {
    id:              raw.id as number,
    taomPanabeazana: String(raw.taomPanabeazana ?? ''),
    sokajy:          (raw.sokajy as SokajyType) ?? 'tily',
    faritany:        String(raw.faritany    ?? ''),
    fivondronana:    String(raw.fivondronana ?? ''),
    faritra:         String(raw.faritra      ?? ''),
    sampana:         String(raw.sampana      ?? ''),
    quarter:         String(raw.quarter      ?? ''),
    months:          Number(raw.months       ?? 3),
    tanjona:         String(raw.tanjona      ?? ''),
    kendrena:        (raw.kendrena as [string,string,string]) ?? ['','',''],
    rows:            ((raw.rows ?? []) as Record<string, unknown>[]).map(normalizeFdpRow),
  }
}

function newFDP(taom: string): FDP {
  return {
    taomPanabeazana: taom, sokajy: 'tily', months: 3,
    faritany: '', fivondronana: '', faritra: '', sampana: '', quarter: '',
    tanjona: '', kendrena: ['', '', ''],
    rows: Array(12).fill(null).map(() => ({ daty: '', lohahevitra: '', sehatra: '', fomba: '', toerana: '' })),
  }
}

export function FDPModule({ taomDefault }: { taomDefault: string }) {
  const [mode, setMode]       = useState<'list' | 'form'>('list')
  const [items, setItems]     = useState<FDP[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [confId, setConfId]   = useState<number | null>(null)
  const [fdp, setFdp]         = useState<FDP>(newFDP(taomDefault))
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    apiFetch<Record<string, unknown>[]>('/api/fdp')
      .then(data => setItems(data.map(normalizeFDP)))
      .catch(console.error)
      .finally(() => setLoadingList(false))
  }, [])

  const set = <K extends keyof FDP>(k: K, val: FDP[K]) => setFdp(p => ({ ...p, [k]: val }))
  const setRow = (i: number, k: keyof FDPRowItem, val: string) =>
    setFdp(p => ({ ...p, rows: p.rows.map((r, j) => j === i ? { ...r, [k]: val } : r) }))
  const addFdpRow = () =>
    setFdp(p => ({ ...p, rows: [...p.rows, { daty: '', lohahevitra: '', sehatra: '', fomba: '', toerana: '' }] }))
  const setKend = (i: number, val: string) =>
    setFdp(p => { const k: [string,string,string] = [...p.kendrena]; k[i] = val; return { ...p, kendrena: k } })

  const openNew  = () => { setFdp(newFDP(taomDefault)); setMode('form') }
  const openEdit = (item: FDP) => { setFdp(item); setMode('form') }

  const save = async () => {
    if (!fdp.taomPanabeazana) { alert('Mila taom-panabeazana'); return }
    setSaving(true)
    try {
      const isNew = !fdp.id
      const saved = await apiFetch<Record<string, unknown>>(
        isNew ? '/api/fdp' : `/api/fdp/${fdp.id}`,
        { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(fdp) }
      )
      const normalized = normalizeFDP(saved)
      setItems(prev => isNew ? [normalized, ...prev] : prev.map(i => i.id === normalized.id ? normalized : i))
      setMode('list')
    } catch (e) { alert((e as Error).message) }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    try {
      await apiFetch(`/api/fdp/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (e) { alert((e as Error).message) }
    setConfId(null)
  }

  if (mode === 'list') {
    return (
      <div className="fade-in">
        <PageHeader
          title="Fandaharam-panabeazana"
          actions={<Btn variant="primary" onClick={openNew}><LuPlus size={14} /> Manampy</Btn>}
        />
        {confId !== null && (
          <ConfirmModal
            title="Hamafa fandaharam-panabeazana?"
            message="Tsy azo averina intsony ny fandidiana io. Tena hamafa io fandaharam-panabeazana io ve ianao?"
            confirmLabel="Hamafa"
            variant="danger"
            onConfirm={() => deleteItem(confId)}
            onCancel={() => setConfId(null)}
          />
        )}
        {loadingList ? (
          <p className="py-8 text-center text-sm text-gray-400">Miandry...</p>
        ) : items.length === 0 ? (
          <Empty
            message="Tsy misy fandaharam-panabeazana voatahiry"
            action={<Btn variant="primary" onClick={openNew}><LuPlus size={14} /> Manampy voalohany</Btn>}
          />
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Taom-panabeazana', 'Sokajy', 'Sampana', 'Faritra', 'Trimestre', ''].map(h => (
                    <th key={h} className="table-th whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="table-td">{item.taomPanabeazana}</td>
                    <td className="table-td">{CATS[item.sokajy]?.label ?? item.sokajy}</td>
                    <td className="table-td">{item.sampana || '—'}</td>
                    <td className="table-td">{item.faritra || item.fivondronana || '—'}</td>
                    <td className="table-td">{item.quarter || '—'}</td>
                    <td className="table-td">
                      <div className="flex gap-1">
                        <Btn size="sm" onClick={() => openEdit(item)}><LuPencil size={13} /> Ovao</Btn>
                        <Btn size="sm" onClick={() => printFDP(item)}><LuPrinter size={13} /> PDF</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConfId(item.id!)}><LuTrash2 size={13} /></Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fade-in">
      <PageHeader
        title={fdp.id ? 'Hanova Fandaharam-panabeazana' : 'Fandaharam-panabeazana Vaovao'}
        actions={
          <>
            <Btn onClick={() => setMode('list')}><LuChevronLeft size={14} /> Hiverina</Btn>
            <Btn onClick={() => printFDP(fdp)}><LuPrinter size={14} /> PDF / Imprimé</Btn>
            <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Mitahiry...' : <><LuSave size={14} /> Hitahiry</>}</Btn>
          </>
        }
      />
      <Sec title="Configuration">
        <Grid cols={2}>
          <YearSel value={fdp.taomPanabeazana} onChange={v => set('taomPanabeazana', v)} />
          <Sel label="Sokajy" value={fdp.sokajy} onChange={v => set('sokajy', v as SokajyType)}>
            {(Object.entries(CATS) as [SokajyType, typeof CATS[SokajyType]][]).map(([k, v]) =>
              <option key={k} value={k}>{v.label}</option>)}
          </Sel>
          <TI label="Faritany" value={fdp.faritany} onChange={v => set('faritany', v)} />
          <TI label="Fivondronana" value={fdp.fivondronana} onChange={v => set('fivondronana', v)} />
          <TI label="Faritra" value={fdp.faritra} onChange={v => set('faritra', v)} />
          <TI label="Sampana" value={fdp.sampana} onChange={v => set('sampana', v)} />
          <TI label="Numero Telovolana" value={fdp.quarter} onChange={v => set('quarter', v)} />
          <Field label={`Isa-volana — ${fdp.months} volana`}>
            <input type="range" min={1} max={12} step={1} value={fdp.months}
              onChange={e => {
                const n = Number(e.target.value)
                setFdp(p => ({
                  ...p, months: n,
                  rows: Array(n * 4).fill(null).map((_, i) =>
                    p.rows[i] ?? { daty: '', lohahevitra: '', sehatra: '', fomba: '', toerana: '' }),
                }))
              }} />
          </Field>
        </Grid>
        <TI label="Tanjona" value={fdp.tanjona} onChange={v => set('tanjona', v)} />
        <Field label="Zava-kendrena manokana">
          {([0, 1, 2] as const).map(i => (
            <input key={i} type="text" value={fdp.kendrena[i]} placeholder={`Zava-kendrena ${i + 1}`}
              onChange={e => setKend(i, e.target.value)} className="mb-2 w-full" />
          ))}
        </Field>
      </Sec>
      <Sec title={`Programme — ${fdp.months} volana (${fdp.rows.length} hetsika)`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Daty', 'Lohahevitra', 'Sehatra', 'Fomba', 'Toerana'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fdp.rows.map((row, i) => (
                <tr key={i} className={Math.floor(i / 4) % 2 === 1 ? 'bg-gray-50/60' : ''}>
                  {(['daty', 'lohahevitra', 'sehatra', 'fomba', 'toerana'] as (keyof FDPRowItem)[]).map(k => (
                    <td key={String(k)} className="border border-gray-200 p-0">
                      <input type={k === 'daty' ? 'date' : 'text'} value={row[k]}
                        onChange={e => setRow(i, k, e.target.value)}
                        className="table-input" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2"><Btn size="sm" onClick={addFdpRow}><LuPlus size={13} /> Hanampy andalana</Btn></div>
      </Sec>
    </div>
  )
}

// ============================================================
//  TEKNIKA MODULE
// ============================================================
function normalizeTeknikaRow(r: Record<string, unknown>): TeknikaRowItem {
  return {
    ora:               String(r.ora               ?? ''),
    atao:              String(r.atao              ?? ''),
    fomba:             String(r.fomba             ?? ''),
    tomponAndraikitra: String(r.tomponAndraikitra ?? ''),
    fitaovana:         String(r.fitaovana         ?? ''),
    fanamarihana:      String(r.fanamarihana      ?? ''),
  }
}

function normalizeTeknika(raw: Record<string, unknown>): Teknika {
  return {
    id:              raw.id as number,
    taomPanabeazana: String(raw.taomPanabeazana ?? ''),
    sokajy:          (raw.sokajy as SokajyType) ?? 'tily',
    sampana:         String(raw.sampana     ?? ''),
    daty:            raw.daty ? String(raw.daty).slice(0, 10) : '',
    tanjona:         String(raw.tanjona     ?? ''),
    kendrena:        (raw.kendrena as [string,string,string]) ?? ['','',''],
    faharetany:      String(raw.faharetany  ?? ''),
    toerana:         String(raw.toerana     ?? ''),
    vontoatiny:      String(raw.vontoatiny  ?? ''),
    tombane:         String(raw.tombane     ?? ''),
    rows:            ((raw.rows ?? []) as Record<string, unknown>[]).map(normalizeTeknikaRow),
  }
}

function newTeknika(taom: string): Teknika {
  return {
    taomPanabeazana: taom, sokajy: 'tily', sampana: '',
    daty: '', tanjona: '', kendrena: ['', '', ''],
    faharetany: '', toerana: '', vontoatiny: '', tombane: '',
    rows: Array(5).fill(null).map(() => ({ ora: '', atao: '', fomba: '', tomponAndraikitra: '', fitaovana: '', fanamarihana: '' })),
  }
}

export function TeknikaModule({ taomDefault }: { taomDefault: string }) {
  const [mode, setMode]       = useState<'list' | 'form'>('list')
  const [items, setItems]     = useState<Teknika[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [confId, setConfId]   = useState<number | null>(null)
  const [tek, setTek]         = useState<Teknika>(newTeknika(taomDefault))
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    apiFetch<Record<string, unknown>[]>('/api/teknika')
      .then(data => setItems(data.map(normalizeTeknika)))
      .catch(console.error)
      .finally(() => setLoadingList(false))
  }, [])

  const set = <K extends keyof Teknika>(k: K, val: Teknika[K]) => setTek(p => ({ ...p, [k]: val }))
  const setRow = (i: number, k: keyof TeknikaRowItem, val: string) =>
    setTek(p => ({ ...p, rows: p.rows.map((r, j) => j === i ? { ...r, [k]: val } : r) }))
  const setKend = (i: number, val: string) =>
    setTek(p => { const k: [string,string,string] = [...p.kendrena]; k[i] = val; return { ...p, kendrena: k } })
  const addRow = () =>
    setTek(p => ({ ...p, rows: [...p.rows, { ora: '', atao: '', fomba: '', tomponAndraikitra: '', fitaovana: '', fanamarihana: '' }] }))

  const openNew  = () => { setTek(newTeknika(taomDefault)); setMode('form') }
  const openEdit = (item: Teknika) => { setTek(item); setMode('form') }

  const save = async () => {
    if (!tek.taomPanabeazana) { alert('Mila taom-panabeazana'); return }
    setSaving(true)
    try {
      const isNew = !tek.id
      const saved = await apiFetch<Record<string, unknown>>(
        isNew ? '/api/teknika' : `/api/teknika/${tek.id}`,
        { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(tek) }
      )
      const normalized = normalizeTeknika(saved)
      setItems(prev => isNew ? [normalized, ...prev] : prev.map(i => i.id === normalized.id ? normalized : i))
      setMode('list')
    } catch (e) { alert((e as Error).message) }
    setSaving(false)
  }

  const deleteItem = async (id: number) => {
    try {
      await apiFetch(`/api/teknika/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (e) { alert((e as Error).message) }
    setConfId(null)
  }

  if (mode === 'list') {
    return (
      <div className="fade-in">
        <PageHeader
          title="Fisy Teknika"
          actions={<Btn variant="primary" onClick={openNew}><LuPlus size={14} /> Manampy</Btn>}
        />
        {confId !== null && (
          <ConfirmModal
            title="Hamafa fisy teknika?"
            message="Tsy azo averina intsony ny fandidiana io. Tena hamafa io fisy teknika io ve ianao?"
            confirmLabel="Hamafa"
            variant="danger"
            onConfirm={() => deleteItem(confId)}
            onCancel={() => setConfId(null)}
          />
        )}
        {loadingList ? (
          <p className="py-8 text-center text-sm text-gray-400">Miandry...</p>
        ) : items.length === 0 ? (
          <Empty
            message="Tsy misy fisy teknika voatahiry"
            action={<Btn variant="primary" onClick={openNew}><LuPlus size={14} /> Manampy voalohany</Btn>}
          />
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Taom-panabeazana', 'Sokajy', 'Sampana', 'Daty', 'Tanjona', ''].map(h => (
                    <th key={h} className="table-th whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="table-td">{item.taomPanabeazana}</td>
                    <td className="table-td">{CATS[item.sokajy]?.label ?? item.sokajy}</td>
                    <td className="table-td">{item.sampana || '—'}</td>
                    <td className="table-td">{item.daty || '—'}</td>
                    <td className="table-td max-w-[200px] truncate">{item.tanjona || '—'}</td>
                    <td className="table-td">
                      <div className="flex gap-1">
                        <Btn size="sm" onClick={() => openEdit(item)}><LuPencil size={13} /> Ovao</Btn>
                        <Btn size="sm" onClick={() => printTeknika(item)}><LuPrinter size={13} /> PDF</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConfId(item.id!)}><LuTrash2 size={13} /></Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fade-in">
      <PageHeader
        title={tek.id ? 'Hanova Fisy Teknika' : 'Fisy Teknika Vaovao'}
        actions={
          <>
            <Btn onClick={() => setMode('list')}><LuChevronLeft size={14} /> Hiverina</Btn>
            <Btn onClick={() => printTeknika(tek)}><LuPrinter size={14} /> PDF / Imprimé</Btn>
            <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Mitahiry...' : <><LuSave size={14} /> Hitahiry</>}</Btn>
          </>
        }
      />
      <Sec title="Antsipiriany">
        <Grid cols={2}>
          <YearSel value={tek.taomPanabeazana} onChange={v => set('taomPanabeazana', v)} />
          <Sel label="Sokajy" value={tek.sokajy} onChange={v => set('sokajy', v as SokajyType)}>
            {(Object.entries(CATS) as [SokajyType, typeof CATS[SokajyType]][]).map(([k, v]) =>
              <option key={k} value={k}>{v.label}</option>)}
          </Sel>
          <TI label="Sampana" value={tek.sampana} onChange={v => set('sampana', v)} />
          <TI label="Daty" value={tek.daty} onChange={v => set('daty', v)} type="date" />
          <TI label="Tanjona" value={tek.tanjona} onChange={v => set('tanjona', v)} />
          <TI label="Faharetany" value={tek.faharetany} onChange={v => set('faharetany', v)} />
          <TI label="Toerana" value={tek.toerana} onChange={v => set('toerana', v)} />
          <TI label="Vontoatiny" value={tek.vontoatiny} onChange={v => set('vontoatiny', v)} />
        </Grid>
        <Field label="Zava-kendrena manokana">
          {([0, 1, 2] as const).map(i => (
            <input key={i} type="text" value={tek.kendrena[i]} placeholder={`Zava-kendrena ${i + 1}`}
              onChange={e => setKend(i, e.target.value)} className="mb-2 w-full" />
          ))}
        </Field>
      </Sec>
      <Sec>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Ora', 'Atao', 'Fomba', "Tompon'andraikitra", 'Fitaovana', 'Fanamarihana'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tek.rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {(['ora', 'atao', 'fomba', 'tomponAndraikitra', 'fitaovana', 'fanamarihana'] as (keyof TeknikaRowItem)[]).map(k => (
                    <td key={String(k)} className="border border-gray-200 p-0">
                      <input type={k === 'ora' ? 'time' : 'text'} value={row[k]}
                        onChange={e => setRow(i, k, e.target.value)}
                        className="table-input" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2"><Btn size="sm" onClick={addRow}><LuPlus size={13} /> Hanampy andalana</Btn></div>
      </Sec>
      <Sec title="Tomban'ezaka">
        <TA value={tek.tombane} onChange={v => set('tombane', v)} rows={4} />
      </Sec>
    </div>
  )
}

// ============================================================
//  FAFI MODULE
// ============================================================
type FafiMap = Record<number, FafiEntry>

export function FAFIModule({ allMembers, taomDefault }: { allMembers: MembresState; taomDefault: string }) {
  const [taom, setTaom]     = useState(taomDefault)
  const [sokajy, setSokajy] = useState<SokajyType | 'all'>('all')
  const [saving, setSaving]  = useState(false)
  const [locked, setLocked]  = useState(false)
  const [fafiMap, setFafiMap] = useState<FafiMap>({})

  const members = (Object.entries(allMembers) as [SokajyType, Membre[]][])
    .flatMap(([cat, arr]) => arr.map(m => ({ ...m, sokajy: cat })))
    .filter(m => m.taomPanabeazana === taom)
    .filter(m => sokajy === 'all' || m.sokajy === sokajy)

  const updateFafi = (membreId: number, field: keyof FafiEntry, val: string) =>
    setFafiMap(prev => {
      const base: FafiEntry = prev[membreId] ?? {
        membreId, taomPanabeazana: taom,
        statut: 'tsy_nandoa', datyFandoavana: '', volaNaloa: '', mpandray: '', fanamarihana: '',
      }
      return { ...prev, [membreId]: { ...base, [field]: val } }
    })

  const getEntry = (mid: number): FafiEntry =>
    fafiMap[mid] ?? { membreId: mid, taomPanabeazana: taom, statut: 'tsy_nandoa', datyFandoavana: '', volaNaloa: '', mpandray: '', fanamarihana: '' }

  const stats = {
    total:      members.length,
    nandoa:     Object.values(fafiMap).filter(f => f.statut === 'nandoa'     && members.find(m => m.id === f.membreId)).length,
    ampahany:   Object.values(fafiMap).filter(f => f.statut === 'ampahany'   && members.find(m => m.id === f.membreId)).length,
    tsyNandoa:  Object.values(fafiMap).filter(f => f.statut === 'tsy_nandoa' && members.find(m => m.id === f.membreId)).length,
    vola:       Object.values(fafiMap).filter(f => f.statut === 'nandoa' && members.find(m => m.id === f.membreId))
                  .reduce((s, f) => s + (parseFloat(f.volaNaloa) || 0), 0),
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      await Promise.all(Object.values(fafiMap).map(fi =>
        apiFetch('/api/fafi', { method: 'POST', body: JSON.stringify(fi) })
      ))
      alert('Voatahiry daholo!')
    } catch (e) { alert((e as Error).message) }
    setSaving(false)
  }

  const fafiList: FafiEntry[] = members.map(m => ({
    ...getEntry(m.id as number),
    anarana: m.anarana, fanampiny: m.fanampiny,
    sokajy: m.sokajy, numeroCarte: m.numeroCarte,
  }))

  return (
    <div className="fade-in">
      <PageHeader
        title="FAFI — Fandoavana Assurance"
        actions={
          <>
            <Btn onClick={() => printFafiList(fafiList, taom, sokajy !== 'all' ? CATS[sokajy]?.label : undefined)}>
              <LuPrinter size={14} /> PDF / Imprimé
            </Btn>
            <Btn variant={locked ? 'danger' : 'secondary'} onClick={() => setLocked(v => !v)}>
              {locked ? <><LuLock size={14} /> Voaidy — Hamaha</> : <><LuLockOpen size={14} /> Haidy</>}
            </Btn>
            <Btn variant="primary" onClick={saveAll} disabled={saving || locked}>
              {saving ? 'Mitahiry...' : <><LuSave size={14} /> Hitahiry daholo</>}
            </Btn>
          </>
        }
      />
      <Sec>
        <Grid cols={2}>
          <YearSel value={taom} onChange={setTaom} />
          <Sel label="Sokajy" value={sokajy} onChange={v => setSokajy(v as SokajyType | 'all')}>
            <option value="all">Sokajy rehetra</option>
            {(Object.entries(CATS) as [SokajyType, typeof CATS[SokajyType]][]).map(([k, v]) =>
              <option key={k} value={k}>{v.label}</option>)}
          </Sel>
        </Grid>
      </Sec>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Total"        value={stats.total}     color="#0C447C" />
        <StatCard label="Nandoa"       value={stats.nandoa}    color="#27500A" />
        <StatCard label="Ampahany"     value={stats.ampahany}  color="#633806" />
        <StatCard label="Tsy nandoa"   value={stats.tsyNandoa} color="#791F1F" />
        <StatCard label="Vola angonina" value={`${stats.vola.toLocaleString('fr-MG')} Ar`} color="#0C447C" />
      </div>
      {members.length === 0 ? (
        <Empty message={`Tsy misy mpikambana amin'ny taom-panabeazana ${taom}`} />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['N° Kara', 'Anarana', 'Sokajy', 'Statut', 'Vola naloa (Ar)', 'Daty fandoavana', 'Mpandray', 'Fanamarihana'].map(h => (
                  <th key={h} className="table-th whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(m => {
                const fi  = getEntry(m.id as number)
                const cv  = CATS[m.sokajy]
                const mid = m.id as number
                return (
                  <tr key={mid} className="hover:bg-gray-50/50">
                    <td className="table-td font-mono text-xs" style={{ color: cv.color }}>{m.numeroCarte || '—'}</td>
                    <td className="table-td font-semibold">{m.anarana} {m.fanampiny}</td>
                    <td className="table-td"><CatBadge sokajy={m.sokajy} /></td>
                    <td className="table-td">
                      {locked
                        ? <FafiBadge statut={fi.statut} />
                        : <select
                            value={fi.statut}
                            onChange={e => updateFafi(mid, 'statut', e.target.value)}
                            className="rounded-md border border-gray-200 px-2 py-1 text-xs"
                          >
                            <option value="nandoa">Nandoa</option>
                            <option value="ampahany">Ampahany</option>
                            <option value="tsy_nandoa">Tsy nandoa</option>
                          </select>
                      }
                    </td>
                    <td className="table-td">
                      <input type="number" value={fi.volaNaloa}
                        onChange={e => updateFafi(mid, 'volaNaloa', e.target.value)}
                        disabled={locked}
                        placeholder="0" className="w-24 rounded border border-gray-200 px-2 py-1 text-right text-xs disabled:bg-gray-50 disabled:text-gray-500" />
                    </td>
                    <td className="table-td">
                      <input type="date" value={fi.datyFandoavana}
                        onChange={e => updateFafi(mid, 'datyFandoavana', e.target.value)}
                        disabled={locked}
                        className="rounded border border-gray-200 px-2 py-1 text-xs disabled:bg-gray-50 disabled:text-gray-500" />
                    </td>
                    <td className="table-td">
                      <input type="text" value={fi.mpandray}
                        onChange={e => updateFafi(mid, 'mpandray', e.target.value)}
                        disabled={locked}
                        className="w-24 rounded border border-gray-200 px-2 py-1 text-xs disabled:bg-gray-50 disabled:text-gray-500" />
                    </td>
                    <td className="table-td">
                      <input type="text" value={fi.fanamarihana}
                        onChange={e => updateFafi(mid, 'fanamarihana', e.target.value)}
                        disabled={locked}
                        className="w-28 rounded border border-gray-200 px-2 py-1 text-xs disabled:bg-gray-50 disabled:text-gray-500" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}