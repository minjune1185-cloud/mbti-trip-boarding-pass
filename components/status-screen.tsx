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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-border bg-card px-6 py-10">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted text-accent">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-muted-foreground">{code}</span>
        <h1 className="text-balance text-[22px] font-black leading-snug">{title}</h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            {badge}
          </span>
        )}
      </div>
      {children}
    </main>
  )
}
