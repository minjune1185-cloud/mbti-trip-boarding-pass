import { Plane } from 'lucide-react'

export function LoadingOverlay() {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby="loading-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-primary/70 px-8 backdrop-blur-sm animate-in fade-in"
    >
      <div className="flex w-full max-w-[300px] flex-col items-center gap-5 rounded-2xl bg-card px-6 py-8 text-center shadow-2xl">
        <div className="relative flex size-16 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-accent" />
          <Plane className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p id="loading-title" className="text-base font-bold">
            보딩패스 발권 중...
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI가 당신의 성격에 맞는 여행지를
            <br />
            열심히 고르고 있어요
          </p>
        </div>
      </div>
    </div>
  )
}
