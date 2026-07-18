'use server'

import mongoose from "mongoose";

import { connectToDatabase } from "@/database/mongoose";
import { escapeRegex, generateSlug, serialiseData } from "@/lib/utils";
import { CreateBook, TextSegment } from "@/types";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { DEFAULT_VOICE, voiceOptions } from "@/lib/constants";

export async function checkBookExists(title: string) {
  try {
    await connectToDatabase()

    const slug = generateSlug(title)

    const existingBook = await Book.findOne({slug}).lean()

    if(existingBook) {
      return {
        exists: true,
        data: serialiseData(existingBook)
      }
    }
    else {
      return {
        exists: false
      }
    }
  }
  catch(e) {
    console.error('Error checking book exists', e)
    return {
      exists: false,
      error: e
    }
  }
}

export async function createBook(data: CreateBook) {
  try {
    await connectToDatabase()

    const slug = generateSlug(data.title)

    const existingBook = await Book.findOne({slug}).lean()
    if(existingBook) {
      return {
        success: true,
        data: serialiseData(existingBook),
        alreadyExists: true,
      }
    }

    // TODO: check subscription limits before creating a book

    const book = await Book.create({ ...data, slug, totalSegments: 0 })

    return {
      success: true,
      data: serialiseData(book),
    }
  }
  catch(e) {
    console.error('Error creating a book', e)

    return {
      success: false,
      error: e,
    }
  }
}

export async function saveBookSegments(bookId: string, clerkId: string, segments: TextSegment[]) {
  try {
    await connectToDatabase()

    console.log('Saving book segments...')

    const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
      clerkId,
      bookId,
      content: text,
      segmentIndex,
      pageNumber,
      wordCount
    }))

    await BookSegment.insertMany(segmentsToInsert)

    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length })

    console.log('Book segments saved successfully.')

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    }
  }
  catch(e) {
    console.error('Error saving book segments', e)

    try {
      await BookSegment.deleteMany({ bookId })
      await Book.findByIdAndDelete(bookId)
      console.log('Deleted book segments and book due to failure saving segments.')
    }
    catch(e) {
      console.error('Error rolling back book/segments after failed save.', e)
    }

    return {
      success: false,
      error: e
    }
  }
}

export async function getAllBooks() {
  try {
    await connectToDatabase()

    const books = await Book.find().sort({ createdAt: -1 }).lean()

    return {
      success: true,
      data: serialiseData(books),
    }
  }
    catch(e) {
    console.error('Error connecting to database', e)
    return {
      success: false,
      error: e
    }
  }
}

export async function getBookBySlug(slug: string) {
  try {
    await connectToDatabase()

    const book = await Book.findOne({ slug }).lean()

    if (!book) {
      return { success: false }
    }

    const voiceInfo = voiceOptions[book.voice as keyof typeof voiceOptions] || voiceOptions[DEFAULT_VOICE];

    return {
      success: true,
      data: {
        ...serialiseData(book),
        persona: voiceInfo.name
      }
    }
  } catch (e) {
    console.error('Error fetching book by slug', e)
    return { success: false, error: e }
  }
}

export async function searchBookSegments(bookId: string, query: string, limit: number = 3) {
  try {
    await connectToDatabase()

    const bookObjectId = new mongoose.Types.ObjectId(bookId)

    console.log(`Searching for "${query}" in book ${bookId}`)

    let segments: Record<string, unknown>[] = []

    try {
      segments = await BookSegment.find({ bookId: bookObjectId, $text: { $search: query } })
        .select('_id bookId content segmentIndex pageNumber wordCount')
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean()
    }
    catch {
      // Text index might not exist, default to blank array
      segments = []
    }

    // Fallback: regex search matching any keyword
    if(segments.length <= 0) {
      const keywords = query.split('/\s+/').filter((k) => k.length > 2)
      const pattern = keywords.map(escapeRegex).join('|')

      if(keywords.length === 0) {
        return {
          success: true,
          data: []
        }
      }

      segments = await BookSegment.find({ bookId: bookObjectId, content: { $regex: pattern, $options: 'i' } })
        .select('_id bookId content segmentIndex pageNumber wordCount')
        .sort({ segmentIndex: 1 })
        .limit(limit)
        .lean()
    }

    console.log(`Found ${segments.length} results in book ${bookId}`)

    return {
      success: true,
      data: serialiseData(segments)
    }
  }
  catch (e) {
    console.error('Error searching book segments', e)
    return { success: false, error: e }
  }
}