import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-out',
          'opacity-100'
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background-primary',
          'border-l border-accent shadow-2xl z-50',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent">
          {title && (
            <h2 className="text-xl font-display text-text-primary">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-background-secondary transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  )
}

