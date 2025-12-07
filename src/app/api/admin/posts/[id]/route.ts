import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!String(body.title || '').trim() || !String(body.summary || '').trim() || !String(body.content || '').trim() || !Array.isArray(body.tags) || body.tags.length === 0) {
    return NextResponse.json({ error: 'Missing required fields: title, summary, content, and at least 1 tag' }, { status: 400 })
  }
  const data: any = {}
  if (body.title) data.title = String(body.title)
  if (body.slug) data.slug = String(body.slug)
  if (body.summary !== undefined) data.summary = String(body.summary)
  if (body.content) data.content = String(body.content)
  if (body.status) {
    data.status = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'
    data.publishedAt = data.status === 'PUBLISHED' ? new Date() : null
  }
  if (body.coverImageId !== undefined) {
    const id = String(body.coverImageId || '')
    data.coverImageId = id ? id : null
  } else if (body.coverImageUrl !== undefined) {
    const url = String(body.coverImageUrl || '')
    if (url) {
      const media = await prisma.media.create({ data: { url, bucket: 'external', key: url } })
      data.coverImageId = media.id
    } else {
      data.coverImageId = null
    }
  }
  const { id } = await context.params
  const updated = await prisma.post.update({ where: { id }, data })
  if (Array.isArray(body.tags)) {
    const names: string[] = body.tags.filter((t: any) => typeof t === 'string').map((t: string) => t.trim()).filter(Boolean)
    await prisma.postTag.deleteMany({ where: { postId: updated.id } })
    for (const name of names) {
      const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      const tag = await prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } })
      await prisma.postTag.create({ data: { postId: updated.id, tagId: tag.id } })
    }
  }
  try {
    if (updated.status === 'PUBLISHED') {
      const stats = {
        total: await prisma.post.count(),
        drafts: await prisma.post.count({ where: { status: 'DRAFT' } }),
        published: await prisma.post.count({ where: { status: 'PUBLISHED' } }),
        lastPublishedAt: updated.publishedAt?.toISOString() ?? null,
      }
      const origin = process.env.APP_ORIGIN || 'http://localhost:3000'
      const res = await fetch(`${origin}/api/ai/post`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'motivation', stats }) })
      if (res.ok) {
        const json = await res.json()
        if (json.message) await prisma.motivation.create({ data: { message: String(json.message) } })
      }
    }
  } catch {}
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData().catch(() => null)
  const method = form?.get('_method')?.toString().toUpperCase() || ''
  const { id } = await context.params
  if (method === 'DELETE') {
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
}
