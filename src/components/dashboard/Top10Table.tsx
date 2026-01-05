import { TrendingUp, SearchX } from 'lucide-react'

interface Top10Item {
  id: string
  nombre: string
  cantidad: number
  porcentaje?: number
}

interface Top10TableProps {
  title: string
  items: Top10Item[]
  tipo: 'libros' | 'busquedas'
}

export function Top10Table({ title, items, tipo }: Top10TableProps) {
  const maxCantidad = Math.max(...items.map((i) => i.cantidad), 1)

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {tipo === 'libros' ? (
          <TrendingUp className="w-5 h-5 text-accent-active" />
        ) : (
          <SearchX className="w-5 h-5 text-accent-active" />
        )}
        <h3 className="text-lg font-display text-text-primary">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => {
          const porcentaje = (item.cantidad / maxCantidad) * 100
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-text-primary">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.nombre}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-active transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary font-medium whitespace-nowrap">
                    {item.cantidad}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}




