import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, slug: true, summary: true, publishedAt: true } })
  return NextResponse.json(posts.map((p: any) => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null })))
}
