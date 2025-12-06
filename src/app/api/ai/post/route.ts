import { NextResponse } from 'next/server'

type Action = 'summary' | 'title' | 'tags' | 'motivation'

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY || ''
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'Respond ONLY with valid JSON. Avoid prose.' },
        { role: 'user', content: prompt },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }
  const json = await res.json()
  const content = json.choices?.[0]?.message?.content || '{}'
  return JSON.parse(content)
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { action: Action; content?: string; stats?: any }
    const action = body.action
    if (!action) return NextResponse.json({ error: 'Missing action' }, { status: 400 })

    if (action === 'summary') {
      const content = body.content || ''
      const data = await callOpenAI(
        `You are a helpful writing assistant. Summarize the following blog content in 1-2 sentences.
Output JSON: {"summary": "..."}
CONTENT:\n${content}`
      )
      return NextResponse.json({ summary: String(data.summary || '').trim() })
    }
    if (action === 'title') {
      const content = body.content || ''
      const data = await callOpenAI(
        `Suggest a compelling blog post title based on content. Avoid quotes.
Output JSON: {"title": "..."}
CONTENT:\n${content}`
      )
      return NextResponse.json({ title: String(data.title || '').trim() })
    }
    if (action === 'tags') {
      const content = body.content || ''
      const data = await callOpenAI(
        `Suggest 3-6 concise tags for this content.
Output JSON: {"tags": ["tag1","tag2",...]}
CONTENT:\n${content}`
      )
      const tags = Array.isArray(data.tags) ? data.tags.map((t: any) => String(t).trim()).filter(Boolean) : []
      return NextResponse.json({ tags })
    }
    if (action === 'motivation') {
      const stats = body.stats || {}
      const data = await callOpenAI(
        `Act as a kind, concise writing coach. Given these stats, produce a short motivational message (1 sentence).
Output JSON: {"message": "..."}
STATS:\n${JSON.stringify(stats)}`
      )
      return NextResponse.json({ message: String(data.message || '').trim() })
    }
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 })
  }
}

