import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
      plan: string;
      trialEndsAt: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      stripeCurrentPeriodEnd: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: string;
    trialEndsAt: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeCurrentPeriodEnd: string | null;
  }
}
