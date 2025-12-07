import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') redirect('/admin/login')
  return <AdminDashboardClient />
}
