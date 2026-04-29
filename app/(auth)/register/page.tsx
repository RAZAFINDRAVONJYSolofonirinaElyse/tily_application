'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { isValidEmail, requireMin, requireEmail, requirePassword } from '@/lib/validators'

const SAMPANA_LABELS: Record<string, string> = {
  lovitao: 'Lovitao', tily: 'Tily',
  mpiandalana: 'Mpiandalana', mpitarika: 'Mpitarika', tonia: 'Tonia',
}

type FormData = { nom: string; prenoms: string; email: string; password: string; confirm: string; sampana: string }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    nom: '', prenoms: '', email: '', password: '', confirm: '', sampana: 'tily',
  })
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess]         = useState(false)
  const [loading, setLoading]         = useState(false)

  const validate = (f: FormData): Record<string, string> => {
    const e: Record<string, string> = {}
    const nom = requireMin(f.nom, 2)
    if (nom) e.nom = nom
    const prenoms = requireMin(f.prenoms, 2)
    if (prenoms) e.prenoms = prenoms
    const email = requireEmail(f.email)
    if (email) e.email = email
    const pwd = requirePassword(f.password)
    if (pwd) e.password = pwd
    if (!f.confirm)                        e.confirm = 'Tsy maintsy feno'
    else if (f.password !== f.confirm)     e.confirm = 'Ny teny miafina roa dia tsy mitovy'
    return e
  }

  const updateField = (k: keyof FormData, v: string) => {
    const updated = { ...form, [k]: v }
    setForm(updated)
    // Re-valider ce champ si des erreurs sont déjà affichées
    if (Object.keys(errors).length > 0) {
      const fresh = validate(updated)
      setErrors(prev => ({ ...prev, [k]: fresh[k] ?? '' }))
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      const { confirm: _, ...body } = form
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, email: body.email.trim(), nom: body.nom.trim(), prenoms: body.prenoms.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error); return }
      if (data.isApproved) {
        router.push('/login')
      } else {
        setSuccess(true)
      }
    } catch { setServerError('Erreur réseau') }
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

  const E = ({ k }: { k: string }) =>
    errors[k] ? <p className="mt-1 text-[11px] text-red-600">{errors[k]}</p> : null

  const errClass = (k: string) =>
    errors[k] ? 'border-red-400 bg-red-50 focus:ring-red-300' : ''

  return (
    <div className="card">
      <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Hisoratra</h1>
      <form onSubmit={submit} className="space-y-4" noValidate>

        {/* Nom / Prénoms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Nom</label>
            <input
              value={form.nom} onChange={e => updateField('nom', e.target.value)}
              className={`w-full ${errClass('nom')}`} disabled={loading}
            />
            <E k="nom" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Prénoms</label>
            <input
              value={form.prenoms} onChange={e => updateField('prenoms', e.target.value)}
              className={`w-full ${errClass('prenoms')}`} disabled={loading}
            />
            <E k="prenoms" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Adiresy mailaka</label>
          <input
            type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
            placeholder="email@exemple.mg"
            className={`w-full ${errClass('email')}`} disabled={loading}
          />
          <E k="email" />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Teny miafina</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={form.password} onChange={e => updateField('password', e.target.value)}
              className={`w-full pr-9 ${errClass('password')}`} disabled={loading}
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPwd(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPwd ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
          <E k="password" />
        </div>

        {/* Confirmer le mot de passe */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Hamarino ny teny miafina</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm} onChange={e => updateField('confirm', e.target.value)}
              className={`w-full pr-9 ${errClass('confirm')}`} disabled={loading}
            />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showConfirm ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
          <E k="confirm" />
        </div>

        {/* Sampana */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Sampana</label>
          <select
            value={form.sampana} onChange={e => updateField('sampana', e.target.value)}
            className="w-full" disabled={loading}
          >
            {Object.entries(SAMPANA_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        )}

        <button
          type="submit" disabled={loading}
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
