'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { isValidEmail } from '@/lib/validators'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email.trim())            e.email    = 'Tsy maintsy feno'
    else if (!isValidEmail(email)) e.email   = 'Mila endrika: email@exemple.com'
    if (!password)                e.password = 'Tsy maintsy feno'
    else if (password.length < 6) e.password = 'Litera 6 farafahakeliny'
    return e
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error); return }
      if (!data.isApproved) {
        router.push('/pending')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch { setServerError('Erreur réseau') }
    finally { setLoading(false) }
  }

  const onEmailChange = (v: string) => {
    setEmail(v)
    if (errors.email) setErrors(p => ({ ...p, email: '' }))
  }
  const onPasswordChange = (v: string) => {
    setPassword(v)
    if (errors.password) setErrors(p => ({ ...p, password: '' }))
  }

  return (
    <div className="card">
      <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Fidirana</h1>
      <form onSubmit={submit} className="space-y-4" noValidate>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Adiresy mailaka</label>
          <input
            type="email" value={email} onChange={e => onEmailChange(e.target.value)}
            placeholder="email@exemple.mg" disabled={loading}
            className={`w-full ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
          />
          {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
        </div>

        {/* Mot de passe */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Teny miafina</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => onPasswordChange(e.target.value)}
              disabled={loading}
              className={`w-full pr-9 ${errors.password ? 'border-red-400 bg-red-50' : ''}`}
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowPwd(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPwd ? <LuEyeOff size={15} /> : <LuEye size={15} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>}
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full rounded-lg bg-scout-dark py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Miandry...' : 'Miditra'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Tsy manana kaonty?{' '}
          <a href="/register" className="font-medium text-scout-dark hover:underline">Hisoratra</a>
        </p>
      </form>
    </div>
  )
}
