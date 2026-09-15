import { NextResponse } from 'next/server'
import { randomBytes, scryptSync } from 'crypto'
import { prisma } from '@/lib/prisma'

function hash(password: string): string {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt.toString('hex'), 64)
  return `${salt.toString('hex')}:${derived.toString('hex')}`
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }
  try {
    const adminEmail = process.env.ADMIN_EMAIL || ''
    const adminPassword = process.env.ADMIN_PASSWORD || ''
    const authorEmail = process.env.AUTHOR_EMAIL || ''
    const authorPassword = process.env.AUTHOR_PASSWORD || ''
    if (!adminEmail || !adminPassword || !authorEmail || !authorPassword) {
      return NextResponse.json({ error: 'Missing seed env vars' }, { status: 400 })
    }

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hash(adminPassword),
          role: 'ADMIN'
        }
      })
    }

    const existingAuthor = await prisma.user.findUnique({ where: { email: authorEmail } })
    if (!existingAuthor) {
      await prisma.user.create({
        data: {
          email: authorEmail,
          passwordHash: hash(authorPassword),
          role: 'AUTHOR'
        }
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Seed failed', message: e?.message }, { status: 500 })
  }
}
