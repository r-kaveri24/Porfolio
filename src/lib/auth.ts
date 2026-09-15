import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto'

type UserRole = 'ADMIN' | 'AUTHOR'

export type SessionPayload = {
  sub: string
  email: string
  role: UserRole
  exp: number
}

const base64url = {
  encode(input: Buffer | string): string {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  },
  decode(input: string): Buffer {
    const str = input.replace(/-/g, '+').replace(/_/g, '/')
    const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
    return Buffer.from(str + pad, 'base64')
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const hashed = scryptSync(password, salt, 64)
  const storedHash = Buffer.from(hashHex, 'hex')
  return timingSafeEqual(hashed, storedHash)
}

export function createSession(payload: Omit<SessionPayload, 'exp'> & { expSeconds?: number }): string {
  const { sub, email, role, expSeconds = 60 * 60 * 24 * 7 } = payload
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body: SessionPayload = { sub, email, role, exp: now + expSeconds }
  const secret = process.env.SESSION_SECRET || ''
  const encodedHeader = base64url.encode(JSON.stringify(header))
  const encodedBody = base64url.encode(JSON.stringify(body))
  const data = `${encodedHeader}.${encodedBody}`
  const signature = createHmac('sha256', secret).update(data).digest()
  return `${data}.${base64url.encode(signature)}`
}

export function verifySession(token: string): { valid: boolean; payload?: SessionPayload } {
  try {
    const secret = process.env.SESSION_SECRET || ''
    const [encodedHeader, encodedBody, encodedSig] = token.split('.')
    if (!encodedHeader || !encodedBody || !encodedSig) return { valid: false }
    const data = `${encodedHeader}.${encodedBody}`
    const expected = createHmac('sha256', secret).update(data).digest()
    const provided = base64url.decode(encodedSig)
    if (!timingSafeEqual(expected, provided)) return { valid: false }
    const payload = JSON.parse(base64url.decode(encodedBody).toString()) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false }
    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}
