import React from 'react'
import UploadForm from "@/components/UploadForm";

function Page() {
  return (
    <main className="wrapper container">
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-[-0.02em]">
            Add a New Book
          </h1>
          <p className="text-md text-black font-serif">
            Upload a PDF to generate your interactive interview
          </p>
        </section>

        <UploadForm />
      </div>
    </main>
  )
}

export default Page
