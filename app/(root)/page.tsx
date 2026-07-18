import React from 'react'

import HeroSection from '@/components/heroSection'
import BookList from "@/components/BookList"

const Page = async () => {
  return (
    <main className="container mx-auto flex flex-col">
      <HeroSection />

      <BookList />
    </main>
  )
}
export default Page
