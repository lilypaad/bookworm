import React from 'react'
import Link from "next/link";

import {BookCardProps} from "@/types";
import Image from "next/image";

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className="bg-white rounded-xl">
        <figure className="flex flex-col gap-2 p-4">
          <div className="w-full">
            <Image src={coverURL} alt={title} width={133} height={200} className="h-48 w-auto mx-auto" />
          </div>
          <figcaption className="h-24">
            <h3 className="font-serif font-bold text-xl text-center">{title}</h3>
            <p className="font-serif text-sm text-center">{author}</p>
          </figcaption>
        </figure>
      </article>
    </Link>
  )
}
export default BookCard
