import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }
  try {
    const existing = await prisma.post.findFirst({ where: { status: 'PUBLISHED' } })
    if (existing) return NextResponse.json({ ok: true, seeded: false })

    const tag = await prisma.tag.upsert({ where: { name: 'General' }, update: {}, create: { name: 'General', slug: 'general' } })
    let author = await prisma.user.findFirst({ where: { role: 'AUTHOR' } })
    if (!author) {
      author = await prisma.user.create({ data: { email: 'seed-author@example.com', passwordHash: 'seed', role: 'AUTHOR' } })
    }
    const post = await prisma.post.create({
      data: {
        title: 'Hello World',
        slug: 'hello-world',
        summary: 'A short introduction post.',
        content: 'This is a sample post to validate the UI rendering. You can edit or delete it from the admin panel.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
        tags: { create: [{ tagId: tag.id }] },
      },
    })
    return NextResponse.json({ ok: true, postId: post.id })
  } catch (e: any) {
    return NextResponse.json({ error: 'Seed failed', message: e?.message }, { status: 500 })
  }
}
