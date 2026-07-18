import React from 'react'
import { auth } from "@clerk/nextjs/server";

import LibraryPage from "@/components/LibraryPage";
import LandingPage from "@/components/LandingPage";

const Page = async () => {
  const session = await auth()

  return (
    <main className="flex flex-col">
      {session.userId && <LibraryPage />}
      {!session.userId && <LandingPage />}
    </main>
  )
}
export default Page
