'use client'

export default function PendingPage() {
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }
  return (
    <div className="card text-center">
      <div className="mb-4 text-5xl text-gray-200">⏳</div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">Miandry fankatoavana</h2>
      <p className="mb-6 text-sm text-gray-500">
        Ny kaontinao dia noforona soa aman-tsara.<br />
        Miandry ny fankatoavana avy amin&apos;ny "Super Admin".
      </p>
      <button onClick={logout} className="text-sm font-medium text-scout-dark hover:underline">
        Hivoaka
      </button>
    </div>
  )
}
