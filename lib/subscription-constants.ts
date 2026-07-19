import { PlanLimits, PlanSlug } from "@/types";

// Plan slugs configured in the Clerk dashboard. Users without a subscription are on the free tier.
export const PLAN_SLUGS = {
  FREE: 'free',
  STANDARD: 'standard',
  PRO: 'pro',
} as const

// Sentinel value representing an unlimited allowance
export const UNLIMITED = Number.POSITIVE_INFINITY

// Per-plan limits enforced across the app
export const PLAN_LIMITS: Record<PlanSlug, PlanLimits> = {
  free: { maxBooks: 1, maxSessionsPerMonth: 5, maxSessionDurationMinutes: 5 },
  standard: { maxBooks: 10, maxSessionsPerMonth: 100, maxSessionDurationMinutes: 15 },
  pro: { maxBooks: 100, maxSessionsPerMonth: UNLIMITED, maxSessionDurationMinutes: 60 },
}

// Plans ordered from highest to lowest tier, used when resolving a user's active plan
export const PLAN_PRIORITY: PlanSlug[] = ['pro', 'standard', 'free']

// Whether a limit value represents an unlimited allowance
export function isUnlimited(value: number): boolean {
  return !Number.isFinite(value)
}

// Returns the start of the current calendar-month billing period
export function getCurrentBillingPeriodStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
}
