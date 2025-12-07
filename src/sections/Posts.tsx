import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export async function PostsSection() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { coverImage: true },
  })

  if (!posts.length) return null

  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Recent Posts</h2>
          <Link href="/posts" className="underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {posts.map((p: any) => (
            <Link key={p.id} href={`/posts/${p.slug}`} className="group bg-gray-800 rounded-2xl border border-white/10 overflow-hidden">
              {p.coverImage?.url ? (
                <img src={p.coverImage.url} alt="Cover image" className="h-40 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <div className="text-sm text-white/60">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
                <div className="mt-1 font-semibold group-hover:underline">{p.title}</div>
                <div className="mt-2 text-white/70 text-sm line-clamp-3">{p.summary}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
