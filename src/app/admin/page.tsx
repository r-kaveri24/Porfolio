"use client"
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [data, setData] = useState<{ total: number; drafts: number; published: number; recent: { id: string; title: string; status: string; createdAt: string }[] } | null>(null)
  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setData).catch(() => setData(null))
  }, [])
  const onLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/'
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-sm text-white/60">Total Posts</div>
            <div className="text-2xl font-bold">{data?.total ?? '-'}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-sm text-white/60">Drafts</div>
            <div className="text-2xl font-bold">{data?.drafts ?? '-'}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-sm text-white/60">Published</div>
            <div className="text-2xl font-bold">{data?.published ?? '-'}</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm text-white/60 mb-2">Recent Posts</div>
          <ul className="space-y-2">
            {(data?.recent ?? []).map((p) => (
              <li key={p.id} className="flex justify-between items-center bg-gray-900 rounded-xl p-3">
                <span className="font-medium">{p.title}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-900">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
        {data?.lastMotivation && (
          <div className="mt-6 bg-gray-900 rounded-xl p-4">
            <div className="text-sm text-white/60">Your writing coach says:</div>
            <div className="mt-2">{data.lastMotivation}</div>
          </div>
        )}
        <button onClick={onLogout} className="mt-4 inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl">
          Logout
        </button>
      </div>
    </div>
  )
}
