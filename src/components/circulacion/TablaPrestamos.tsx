import { useCirculacionStore } from '@/store/circulacionStore'
import { DataTable, Column } from '@/components/ui/DataTable'
import { cn } from '@/utils/cn'
import { Calendar, User, Book, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export function TablaPrestamos() {
  const { getAllPrestamos } = useCirculacionStore()
  const prestamos = getAllPrestamos()

  const columns: Column<typeof prestamos[0]>[] = [
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (value: string) => {
        const estados = {
          Activo: 'bg-green-100 text-green-800',
          Vencido: 'bg-red-100 text-red-800',
          Devuelto: 'bg-blue-100 text-blue-800',
          'Devuelto Tardío': 'bg-orange-100 text-orange-800',
        }
        const iconos = {
          Activo: CheckCircle,
          Vencido: AlertCircle,
          Devuelto: CheckCircle,
          'Devuelto Tardío': AlertCircle,
        }
        const Icono = iconos[value as keyof typeof iconos] || Clock
        return (
          <span
            className={cn(
              'px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit',
              estados[value as keyof typeof estados] || 'bg-gray-100 text-gray-800'
            )}
          >
            <Icono className="w-3 h-3" />
            {value}
          </span>
        )
      },
    },
    {
      key: 'nombreUsuario',
      header: 'Usuario',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-text-secondary" />
          <div>
            <div className="text-sm text-text-primary font-medium">
              {row.nombreUsuario} {row.apellidoUsuario}
            </div>
            <div className="text-xs text-text-secondary">DNI: {row.legajoDni}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'titulo',
      header: 'Material',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 text-text-secondary" />
          <div>
            <div className="text-sm text-text-primary font-medium">{row.titulo}</div>
            {row.autor && <div className="text-xs text-text-secondary">{row.autor}</div>}
            {row.codigoBarras && (
              <div className="text-xs text-text-secondary">Código: {row.codigoBarras}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'fechaPrestamo',
      header: 'Fecha Préstamo',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Calendar className="w-3 h-3" />
          {new Date(value).toLocaleDateString('es-AR')}
          <span className="text-xs ml-1">
            {new Date(value).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'fechaVencimiento',
      header: 'Fecha Vencimiento',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Calendar className="w-3 h-3" />
          {new Date(value).toLocaleDateString('es-AR')}
        </div>
      ),
    },
    {
      key: 'fechaDevolucion',
      header: 'Fecha Devolución',
      sortable: true,
      render: (value?: string) => {
        if (!value) return <span className="text-sm text-text-secondary">-</span>
        return (
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <Calendar className="w-3 h-3" />
            {new Date(value).toLocaleDateString('es-AR')}
            <span className="text-xs ml-1">
              {new Date(value).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )
      },
    },
    {
      key: 'renovacionesContador',
      header: 'Renovaciones',
      render: (value: number) => (
        <span className="text-sm text-text-secondary">{value}</span>
      ),
    },
  ]

  if (prestamos.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-8 text-center">
        <Book className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
        <p className="text-text-secondary">No hay préstamos registrados</p>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md">
      <DataTable data={prestamos} columns={columns} pageSize={10} searchable={true} />
    </div>
  )
}



