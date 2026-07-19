import { z } from 'zod'
import { Document, Types } from 'mongoose'

import { BookUploadSchema } from "@/lib/zod";

// DATABASE MODELS

export interface IBook extends Document {
  _id: string;
  clerkId: string;
  title: string;
  author: string;
  voice?: string;
  slug: string;
  fileURL: string;
  fileBlobKey: string;
  coverURL: string;
  coverBlobKey?: string;
  fileSize: number;
  totalSegments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookSegment extends Document {
  _id: string;
  clerkId: string;
  bookId: Types.ObjectId;
  content: string;
  segmentIndex: number;
  pageNumber?: number;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationSession extends Document {
  _id: string;
  clerkId: string;
  bookId: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  billingPeriodStart: Date;
  createdAt: Date;
  updatedAt: Date;
}

// FORM & INPUT TYPES

export type BookUploadFormValues = z.infer<typeof BookUploadSchema>;

export interface CreateBook {
  clerkId: string;
  title: string;
  author: string;
  voice?: string;
  fileURL: string;
  fileBlobKey: string;
  coverURL?: string;
  coverBlobKey?: string;
  fileSize: number;
}

export interface TextSegment {
  text: string;
  segmentIndex: number;
  pageNumber?: number;
  wordCount: number;
}

export interface BookCardProps {
  title: string;
  author: string;
  coverURL: string;
  slug: string;
}

export interface Messages {
  role: string;
  content: string;
}

export interface StartSessionResult {
  success: boolean;
  sessionId?: string;
  maxDurationMinutes?: number;
  error?: string;
}

export interface EndSessionResult {
  success: boolean;
  error?: string;
}

// SUBSCRIPTION & BILLING TYPES

// The plan slugs configured in the Clerk dashboard. Users without a subscription are on the free tier.
export type PlanSlug = 'free' | 'standard' | 'pro';

export interface PlanLimits {
  maxBooks: number;
  maxSessionsPerMonth: number; // Number.POSITIVE_INFINITY represents unlimited
  maxSessionDurationMinutes: number;
}

export interface UserPlan {
  plan: PlanSlug;
  limits: PlanLimits;
}

// Clerk's `has()` helper, narrowed to the plan check used across the app
export type HasPlanFn = (params: { plan: string }) => boolean;