## Assignment Overview

This repository implements a full‑stack CRUD application with Next.js 16, TypeScript, Prisma (PostgreSQL), and Tailwind CSS. It includes a secure admin dashboard (email/password), a clean public UI, basic testing and CI, and optional AI features to help with post authoring.

## Features

- Admin authentication with secure session cookies
- CRUD for posts (create, read, update, delete) with validation and tags
- Image upload with type/size checks and local storage
- Public posts feed/API
- Optional AI helpers for title, summary, and tags
- CI workflow for lint, typecheck, and tests
- Tailwind‑based responsive UI with a footer showing name, GitHub, and LinkedIn

## Tech Stack

- Next.js 16 (App Router, SSR, TypeScript)
- Prisma ORM with PostgreSQL
- Tailwind CSS
- Jest for unit tests
- GitHub Actions for CI
- OpenAI API (optional)

## Getting Started

- Install dependencies: `npm ci`
- Create `.env` with the variables below
- Apply database schema: `npx prisma migrate dev`
- Seed local users (optional): call `GET /api/auth/seed` in non‑production or set your own users
- Run dev: `npm run dev`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — HMAC secret for session signing
- `NEXT_PUBLIC_AUTHOR_NAME` — footer display name
- `NEXT_PUBLIC_GITHUB_URL` — GitHub profile URL
- `NEXT_PUBLIC_LINKEDIN_URL` — LinkedIn profile URL
- `OPENAI_API_KEY` — optional, enables AI helpers in admin

Optional seed variables (local only):

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `AUTHOR_EMAIL`, `AUTHOR_PASSWORD`

## Security

- Passwords hashed with `scrypt` and unique salts
- Session in an HTTP‑only cookie, signed with `SESSION_SECRET`
- Server‑side auth checks on admin pages; unauthorized users are redirected to `/admin/login`
- Admin APIs verify `ADMIN` role and return `401` when unauthorized
- Uploads restricted to images and capped at 8 MB

## CRUD Endpoints (Admin)

- Create: `POST /api/admin/posts`
- Update: `PUT /api/admin/posts/:id`
- Delete: `DELETE /api/admin/posts/:id`
- Dashboard: `GET /api/admin/stats`

Public:

- `GET /api/public/posts` — list published posts

## AI Helpers (Optional)

- `POST /api/ai/post` with `action` in `{title, summary, tags}`
- Only available to admin users

## Testing and CI

- Run tests: `npm test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- GitHub Actions: runs on push/PR to `main` (`.github/workflows/ci.yml`)

## Deployment

- Hosting: Vercel (recommended)
- Configure env vars in the Vercel dashboard
- Connect GitHub repo and push to `main`
- Provision PostgreSQL (Vercel Postgres or external) and set `DATABASE_URL`

## Notes

- Icons are rendered in a way that works well with Turbopack and can be colorized via Tailwind gradients
- The login route sets the `session` cookie securely; logout clears it
- The admin footer hides on `/admin/login`; public footer shows your name and profile links

## Troubleshooting

- If you see a middleware deprecation message in older builds, this project uses server‑side auth checks instead
- Lint warnings about `<img>` are safe for previews; use `next/image` for large images to optimize LCP
