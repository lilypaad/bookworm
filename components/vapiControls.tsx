'use client'

import React from 'react'
import Image from "next/image";
import {Mic, MicOff} from "lucide-react";

import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import Transcript from "@/components/Transcript";
import {cn} from "@/lib/utils";

function VapiControls({ book }: { book: IBook }) {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    maxDurationSeconds,
    start,
    stop,
  } = useVapi(book)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            className="rounded-lg shadow-md object-cover md:w-30 w-24 aspect-2/3"
            loading="eager"
          />
          {(status === 'speaking' || status === 'thinking') && (
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-15 h-15 bg-white rounded-full animate-ping pointer-events-none" />
          )}
          <button
            className="vapi-mic-btn"
            type="button"
            onClick={isActive ? stop : start}
            disabled={status === 'connecting'}
            aria-label={isActive ? 'Stop conversation' : 'Start conversation'}
          >
            {isActive ? (
              <Mic className="w-7 h-7 text-foreground" />
            ) : (
              <MicOff className="w-7 h-7 text-foreground" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3 py-1">
          <div className="space-y-1">
            <h1 className="md:text-3xl text-xl font-bold font-serif text-foreground">
              {book.title}
            </h1>
            <p className="font-sans text-muted-foreground text-lg">
              by {book.author}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            <div className="vapi-status-indicator">
              <span className={cn(
                "vapi-status-dot",
                isActive ? "bg-green-500" : "bg-gray-400",
                status === 'thinking' && "bg-amber-500 animate-pulse",
                status === 'speaking' && "bg-blue-500 animate-pulse"
              )} />
              <span className="vapi-status-text">{status}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">Voice: {book.voice}</span>
            </div>

            <div className="vapi-status-indicator">
              <span className="vapi-status-text">
                {formatTime(duration)}/{formatTime(maxDurationSeconds)}
              </span>
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
