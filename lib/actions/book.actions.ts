'use server'

import { connectToDatabase } from "@/database/mongoose";
import { generateSlug, serialiseData } from "@/lib/utils";
import { CreateBook, TextSegment } from "@/types";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

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
    await BookSegment.deleteMany({ bookId })
    await Book.findByIdAndDelete(bookId)
    console.log('Deleted book segments and book due to failure saving segments.')

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