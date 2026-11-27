'use client'

import { useCallback, useEffect, useState } from 'react'
import { MessageSquarePlus, Send, Sparkles } from 'lucide-react'
import type { GuestbookEntry } from '@/app/api/guestbook/route'
import { useTrip } from '@/components/trip-provider'
import { MBTI_TYPES, type Mbti } from '@/lib/options'

function formatRelativeTime(iso: string) {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (diffSec < 60) return '방금 전'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return `${diffDay}일 전`
  return new Date(iso).toLocaleDateString('ko-KR')
}

export function GuestbookSection({
  defaultMbti,
  defaultCountry,
}: {
  defaultMbti?: Mbti | null
  defaultCountry?: string | null
}) {
  const { showToast } = useTrip()
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [nickname, setNickname] = useState('')
  const [mbti, setMbti] = useState<string>(defaultMbti ?? '')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (defaultMbti) setMbti(defaultMbti)
  }, [defaultMbti])

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/guestbook', { cache: 'no-store' })
      const data = await res.json().catch(() => null)
      if (res.ok && Array.isArray(data?.entries)) {
        setEntries(data.entries)
      }
    } catch {
      // ignore initial load error silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || '익명 여행자',
          mbti: mbti || null,
          country: defaultCountry ?? null,
          message: trimmed,
        }),
      })
      const data = await res.json().catch(() => null)

      if (res.ok && data?.entry) {
        setEntries((prev) => [data.entry as GuestbookEntry, ...prev])
        setMessage('')
        showToast('방명록에 댓글이 등록되었어요!')
        return
      }

      if (data?.error === 'RATE_LIMITED') {
        showToast('댓글을 너무 빠르게 작성하고 있어요. 잠시 후 다시 시도해 주세요.')
        return
      }
      showToast('댓글 등록에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } catch {
      showToast('일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      aria-labelledby="guestbook-heading"
      className="flex flex-col gap-5 border-t border-[#ebebeb] bg-[#ffffff] px-5 py-7"
    >
      {/* Section Header (Airbnb Reviews Section Header style) */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="size-4 text-[#ff385c]" aria-hidden="true" />
            <h2 id="guestbook-heading" className="ty-display-sm text-[20px] text-[#222222]">
              여행자 방명록
            </h2>
            <span className="ty-badge rounded-full border border-[#dddddd] bg-[#f7f7f7] px-2.5 py-0.5 text-[#222222]">
              {entries.length}
            </span>
          </div>
          <p className="ty-caption-sm text-[#6a6a6a]">
            회원가입 없이 누구나 자유롭게 내 보딩패스 후기와 여행 한마디를 남겨보세요
          </p>
        </div>
      </div>

      {/* Anonymous Comment Form (Airbnb text-input & button-primary spec) */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-[20px] border border-[#dddddd] bg-[#ffffff] p-4 shadow-airbnb"
      >
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1">
            <label htmlFor="gb-nickname" className="ty-micro-label text-[11px] text-[#6a6a6a]">
              닉네임 (선택)
            </label>
            <input
              id="gb-nickname"
              type="text"
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="익명 여행자"
              className="ty-body-sm h-10 rounded-[8px] border border-[#dddddd] bg-[#ffffff] px-3 text-[#222222] placeholder:text-[#929292] focus:border-2 focus:border-[#222222] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="gb-mbti" className="ty-micro-label text-[11px] text-[#6a6a6a]">
              내 MBTI (선택)
            </label>
            <select
              id="gb-mbti"
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              className="ty-body-sm h-10 rounded-[8px] border border-[#dddddd] bg-[#ffffff] px-2.5 font-mono text-[13px] text-[#222222] focus:border-2 focus:border-[#222222] focus:outline-none"
            >
              <option value="">선택 안 함</option>
              {MBTI_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="gb-message" className="ty-micro-label text-[11px] text-[#6a6a6a]">
              방명록 댓글
            </label>
            <span className="ty-caption-sm text-[11px] text-[#929292]">{message.length}/200</span>
          </div>
          <textarea
            id="gb-message"
            rows={2}
            maxLength={200}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              defaultCountry
                ? `${defaultCountry} 추천받은 소감이나 여행 팁을 남겨보세요!`
                : '어느 나라가 나왔나요? 자유롭게 댓글을 남겨보세요!'
            }
            className="ty-body-sm resize-none rounded-[8px] border border-[#dddddd] bg-[#ffffff] p-3 text-[#222222] placeholder:text-[#929292] focus:border-2 focus:border-[#222222] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || submitting}
          className="ty-button-sm flex h-11 w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#222222] px-4 text-[#ffffff] transition-colors hover:bg-[#3f3f3f] disabled:cursor-not-allowed disabled:bg-[#ebebeb] disabled:text-[#929292]"
        >
          <Send className="size-3.5" aria-hidden="true" />
          {submitting ? '등록 중...' : '방명록 남기기'}
        </button>
      </form>

      {/* Guestbook Entries List (Airbnb reviews-card style) */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-6 text-center">
            <p className="ty-caption-sm text-[#6a6a6a]">방명록을 불러오는 중이에요...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-7 text-center">
            <Sparkles className="size-5 text-[#ff385c]" aria-hidden="true" />
            <p className="ty-caption font-semibold text-[#222222]">첫 번째 방명록의 주인공이 되어보세요!</p>
            <p className="ty-caption-sm text-[#6a6a6a]">회원가입 없이 바로 한 줄 후기를 남길 수 있어요.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="방명록 댓글 목록">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222222] text-[12px] font-bold text-[#ffffff]">
                      {entry.nickname.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="ty-caption font-semibold text-[#222222]">
                          {entry.nickname}
                        </span>
                        {entry.mbti && (
                          <span className="rounded-full bg-[#f7f7f7] border border-[#dddddd] px-2 py-0.5 font-mono text-[10px] font-bold text-[#222222]">
                            {entry.mbti}
                          </span>
                        )}
                        {entry.country && (
                          <span className="rounded-full bg-[#fff0f3] px-2 py-0.5 text-[10px] font-semibold text-[#ff385c]">
                            ✈ {entry.country}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#929292]">
                        {formatRelativeTime(entry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="ty-body-sm whitespace-pre-wrap break-words text-[#3f3f3f]">
                  {entry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
