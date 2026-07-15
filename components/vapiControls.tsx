'use client'

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, Mic, MicOff} from "lucide-react";

import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import Transcript from "@/components/Transcript";

function VapiControls({ book }: { book: IBook }) {
  const { status, isActive, messages, currentMessage, currentUserMessage, duration, limitError, start, stop, clearErrors } = useVapi(book)

  return (
    <div className="flex flex-col gap-2">
      {/* Header card */}
      <section className="vapi-header-card mt-24">
        <div className="relative shrink-0">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={120}
            height={180}
            className="rounded-lg shadow-md object-cover w-[120px] aspect-[2/3]"
          />
          {(status === 'speaking' || status === 'thinking') && (
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[60px] h-[60px] bg-white rounded-full animate-ping pointer-events-none" />
          )}
          <button className="vapi-mic-btn" onClick={isActive ? stop : start} disabled={status === 'connecting'}>
            {isActive ? (
              <Mic className="w-7 h-7 text-foreground" />
            ) : (
              <MicOff className="w-7 h-7 text-foreground" />
            )}
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
              <span className="vapi-status-text">{status}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">Voice: {book.voice}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transcript area */}
      <section className="transcript-container">
        <div className="vapi-transcript-wrapper">
          <Transcript
            messages={messages}
            currentMessage={currentMessage}
            currentUserMessage={currentUserMessage}
          />
        </div>
      </section>
    </div>
  )
}

export default VapiControls
