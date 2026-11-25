import type { Metadata } from 'next'
import Link from 'next/link'
import { Hourglass } from 'lucide-react'
import { StatusScreen } from '@/components/status-screen'

export const metadata: Metadata = { title: '발권 횟수 초과 | 성격따라 따라가는 여행' }

export default function LimitedPage() {
  return (
    <StatusScreen
      icon={Hourglass}
      code="GATE CLOSED · 429"
      title="잠시 쉬어가요! 발권 횟수를 초과했어요"
      description={
        <>
          원활한 무료 운영을 위해 발권은 1분에 3회, 하루 20회까지 가능해요.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      }
    >
      <Link
        href="/"
        className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        처음으로 돌아가기
      </Link>
    </StatusScreen>
  )
}
