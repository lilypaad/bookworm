'use server'

import {StartSessionResult, EndSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import ConversationSession from "@/database/models/conversation-session.model";
import {getCurrentBillingPeriodStart} from "@/lib/subscription-constants";

export async function startConversationSession(clerkId: string, bookId: string): Promise<StartSessionResult> {
  try {
    await connectToDatabase()

    // TODO: check limits/plan to see if a session is allowed

    const session = await ConversationSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart: getCurrentBillingPeriodStart(),
      durationSeconds: 0,
    })

    return {
      success: true,
      sessionId: session._id.toString(),
      // maxDurationMinutes: check.maxDurationMinutes
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
