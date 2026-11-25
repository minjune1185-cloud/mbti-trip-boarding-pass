'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Info, RotateCcw } from 'lucide-react'
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
    <main className="flex min-h-dvh flex-col gap-4 px-2 pt-6 pb-10">
      <h1 className="sr-only">{`추천 결과: ${result.recommendation.country}`}</h1>
      <p className="mx-3 flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        카톡·인스타 앱 내에서 저장이 안 된다면, 외부 브라우저(크롬·사파리)로 열어 저장해 주세요.
      </p>

      <BoardingPass ref={cardRef} input={result.input} recommendation={result.recommendation} issuedAt={issuedAt} />

      <div className="flex flex-col gap-2.5 px-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-accent text-base font-bold text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
        >
          <Download className="size-5" aria-hidden="true" />
          {saving ? '저장 중...' : '보딩패스 이미지 저장'}
        </button>
        <button
          type="button"
          onClick={handleRetry}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-card text-[15px] font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          다시 추천받기
        </button>
      </div>
    </main>
  )
}
