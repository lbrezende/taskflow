import type { UserWithPlan, UsageLimitResult } from "@/types";

// ─── Plan Limits ─────────────────────────────────────────
// Customize per product: set limits for the FREE plan.
// TRIAL and PRO are unlimited.

export const PLAN_LIMITS = {
  FREE: {
    todoLists: 3,
  },
  TRIAL: {
    todoLists: Infinity,
  },
  PRO: {
    todoLists: Infinity,
  },
} as const;

export type ResourceKey = keyof typeof PLAN_LIMITS.FREE;

// ─── Trial & Subscription Checks ────────────────────────

export function isTrialActive(user: UserWithPlan): boolean {
  if (user.plan !== "TRIAL") return false;
  if (!user.trialEndsAt) return false;
  return new Date(user.trialEndsAt) > new Date();
}

export function isSubscribed(user: UserWithPlan): boolean {
  if (user.plan !== "PRO") return false;
  if (!user.stripeCurrentPeriodEnd) return false;
  return new Date(user.stripeCurrentPeriodEnd) > new Date();
}

export function hasAccess(user: UserWithPlan): boolean {
  return isTrialActive(user) || isSubscribed(user);
}

export function daysLeftInTrial(user: UserWithPlan): number {
  if (!user.trialEndsAt) return 0;
  const diff = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Usage Limits ────────────────────────────────────────

export function checkUsageLimit(
  user: UserWithPlan,
  resource: ResourceKey,
  currentUsage: number
): UsageLimitResult {
  const plan = user.plan;
  const limit = PLAN_LIMITS[plan][resource];

  return {
    allowed: currentUsage < limit,
    current: currentUsage,
    limit: limit === Infinity ? -1 : limit,
  };
}

export function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case "PRO":
      return "Pro";
    case "TRIAL":
      return "Trial";
    default:
      return "Gratuito";
  }
}
