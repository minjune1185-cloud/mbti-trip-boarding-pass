'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { InputPayload } from '@/lib/options'
import type { Recommendation } from '@/lib/schema'

export type TripResult = { input: InputPayload; recommendation: Recommendation }

type TripContextValue = {
  result: TripResult | null
  setResult: (result: TripResult | null) => void
  showToast: (message: string) => void
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<TripResult | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ id: Date.now(), message })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  return (
    <TripContext.Provider value={{ result, setResult, showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-5"
      >
        {toast && (
          <p
            key={toast.id}
            className="max-w-[390px] rounded-[14px] bg-[#222222] px-4 py-3 text-center text-[14px] font-medium leading-[1.43] text-[#ffffff] shadow-airbnb animate-in fade-in slide-in-from-bottom-4"
          >
            {toast.message}
          </p>
        )}
      </div>
    </TripContext.Provider>
  )
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used within TripProvider')
  return ctx
}
