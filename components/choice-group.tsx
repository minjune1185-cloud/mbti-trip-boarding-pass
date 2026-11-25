import { cn } from '@/lib/utils'

type ChoiceGroupProps<T extends string> = {
  name: string
  step: string
  legend: string
  options: readonly T[]
  value: T | null
  onChange: (value: T) => void
  columns?: 2 | 3 | 4
  mono?: boolean
}

export function ChoiceGroup<T extends string>({
  name,
  step,
  legend,
  options,
  value,
  onChange,
  columns = 2,
  mono = false,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex w-full items-center gap-2">
        <span className="font-mono text-[11px] font-semibold tracking-widest text-accent">{step}</span>
        <span className="text-[15px] font-bold">{legend}</span>
        {value && (
          <span className="ml-auto truncate text-xs font-medium text-muted-foreground">{value}</span>
        )}
      </legend>
      <div
        className={cn(
          'grid gap-2',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-3',
          columns === 4 && 'grid-cols-4',
        )}
      >
        {options.map((option) => (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-2 py-2.5 text-center text-sm font-medium leading-tight transition-colors',
                'hover:border-primary/40',
                'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                mono && 'font-mono text-[13px] tracking-wide',
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
