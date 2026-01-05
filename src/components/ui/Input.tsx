import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2 bg-background-secondary border border-[#D1D1D1] rounded-md',
              'text-text-primary text-sm font-body',
              'focus:outline-none focus:border-accent-active focus:ring-0',
              'placeholder:text-text-secondary',
              'transition-colors',
              error && 'border-error',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'





