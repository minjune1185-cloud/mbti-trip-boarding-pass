import type { LucideIcon } from 'lucide-react'

type StatusScreenProps = {
  icon: LucideIcon
  code: string
  title: string
  description: React.ReactNode
  badge?: string
  children?: React.ReactNode
}

export function StatusScreen({ icon: Icon, code, title, description, badge, children }: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#ffffff] px-6 py-12 text-center text-[#222222]">
      {/* Airbnb host-card / reservation-card spec: 14px radius, 24px padding, 1px #dddddd border + single shadow */}
      <div className="flex w-full flex-col items-center gap-4 rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-6 shadow-airbnb">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#f7f7f7] border border-[#ebebeb] text-[#ff385c]">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span className="ty-micro-label font-mono text-[11px] tracking-[0.18em] text-[#6a6a6a] uppercase">
          {code}
        </span>
        <h1 className="ty-display-lg text-balance font-semibold text-[#222222]">
          {title}
        </h1>
        <p className="ty-body-sm text-pretty text-[#6a6a6a]">
          {description}
        </p>
        {badge && (
          <span className="ty-badge mt-1 inline-flex items-center gap-2 rounded-full border border-[#dddddd] bg-[#ffffff] px-3.5 py-1.5 text-[#222222] shadow-airbnb">
            <span className="size-2 animate-pulse rounded-full bg-[#ff385c]" aria-hidden="true" />
            {badge}
          </span>
        )}
      </div>
      {children}
    </main>
  )
}
