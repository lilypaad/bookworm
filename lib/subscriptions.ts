import { HasPlanFn, PlanLimits, PlanSlug } from "@/types";
import { PLAN_LIMITS, PLAN_PRIORITY } from "@/lib/subscription-constants";

// Resolves the user's active plan from Clerk's `has()` helper.
// Works with both the server (`auth()`) and client (`useAuth()`) `has` functions.
// Users without a paid subscription fall back to the free tier.
export function resolvePlan(has: HasPlanFn): PlanSlug {
  for (const plan of PLAN_PRIORITY) {
    if (plan === 'free') continue
    if (has({ plan })) return plan
  }
  return 'free'
}

// Returns the limits for a given plan
export function getPlanLimits(plan: PlanSlug): PlanLimits {
  return PLAN_LIMITS[plan]
}
