import React from 'react'

import {getAllBooks} from "@/lib/actions/book.actions";
import HeroSection from '@/components/heroSection'
import BookCard from "@/components/bookCard";

const Page = async () => {
  const bookResults = await getAllBooks()
  const books = bookResults.success ? bookResults.data : []

  return (
    <main className="container mx-auto flex flex-col">
      <HeroSection />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-10 gap-y-7 md:gap-y-9">
        {books.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  )
}
export default Page
