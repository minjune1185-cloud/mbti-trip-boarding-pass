import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ChoiceVariant = 'card-icon' | 'mbti-tile' | 'pill'

type ChoiceGroupProps<T extends string> = {
  name: string
  step: string
  legend: string
  subtitle?: string
  collapsedLabel?: string
  options: readonly T[]
  value: T | null
  onChange: (value: T) => void
  columns?: 2 | 3 | 4
  mono?: boolean
  variant?: ChoiceVariant
  iconMap?: Record<string, string>
  descMap?: Record<string, string>
  open?: boolean
  onToggle?: () => void
}

export function ChoiceGroup<T extends string>({
  name,
  step,
  legend,
  subtitle,
  collapsedLabel,
  options,
  value,
  onChange,
  columns = 2,
  mono = false,
  variant = 'card-icon',
  iconMap,
  descMap,
  open = true,
  onToggle,
}: ChoiceGroupProps<T>) {
  // Collapsed Airbnb Search Step Card (like Where / When / Who accordion cards)
  if (!open && onToggle) {
    return (
      <div className="rounded-[20px] border border-[#dddddd] bg-[#ffffff] px-5 py-4 shadow-airbnb transition-all">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline-none"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-[11px] font-bold',
                value
                  ? 'bg-[#222222] text-[#ffffff]'
                  : 'border border-[#dddddd] bg-[#f7f7f7] text-[#6a6a6a]',
              )}
            >
              {value ? <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" /> : step}
            </span>
            <span className="ty-caption font-semibold text-[#6a6a6a]">
              {collapsedLabel ?? legend}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'ty-caption font-semibold',
                value ? 'text-[#222222]' : 'text-[#929292]',
              )}
            >
              {value ? (
                <span className="inline-flex items-center gap-1">
                  {iconMap?.[value] && <span aria-hidden="true">{iconMap[value]}</span>}
                  <span>{value}</span>
                </span>
              ) : (
                '선택하기'
              )}
            </span>
            <ChevronDown className="size-4 text-[#6a6a6a]" aria-hidden="true" />
          </div>
        </button>
      </div>
    )
  }

  // Expanded Airbnb Search Step Card (20px radius, 24px padding, single shadow elevation)
  return (
    <fieldset className="flex flex-col gap-4 rounded-[20px] border border-[#dddddd] bg-[#ffffff] p-5 shadow-airbnb transition-all">
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="ty-micro-label inline-flex items-center rounded-full bg-[#f7f7f7] border border-[#ebebeb] px-2.5 py-0.5 text-[11px] tracking-[0.04em] text-[#222222]">
              STEP {step}
            </span>
            {value && (
              <span className="ty-badge inline-flex items-center gap-1 rounded-full bg-[#222222] px-2.5 py-0.5 text-[#ffffff]">
                <Check className="size-3 stroke-[2.5]" aria-hidden="true" />
                {value}
              </span>
            )}
          </div>
          <legend className="ty-display-sm mt-1 text-[20px] text-[#222222]">{legend}</legend>
          {subtitle && <p className="ty-caption-sm text-[#6a6a6a]">{subtitle}</p>}
        </div>

        {onToggle && value && (
          <button
            type="button"
            onClick={onToggle}
            className="ty-caption-sm shrink-0 font-semibold text-[#6a6a6a] underline underline-offset-4 hover:text-[#222222]"
          >
            접기
          </button>
        )}
      </div>

      {variant === 'pill' ? (
        <div className="flex flex-wrap gap-2 pt-1">
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
                  'ty-button-sm inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#dddddd] bg-[#ffffff] px-4 py-2.5 text-[#222222] transition-all',
                  'hover:border-[#222222]',
                  'peer-checked:border-[#222222] peer-checked:bg-[#222222] peer-checked:text-[#ffffff]',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#222222] peer-focus-visible:ring-offset-2',
                )}
              >
                {iconMap?.[option] && (
                  <span className="text-[16px] leading-none" aria-hidden="true">
                    {iconMap[option]}
                  </span>
                )}
                <span>{option}</span>
              </span>
            </label>
          ))}
        </div>
      ) : variant === 'mbti-tile' ? (
        <div className="grid grid-cols-4 gap-2 pt-1">
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
            'grid gap-2.5 pt-1',
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
                  'flex min-h-[76px] cursor-pointer flex-col items-start justify-between rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-3.5 text-left transition-all',
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
