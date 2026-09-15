import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const total = await prisma.post.count()
  const drafts = await prisma.post.count({ where: { status: 'DRAFT' } })
  const published = await prisma.post.count({ where: { status: 'PUBLISHED' } })
  const totalViews = await prisma.pageView.count()
  const recentBase = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: { tags: { include: { tag: true } } },
  })
  const recent = await Promise.all(
    recentBase.map(async (p: typeof recentBase[number]) => {
      const views = await prisma.pageView.count({ where: { postId: p.id } })
      return {
        id: p.id,
        title: p.title,
        status: p.status,
        updatedAt: p.updatedAt.toISOString(),
        tags: p.tags.map((t: any) => t.tag.name),
        views,
      }
    })
  )
  const lastMotivation = await prisma.motivation.findFirst({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ total, drafts, published, totalViews, recent, lastMotivation: lastMotivation?.message ?? null })
}
