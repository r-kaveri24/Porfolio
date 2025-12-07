import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PostsListPage() {
  let posts: any[] = []
  try {
    posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, include: { coverImage: true, tags: { include: { tag: true } } } })
  } catch {}
  return (
    <div className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold">All Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {posts.map((p: any) => (
            <Link key={p.id} href={`/posts/${p.slug}`} className="group bg-gray-800 rounded-2xl border border-white/10 overflow-hidden">
              {p.coverImage?.url ? <img src={p.coverImage.url} alt="Cover image" className="h-40 w-full object-cover" /> : null}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
                  {p.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t: any) => (
                        <span key={t.tagId} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{t.tag.name}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-1 font-semibold group-hover:underline">{p.title}</div>
                <div className="mt-2 text-white/70 text-sm line-clamp-3">{p.summary}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
