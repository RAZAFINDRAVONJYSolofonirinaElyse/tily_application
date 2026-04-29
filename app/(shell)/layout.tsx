import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { COOKIE } from '@/lib/session'
import { ShellProvider } from './ShellContext'
import ShellShell from '@/components/layout/ShellShell'

async function ShellLayout({ children }: { children: React.ReactNode }) {
  const jar   = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) redirect('/login')

  const user = await verifyToken(token)
  if (!user) redirect('/login')
  if (!user.isApproved) redirect('/pending')

  return (
    <ShellProvider user={user}>
      <ShellShell>{children}</ShellShell>
    </ShellProvider>
  )
}

export default ShellLayout
