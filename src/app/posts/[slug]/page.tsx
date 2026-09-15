import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findFirst({ where: { slug }, include: { coverImage: true, tags: { include: { tag: true } } } })
  if (!post || post.status !== 'PUBLISHED') {
    return (
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-white/70">Post not found.</div>
          <Link href="/posts" className="underline mt-2 inline-block">Back to posts</Link>
        </div>
      </div>
    )
  }
  return (
    <article className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/posts" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          Back to Posts
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">{post.title}</h1>
        <div className="mt-2 text-sm text-white/60">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
        {post.coverImage?.url ? (
          <img src={post.coverImage.url} alt="Cover image" className="mt-6 rounded-xl border border-white/10 w-full object-cover max-h-[420px]" />
        ) : null}
        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-1">
            {post.tags.map((t: any) => (
              <span key={t.tagId} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{t.tag.name}</span>
            ))}
          </div>
        ) : null}
        <p className="mt-6 text-white/80 leading-7 whitespace-pre-wrap">{post.content}</p>
      </div>
    </article>
  )
}
