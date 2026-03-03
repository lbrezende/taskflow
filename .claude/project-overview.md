# Project Overview

TaskFlow is a SaaS MVP boilerplate that implements a task management app.
The boilerplate is designed to be reusable — replace the [MEU PRODUTO] section
in BOILERPLATE_MANUAL.md with your own product and rebuild.

## Stack
- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS 4
- Prisma 6 + PostgreSQL (Neon), Auth.js v5, Stripe, Resend
- shadcn/ui components, TanStack Query, Zod validation

## Folder Structure
- `app/(public)/` — Landing, pricing, login (no auth required)
- `app/(auth)/` — Dashboard, settings (auth required)
- `app/api/` — API routes (auth, stripe, CRUD)
- `components/` — UI, forms, layout, paywall
- `lib/` — Auth, DB, Stripe, email, validations, subscription helpers
- `prisma/` — Schema and migrations

## Key Patterns
- Server Components for initial data loading
- Client Components with TanStack Query for mutations
- Zod validation on both client and server
- PaywallGate component for feature gating
- Trial banner for trial users
- Middleware-based route protection
