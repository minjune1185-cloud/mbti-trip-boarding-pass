'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket } from 'lucide-react'
import { ChoiceGroup } from '@/components/choice-group'
import { LoadingOverlay } from '@/components/loading-overlay'
import { useTrip } from '@/components/trip-provider'
import {
  BUDGETS,
  COMPANIONS,
  COMPANION_MBTI_TYPES,
  DURATIONS,
  MBTI_TYPES,
  SOLO,
  TRAVEL_STYLES,
  type Budget,
  type Companion,
  type CompanionMbti,
  type Duration,
  type InputPayload,
  type Mbti,
  type TravelStyle,
} from '@/lib/options'
import type { ApiErrorCode, Recommendation } from '@/lib/schema'

const TEMP_ERROR_MESSAGE = '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'

export function TripForm() {
  const router = useRouter()
  const { setResult, showToast } = useTrip()
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null)
  const [myMbti, setMyMbti] = useState<Mbti | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [duration, setDuration] = useState<Duration | null>(null)
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [companionMbti, setCompanionMbti] = useState<CompanionMbti | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)

  const needsCompanionMbti = companion !== null && companion !== SOLO
  const isComplete =
    travelStyle && myMbti && budget && duration && companion && (!needsCompanionMbti || companionMbti)

  const handleCompanion = (value: Companion) => {
    setCompanion(value)
    if (value === SOLO) setCompanionMbti(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isComplete || inFlight.current) return

    const payload: InputPayload = {
      travel_style: travelStyle,
      my_mbti: myMbti,
      budget,
      duration,
      companion,
      companion_mbti: needsCompanionMbti ? companionMbti : null,
    }

    inFlight.current = true
    setSubmitting(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(28_000),
      })
      const data = await res.json().catch(() => null)

      if (res.ok && data?.country) {
        setResult({ input: payload, recommendation: data as Recommendation })
        router.push('/result')
        return
      }

      const code = data?.error as ApiErrorCode | undefined
      if (code === 'RATE_LIMITED') return router.push('/limited')
      if (code === 'QUOTA_EXHAUSTED') return router.push('/closed')
      throw new Error(code ?? `HTTP ${res.status}`)
    } catch {
      inFlight.current = false
      setSubmitting(false)
      showToast(TEMP_ERROR_MESSAGE)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-5 pb-6" noValidate>
        <ChoiceGroup
          name="travel_style"
          step="01"
          legend="여행 스타일"
          options={TRAVEL_STYLES}
          value={travelStyle}
          onChange={setTravelStyle}
          columns={2}
        />
        <ChoiceGroup
          name="my_mbti"
          step="02"
          legend="본인 MBTI"
          options={MBTI_TYPES}
          value={myMbti}
          onChange={setMyMbti}
          columns={4}
          mono
        />
        <ChoiceGroup
          name="budget"
          step="03"
          legend="예산 (1인)"
          options={BUDGETS}
          value={budget}
          onChange={setBudget}
          columns={3}
        />
        <ChoiceGroup
          name="duration"
          step="04"
          legend="기간"
          options={DURATIONS}
          value={duration}
          onChange={setDuration}
          columns={2}
        />
        <ChoiceGroup
          name="companion"
          step="05"
          legend="동행자"
          options={COMPANIONS}
          value={companion}
          onChange={handleCompanion}
          columns={3}
        />
        {needsCompanionMbti && (
          <ChoiceGroup
            name="companion_mbti"
            step="06"
            legend="동행자 MBTI"
            options={COMPANION_MBTI_TYPES}
            value={companionMbti}
            onChange={setCompanionMbti}
            columns={4}
            mono
          />
        )}

        <div className="sticky bottom-0 -mx-5 flex flex-col gap-2 border-t border-border bg-background/95 px-5 pt-3 pb-4 backdrop-blur">
          {!isComplete && (
            <p className="text-center text-xs font-medium text-muted-foreground" id="submit-hint">
              모든 조건을 선택하면 발권할 수 있어요
            </p>
          )}
          <button
            type="submit"
            disabled={!isComplete || submitting}
            aria-describedby={!isComplete ? 'submit-hint' : undefined}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            <Ticket className="size-5" aria-hidden="true" />
            내 여행지 보딩패스 발권하기
          </button>
        </div>
      </form>
      {submitting && <LoadingOverlay />}
    </>
  )
}
