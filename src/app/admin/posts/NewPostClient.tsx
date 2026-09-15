"use client"
import React, { useState } from 'react'
import Link from 'next/link'

export default function NewPostClient() {
  const [form, setForm] = useState({ title: '', slug: '', summary: '', content: '', status: 'DRAFT', coverImageUrl: '' })
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [coverImageId, setCoverImageId] = useState<string | undefined>(undefined)
  const [validationError, setValidationError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = form.title.trim() && form.summary.trim() && form.content.trim() && tags.length > 0
    if (!isValid) {
      setValidationError('Please fill Title, Summary, Content, and add at least 1 tag.')
      return
    }
    setValidationError('')
    const payload = { ...form, tags, coverImageId }
    const res = await fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
  const suggestTags = async () => {
    const res = await fetch('/api/ai/post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'tags', content: form.content }) })
    const json = await res.json()
    if (Array.isArray(json.tags)) setSuggestedTags(json.tags)
  }
  const handleFile = async (file?: File) => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
    const json = await res.json().catch(() => ({}))
    if (json?.id && json?.url) {
      setCoverImageId(json.id)
      setCoverPreview(json.url)
      setForm({ ...form, coverImageUrl: json.url })
    }
  }
  return (
    <div className="py-2 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          Back to Posts
        </Link>
        <button form="new-post-form" className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl">Create Post</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        <form id="new-post-form" onSubmit={submit} className="bg-gray-800 rounded-2xl p-5 space-y-4 border border-white/10">
          <div>
            <div className="text-sm text-white/60 mb-1">Title</div>
            <div className="flex gap-2">
              <input className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" placeholder="Enter post title..." value={form.title} onChange={e => { const title = e.target.value; const s = title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'); setForm({ ...form, title, slug: s }) }} required />
              <button type="button" onClick={suggestTitle} className="h-10 border border-white bg-white text-gray-900 rounded-xl px-3">✨</button>
            </div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">Slug</div>
            <input className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" placeholder="post-url-slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">Summary</div>
            <div className="flex gap-2">
              <input className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" placeholder="Brief description of your post..." value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required />
              <button type="button" onClick={genSummary} className="h-10 border border-white bg-white text-gray-900 rounded-xl px-3">✨</button>
            </div>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">Content</div>
            <textarea className="w-full p-3 rounded-xl bg-gray-900 border border-white/10 h-40" placeholder="Write your post content in Markdown..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          </div>
        </form>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
            <div className="text-sm text-white/60 mb-2">Post Settings</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60 mb-1">Status</div>
                <select className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Cover Image</div>
                <div
                  className="w-full rounded-xl border border-dashed border-white/40 bg-gray-900/40 p-4 text-white/60"
                  onDragOver={(e) => { e.preventDefault() }}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; handleFile(f) }}
                >
                  <div className="flex flex-col items-center justify-between gap-3">
                    <div>Drag & drop image here or click to upload</div>
                    <label className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/20 bg-white text-gray-900 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || undefined)} />
                      Upload
                    </label>
                  </div>
                  {coverPreview && (
                    <div className="mt-3">
                      <img src={coverPreview} alt="Cover preview" className="rounded-lg border border-white/10 max-h-40 w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-white/10">
            <div className="text-sm text-white/60 mb-2">Tags</div>
            <div className="flex gap-2">
              <input className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} />
              <button type="button" className="h-10 border border-white bg-white text-gray-900 rounded-xl px-3" onClick={() => { const t = tagInput.trim(); if (t) { setTags(prev => Array.from(new Set([...prev, t]))); setTagInput('') } }}>Add</button>
            </div>
            <div className="mt-2 text-sm text-white/60">{tags.length === 0 ? 'Add at least 1 tag' : null}</div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map(t => (
                  <button key={t} type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{t}</button>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={suggestTags} className="h-10 border border-white bg-white text-gray-900 rounded-xl px-3">✨ Suggest tags</button>
              {suggestedTags.length > 0 && (
                <div className="text-sm text-white/70">{suggestedTags.join(', ')}</div>
              )}
            </div>
            {validationError && <div className="mt-3 text-xs text-red-400">{validationError}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
