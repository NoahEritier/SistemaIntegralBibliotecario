import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-background-secondary border border-[#D1D1D1] rounded-md',
            'text-text-primary text-sm font-body',
            'focus:outline-none focus:border-accent-active focus:ring-0',
            'placeholder:text-text-secondary',
            'transition-colors resize-none',
            error && 'border-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'






