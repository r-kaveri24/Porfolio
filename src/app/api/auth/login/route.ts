import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; password?: string }
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    const ok = verifyPassword(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    const token = createSession({ sub: user.id, email: user.email, role: user.role })
    const cookieStore = await cookies()
    cookieStore.set('session', token, { httpOnly: true, sameSite: 'strict', secure: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
