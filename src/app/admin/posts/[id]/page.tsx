import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EditForm from './edit-form'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') redirect('/admin/login')
  const post = await prisma.post.findUnique({ where: { id: params.id }, include: { tags: { include: { tag: true } }, coverImage: true } })
  if (!post) {
    return <div className="container py-8">Not found</div>
  }
  const tagNames = post.tags.map((t: any) => t.tag.name)
  const coverImageUrl = post.coverImage?.url ?? ''
  return (
    <EditForm post={{ id: post.id, title: post.title, slug: post.slug, summary: post.summary ?? '', content: post.content, status: post.status, tags: tagNames, coverImageUrl }} />
  )
}
