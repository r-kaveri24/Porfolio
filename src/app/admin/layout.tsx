"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname.startsWith('/admin/login')
  const title = pathname.startsWith('/admin/posts/new')
    ? 'New Post'
    : pathname.startsWith('/admin/posts/') && pathname !== '/admin/posts'
    ? 'Edit Post'
    : pathname === '/admin/posts'
    ? 'All Posts'
    : 'Dashboard'
  const showNewButton = !pathname.startsWith('/admin/posts/new')
  const navClass = (href: string) => {
    const active = href === '/admin'
      ? pathname === '/admin'
      : href === '/admin/posts'
      ? pathname.startsWith('/admin/posts') && !pathname.startsWith('/admin/posts/new') && pathname === '/admin/posts'
      : href === '/admin/posts/new'
      ? pathname.startsWith('/admin/posts/new')
      : pathname === href
    return `inline-flex h-9 items-center rounded-lg px-3 ${active ? 'bg-white text-gray-900' : 'hover:bg-white/10'}`
  }
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  async function onLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setLoggingOut(false)
      window.location.href = '/'
    }
  }
  if (isLogin) {
    return (
      <div className="h-screen">{children}</div>
    )
  }
  return (
    <div className="h-screen grid grid-cols-[240px_1fr] bg-gray-900">
      <aside className="bg-gray-950/70 border-r border-white/10 p-4 flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <div className="text-lg font-bold tracking-tight">Admin</div>
          <nav className="flex flex-col gap-3 mt-4">
            <Link href="/admin" className={navClass('/admin')}>Dashboard</Link>
            <Link href="/admin/posts" className={navClass('/admin/posts')}>Posts</Link>
            <Link href="/admin/posts/new" className={navClass('/admin/posts/new')}>New Post</Link>
          </nav>
        </div>
        <div className="mt-6">
          <button onClick={() => setConfirmLogout(true)} className="w-full inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-red-500/20 bg-red-500/15 text-red-400 hover:bg-red-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 17v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/><path d="M21 12H9" stroke="currentColor" strokeWidth="2"/><path d="M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2"/></svg>
            Logout
          </button>
        </div>
        {confirmLogout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-[340px]">
              <div className="text-lg font-semibold">Confirm Logout</div>
              <div className="text-white/70 mt-2">Are you sure you want to logout?</div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="border border-white/20 px-4 h-10 rounded-xl" onClick={() => setConfirmLogout(false)}>Cancel</button>
                <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl" onClick={onLogout} disabled={loggingOut}>{loggingOut ? 'Logging out...' : 'Logout'}</button>
              </div>
            </div>
          </div>
        )}
      </aside>
      <main className="h-screen flex flex-col overflow-hidden">
        <header className="border-b border-white/10 px-8 py-5 bg-gray-900/60 backdrop-blur flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold">{title}</h1>
          {showNewButton && (
            <Link href="/admin/posts/new" className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-9 px-4 rounded-xl">New Post</Link>
          )}
        </header>
        <div className="p-8 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  )
}
