"use client"
import { useState } from 'react'

export default function EditForm({ post }: { post: { id: string; title: string; slug: string; summary: string; content: string; status: 'DRAFT' | 'PUBLISHED' } }) {
  const [form, setForm] = useState(post)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) window.location.href = '/admin/posts'
  }
  const genSummary = async () => {
    const res = await fetch('/api/ai/post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'summary', content: form.content }) })
    const json = await res.json()
    if (json.summary) setForm({ ...form, summary: json.summary })
  }
  const suggestTitle = async () => {
    const res = await fetch('/api/ai/post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'title', content: form.content }) })
    const json = await res.json()
    if (json.title) setForm({ ...form, title: json.title })
  }
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
      <form onSubmit={submit} className="bg-gray-800 rounded-2xl p-4 space-y-3">
        <div className="flex gap-2">
          <input className="w-full p-2 rounded bg-gray-900" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <button type="button" onClick={suggestTitle} className="border border-white bg-white text-gray-900 rounded-xl px-3">Suggest title</button>
        </div>
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <div className="flex gap-2">
          <input className="w-full p-2 rounded bg-gray-900" placeholder="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
          <button type="button" onClick={genSummary} className="border border-white bg-white text-gray-900 rounded-xl px-3">Generate summary</button>
        </div>
        <textarea className="w-full p-2 rounded bg-gray-900 h-40" placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <select className="w-full p-2 rounded bg-gray-900" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
        <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl">Save</button>
      </form>
    </div>
  )
}
