import { NextResponse } from 'next/server'
import { randomBytes, scryptSync } from 'crypto'
import { prisma } from '@/lib/prisma'

function hash(password: string): string {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${derived.toString('hex')}`
}

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'rautkaveri88@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Bhimrao@13'
    const authorEmail = process.env.AUTHOR_EMAIL || 'author@gmail.com'
    const authorPassword = process.env.AUTHOR_PASSWORD || 'password1234'

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
