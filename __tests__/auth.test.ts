import { createSession, verifySession, hashPassword, verifyPassword } from '@/lib/auth'

describe('auth utils', () => {
  process.env.SESSION_SECRET = 'test-secret'
  it('hash and verify password', () => {
    const hash = hashPassword('hello-world')
    expect(verifyPassword('hello-world', hash)).toBe(true)
    expect(verifyPassword('wrong', hash)).toBe(false)
  })
  it('create and verify session', () => {
    const token = createSession({ sub: 'u1', email: 'a@b.com', role: 'ADMIN', expSeconds: 60 })
    const { valid, payload } = verifySession(token)
    expect(valid).toBe(true)
    expect(payload?.sub).toBe('u1')
    expect(payload?.role).toBe('ADMIN')
  })
})
