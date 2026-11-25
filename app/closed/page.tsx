import type { Metadata } from 'next'
import { PlaneLanding } from 'lucide-react'
import { StatusScreen } from '@/components/status-screen'

export const metadata: Metadata = { title: '오늘의 발권 마감 | 성격따라 따라가는 여행' }

export default function ClosedPage() {
  return (
    <StatusScreen
      icon={PlaneLanding}
      code="SOLD OUT · TODAY"
      title="오늘의 무료 발권이 모두 마감되었어요"
      description={
        <>
          무료티어 AI의 일일 할당량이 모두 소진되었어요.
          <br />
          할당량이 충전되면 다시 발권할 수 있어요. 조금만 기다려 주세요!
        </>
      }
      badge="무료티어 충전 대기 중"
    />
  )
}
