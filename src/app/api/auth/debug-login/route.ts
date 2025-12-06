import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, role } = await req.json().catch(() => ({ email: '', role: 'ADMIN' }))
  const token = createSession({ sub: 'debug-admin', email: email || 'rautkaveri88@gmail.com', role: (role || 'ADMIN') as 'ADMIN' | 'AUTHOR' })
  const res = NextResponse.json({ success: true })
  res.cookies.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

