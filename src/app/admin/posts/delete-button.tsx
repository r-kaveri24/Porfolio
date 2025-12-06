"use client"
import { useState } from 'react'

export default function DeletePostButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const onDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <button className="underline" onClick={() => setOpen(true)}>Delete</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-[320px]">
            <div className="text-lg font-semibold">Delete Post</div>
            <div className="text-white/70 mt-2">Are you sure you want to delete?</div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="border border-white/20 px-4 h-10 rounded-xl" onClick={() => setOpen(false)}>Cancel</button>
              <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-10 px-4 rounded-xl" onClick={onDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
