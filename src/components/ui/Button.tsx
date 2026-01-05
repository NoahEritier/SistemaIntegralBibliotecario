import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-active',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          {
            'border border-accent bg-background-secondary text-text-primary hover:border-accent-active':
              variant === 'default',
            'border border-accent bg-transparent text-text-primary hover:bg-background-primary':
              variant === 'outline',
            'border-transparent bg-transparent text-text-primary hover:bg-background-primary':
              variant === 'ghost',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'



