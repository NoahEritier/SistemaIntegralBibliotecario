import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: Array<{ value: string; label: string }>
  children?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-background-secondary border border-[#D1D1D1] rounded-md',
            'text-text-primary text-sm font-body',
            'focus:outline-none focus:border-accent-active focus:ring-0',
            'transition-colors cursor-pointer',
            error && 'border-error',
            className
          )}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

