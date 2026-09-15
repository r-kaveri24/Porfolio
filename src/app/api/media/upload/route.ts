import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData().catch(() => null)
  const file = form?.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  const allowed = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowed.includes(file.type || '')) return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
  const maxBytes = 8 * 1024 * 1024
  if ((file.size || 0) > maxBytes) return NextResponse.json({ error: 'File too large' }, { status: 413 })
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const original = file.name || 'upload'
  const ext = path.extname(original) || (file.type === 'image/png' ? '.png' : file.type === 'image/jpeg' ? '.jpg' : '')
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, new Uint8Array(buffer))
  const url = `/uploads/${filename}`
  const media = await prisma.media.create({ data: { url, bucket: 'local', key: filename, contentType: file.type || null, size: file.size || null } })
  return NextResponse.json({ id: media.id, url })
}
