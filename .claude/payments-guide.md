# Payments Guide (Stripe)

## Setup
- Create a product + price in Stripe Dashboard
- Set STRIPE_PRICE_ID_PRO to that price ID
- Configure webhook endpoint: /api/stripe/webhook

## Checkout Flow
1. User clicks "Upgrade" → POST /api/stripe/checkout
2. Creates Stripe Checkout Session with userId in metadata
3. User completes payment on Stripe
4. Webhook `checkout.session.completed` → updates user to PRO

## Customer Portal
- POST /api/stripe/portal → creates portal session
- User can manage subscription, cancel, update payment method

## Webhook Events Handled
- `checkout.session.completed` → Set plan=PRO, save Stripe IDs
- `invoice.payment_succeeded` → Update stripeCurrentPeriodEnd
- `customer.subscription.deleted` → Set plan=FREE, clear Stripe data
- `customer.subscription.updated` → Update period and plan status

## Plan Limits
Defined in lib/subscription.ts PLAN_LIMITS constant.
Enforced via checkUsageLimit() and <PaywallGate> component.
