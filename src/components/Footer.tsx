"use client"
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin/login')) return null
  const name = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Your Name'
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || '#'
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'
  return (
    <footer className="border-t border-white/10 px-6 py-6 text-sm text-white/70">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>{name}</div>
        <div className="flex items-center gap-4">
          <a href={github} target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
