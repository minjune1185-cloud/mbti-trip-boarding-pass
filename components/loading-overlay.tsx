import { Plane } from 'lucide-react'

export function LoadingOverlay() {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby="loading-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#000000]/50 px-8 animate-in fade-in"
    >
      <div className="flex w-full max-w-[310px] flex-col items-center gap-5 rounded-[20px] border border-[#dddddd] bg-[#ffffff] p-6 text-center shadow-airbnb">
        <div className="relative flex size-16 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#ebebeb] border-t-[#ff385c]" />
          <Plane className="size-6 text-[#ff385c]" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p id="loading-title" className="ty-display-sm text-[18px] text-[#222222]">
            보딩패스 발권 중...
          </p>
          <p className="ty-body-sm text-[#6a6a6a]">
            AI가 당신의 성격에 맞는 여행지를
            <br />
            열심히 고르고 있어요
          </p>
        </div>
      </div>
    </div>
  )
}
