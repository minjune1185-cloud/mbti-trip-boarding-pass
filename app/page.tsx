import { Plane } from 'lucide-react'
import { TripForm } from '@/components/trip-form'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex flex-col gap-3 px-5 pt-10 pb-8">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
          <Plane className="size-3.5 text-accent" aria-hidden="true" />
          ICN · AI BOARDING PASS
        </div>
        <h1 className="text-balance text-[28px] font-black leading-tight tracking-tight">
          성격따라 따라가는 여행
        </h1>
        <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
          조건만 고르면 AI가 30개국 중 딱 맞는 여행지를 밈 보딩패스로 발권해 드려요.
        </p>
      </header>

      <TripForm />

      <footer className="px-5 pb-10">
        <p className="rounded-lg bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          본 서비스는 무료티어 AI로 운영되며, 일일 무료 할당량이 소진되면 충전 전까지 발권이 중단될 수
          있습니다. 입력하신 정보는 별도 저장되지 않습니다.
        </p>
      </footer>
    </main>
  )
}
