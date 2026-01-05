import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToastStore, Toast } from '@/store/toastStore'
import { cn } from '@/utils/cn'

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast)
  const config = toastConfig[toast.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-[500px]',
        config.bgColor
      )}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <p className={cn('flex-1 text-sm font-medium', config.textColor)}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className={cn(
          'flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors',
          config.textColor
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}

