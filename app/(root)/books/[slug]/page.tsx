import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react'

import { getBookBySlug } from '@/lib/actions/book.actions'
import VapiControls from "@/components/vapiControls";

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

      {/* Back button */}
      <Link href="/" className="back-btn-floating" aria-label="Go back to library">
        <ArrowLeft className="w-6 h-6 text-[#212a3b]" />
      </Link>

      <VapiControls book={book} />
    </main>
  )
}

export default BookDetailsPage
