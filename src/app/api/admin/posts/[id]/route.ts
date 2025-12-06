import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data: any = {}
  if (body.title) data.title = String(body.title)
  if (body.slug) data.slug = String(body.slug)
  if (body.summary !== undefined) data.summary = body.summary ? String(body.summary) : null
  if (body.content) data.content = String(body.content)
  if (body.status) {
    data.status = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'
    data.publishedAt = data.status === 'PUBLISHED' ? new Date() : null
  }
  const updated = await prisma.post.update({ where: { id: params.id }, data })
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const token = cookies().get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const token = cookies().get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData().catch(() => null)
  const method = form?.get('_method')?.toString().toUpperCase() || ''
  if (method === 'DELETE') {
    await prisma.post.delete({ where: { id: ctx.params.id } })
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
}
