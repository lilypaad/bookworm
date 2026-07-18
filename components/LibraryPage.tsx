import React from 'react'
import HeroSection from "@/components/heroSection";
import BookList from "@/components/BookList";

function LibraryPage() {
  return (
    <div className="container mx-auto">
      <HeroSection />
      <BookList />
    </div>
  )
}

export default LibraryPage
