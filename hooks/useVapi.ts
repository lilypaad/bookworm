import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";

import {IBook, Messages} from "@/types";
import {DEFAULT_VOICE} from "@/lib/constants";

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking'

function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

function useVapi(book: IBook) {
  const { userId } = useAuth()
  // TODO: implement limits

  const [status, setStatus] = useState<CallStatus>('idle')
  const [messages, setMessages] = useState<Messages[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [duration, setDuration] = useState(0)
  const [limitError, setLimitError] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const isStoppingRef = useRef<boolean>(false)

  const bookRef = useLatestRef(book)
  const durationRef = useLatestRef(duration)
  const voice = book.voice || DEFAULT_VOICE

  const isActive = status === 'listening' || status === 'thinking' || status === 'speaking' || status === 'starting'

  // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60)
  // const maxDurationSeconds
  // const remainingSeconds
  // const showTimeWarning

  const start = async () => {}
  const stop = async () => {}
  const clearErrors = async () => {}

  return {
    status, isActive, messages, currentMessage, currentUserMessage, duration, limitError, start, stop, clearErrors,
    // maxDurationSeconds, remainingSeconds, showTimeWarning,
  }
}

export default useVapi