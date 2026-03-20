@AGENTS.md

# ItsManaged

Self-hosted customer support platform. Next.js 15 + TypeScript + Tailwind CSS + Prisma + PostgreSQL.

## Tech Stack
- **Frontend**: Next.js 15 App Router, Tailwind CSS v4, TanStack Query
- **Backend**: Next.js Server Actions (mutations), API Routes only for auth/webhooks/uploads
- **Database**: PostgreSQL 16 + pgvector, Prisma ORM 7.x with `@prisma/adapter-pg`
- **Auth**: NextAuth.js v5 (beta) with credentials provider, JWT strategy
- **Deployment**: Docker Compose on Hostinger KVM2 VPS, GitHub Actions CI/CD

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — Type check
- `npm run db:generate` — Regenerate Prisma client after schema changes
- `npm run db:migrate` — Create and apply migrations (dev)
- `npm run db:seed` — Seed default workspace + admin agent
- `docker compose up --build` — Run full stack locally

## Architecture
- Route groups: `(auth)` for login, `(portal)` for public pages, `(dashboard)` for agent UI
- All dashboard routes are auth-gated via `requireAuth()` in the layout
- All core tables have `workspace_id` for future multi-tenancy
- Prisma 7.x uses driver adapters — see `src/lib/db.ts` for the PrismaPg adapter pattern
- Server Actions live in `src/actions/`, lib utilities in `src/lib/`
