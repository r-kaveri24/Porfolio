import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth'
import OpenAI from 'openai'

function sanitizeText(input: string, max = 4000): string {
  return String(input || '').replace(/[\u0000-\u001F]/g, '').slice(0, max)
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value || ''
  const { valid, payload } = verifySession(token)
  if (!valid || !payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { action?: string; content?: string; stats?: any }
  const action = String(body.action || '')
  const content = sanitizeText(String(body.content || ''))
  const apiKey = process.env.OPENAI_API_KEY || ''
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })
  const client = new OpenAI({ apiKey })
  try {
    if (action === 'title') {
      const prompt = `Write a concise, catchy blog post title based on the content. Return just the title.\n\nContent:\n${content}`
      const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
      const title = res.choices?.[0]?.message?.content?.trim() || ''
      return NextResponse.json({ title })
    }
    if (action === 'summary') {
      const prompt = `Summarize the following post in 1–2 sentences. Return plain text.\n\n${content}`
      const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3 })
      const summary = res.choices?.[0]?.message?.content?.trim() || ''
      return NextResponse.json({ summary })
    }
    if (action === 'tags') {
      const prompt = `Suggest 3-6 short tags (one or two words) for the content. Return as a comma-separated list.\n\n${content}`
      const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.6 })
      const raw = res.choices?.[0]?.message?.content || ''
      const tags = raw.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6)
      return NextResponse.json({ tags })
    }
    if (action === 'motivation') {
      const prompt = `Based on these blog stats, produce a short uplifting message to encourage publishing more.\n\n${JSON.stringify(body.stats ?? {})}`
      const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
      const message = res.choices?.[0]?.message?.content?.trim() || ''
      return NextResponse.json({ message })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: 'AI error', message: e?.message ?? 'unknown' }, { status: 500 })
  }
}
