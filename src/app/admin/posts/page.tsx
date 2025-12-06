import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeletePostButton from './delete-button'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <Link href="/admin/posts/new" className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl">New post</Link>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="p-2">{p.title}</td>
                <td className="p-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-900">{p.status}</span>
                </td>
                <td className="p-2">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <Link href={`/admin/posts/${p.id}`} className="mr-3 underline">Edit</Link>
                  <DeletePostButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
