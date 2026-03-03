import type { Plan } from "@prisma/client";

export type UserWithPlan = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: Plan;
  trialEndsAt: Date | null;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
};

export type UsageLimitResult = {
  allowed: boolean;
  current: number;
  limit: number;
};
