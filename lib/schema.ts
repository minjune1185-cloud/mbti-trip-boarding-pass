import { z } from 'zod'
import { COUNTRY_NAMES } from './countries'
import {
  BUDGETS,
  COMPANIONS,
  COMPANION_MBTI_TYPES,
  DURATIONS,
  MBTI_TYPES,
  SAFETY_LEVELS,
  SOLO,
  TRAVEL_STYLES,
} from './options'

export const inputPayloadSchema = z
  .object({
    travel_style: z.enum(TRAVEL_STYLES),
    my_mbti: z.enum(MBTI_TYPES),
    budget: z.enum(BUDGETS),
    duration: z.enum(DURATIONS),
    safety_level: z.enum(SAFETY_LEVELS),
    companion: z.enum(COMPANIONS),
    companion_mbti: z.enum(COMPANION_MBTI_TYPES).nullable(),
  })
  .strict()
  .refine(
    (v) => (v.companion === SOLO ? v.companion_mbti === null : v.companion_mbti !== null),
    { message: 'companion_mbti is required unless companion is 혼자', path: ['companion_mbti'] },
  )

export const recommendationSchema = z.object({
  country: z.enum(COUNTRY_NAMES).describe('추천 국가. 반드시 후보 30개국 중 하나의 한글 국가명'),
  meme_title: z
    .string()
    .describe('밈 스타일 한 줄 타이틀. 공백 포함 25자 이내, 이모지 금지'),
  meme_reason: z
    .string()
    .describe('밈 말투의 추천 이유. 공백 포함 90~140자, 2~3문장, 이모지 금지'),
  tags: z
    .array(z.string())
    .describe('해시태그 3~4개. # 기호 없이 각 10자 이내 한국어 단어'),
})

export type Recommendation = z.infer<typeof recommendationSchema>

export type ApiErrorCode = 'RATE_LIMITED' | 'QUOTA_EXHAUSTED' | 'INVALID_INPUT' | 'TEMPORARY_ERROR'
