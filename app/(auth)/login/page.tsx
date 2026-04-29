'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      if (!data.isApproved) {
        router.push('/pending')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch { setError('Erreur réseau') }
    finally { setLoading(false) }
  }

  return (
    <div className="card">
      <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Fidirana</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Adiresy mailaka</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full" placeholder="email@exemple.mg" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Teny miafina</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full" required />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-scout-dark py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
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
