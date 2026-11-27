import { Plane } from 'lucide-react'
import { TripForm } from '@/components/trip-form'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col bg-[#ffffff] text-[#222222]">
      {/* Airbnb Top Navigation */}
      <header className="border-b border-[#ebebeb] bg-[#ffffff] px-6 pt-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#ff385c] text-[#ffffff]">
              <Plane className="size-4 -rotate-45" aria-hidden="true" />
            </span>
            <span className="ty-nav-link tracking-[-0.3px] text-[#ff385c]">
              성격따라 따라가는 여행
            </span>
          </div>
          <span className="ty-badge rounded-full border border-[#ebebeb] bg-[#f7f7f7] px-3 py-1 text-[#222222]">
            ICN 출발 · 30개국
          </span>
        </div>

        {/* Airbnb Product Tabs (product-tab-active / product-tab-inactive + new-tag) */}
        <nav aria-label="서비스 카테고리" className="mt-4 flex items-center gap-7">
          <div className="ty-nav-link relative flex items-center gap-2 border-b-2 border-[#222222] pb-3 text-[#222222]">
            <span className="text-[18px]" aria-hidden="true">
              🎫
            </span>
            <span>보딩패스 발권</span>
          </div>
          <div className="ty-nav-link relative flex items-center gap-1.5 pb-3 font-medium text-[#6a6a6a]">
            <span className="text-[18px]" aria-hidden="true">
              🧬
            </span>
            <span>MBTI 케미</span>
            <span className="ty-uppercase-tag rounded-full border border-[#dddddd] bg-[#ffffff] px-1.5 py-0.5 text-[#222222] shadow-airbnb">
              NEW
            </span>
          </div>
        </nav>
      </header>

      {/* Editorial Hero Header (display-lg / body-sm) */}
      <section className="px-6 pt-6 pb-2">
        <h1 className="ty-display-lg text-balance font-semibold text-[#222222]">
          나와 딱 맞는 여행지, 어디로 떠날까요?
        </h1>
        <p className="ty-body-sm mt-1.5 text-pretty text-[#6a6a6a]">
          조건만 고르면 AI가 30개국 중 딱 맞는 여행지를 밈 보딩패스로 발권해 드려요.
        </p>
      </section>

      <TripForm />

      {/* Airbnb Light Footer & Legal Band */}
      <footer className="mt-auto border-t border-[#dddddd] bg-[#ffffff] px-6 py-8">
        <div className="rounded-[14px] bg-[#f7f7f7] px-4 py-3.5">
          <p className="ty-caption-sm leading-[1.45] text-[#6a6a6a]">
            본 서비스는 무료티어 AI로 운영되며, 일일 무료 할당량이 소진되면 충전 전까지 발권이 중단될 수
            있습니다. 입력하신 정보는 별도 저장되지 않습니다.
          </p>
        </div>
        <div className="ty-caption-sm mt-5 flex items-center justify-between border-t border-[#ebebeb] pt-4 text-[#6a6a6a]">
          <span>© 2026 성격따라 따라가는 여행, Inc.</span>
          <span className="font-medium text-[#222222]">한국어 (KR) · ₩ KRW</span>
        </div>
      </footer>
    </main>
  )
}
