# TaskFlow — Claude Code Context

This is a Next.js 14+ SaaS MVP boilerplate with authentication, payments, and a task management product.

## Project Conventions

- **Framework:** Next.js App Router (NO src/ directory)
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **ORM:** Prisma 6 with PostgreSQL (Neon)
- **Auth:** Auth.js v5 (NextAuth) — Google OAuth + Email Magic Link
- **Payments:** Stripe subscriptions with trial support
- **Data fetching:** TanStack Query (client), Server Components (server)
- **Validation:** Zod schemas in `lib/validations.ts`
- **Email:** Resend

## Architecture Rules

1. **Route Groups:** `(public)` for unauthenticated pages, `(auth)` for protected pages
2. **API Routes:** Always validate auth with `auth()` from `lib/auth.ts`
3. **Subscription Logic:** All plan checks go through `lib/subscription.ts`
4. **Paywall:** Use `<PaywallGate>` component for feature gating
5. **3-Layer Auth Protection:** middleware → server component check → client component check

## Key Files

- `lib/auth.ts` — NextAuth config, JWT callbacks, user creation with trial
- `lib/subscription.ts` — Plan limits, trial/subscription checks
- `lib/stripe.ts` — Checkout sessions, customer portal
- `lib/validations.ts` — Zod schemas for all inputs
- `prisma/schema.prisma` — Database schema
- `middleware.ts` — Route protection

## Plan System

- **FREE:** Limited features (defined in PLAN_LIMITS)
- **TRIAL:** 14 days, unlimited access, starts on first signup
- **PRO:** Paid via Stripe, unlimited access
