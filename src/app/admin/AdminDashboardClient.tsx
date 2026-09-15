"use client"
import { useEffect, useState } from 'react'

export default function AdminDashboardClient() {
  const [data, setData] = useState<{ total: number; drafts: number; published: number; totalViews: number; recent: { id: string; title: string; status: string; updatedAt: string; tags: string[]; views: number }[]; lastMotivation?: string | null } | null>(null)
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-amber-400/15 text-amber-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h9a2 2 0 0 1 2 2v2h3v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 4v14h12V6H6Z" fill="currentColor"/></svg>
            </div>
            <div className="text-sm text-white/60">Total Posts</div>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{data?.total ?? '-'}</div>
          <div className="text-xs text-white/60 mt-1">All time</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-orange-400/15 text-orange-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h12a2 2 0 0 1 2 2v9H8l-4 4V6a2 2 0 0 1 2-2Z" fill="currentColor"/></svg>
            </div>
            <div className="text-sm text-white/60">Drafts</div>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{data?.drafts ?? '-'}</div>
          <div className="text-xs text-white/60 mt-1">Pending review</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-400/15 text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17l6-6 4 4 7-7v7h-7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            </div>
            <div className="text-sm text-white/60">Published</div>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{data?.published ?? '-'}</div>
          <div className="text-xs text-white/60 mt-1">Consistent publishing</div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-sky-400/15 text-sky-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="currentColor"/></svg>
            </div>
            <div className="text-sm text-white/60">Total Views</div>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{data?.totalViews ?? '-'}</div>
          <div className="text-xs text-white/60 mt-1">Keep engaging readers</div>
        </div>
      </div>
      <div>
        <div className="text-sm text-white/60 mb-2">Recent Posts</div>
        <div className="bg-gray-800 rounded-2xl border border-white/10">
          <ul className="divide-y divide-white/10">
            {(data?.recent ?? []).map((p) => (
              <li key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{p.title}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${p.status === 'PUBLISHED' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20' : 'bg-amber-400/15 text-amber-300 border-amber-400/20'}`}>{p.status}</span>
                    </div>
                    <div className="text-xs text-white/60">Updated {new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    {p.tags?.length ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.tags.map(t => (
                          <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{t}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-6 text-white/70">
                    <div className="flex items-center gap-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="currentColor"/></svg>
                      <span className="text-sm">{p.views}</span>
                    </div>
                    <a href={`/admin/posts/${p.id}`} className="inline-flex items-center text-white/80 hover:text-white" title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L21 5.75Z" fill="currentColor"/></svg>
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {data?.lastMotivation && (
        <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
          <div className="text-sm text-white/60">Your writing coach says:</div>
          <div className="mt-2">{data.lastMotivation}</div>
        </div>
      )}
    </div>
  )
}
