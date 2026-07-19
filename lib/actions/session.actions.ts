'use server'

import {StartSessionResult, EndSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import ConversationSession from "@/database/models/conversation-session.model";
import {getCurrentBillingPeriodStart, isUnlimited} from "@/lib/subscription-constants";
import {getUserPlan} from "@/lib/actions/subscriptions.actions";

export async function startConversationSession(clerkId: string, bookId: string): Promise<StartSessionResult> {
  try {
    await connectToDatabase()

    // Check the user's plan limits before starting a voice session
    const { plan, limits } = await getUserPlan()

    // Billing periods are tracked by calendar month
    const billingPeriodStart = getCurrentBillingPeriodStart()

    if(!isUnlimited(limits.maxSessionsPerMonth)) {
      const sessionCount = await ConversationSession.countDocuments({ clerkId, billingPeriodStart })

      if(sessionCount >= limits.maxSessionsPerMonth) {
        return {
          success: false,
          error: `You've reached the ${plan} plan limit of ${limits.maxSessionsPerMonth} voice `
            + `sessions this month. Upgrade your plan to start more conversations.`,
        }
      }
    }

    const session = await ConversationSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart,
      durationSeconds: 0,
    })

    return {
      success: true,
      sessionId: session._id.toString(),
      maxDurationMinutes: limits.maxSessionDurationMinutes,
    }
  }
  catch(e) {
    console.error('Error starting conversation', e)
    return { success: false, error: 'Failed to start conversation. Please try again later.' }
  }
}

export async function endConversationSession(sessionId: string, durationSeconds: number): Promise<EndSessionResult> {
  try {
    await connectToDatabase()

    const result = await ConversationSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds: durationSeconds,
    })

    if(!result) return { success: false, error: 'Failed to end conversation: voice session not found.' }

    return { success: true }
  }
  catch(e) {
    console.error('Error ending conversation', e)
    return { success: false, error: 'Failed to end conversation. Please try again later.' }
  }
}
