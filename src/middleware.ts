import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const base64urlEncode = (input: ArrayBuffer | Uint8Array | string) => {
  const buf =
    typeof input === 'string' ? new TextEncoder().encode(input) : input instanceof ArrayBuffer ? new Uint8Array(input) : input
  let str = ''
  for (let i = 0; i < buf.length; i++) str += String.fromCharCode(buf[i])
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const base64urlDecodeToString = (input: string) => {
  const str = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const bin = atob(str + pad)
  return bin
}

async function verifySessionEdge(token: string): Promise<{ valid: boolean }> {
  try {
    const secret = process.env.SESSION_SECRET || ''
    const [encodedHeader, encodedBody, encodedSig] = token.split('.')
    if (!encodedHeader || !encodedBody || !encodedSig) return { valid: false }
    const data = `${encodedHeader}.${encodedBody}`
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
    const expectedSig = base64urlEncode(signature)
    if (expectedSig !== encodedSig) return { valid: false }
    const payloadJson = base64urlDecodeToString(encodedBody)
    const payload = JSON.parse(payloadJson) as { exp: number }
    if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false }
    return { valid: true }
  } catch {
    return { valid: false }
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = req.cookies.get('session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const { valid } = await verifySessionEdge(token)
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
