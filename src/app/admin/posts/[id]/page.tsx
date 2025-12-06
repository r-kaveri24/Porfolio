import { prisma } from '@/lib/prisma'
import EditForm from './edit-form'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) {
    return <div className="container py-8">Not found</div>
  }
  return <EditForm post={{ id: post.id, title: post.title, slug: post.slug, summary: post.summary ?? '', content: post.content, status: post.status }} />
}

