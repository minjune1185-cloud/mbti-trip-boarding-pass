'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Info, RotateCcw } from 'lucide-react'
import { toPng } from 'html-to-image'
import { BoardingPass } from '@/components/boarding-pass'
import { useTrip } from '@/components/trip-provider'
import { findCountry } from '@/lib/countries'

export function ResultView() {
  const router = useRouter()
  const { result, setResult, showToast } = useTrip()
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [issuedAt] = useState(() => new Date())

  useEffect(() => {
    if (!result) router.replace('/')
  }, [result, router])

  if (!result) return null

  async function handleSave() {
    if (!cardRef.current || saving || !result) return
    setSaving(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
      const code = findCountry(result.recommendation.country)?.code ?? 'TRIP'
      const stamp = issuedAt.toISOString().slice(0, 10).replaceAll('-', '')
      const link = document.createElement('a')
      link.download = `boarding-pass-${code}-${stamp}.png`
      link.href = dataUrl
      link.click()
      showToast('보딩패스가 저장되었어요! 갤러리에서 카톡·인스타에 공유해 보세요.')
    } catch {
      showToast('이미지 저장에 실패했어요. 외부 브라우저에서 다시 시도해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  function handleRetry() {
    setResult(null)
    router.push('/')
  }

  return (
    <main className="flex min-h-dvh flex-col gap-4 bg-[#ffffff] px-3 pt-4 pb-10 text-[#222222]">
      {/* Airbnb Detail Toolbar (icon-button-circle #f2f2f2 32px) */}
      <div className="flex items-center justify-between px-3 pb-1">
        <button
          type="button"
          onClick={handleRetry}
          aria-label="조건 다시 선택하기"
          className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition-colors hover:bg-[#dddddd]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <span className="ty-caption font-semibold text-[#222222]">AI 보딩패스 발권 완료</span>
        <span className="size-8" aria-hidden="true" />
      </div>

      <h1 className="sr-only">{`추천 결과: ${result.recommendation.country}`}</h1>

      {/* In-App Browser Guidance Notice */}
      <p className="ty-caption-sm mx-3 flex items-start gap-2.5 rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-3 leading-[1.45] text-[#6a6a6a]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#222222]" aria-hidden="true" />
        <span>
          카톡·인스타 앱 내에서 저장이 안 된다면, 외부 브라우저(크롬·사파리)로 열어 저장해 주세요.
        </span>
      </p>

      <BoardingPass ref={cardRef} input={result.input} recommendation={result.recommendation} issuedAt={issuedAt} />

      {/* Action Buttons: button-primary (#ff385c) & button-secondary (#ffffff + 1px #222222) */}
      <div className="flex flex-col gap-2.5 px-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="ty-button-md flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#ff385c] px-6 py-3.5 text-[#ffffff] transition-colors active:bg-[#e00b41] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 disabled:bg-[#ffd1da]"
        >
          <Download className="size-5" aria-hidden="true" />
          {saving ? '저장 중...' : '보딩패스 이미지 저장'}
        </button>
        <button
          type="button"
          onClick={handleRetry}
          className="ty-button-md flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#222222] bg-[#ffffff] px-6 py-3 text-[#222222] transition-colors hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222]"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          다시 추천받기
        </button>
      </div>
    </main>
  )
}
