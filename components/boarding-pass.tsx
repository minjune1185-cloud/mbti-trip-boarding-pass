import { forwardRef } from 'react'
import { Plane } from 'lucide-react'
import { findCountry } from '@/lib/countries'
import type { InputPayload } from '@/lib/options'
import type { Recommendation } from '@/lib/schema'

type BoardingPassProps = { input: InputPayload; recommendation: Recommendation; issuedAt: Date }

function barcodeWidths(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return Array.from({ length: 46 }, (_, i) => {
    h = Math.imul(h ^ (i + 1), 16777619)
    return ((h >>> 0) % 3) + 1
  })
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="truncate text-[13px] font-bold">{value}</dd>
    </div>
  )
}

export const BoardingPass = forwardRef<HTMLDivElement, BoardingPassProps>(function BoardingPass(
  { input, recommendation, issuedAt },
  ref,
) {
  const country = findCountry(recommendation.country)
  const code = country?.code ?? 'XXX'
  const date = issuedAt
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
  const bars = barcodeWidths(`${code}${recommendation.meme_title}${input.my_mbti}`)

  return (
    <div ref={ref} className="bg-background p-3">
      <article
        aria-label={`${recommendation.country} 보딩패스`}
        className="overflow-hidden rounded-2xl bg-ticket text-card-foreground shadow-[0_1px_0_var(--border),0_12px_32px_-12px_oklch(0.27_0.07_262/0.35)]"
      >
        <header className="flex items-center justify-between bg-primary px-5 py-3.5 text-primary-foreground">
          <div className="flex flex-col">
            <span className="text-[13px] font-black leading-tight">「성격따라 따라가는 여행」</span>
            <span className="font-mono text-[10px] font-semibold tracking-[0.22em] opacity-80">AIRLINES</span>
          </div>
          <span className="font-mono text-[11px] font-bold tracking-[0.2em]">BOARDING PASS</span>
        </header>

        <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">FROM</span>
              <span className="font-mono text-4xl font-bold leading-none tracking-tight">ICN</span>
              <span className="mt-1 text-xs text-muted-foreground">대한민국</span>
            </div>
            <div className="flex flex-1 items-center gap-1.5 px-3 pb-6 text-accent">
              <span className="h-px flex-1 border-t border-dashed border-current" />
              <Plane className="size-4" aria-hidden="true" />
              <span className="h-px flex-1 border-t border-dashed border-current" />
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">TO</span>
              <span className="font-mono text-4xl font-bold leading-none tracking-tight text-accent">{code}</span>
              <span className="mt-1 text-xs text-muted-foreground">{country?.en}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-xl bg-muted px-4 py-4">
            <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
              DESTINATION
            </span>
            <p className="text-[34px] font-black leading-tight tracking-tight">{recommendation.country}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-balance text-xl font-black leading-snug text-primary">
              {recommendation.meme_title}
            </h2>
            <p className="text-pretty text-[14px] leading-relaxed">{recommendation.meme_reason}</p>
            <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="해시태그">
              {recommendation.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative flex items-center" aria-hidden="true">
          <span className="-ml-3 size-6 shrink-0 rounded-full bg-background" />
          <span className="mx-2 h-px flex-1 border-t-2 border-dashed border-border" />
          <span className="-mr-3 size-6 shrink-0 rounded-full bg-background" />
        </div>

        <div className="flex flex-col gap-5 px-5 pt-4 pb-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label="PASSENGER MBTI" value={input.my_mbti} />
            <Field label="BUDGET / PAX" value={input.budget} />
            <Field label="DURATION" value={input.duration} />
            <Field label="COMPANION" value={input.companion} />
          </dl>
          <div className="flex items-end justify-between gap-4">
            <div className="flex h-11 items-stretch gap-px" aria-hidden="true">
              {bars.map((w, i) => (
                <span
                  key={i}
                  className={i % 2 === 0 ? 'bg-primary' : 'bg-transparent'}
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <div className="flex flex-col items-end font-mono text-[10px] leading-tight text-muted-foreground">
              <span>ISSUED</span>
              <span className="font-bold text-foreground">{date}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
})
