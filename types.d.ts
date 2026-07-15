import { Document, Types } from 'mongoose'

import { BookUploadSchema } from "@/lib/zod";

// DATABASE MODELS

export interface IBook extends Document {
  _id: string;
  clerkId: string;
  title: string;
  author: string;
  persona?: string;
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

export interface IVoiceSession extends Document {
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
