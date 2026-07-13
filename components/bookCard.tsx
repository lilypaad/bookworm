import React from 'react'
import Link from "next/link";

import {BookCardProps} from "@/types";
import Image from "next/image";

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className="">
        <figure className="flex justify-center bg-white">
          <div>
            <Image src={coverURL} alt={title} width={133} height={200} className="h-52 w-auto" />
          </div>
        </figure>
        <figcaption className="h-24 pt-2">
          <h3 className="font-serif font-bold text-xl">{title}</h3>
          <p className="font-serif text-md">{author}</p>
        </figcaption>
      </article>
    </Link>
  )
}
export default BookCard
