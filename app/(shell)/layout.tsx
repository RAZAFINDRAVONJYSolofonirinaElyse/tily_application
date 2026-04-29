import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { COOKIE } from '@/lib/session'
import { ShellProvider } from './ShellContext'
import Sidebar from '@/components/layout/Sidebar'

async function ShellLayout({ children }: { children: React.ReactNode }) {
  const jar   = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) redirect('/login')

  const user = await verifyToken(token)
  if (!user) redirect('/login')
  if (!user.isApproved) redirect('/pending')

  return (
    <ShellProvider user={user}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </ShellProvider>
  )
}

export default ShellLayout
