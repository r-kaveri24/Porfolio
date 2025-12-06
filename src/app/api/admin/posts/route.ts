import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function POST(req: Request) {
  const token = cookies().get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const title = String(body.title || '')
  const slug = String(body.slug || title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'))
  const summary = body.summary ? String(body.summary) : null
  const content = String(body.content || '')
  const status = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'
  const created = await prisma.post.create({ data: { title, slug, summary, content, status, authorId: String(payload.sub), publishedAt: status === 'PUBLISHED' ? new Date() : null } })
  try {
    if (status === 'PUBLISHED') {
      const stats = {
        total: await prisma.post.count(),
        drafts: await prisma.post.count({ where: { status: 'DRAFT' } }),
        published: await prisma.post.count({ where: { status: 'PUBLISHED' } }),
        lastPublishedAt: created.publishedAt?.toISOString() ?? null,
      }
      const origin = process.env.APP_ORIGIN || 'http://localhost:3000'
      const res = await fetch(`${origin}/api/ai/post`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'motivation', stats }) })
      if (res.ok) {
        const json = await res.json()
        if (json.message) await prisma.motivation.create({ data: { message: String(json.message) } })
      }
    }
  } catch {}
  return NextResponse.json({ id: created.id })
}
