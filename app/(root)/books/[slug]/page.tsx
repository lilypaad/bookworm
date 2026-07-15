import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft, Mic, MicOff } from 'lucide-react'

import { getBookBySlug } from '@/lib/actions/book.actions'

interface Props {
  params: Promise<{ slug: string }>
}

const BookDetailsPage = async ({ params }: Props) => {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const { slug } = await params
  const result = await getBookBySlug(slug)

  if (!result.success || !result.data) {
    redirect('/')
  }

  const book = result.data

  return (
    <main className="container mx-auto">
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-6 h-6 text-[#212a3b]" />
      </Link>

      <div className="flex flex-col gap-2">
      <section className="vapi-header-card mt-24">
        <div className="relative shrink-0">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={120}
            height={180}
            className="rounded-lg shadow-md object-cover w-[120px] aspect-[2/3]"
          />
          <button className="vapi-mic-btn">
            <MicOff className="w-7 h-7 text-[#212a3b]" />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-1">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif text-foreground">
              {book.title}
            </h1>
            <p className="font-sans text-muted-foreground text-lg">
              by {book.author}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="vapi-status-indicator">
              <span className="vapi-status-dot" />
              <span className="vapi-status-text">Ready</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">Voice: {book.persona}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="transcript-container">
        <div className="transcript-empty">
          <Mic className="w-12 h-12 text-[#212a3b]/20" />
          <h2 className="transcript-empty-text">No conversation yet</h2>
          <p className="transcript-empty-hint">
            Click the mic button above to start talking
          </p>
        </div>
      </section>
      </div>
    </main>
  )
}

export default BookDetailsPage
