'use client'

import { useAuth } from "@clerk/nextjs";

import { PlanLimits, PlanSlug } from "@/types";
import { getPlanLimits, resolvePlan } from "@/lib/subscriptions";

interface UseSubscriptionResult {
  isLoaded: boolean;
  plan: PlanSlug;
  limits: PlanLimits;
}

// Client-side utility to check the current user's plan using Clerk's `has()` method.
// Falls back to the free tier while auth is loading or when the user has no subscription.
export function useSubscription(): UseSubscriptionResult {
  const { isLoaded, has } = useAuth()

  const plan: PlanSlug = isLoaded && has ? resolvePlan(has) : 'free'

  return {
    isLoaded,
    plan,
    limits: getPlanLimits(plan),
  }
}
