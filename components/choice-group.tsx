import { cn } from '@/lib/utils'

export type ChoiceVariant = 'card-icon' | 'mbti-tile' | 'pill'

type ChoiceGroupProps<T extends string> = {
  name: string
  step: string
  legend: string
  subtitle?: string
  options: readonly T[]
  value: T | null
  onChange: (value: T) => void
  columns?: 2 | 3 | 4
  mono?: boolean
  variant?: ChoiceVariant
  iconMap?: Record<string, string>
  descMap?: Record<string, string>
}

export function ChoiceGroup<T extends string>({
  name,
  step,
  legend,
  subtitle,
  options,
  value,
  onChange,
  columns = 2,
  mono = false,
  variant = 'card-icon',
  iconMap,
  descMap,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-3.5 border-b border-[#ebebeb] pb-7 last:border-b-0">
      <legend className="mb-1 flex w-full items-baseline justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="ty-micro-label tracking-[0.04em] text-[#6a6a6a]">{step}</span>
            <span className="ty-display-sm text-[#222222]">{legend}</span>
          </div>
          {subtitle && <span className="ty-caption-sm text-[#6a6a6a]">{subtitle}</span>}
        </div>
        {value && (
          <span className="ty-badge shrink-0 rounded-full border border-[#dddddd] bg-[#f7f7f7] px-2.5 py-1 text-[#222222]">
            {value}
          </span>
        )}
      </legend>

      {variant === 'pill' ? (
        <div className="flex flex-wrap gap-2">
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
                  'ty-button-sm inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-[#dddddd] bg-[#ffffff] px-4 py-2.5 text-[#222222] transition-all',
                  'hover:border-[#222222]',
                  'peer-checked:border-[#222222] peer-checked:bg-[#222222] peer-checked:text-[#ffffff]',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#222222] peer-focus-visible:ring-offset-2',
                )}
              >
                {iconMap?.[option] && (
                  <span className="text-[15px] leading-none" aria-hidden="true">
                    {iconMap[option]}
                  </span>
                )}
                <span>{option}</span>
              </span>
            </label>
          ))}
        </div>
      ) : variant === 'mbti-tile' ? (
        <div className="grid grid-cols-4 gap-2">
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
                  'flex h-11 cursor-pointer items-center justify-center rounded-full border border-[#dddddd] bg-[#ffffff] px-2 text-center text-[13px] font-semibold tracking-[0.02em] text-[#222222] transition-all',
                  'hover:border-[#222222]',
                  'peer-checked:border-[#222222] peer-checked:bg-[#222222] peer-checked:text-[#ffffff]',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#222222] peer-focus-visible:ring-offset-2',
                  mono && 'font-mono',
                )}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-2.5',
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
                  'flex min-h-[72px] cursor-pointer flex-col items-start justify-between rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-3.5 text-left transition-all',
                  'hover:border-[#222222]',
                  'peer-checked:border-2 peer-checked:border-[#222222] peer-checked:bg-[#f7f7f7] peer-checked:p-[13px]',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#222222] peer-focus-visible:ring-offset-2',
                )}
              >
                {iconMap?.[option] && (
                  <span className="mb-1.5 text-[20px] leading-none" aria-hidden="true">
                    {iconMap[option]}
                  </span>
                )}
                <span className="ty-title-md text-[14px] text-[#222222]">{option}</span>
                {descMap?.[option] && (
                  <span className="ty-caption-sm mt-0.5 text-[12px] text-[#6a6a6a]">
                    {descMap[option]}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
}
