'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Search, Ticket } from 'lucide-react'
import { ChoiceGroup } from '@/components/choice-group'
import { LoadingOverlay } from '@/components/loading-overlay'
import { useTrip } from '@/components/trip-provider'
import {
  BUDGETS,
  COMPANIONS,
  COMPANION_MBTI_TYPES,
  DURATIONS,
  MBTI_TYPES,
  SAFETY_LEVELS,
  SOLO,
  TRAVEL_STYLES,
  type Budget,
  type Companion,
  type CompanionMbti,
  type Duration,
  type InputPayload,
  type Mbti,
  type SafetyLevel,
  type TravelStyle,
} from '@/lib/options'
import type { ApiErrorCode, Recommendation } from '@/lib/schema'

const TEMP_ERROR_MESSAGE = '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'

const STYLE_ICONS: Record<TravelStyle, string> = {
  '휴양·호캉스': '🏖️',
  '맛집·먹방': '🍜',
  '관광·랜드마크': '🏛️',
  '쇼핑·도시': '🛍️',
  '액티비티·자연': '⛰️',
}

const STYLE_DESC: Record<TravelStyle, string> = {
  '휴양·호캉스': '수영장 · 리조트 힐링',
  '맛집·먹방': '야시장 · 로컬 미식 투어',
  '관광·랜드마크': '인생샷 · 필수 명소 정복',
  '쇼핑·도시': '트렌디 스팟 · 시티 라이프',
  '액티비티·자연': '대자연 · 다이내믹 체험',
}

const SAFETY_ICONS: Record<SafetyLevel, string> = {
  '치안 최우선': '🛡️',
  '보통(무난)': '⚖️',
  '모험 가능': '🔥',
}

const COMPANION_ICONS: Record<Companion, string> = {
  혼자: '🧳',
  '친구(텐션 높음)': '🪩',
  '친구(힐링)': '🍵',
  연인: '💑',
  가족: '👨‍👩‍👧‍👦',
}

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function TripForm() {
  const router = useRouter()
  const { setResult, showToast } = useTrip()
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null)
  const [myMbti, setMyMbti] = useState<Mbti | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [duration, setDuration] = useState<Duration | null>(null)
  const [safetyLevel, setSafetyLevel] = useState<SafetyLevel | null>(null)
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [companionMbti, setCompanionMbti] = useState<CompanionMbti | null>(null)
  const [activeStep, setActiveStep] = useState<StepIndex | 'all'>(1)
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)

  const needsCompanionMbti = companion !== null && companion !== SOLO
  const totalRequired = needsCompanionMbti ? 7 : 6
  const completedCount = [
    travelStyle,
    myMbti,
    budget,
    duration,
    safetyLevel,
    companion,
    ...(needsCompanionMbti ? [companionMbti] : []),
  ].filter(Boolean).length

  const isComplete = Boolean(
    travelStyle &&
      myMbti &&
      budget &&
      duration &&
      safetyLevel &&
      companion &&
      (!needsCompanionMbti || companionMbti),
  )

  const handleSelectStyle = (val: TravelStyle) => {
    setTravelStyle(val)
    if (!myMbti) setActiveStep(2)
  }

  const handleSelectMyMbti = (val: Mbti) => {
    setMyMbti(val)
    if (!budget) setActiveStep(3)
  }

  const handleSelectBudget = (val: Budget) => {
    setBudget(val)
    if (!duration) setActiveStep(4)
  }

  const handleSelectDuration = (val: Duration) => {
    setDuration(val)
    if (!safetyLevel) setActiveStep(5)
  }

  const handleSelectSafety = (val: SafetyLevel) => {
    setSafetyLevel(val)
    if (!companion) setActiveStep(6)
  }

  const handleCompanion = (value: Companion) => {
    setCompanion(value)
    if (value === SOLO) {
      setCompanionMbti(null)
    } else {
      setActiveStep(7)
    }
  }

  const handleSelectCompanionMbti = (val: CompanionMbti) => {
    setCompanionMbti(val)
  }

  const handleResetAll = () => {
    setTravelStyle(null)
    setMyMbti(null)
    setBudget(null)
    setDuration(null)
    setSafetyLevel(null)
    setCompanion(null)
    setCompanionMbti(null)
    setActiveStep(1)
  }

  const isStepOpen = (step: StepIndex) => activeStep === 'all' || activeStep === step

  const toggleStep = (step: StepIndex) => {
    setActiveStep((prev) => (prev === step ? 'all' : step))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (
      !isComplete ||
      !travelStyle ||
      !myMbti ||
      !budget ||
      !duration ||
      !safetyLevel ||
      !companion ||
      inFlight.current
    ) {
      return
    }

    const payload: InputPayload = {
      travel_style: travelStyle,
      my_mbti: myMbti,
      budget,
      duration,
      safety_level: safetyLevel,
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 px-5 pt-3 pb-6" noValidate>
        {/* Airbnb Signature Global Search Bar Pill (64px height, 3 clickable segments + 48x48px Rausch Search Orb) */}
        <div
          aria-label="선택된 여행 조건 요약"
          className="flex h-16 items-center justify-between rounded-full border border-[#dddddd] bg-[#ffffff] py-2 pr-2 pl-5 shadow-airbnb"
        >
          <div className="grid flex-1 grid-cols-3 divide-x divide-[#dddddd] pr-2">
            <button
              type="button"
              onClick={() => setActiveStep(travelStyle ? 5 : 1)}
              className="flex min-w-0 flex-col pr-2.5 text-left focus-visible:outline-none"
            >
              <span className="ty-micro-label text-[11px] text-[#222222]">어디로 · 치안</span>
              <span className="ty-caption-sm truncate text-[12px] text-[#6a6a6a]">
                {travelStyle || safetyLevel
                  ? [travelStyle, safetyLevel].filter(Boolean).join(' · ')
                  : '스타일 · 치안'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(budget ? 4 : 3)}
              className="flex min-w-0 flex-col px-2.5 text-left focus-visible:outline-none"
            >
              <span className="ty-micro-label text-[11px] text-[#222222]">일정 · 예산</span>
              <span className="ty-caption-sm truncate text-[12px] text-[#6a6a6a]">
                {duration || budget
                  ? [duration, budget].filter(Boolean).join(' · ')
                  : '기간 · 예산'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(myMbti ? 6 : 2)}
              className="flex min-w-0 flex-col pl-2.5 text-left focus-visible:outline-none"
            >
              <span className="ty-micro-label text-[11px] text-[#222222]">누구와</span>
              <span className="ty-caption-sm truncate text-[12px] text-[#6a6a6a]">
                {myMbti || companion
                  ? [myMbti, companion].filter(Boolean).join(' · ')
                  : 'MBTI · 동행'}
              </span>
            </button>
          </div>
          <button
            type="submit"
            disabled={!isComplete || submitting}
            aria-label="선택한 조건으로 보딩패스 발권"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-[#ffffff] transition-colors active:bg-[#e00b41] disabled:cursor-not-allowed disabled:bg-[#ffd1da]"
          >
            <Search className="size-4 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Switcher: Step-by-Step Accordion vs Expand All */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="ty-caption-sm text-[#6a6a6a]">
            카드를 눌러 단계별로 조건을 선택해 보세요
          </span>
          <button
            type="button"
            onClick={() => setActiveStep((prev) => (prev === 'all' ? 1 : 'all'))}
            className="ty-caption-sm font-semibold text-[#222222] underline underline-offset-4 hover:text-[#6a6a6a]"
          >
            {activeStep === 'all' ? '단계별로 보기' : '전체 펼쳐보기'}
          </button>
        </div>

        {/* 01. Travel Style - Airbnb Icon Cards */}
        <ChoiceGroup
          name="travel_style"
          step="01"
          collapsedLabel="여행 스타일"
          legend="어디서 무엇을 하고 싶나요?"
          subtitle="가장 끌리는 여행 테마 1가지를 골라주세요"
          options={TRAVEL_STYLES}
          value={travelStyle}
          onChange={handleSelectStyle}
          columns={2}
          variant="card-icon"
          iconMap={STYLE_ICONS}
          descMap={STYLE_DESC}
          open={isStepOpen(1)}
          onToggle={() => toggleStep(1)}
        />

        {/* 02. My MBTI - Airbnb Calendar-style Ink Invert Tiles */}
        <ChoiceGroup
          name="my_mbti"
          step="02"
          collapsedLabel="본인 MBTI"
          legend="본인의 MBTI는 무엇인가요?"
          subtitle="성향에 딱 맞는 밈과 여행지를 매칭해 드려요"
          options={MBTI_TYPES}
          value={myMbti}
          onChange={handleSelectMyMbti}
          columns={4}
          mono
          variant="mbti-tile"
          open={isStepOpen(2)}
          onToggle={() => toggleStep(2)}
        />

        {/* 03. Budget - Airbnb Filter Pills */}
        <ChoiceGroup
          name="budget"
          step="03"
          collapsedLabel="예산 (1인)"
          legend="1인 기준 예산은 어느 정도인가요?"
          subtitle="항공권과 숙소를 포함한 현실적인 예산 구간"
          options={BUDGETS}
          value={budget}
          onChange={handleSelectBudget}
          variant="pill"
          open={isStepOpen(3)}
          onToggle={() => toggleStep(3)}
        />

        {/* 04. Duration - Airbnb Filter Pills */}
        <ChoiceGroup
          name="duration"
          step="04"
          collapsedLabel="기간"
          legend="얼마나 떠나 있을 예정인가요?"
          subtitle="일정에 무리 없는 비행 거리의 국가를 골라드려요"
          options={DURATIONS}
          value={duration}
          onChange={handleSelectDuration}
          variant="pill"
          open={isStepOpen(4)}
          onToggle={() => toggleStep(4)}
        />

        {/* 05. Safety Level - Airbnb Icon Pills */}
        <ChoiceGroup
          name="safety_level"
          step="05"
          collapsedLabel="치안 중요도"
          legend="여행지 치안은 얼마나 중요한가요?"
          subtitle="밤거리 안전을 최우선으로 할지, 낭만과 모험을 즐길지 골라주세요"
          options={SAFETY_LEVELS}
          value={safetyLevel}
          onChange={handleSelectSafety}
          variant="pill"
          iconMap={SAFETY_ICONS}
          open={isStepOpen(5)}
          onToggle={() => toggleStep(5)}
        />

        {/* 06. Companion - Airbnb Icon Pills */}
        <ChoiceGroup
          name="companion"
          step="06"
          collapsedLabel="동행자"
          legend="누구와 함께 떠나나요?"
          subtitle="동행자와의 케미를 보딩패스에 녹여드려요"
          options={COMPANIONS}
          value={companion}
          onChange={handleCompanion}
          variant="pill"
          iconMap={COMPANION_ICONS}
          open={isStepOpen(6)}
          onToggle={() => toggleStep(6)}
        />

        {/* 07. Companion MBTI - Conditional Ink Invert Tiles */}
        {needsCompanionMbti && (
          <ChoiceGroup
            name="companion_mbti"
            step="07"
            collapsedLabel="동행자 MBTI"
            legend="동행자의 MBTI도 알고 계신가요?"
            subtitle="잘 모르시면 '모름'을 선택해도 재미있게 발권돼요"
            options={COMPANION_MBTI_TYPES}
            value={companionMbti}
            onChange={handleSelectCompanionMbti}
            columns={4}
            mono
            variant="mbti-tile"
            open={isStepOpen(7)}
            onToggle={() => toggleStep(7)}
          />
        )}

        {/* Airbnb Sticky Bottom Reservation Bar */}
        <div className="sticky bottom-0 -mx-5 mt-2 flex flex-col gap-2.5 border-t border-[#dddddd] bg-[#ffffff]/95 px-6 pt-3.5 pb-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="ty-title-md text-[#222222]">
                  {isComplete ? '발권 준비 완료' : `${completedCount} / ${totalRequired} 조건 선택됨`}
                </span>
                {myMbti && (
                  <span className="font-mono text-[12px] font-semibold text-[#6a6a6a]">
                    · {myMbti}
                  </span>
                )}
              </div>
              {!isComplete ? (
                <p className="ty-caption-sm text-[12px] text-[#6a6a6a]" id="submit-hint">
                  모든 조건을 선택하면 발권할 수 있어요
                </p>
              ) : (
                <p className="ty-caption-sm truncate text-[12px] text-[#6a6a6a]">
                  {[travelStyle, duration, safetyLevel, companion].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleResetAll}
                className="ty-caption-sm inline-flex items-center gap-1 font-medium text-[#222222] underline underline-offset-4 hover:text-[#6a6a6a]"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                전체 초기화
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!isComplete || submitting}
            aria-describedby={!isComplete ? 'submit-hint' : undefined}
            className="ty-button-md flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#ff385c] px-6 py-3.5 text-[#ffffff] transition-colors active:bg-[#e00b41] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#ffd1da] disabled:text-[#ffffff]"
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
