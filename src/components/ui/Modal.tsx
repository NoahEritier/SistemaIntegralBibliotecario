import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-background-secondary border border-accent rounded-md shadow-subtle',
          'w-full max-h-[90vh] overflow-y-auto',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-accent">
          <h2 className="text-xl font-display text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-background-primary transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

