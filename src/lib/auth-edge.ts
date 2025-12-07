type UserRole = 'ADMIN' | 'AUTHOR'

export type SessionPayload = {
  sub: string
  email: string
  role: UserRole
  exp: number
}

const base64url = {
  encode(input: Uint8Array): string {
    const str = btoa(String.fromCharCode(...input))
    return str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  },
  decode(input: string): Uint8Array {
    const str = input.replace(/-/g, '+').replace(/_/g, '/')
    const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
    const bin = atob(str + pad)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return arr
  },
}

async function hmacSha256(data: string, secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return new Uint8Array(signature)
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export async function verifySessionEdge(token: string): Promise<{ valid: boolean; payload?: SessionPayload }> {
  try {
    const secret = process.env.SESSION_SECRET || ''
    const parts = token.split('.')
    if (parts.length !== 3) return { valid: false }
    const [encodedHeader, encodedBody, encodedSig] = parts
    const data = `${encodedHeader}.${encodedBody}`
    const expected = await hmacSha256(data, secret)
    const provided = base64url.decode(encodedSig)
    if (!constantTimeEqual(expected, provided)) return { valid: false }
    const payloadJson = new TextDecoder().decode(base64url.decode(encodedBody))
    const payload = JSON.parse(payloadJson) as SessionPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false }
    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}
