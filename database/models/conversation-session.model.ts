import { model, models, Schema } from 'mongoose'

import { IConversationSession } from "@/types";

const ConversationSessionSchema = new Schema<IConversationSession>({
  clerkId: { type: String, required: true, index: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  startedAt: { type: Date, required: true, default: Date.now },
  endedAt: { type: Date },
  durationSeconds: { type: Number, default: 0, required: true },
  billingPeriodStart: { type: Date, required: true, index: true },
}, { timestamps: true })

ConversationSessionSchema.index({ bookId: 1, billingPeriodStart: 1 }, { unique: true })

const ConversationSession = models.ConversationSession || model<IConversationSession>('ConversationSession', ConversationSessionSchema)

export default ConversationSession
