import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeletePostButton from './delete-button'

export default async function AdminPostsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') redirect('/admin/login')
  const q = searchParams?.q?.trim() || ''
  const postsBase = await prisma.post.findMany({
    where: q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { summary: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }] } : undefined,
    orderBy: { updatedAt: 'desc' },
    include: { tags: { include: { tag: true } } },
  })
  const posts = await Promise.all(
    postsBase.map(async (p: typeof postsBase[number]) => {
      const views = await prisma.pageView.count({ where: { postId: p.id } })
      return { id: p.id, title: p.title, status: p.status, updatedAt: p.updatedAt, tags: p.tags.map((t: any) => t.tag.name), views }
    })
  )
  return (
    <div className="py-2">
      <div className="mb-4 w-1/3">
        <form className="flex items-center gap-2" action="/admin/posts" method="get">
          <input name="q" defaultValue={q} placeholder="Search posts..." className="w-full h-10 px-3 rounded-xl bg-gray-900 border border-white/10" />
        </form>
      </div>
      <div className="bg-gray-800 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900/50">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Views</th>
              <th className="p-3">Updated</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="p-3 align-top w-[40%]">
                  <div className="font-medium">{p.title}</div>
                  {p.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{tag}</span>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">+{p.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-3 align-top">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${p.status === 'PUBLISHED' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20' : 'bg-amber-400/15 text-amber-300 border-amber-400/20'}`}>{p.status}</span>
                </td>
                <td className="p-3 align-top text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="currentColor"/></svg>
                    {p.views}
                  </span>
                </td>
                <td className="p-3 align-top text-white/70">{new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="p-3 align-top ">
                  <div className="inline-flex items-center gap-4">
                    <Link href={`/admin/posts/${p.id}`} className="inline-flex items-center text-white/80 hover:text-white" title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L21 5.75Z" fill="currentColor"/></svg>
                    </Link>
                    <DeletePostButton id={p.id} variant="icon" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
