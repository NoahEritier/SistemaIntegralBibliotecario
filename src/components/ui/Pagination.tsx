import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  total: number
  limit: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
}: PaginationProps) {
  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-accent pt-4">
      <div className="text-sm text-text-secondary">
        Mostrando {start} - {end} de {total} resultados
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Anterior
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Mostrar primera, última, actual y adyacentes
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
            })
            .map((page, index, array) => {
              // Agregar elipsis si hay gap
              const showEllipsis = index > 0 && array[index - 1] !== page - 1
              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis && (
                    <span className="px-2 text-text-secondary">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={cn(
                      'w-8 h-8 rounded-md text-sm transition-colors',
                      currentPage === page
                        ? 'bg-accent-active text-background-secondary font-medium'
                        : 'bg-background-primary text-text-primary hover:bg-background-secondary border border-accent'
                    )}
                  >
                    {page}
                  </button>
                </div>
              )
            })}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}






