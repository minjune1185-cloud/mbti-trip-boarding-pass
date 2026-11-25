export const TRAVEL_STYLES = [
  '휴양·호캉스',
  '맛집·먹방',
  '관광·랜드마크',
  '쇼핑·도시',
  '액티비티·자연',
] as const

export const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const

export const BUDGETS = [
  '50만 이하',
  '50~100만',
  '100~200만',
  '200~300만',
  '300만 이상',
] as const

export const DURATIONS = ['2박 3일 이하', '3박 4일', '4박 5일', '1주일 이상'] as const

export const SOLO = '혼자'

export const COMPANIONS = [SOLO, '친구(텐션 높음)', '친구(힐링)', '연인', '가족'] as const

export const COMPANION_MBTI_TYPES = [...MBTI_TYPES, '모름'] as const

export type TravelStyle = (typeof TRAVEL_STYLES)[number]
export type Mbti = (typeof MBTI_TYPES)[number]
export type Budget = (typeof BUDGETS)[number]
export type Duration = (typeof DURATIONS)[number]
export type Companion = (typeof COMPANIONS)[number]
export type CompanionMbti = (typeof COMPANION_MBTI_TYPES)[number]

export type InputPayload = {
  travel_style: TravelStyle
  my_mbti: Mbti
  budget: Budget
  duration: Duration
  companion: Companion
  companion_mbti: CompanionMbti | null
}
