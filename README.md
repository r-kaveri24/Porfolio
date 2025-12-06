## Admin Authentication

- Goal: secure the `/admin` area with basic email/password credentials. No social login.
- Strategy: custom credentials auth implemented with Prisma Users, `scrypt` password hashing, and an HTTP-only session cookie containing a signed token.

### What Was Added

- `src/app/api/auth/login/route.ts`: login API that accepts `email` and `password`, verifies them against the database, and sets a signed `session` cookie on success.
- `src/middleware.ts`: protects the `/admin` area. Requests to `/admin/*` without a valid session are redirected to `/admin/login`.
- `src/app/admin/login/page.tsx`: simple login form posting to the login API.
- `src/lib/auth.ts`: small auth utility module for hashing passwords and creating/verifying signed tokens.
- `src/lib/prisma.ts`: shared Prisma client singleton.
- `prisma/seed.ts`: seeds one `ADMIN` user using environment variables.

### Database

- ORM: Prisma (`@prisma/client`).
- Provider: PostgreSQL (see `prisma/schema.prisma`).
- Models: includes `User` with `email`, `passwordHash`, and `role` (`ADMIN` | `AUTHOR`).

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `SESSION_SECRET`: secret for token signing/verification used by session cookies.
- `ADMIN_EMAIL`: email for the seeded admin user.
- `ADMIN_PASSWORD`: plaintext password for the seeded admin user (hashed before storage).

Keep these in a local `.env` and do not commit them. `.gitignore` already ignores `.env` and common env file variants.

### Seeding the Admin User

1. Ensure `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in `.env`.
2. Apply migrations if needed: `npx prisma migrate dev`.
3. Seed: `npx prisma db seed`.

This creates a single `ADMIN` user. If the user already exists, the seed script skips creation.

### Login Flow

- The login page submits `email`/`password` to `POST /api/auth/login`.
- The API checks `User` in the DB and verifies `passwordHash` using `scrypt`.
- On success and `role === 'ADMIN'`, an HTTP-only `session` cookie is set containing a signed token with `sub`, `email`, `role`, and expiry.
- Middleware intercepts `/admin/*` requests and validates the `session` cookie; invalid/missing cookies are redirected to `/admin/login`.

### Development

- Start dev server: `npm run dev`.
- Lint: `npm run lint`.
- Build: `npm run build`.

### Notes

- Passwords are hashed with `scrypt` and salted. Stored as `salt:hash` in `User.passwordHash`.
- Tokens are signed using HMAC-SHA256 with `SESSION_SECRET` and encoded in a compact JWT-like format.
- The middleware is configured to match `'/admin/:path*'` and allows `'/admin/login'` without a session.
