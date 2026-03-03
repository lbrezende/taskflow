# Authentication Guide

## Providers
- **Google OAuth:** Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **Email Magic Link:** Requires RESEND_API_KEY, sends passwordless login links

## Flow
1. User visits /login
2. Chooses Google or enters email
3. Auth.js handles the flow
4. On first signup: user gets plan=TRIAL, trialEndsAt=now+14days
5. JWT session with user plan info

## Protection Layers
1. **middleware.ts:** Redirects unauthenticated users from protected routes
2. **Server:** `auth()` call in API routes and server components
3. **Client:** `useSession()` hook + PaywallGate component

## Session Data (available in JWT)
- user.id, user.email, user.name, user.image
- user.plan (FREE | TRIAL | PRO)
- user.trialEndsAt
- user.stripeCustomerId, stripeSubscriptionId, stripeCurrentPeriodEnd
