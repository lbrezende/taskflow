import Stripe from "stripe";

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    apiVersion: "2026-02-25.clover",
  });
}

// Lazy singleton — only created when first accessed at runtime
let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) {
      _stripe = getStripeClient();
    }
    return (_stripe as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export async function createCheckoutSession({
  userId,
  email,
  stripeCustomerId,
}: {
  userId: string;
  email: string;
  stripeCustomerId?: string | null;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO!,
        quantity: 1,
      },
    ],
    ...(stripeCustomerId
      ? { customer: stripeCustomerId }
      : { customer_email: email }),
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      metadata: { userId },
    },
  });

  return session;
}

export async function createCustomerPortalSession(stripeCustomerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return session;
}
