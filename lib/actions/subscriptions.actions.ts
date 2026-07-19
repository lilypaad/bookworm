import 'server-only'

import { auth } from "@clerk/nextjs/server";

import { UserPlan } from "@/types";
import { getPlanLimits, resolvePlan } from "@/lib/subscriptions";

// Server-side utility to resolve the current user's plan and its limits using Clerk's `has()` method.
// Falls back to the free tier when the user is signed out or has no subscription.
export async function getUserPlan(): Promise<UserPlan> {
  const { has } = await auth()

  const plan = has ? resolvePlan(has) : 'free'

  return {
    plan,
    limits: getPlanLimits(plan),
  }
}
