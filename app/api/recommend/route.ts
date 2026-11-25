import { generateText, Output } from 'ai'
import { COUNTRIES } from '@/lib/countries'
import { inputPayloadSchema, recommendationSchema, type ApiErrorCode } from '@/lib/schema'
import {
  checkRateLimit,
  consumeQuota,
  getClientIp,
  isQuotaExhausted,
  markProviderExhausted,
} from '@/lib/rate-limit'

export const maxDuration = 30

const MODEL = 'google/gemini-3.5-flash'

const SYSTEM = `너는 한국 MZ 감성 여행 밈 큐레이터야. 사용자의 여행 조건과 MBTI 조합을 보고 아래 30개국 중 딱 1곳을 골라 밈 말투로 추천해.

후보 국가: ${COUNTRIES.map((c) => c.name).join(', ')}

규칙:
- country는 반드시 후보 국가의 한글명 그대로.
- 예산·기간·여행 스타일과 현실적으로 맞는 나라를 고를 것 (예: 50만 이하 + 2박3일이면 장거리 유럽 X).
- 동행자 MBTI가 있으면 두 사람의 케미를 웃기게 녹일 것. '모름'이면 미지의 동행자 컨셉으로.
- 말투: 친근한 반말, 요즘 밈·인터넷 유행어 느낌, 과장된 공감 개그. 이모지 사용 금지.
- 금지: 욕설·비속어, 성적 표현, 특정 국가·민족·성별·종교 비하, MBTI를 깎아내리는 인신공격, 정치 이슈.
- meme_title 25자 이내, meme_reason 90~140자, tags 3~4개(# 없이, 각 10자 이내).`

function errorResponse(code: ApiErrorCode, status: number) {
  return Response.json({ error: code }, { status })
}

function isProviderQuotaError(err: unknown): boolean {
  const candidates = [err, (err as { lastError?: unknown })?.lastError]
  return candidates.some((e) => {
    if (!e || typeof e !== 'object') return false
    const status = (e as { statusCode?: number }).statusCode
    const name = (e as { name?: string }).name ?? ''
    return status === 429 || status === 402 || /RateLimit|InsufficientFunds|Quota/i.test(name)
  })
}

export async function POST(req: Request) {
  if (isQuotaExhausted()) return errorResponse('QUOTA_EXHAUSTED', 503)

  const limit = checkRateLimit(getClientIp(req))
  if (!limit.ok) return errorResponse('RATE_LIMITED', 429)

  const parsed = inputPayloadSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return errorResponse('INVALID_INPUT', 400)

  if (!consumeQuota()) return errorResponse('QUOTA_EXHAUSTED', 503)

  const input = parsed.data
  const prompt = `여행 조건(input_payload):
- 여행 스타일: ${input.travel_style}
- 본인 MBTI: ${input.my_mbti}
- 1인 예산: ${input.budget}
- 기간: ${input.duration}
- 동행자: ${input.companion}
- 동행자 MBTI: ${input.companion_mbti ?? '해당 없음(혼자 여행)'}`

  try {
    const { output } = await generateText({
      model: MODEL,
      system: SYSTEM,
      prompt,
      output: Output.object({ schema: recommendationSchema }),
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(20_000),
    })

    return Response.json({
      country: output.country,
      meme_title: output.meme_title.slice(0, 40),
      meme_reason: output.meme_reason.slice(0, 220),
      tags: output.tags
        .map((t) => t.replace(/^#+/, '').trim())
        .filter(Boolean)
        .slice(0, 4),
    })
  } catch (err) {
    if (isProviderQuotaError(err)) {
      markProviderExhausted()
      return errorResponse('QUOTA_EXHAUSTED', 503)
    }
    console.error('[recommend] AI request failed:', err instanceof Error ? err.message : err)
    return errorResponse('TEMPORARY_ERROR', 502)
  }
}
