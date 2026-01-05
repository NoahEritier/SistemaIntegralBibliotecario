import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'bg-background-secondary border border-accent rounded-md p-6',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-display text-text-primary">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-md border border-accent flex items-center justify-center bg-background-primary">
          <Icon className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-error'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-xs text-text-secondary">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}






