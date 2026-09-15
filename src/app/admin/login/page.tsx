"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || 'Login failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-gray-800 rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div className="space-y-2">
          <label className="block text-sm text-white/70">Email</label>
          <input
            type="email"
            className="w-full rounded-lg p-3 bg-black/50 border border-white/10 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='admin@example.com'
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-white/70">Password</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              className="w-full rounded-lg p-3 pr-10 bg-black/50 border border-white/10 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
            <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
              {showPwd ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s3.5-7 10-7c2.1 0 4 .7 5.6 1.6M22 12s-3.5 7-10 7c-2.1 0-4-.7-5.6-1.6" stroke="currentColor" strokeWidth="2"/><path d="M15 12a3 3 0 0 1-3 3M12 9a3 3 0 0 1 3 3" stroke="currentColor" strokeWidth="2"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="2"/></svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-medium bg-white text-gray-900"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
