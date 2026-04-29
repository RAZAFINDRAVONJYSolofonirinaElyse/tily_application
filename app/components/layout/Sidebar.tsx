'use client'

import React, { useState } from 'react'
import { LuLayoutDashboard, LuUsers, LuEye, LuCalendar, LuFileText, LuShield, LuHistory, LuSettings, LuLogOut } from 'react-icons/lu'
import { CATS, SokajyType, NavPage } from '@/types'
import { useShell } from '@/(shell)/ShellContext'
import { ConfirmModal } from '@/components/atoms'

const NAV_ITEMS: { id: NavPage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',    label: 'Tableau de bord',       icon: <LuLayoutDashboard size={14} /> },
  { id: 'membres',      label: 'Mpikambana',             icon: <LuUsers size={14} /> },
  { id: 'surveillance', label: 'Fanaraha-maso',          icon: <LuEye size={14} /> },
  { id: 'fdp',          label: 'Fandaharam-panabeazana', icon: <LuCalendar size={14} /> },
  { id: 'teknika',      label: 'Fisy Teknika',           icon: <LuFileText size={14} /> },
  { id: 'fafi',         label: 'FAFI Assurance',         icon: <LuShield size={14} /> },
]

const SAMPANA_LABELS: Record<string, string> = {
  lovitao: 'Lovitao', tily: 'Tily', mpiandalana: 'Mpiandalana',
  mpitarika: 'Mpitarika', tonia: 'Tonia',
}

export default function Sidebar() {
  const { user, nav, setNav, cat, setCat, taom, members } = useShell()
  const isTonia = user.sampana === 'tonia' || user.isSuperAdmin
  const showCatSub = nav === 'membres' || nav === 'surveillance'

  const [showLogout, setShowLogout] = useState(false)

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  // Categories the current user can access
  const allowedCats = (Object.keys(CATS) as SokajyType[]).filter(k =>
    isTonia || k === (user.sampana as SokajyType)
  )

  return (
    <aside className="flex h-screen w-48 shrink-0 flex-col bg-scout-dark overflow-y-auto">
      {/* Brand */}
      <div className="border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-1.5">
          <img src="/LogoTily.png" alt="" className="h-7 w-7 shrink-0 object-contain" />
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40 leading-tight">
            Tily Eto Madagasikara
          </p>
          <img src="/Fleurdelys.png" alt="" className="h-7 w-7 shrink-0 object-contain" />
        </div>
        <p className="mt-1.5 text-center text-sm font-bold text-white">Skoto Zazalahy</p>
        <p className="mt-0.5 text-center text-[10px] text-white/40">{taom}</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setNav(item.id)}
            type="button" className={`flex w-full items-center gap-2.5 border-l-2 px-4 py-2 text-xs transition-colors text-left
              ${nav === item.id
                ? 'border-scout-accent bg-white/10 text-white font-semibold'
                : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white/90'}`}>
            {item.icon} {item.label}
          </button>
        ))}

        {/* Audit — tonia + super admin only */}
        {(user.sampana === 'tonia' || user.isSuperAdmin) && (
          <button onClick={() => setNav('audit')}
            type="button" className={`flex w-full items-center gap-2.5 border-l-2 px-4 py-2 text-xs transition-colors text-left
              ${nav === 'audit'
                ? 'border-scout-accent bg-white/10 text-white font-semibold'
                : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white/90'}`}>
            <LuHistory size={14} /> Historique
          </button>
        )}

        {/* Admin — super admin only */}
        {user.isSuperAdmin && (
          <button onClick={() => setNav('admin')}
            type="button" className={`flex w-full items-center gap-2.5 border-l-2 px-4 py-2 text-xs transition-colors text-left
              ${nav === 'admin'
                ? 'border-scout-accent bg-white/10 text-white font-semibold'
                : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white/90'}`}>
            <LuSettings size={14} /> Administration
          </button>
        )}
      </nav>

      {/* Category sub-nav */}
      {showCatSub && (
        <div className="border-t border-white/10 py-2">
          <p className="px-4 pb-1 pt-2 text-[9px] font-bold uppercase tracking-widest text-white/30">Sokajy</p>
          {allowedCats.map(k => {
            const v = CATS[k]
            const count = members[k]?.filter(m => m.taomPanabeazana === taom).length ?? 0
            const active = cat === k
            return (
              <button type="button" key={k} onClick={() => setCat(k)}
                className={`flex w-full items-center gap-2 border-l-2 px-4 py-1.5 text-[11px] transition-colors
                  ${active ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                style={{ borderLeftColor: active ? v.dot : 'transparent' }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: v.dot }} />
                <span className="flex-1 text-left">{v.label}</span>
                <span className="rounded-full bg-white/10 px-1.5 text-[9px] text-white/40">{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* User info + logout */}
      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-[10px] font-semibold text-white/70 truncate">{user.nom} {user.prenoms}</p>
        <p className="text-[9px] text-white/40">{SAMPANA_LABELS[user.sampana]}{user.isSuperAdmin ? ' · Admin' : ''}</p>
        <button type="button" onClick={() => setShowLogout(true)}
          className="mt-2 flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors">
          <LuLogOut size={11} /> Hivoaka
        </button>
      </div>

      {showLogout && (
        <ConfirmModal
          title="Hivoaka?"
          message="Tena hivoaka amin'ny kaonty ve ianao?"
          confirmLabel="Hivoaka"
          variant="logout"
          onConfirm={logout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </aside>
  )
}
