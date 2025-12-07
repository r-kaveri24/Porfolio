import { prisma } from '@/lib/prisma'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })
  if (!post || post.status !== 'PUBLISHED') {
    return <div className="container py-12">Not found</div>
  }
  return (
    <article className="container py-12 prose prose-invert max-w-3xl">
      <h1>{post.title}</h1>
      {post.summary && <p className="text-white/70">{post.summary}</p>}
      <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
    </article>
  )
}
