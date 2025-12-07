import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } })
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-serif">Blog</h1>
      <p className="text-white/60 mt-2">Latest published posts</p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {posts.map((p: typeof posts[number]) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="block bg-gray-800 rounded-2xl p-6 border border-white/10 hover:border-white/30">
            <div className="text-xs text-white/50">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</div>
            <div className="text-xl font-semibold mt-1">{p.title}</div>
            {p.summary && <div className="text-white/70 mt-2">{p.summary}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
