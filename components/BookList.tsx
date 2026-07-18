import React from 'react'
import { auth } from "@clerk/nextjs/server";

import { getBooksByUser } from "@/lib/actions/book.actions";
import BookCard from "@/components/bookCard";

async function BookList() {
  const session = await auth()

  const bookResults = await getBooksByUser(session.userId)
  const books = bookResults.success ? bookResults.data : []

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-10 gap-y-7 md:gap-y-9">
      {books && books.map((book) => (
        <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
      ))}
    </div>
  )
}

export default BookList
