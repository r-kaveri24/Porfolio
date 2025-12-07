import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('session', '', { httpOnly: true, sameSite: 'strict', secure: true, path: '/', maxAge: 0 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
