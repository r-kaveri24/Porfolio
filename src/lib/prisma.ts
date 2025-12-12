import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function normalize(url: string): string {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  let out = trimmed
  try {
    const u = new URL(trimmed)
    const host = u.hostname.toLowerCase()
    const isPooler = host.includes('pooler.supabase.com')
    if (isPooler) {
      u.port = u.port && u.port !== '5432' ? u.port : '6543'
      const qs = u.searchParams
      if (!qs.has('ssl')) qs.set('ssl', 'true')
      out = u.toString()
    } else {
      const qs = u.searchParams
      if (!qs.has('ssl')) qs.set('ssl', 'true')
      out = u.toString()
    }
  } catch {
    if (!/\?/.test(out)) out += '?ssl=true'
    else if (!/[?&]ssl=/.test(out)) out += '&ssl=true'
    if (/pooler\.supabase\.com/.test(out) && /:5432\//.test(out)) out = out.replace(':5432/', ':6543/')
  }
  return out
}

const connectionString = normalize(process.env.DATABASE_URL ?? '')
const adapter = new PrismaPg({ connectionString })

const globalForPrisma = global as any

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
