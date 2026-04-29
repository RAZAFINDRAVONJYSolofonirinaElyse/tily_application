'use client'
// src/components/atoms/index.tsx — Tailwind UI atoms

import React from 'react'
import { LuX, LuTrash2, LuLogOut } from 'react-icons/lu'
import { CATS, YEARS, SokajyType } from '@/types'

// ---- Field wrapper ----
export function Field({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      {label && <label className="mb-1 block text-[11px] font-medium text-gray-500">{label}</label>}
      {children}
      {hint && <p className="mt-0.5 text-[10px] text-gray-400">{hint}</p>}
    </div>
  )
}

// ---- Text input ----
interface TIProps {
  label?: string; hint?: string; value: string | null | undefined
  onChange: (v: string) => void
  type?: string; maxLength?: number; placeholder?: string; disabled?: boolean
}
export function TI({ label, hint, value, onChange, type = 'text', maxLength, placeholder, disabled }: TIProps) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type} value={value ?? ''} maxLength={maxLength} placeholder={placeholder}
        disabled={disabled} onChange={e => onChange(e.target.value)}
        className="w-full"
      />
    </Field>
  )
}

// ---- Select ----
export function Sel({ label, value, onChange, children }: {
  label?: string; value: string | null | undefined; onChange: (v: string) => void; children: React.ReactNode
}) {
  return (
    <Field label={label}>
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} className="w-full">{children}</select>
    </Field>
  )
}

// ---- Textarea ----
export function TA({ label, value, onChange, rows = 3 }: {
  label?: string; value: string | null | undefined; onChange: (v: string) => void; rows?: number
}) {
  return (
    <Field label={label}>
      <textarea
        value={value ?? ''} rows={rows}
        onChange={e => onChange(e.target.value)}
        className="w-full resize-none"
      />
    </Field>
  )
}

// ---- Checkbox ----
export function CB({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-scout-mid accent-scout-mid"
      />
      {label}
    </label>
  )
}

// ---- Radio group ----
export function RadioGroup({ label, options, value, onChange }: {
  label?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Field label={label}>
      <div className="flex gap-4 pt-1">
        {options.map(o => (
          <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="radio" checked={value === o.value} onChange={() => onChange(o.value)}
              className="accent-scout-mid"
            />
            {o.label}
          </label>
        ))}
      </div>
    </Field>
  )
}

// ---- Grid ----
export function Grid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  const colMap: Record<number, string> = {
    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
  }
  return (
    <div className={`grid ${colMap[cols] ?? 'grid-cols-2'} gap-3`}>{children}</div>
  )
}

// ---- Section card ----
export function Sec({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card mb-4 ${className}`}>
      {title && <p className="section-title">{title}</p>}
      {children}
    </div>
  )
}

// ---- Button ----
interface BtnProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
}
export function Btn({ children, onClick, variant = 'secondary', size = 'md', disabled, style, className = '' }: BtnProps) {
  const base = 'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border'
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm' }
  const variants = {
    primary:   'bg-scout-mid border-scout-mid text-white hover:bg-scout/90',
    secondary: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
    danger:    'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    ghost:     'bg-transparent border-transparent text-gray-500 hover:text-gray-800',
  }
  return (
    <button onClick={onClick} disabled={disabled} style={style}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// ---- Colored button (for cat actions) ----
export function CatBtn({ children, onClick, color, light, disabled, size = 'md' }: {
  children: React.ReactNode; onClick?: () => void
  color: string; light: string; disabled?: boolean; size?: 'sm' | 'md'
}) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{ background: color, color: '#fff' }}
      className={`inline-flex items-center gap-1 rounded-lg border-0 font-semibold transition-opacity
        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
        ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
    >
      {children}
    </button>
  )
}

// ---- Badge ----
export function Badge({ label, color, light, border }: {
  label: string; color: string; light: string; border?: string
}) {
  return (
    <span
      style={{ background: light, color, border: `0.5px solid ${border ?? color}` }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
    >
      {label}
    </span>
  )
}

// ---- Cat badge ----
export function CatBadge({ sokajy }: { sokajy: SokajyType }) {
  const c = CATS[sokajy]
  return <Badge label={c.label} color={c.color} light={c.light} border={c.dot} />
}

// ---- Status badge FAFI ----
export function FafiBadge({ statut }: { statut: string }) {
  const map: Record<string, { label: string; color: string; light: string }> = {
    nandoa:     { label: 'Nandoa',     color: '#27500A', light: '#EAF3DE' },
    ampahany:   { label: 'Ampahany',   color: '#633806', light: '#FFF8EC' },
    tsy_nandoa: { label: 'Tsy nandoa', color: '#791F1F', light: '#FCEBEB' },
  }
  const c = map[statut] ?? { label: statut, color: '#555', light: '#eee' }
  return <Badge label={c.label} color={c.color} light={c.light} />
}

// ---- Progress bar ----
export function ProgressBar({ pct, color, height = 6 }: { pct: number; color: string; height?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-full bg-gray-100" style={{ height }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ---- Year selector ----
export function YearSel({ value, onChange, label = 'Taom-panabeazana' }: {
  value: string; onChange: (v: string) => void; label?: string
}) {
  return (
    <Sel label={label} value={value} onChange={onChange}>
      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
    </Sel>
  )
}

// ---- Page header ----
export function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ---- Empty state ----
export function Empty({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-4 py-12 text-center">
      <div className="text-4xl text-gray-200">○</div>
      <p className="text-sm text-gray-500">{message}</p>
      {action}
    </div>
  )
}

// ---- Confirm dialog (inline) ----
export function ConfirmBar({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
      <p className="text-sm text-red-700">{message}</p>
      <div className="flex gap-2">
        <Btn size="sm" onClick={onCancel}><LuX size={13} /> Hiala</Btn>
        <Btn size="sm" variant="danger" onClick={onConfirm}><LuTrash2 size={13} /> Hamafa</Btn>
      </div>
    </div>
  )
}

// ---- Confirm modal (overlay) ----
export function ConfirmModal({ title, message, confirmLabel, variant = 'danger', onConfirm, onCancel }: {
  title: string
  message: string
  confirmLabel: string
  variant?: 'danger' | 'logout'
  onConfirm: () => void
  onCancel: () => void
}) {
  const isDanger = variant === 'danger'
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full
          ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          {isDanger ? <LuTrash2 size={22} /> : <LuLogOut size={22} />}
        </div>
        <h3 className="mb-1 text-center text-base font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-center text-sm text-gray-500">{message}</p>
        <div className="flex gap-3">
          <Btn className="flex-1 justify-center" onClick={onCancel}>
            <LuX size={14} /> Hiala
          </Btn>
          <Btn className="flex-1 justify-center" variant={isDanger ? 'danger' : 'danger'} onClick={onConfirm}>
            {isDanger ? <LuTrash2 size={14} /> : <LuLogOut size={14} />} {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ---- Stat card ----
export function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="card text-center">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-2xl font-bold" style={{ color: color ?? '#111' }}>{value}</p>
    </div>
  )
}
