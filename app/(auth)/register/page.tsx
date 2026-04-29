'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuEye, LuEyeOff } from 'react-icons/lu'

const SAMPANA_LABELS: Record<string, string> = {
  lovitao: 'Lovitao', tily: 'Tily',
  mpiandalana: 'Mpiandalana', mpitarika: 'Mpitarika', tonia: 'Tonia',
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '', prenoms: '', email: '', password: '', confirm: '', sampana: 'tily',
  })
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)
  const [loading, setLoading]         = useState(false)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const pwdMismatch = form.confirm.length > 0 && form.password !== form.confirm

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Ny teny miafina roa dia tsy mitovy')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { confirm: _, ...body } = form
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      if (data.isApproved) {
        router.push('/login')
      } else {
        setSuccess(true)
      }
    } catch { setError('Erreur réseau') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="card text-center">
      <div className="mb-4 text-4xl">✓</div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">Kaonty noforonina!</h2>
      <p className="mb-6 text-sm text-gray-500">
        Ny kaontinao dia miandry ny fankatoavana avy amin&apos;ny Super Mpampiasa.
      </p>
      <a href="/login" className="text-sm font-medium text-scout-dark hover:underline">← Hiverina amin&apos;ny fidirana</a>
    </div>
  )

  return (
    <div className="card">
      <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Hisoratra</h1>
      <form onSubmit={submit} className="space-y-4">

        {/* Nom / Prénoms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Nom</label>
            <input
              value={form.nom} onChange={f('nom')}
              className="w-full" required disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Prénoms</label>
            <input
              value={form.prenoms} onChange={f('prenoms')}
              className="w-full" required disabled={loading}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Adiresy mailaka</label>
          <input
            type="email" value={form.email} onChange={f('email')}
            className="w-full" required disabled={loading}
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Teny miafina</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={form.password} onChange={f('password')}
              className="w-full pr-9" minLength={6} required disabled={loading}
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowPwd(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPwd ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirmer le mot de passe */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Hamarino ny teny miafina</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm} onChange={f('confirm')}
              className={`w-full pr-9 ${pwdMismatch ? 'border-red-400 bg-red-50 focus:ring-red-300' : ''}`}
              required disabled={loading}
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowConfirm(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
          {pwdMismatch && (
            <p className="mt-1 text-[11px] text-red-600">Ny teny miafina roa dia tsy mitovy</p>
          )}
        </div>

        {/* Sampana */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Sampana</label>
          <select
            value={form.sampana} onChange={f('sampana')}
            className="w-full" disabled={loading}
          >
            {Object.entries(SAMPANA_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading || pwdMismatch}
          className="w-full rounded-lg bg-scout-dark py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Miandry...' : 'Hisoratra'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Manana kaonty?{' '}
          <a href="/login" className="font-medium text-scout-dark hover:underline">Miditra</a>
        </p>
      </form>
    </div>
  )
}
