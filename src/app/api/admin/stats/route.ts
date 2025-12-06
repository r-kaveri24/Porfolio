import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const total = await prisma.post.count()
  const drafts = await prisma.post.count({ where: { status: 'DRAFT' } })
  const published = await prisma.post.count({ where: { status: 'PUBLISHED' } })
  const recentRaw = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, title: true, status: true, createdAt: true } })
  const recent = recentRaw.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }))
  const lastMotivation = await prisma.motivation.findFirst({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ total, drafts, published, recent, lastMotivation: lastMotivation?.message ?? null })
}
