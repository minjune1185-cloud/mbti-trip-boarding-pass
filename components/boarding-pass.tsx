import { forwardRef } from 'react'
import { Heart, Plane, Star } from 'lucide-react'
import { findCountry } from '@/lib/countries'
import type { InputPayload } from '@/lib/options'
import type { Recommendation } from '@/lib/schema'

type BoardingPassProps = { input: InputPayload; recommendation: Recommendation; issuedAt: Date }

function barcodeWidths(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return Array.from({ length: 48 }, (_, i) => {
    h = Math.imul(h ^ (i + 1), 16777619)
    return ((h >>> 0) % 3) + 1
  })
}

function LaurelLeft() {
  return (
    <svg
      viewBox="0 0 32 64"
      fill="none"
      className="h-14 w-7 shrink-0 text-[#222222]"
      aria-hidden="true"
    >
      <path
        d="M26 56C16 48 11 36 12 20C12.5 13 16 7 21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="18" cy="11" rx="3" ry="5.5" transform="rotate(-25 18 11)" fill="currentColor" />
      <ellipse cx="13" cy="22" rx="3" ry="6" transform="rotate(-15 13 22)" fill="currentColor" />
      <ellipse cx="13" cy="35" rx="3" ry="6" transform="rotate(8 13 35)" fill="currentColor" />
      <ellipse cx="17" cy="47" rx="3" ry="5.5" transform="rotate(28 17 47)" fill="currentColor" />
    </svg>
  )
}

function LaurelRight() {
  return (
    <svg
      viewBox="0 0 32 64"
      fill="none"
      className="h-14 w-7 shrink-0 text-[#222222]"
      aria-hidden="true"
    >
      <path
        d="M6 56C16 48 21 36 20 20C19.5 13 16 7 11 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="14" cy="11" rx="3" ry="5.5" transform="rotate(25 14 11)" fill="currentColor" />
      <ellipse cx="19" cy="22" rx="3" ry="6" transform="rotate(15 19 22)" fill="currentColor" />
      <ellipse cx="19" cy="35" rx="3" ry="6" transform="rotate(-8 19 35)" fill="currentColor" />
      <ellipse cx="15" cy="47" rx="3" ry="5.5" transform="rotate(-28 15 47)" fill="currentColor" />
    </svg>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="ty-micro-label text-[11px] tracking-[0.06em] text-[#6a6a6a] uppercase">
        {label}
      </dt>
      <dd className="ty-caption truncate font-semibold text-[#222222]">{value}</dd>
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
    <div ref={ref} className="bg-[#ffffff] p-3">
      <article
        aria-label={`${recommendation.country} 보딩패스`}
        className="overflow-hidden rounded-[20px] border border-[#dddddd] bg-[#ffffff] text-[#222222] shadow-airbnb"
      >
        {/* 1. Photo-First Visual Plate (property-card-photo + guest-favorite-badge + heart icon) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#222222] via-[#2c2c2c] to-[#181818] px-5 pt-4 pb-6 text-[#ffffff]">
          <div
            className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-[#ff385c]/25 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative flex items-center justify-between">
            <span className="ty-badge inline-flex items-center gap-1.5 rounded-full bg-[#ffffff] px-3 py-1 text-[#222222] shadow-airbnb">
              <span aria-hidden="true">🏆</span>
              <span>게스트 선호 여행지</span>
            </span>
            <span
              className="flex size-8 items-center justify-center rounded-full bg-[#ffffff]/15 text-[#ff385c]"
              aria-hidden="true"
            >
              <Heart className="size-4 fill-[#ff385c] text-[#ff385c]" />
            </span>
          </div>

          <div className="relative mt-6 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#ffffff]/60">
                FROM
              </span>
              <span className="font-mono text-[36px] font-bold leading-none tracking-tight text-[#ffffff]">
                ICN
              </span>
              <span className="mt-1 text-[12px] font-normal text-[#ffffff]/75">대한민국</span>
            </div>

            <div className="flex flex-1 flex-col items-center px-3 pb-3">
              <span className="mb-1.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#ffffff]/70">
                BOARDING PASS
              </span>
              <div className="flex w-full items-center gap-1.5">
                <span className="h-px flex-1 border-t border-dashed border-[#ffffff]/35" />
                <span className="flex size-7 items-center justify-center rounded-full bg-[#ff385c] text-[#ffffff]">
                  <Plane className="size-3.5" aria-hidden="true" />
                </span>
                <span className="h-px flex-1 border-t border-dashed border-[#ffffff]/35" />
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#ffffff]/60">
                TO
              </span>
              <span className="font-mono text-[36px] font-bold leading-none tracking-tight text-[#ff385c]">
                {code}
              </span>
              <span className="mt-1 text-[12px] font-normal text-[#ffffff]/75">
                {country?.en ?? 'DESTINATION'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Signature Airbnb Rating-Display & Laurel Wreath Block (rating-display-card) */}
        <div className="flex flex-col items-center border-b border-[#ebebeb] px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-3.5">
            <LaurelLeft />
            <div className="flex flex-col items-center">
              <span className="ty-micro-label text-[11px] tracking-[0.08em] text-[#6a6a6a] uppercase">
                DESTINATION
              </span>
              <p className="mt-0.5 text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[#222222]">
                {recommendation.country}
              </p>
            </div>
            <LaurelRight />
          </div>

          <div className="ty-caption-sm mt-3 flex items-center gap-2 text-[#6a6a6a]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#222222]">
              <Star className="size-3.5 fill-[#222222] text-[#222222]" aria-hidden="true" />
              4.98
            </span>
            <span>·</span>
            <span className="font-medium text-[#222222]">성격따라 따라가는 여행 AIRLINES</span>
            <span>·</span>
            <span>{input.travel_style}</span>
          </div>
        </div>

        {/* 3. Editorial Meme Title, Reason, and Hashtag Pills (reviews-card / host-card feel) */}
        <div className="flex flex-col gap-3.5 px-6 py-6">
          <h2 className="ty-display-sm text-balance leading-[1.32] text-[#222222]">
            “{recommendation.meme_title}”
          </h2>
          <p className="ty-body-md text-pretty text-[15px] text-[#3f3f3f]">
            {recommendation.meme_reason}
          </p>
          <ul className="flex flex-wrap gap-2 pt-1" aria-label="해시태그">
            {recommendation.tags.map((tag) => (
              <li
                key={tag}
                className="ty-badge rounded-full border border-[#dddddd] bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#222222]"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Ticket Perforation Divider */}
        <div className="relative flex items-center" aria-hidden="true">
          <span className="-ml-3 size-6 shrink-0 rounded-full border border-[#dddddd] bg-[#ffffff]" />
          <span className="mx-2 h-px flex-1 border-t border-dashed border-[#dddddd]" />
          <span className="-mr-3 size-6 shrink-0 rounded-full border border-[#dddddd] bg-[#ffffff]" />
        </div>

        {/* 5. Passenger Summary & Barcode Stub */}
        <div className="flex flex-col gap-4 bg-[#f7f7f7] px-6 pt-4 pb-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label="PASSENGER MBTI" value={input.my_mbti} />
            <Field label="BUDGET / PAX" value={input.budget} />
            <Field label="DURATION" value={input.duration} />
            <Field label="COMPANION" value={input.companion} />
          </dl>

          <div className="flex items-end justify-between gap-4 border-t border-[#dddddd] pt-4">
            <div className="flex h-10 items-stretch gap-px" aria-hidden="true">
              {bars.map((w, i) => (
                <span
                  key={i}
                  className={i % 2 === 0 ? 'bg-[#222222]' : 'bg-transparent'}
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <div className="flex flex-col items-end font-mono text-[10px] leading-tight text-[#6a6a6a]">
              <span>BOARDING PASS</span>
              <span className="mt-0.5 font-bold text-[#222222]">ISSUED · {date}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
})
