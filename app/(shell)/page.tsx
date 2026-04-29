'use client'

import { useShell } from './ShellContext'
import { newMembre } from '@/types'
import {
  Dashboard, MembresList, MembreForm, MembreDetail, Surveillance,
  FDPModule, TeknikaModule, FAFIModule, AdminModule, AuditModule,
} from '@/components/modules'

export default function HomePage() {
  const {
    user, nav, setNav, cat, setCat, taom, setTaom,
    members, form, setForm, detail, setDetail,
    saveMember, deleteMember, filtered,
  } = useShell()

  if (form !== null) {
    return <MembreForm cat={cat} initial={form} onSave={saveMember} onCancel={() => setForm(null)} />
  }

  if (detail !== null) {
    return (
      <MembreDetail
        member={detail} cat={cat}
        onBack={() => setDetail(null)}
        onEdit={m => { setDetail(null); setForm({ ...m }) }}
      />
    )
  }

  return (
    <>
      {nav === 'dashboard'    && <Dashboard members={members} taom={taom} setTaom={setTaom} setNav={p => setNav(p as never)} setCat={setCat} />}
      {nav === 'membres'      && <MembresList cat={cat} members={filtered(cat)} taom={taom} onAdd={() => setForm(newMembre(cat, taom))} onEdit={m => setForm({ ...m })} onDelete={deleteMember} onView={m => setDetail(m)} />}
      {nav === 'surveillance' && <Surveillance cat={cat} members={filtered(cat)} />}
      {nav === 'fdp'          && <FDPModule taomDefault={taom} />}
      {nav === 'teknika'      && <TeknikaModule taomDefault={taom} />}
      {nav === 'fafi'         && <FAFIModule allMembers={members} taomDefault={taom} />}
      {nav === 'audit'        && <AuditModule />}
      {nav === 'admin'        && <AdminModule />}
    </>
  )
}
