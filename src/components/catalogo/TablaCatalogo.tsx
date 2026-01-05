import { Edit, Eye, Trash2 } from 'lucide-react'
import type { Manifestacion } from '@/services/catalogoService'

interface TablaCatalogoProps {
  manifestaciones: Manifestacion[]
  onEdit: (id: number) => void
  onViewItems: (id: number) => void
  onDelete: (id: number) => void
}

export function TablaCatalogo({
  manifestaciones,
  onEdit,
  onViewItems,
  onDelete,
}: TablaCatalogoProps) {
  if (manifestaciones.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-8 text-center">
        <p className="text-text-secondary">No hay manifestaciones en el catálogo</p>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background-primary border-b border-accent">
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Portada</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Título</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Autor</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Editorial</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">ISBN</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Stock Disponible</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-sm font-display text-accent-active">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {manifestaciones.map((manifestacion) => (
              <tr
                key={manifestacion.id}
                className="border-b border-accent hover:bg-background-primary transition-colors"
              >
                <td className="px-4 py-4">
                  {manifestacion.portada ? (
                    <img
                      src={manifestacion.portada}
                      alt={manifestacion.tituloPropio}
                      className="w-12 h-16 object-cover rounded border border-accent"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-background-primary border border-accent rounded flex items-center justify-center">
                      <span className="text-xs text-text-secondary">Sin imagen</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary font-medium">
                    {manifestacion.tituloPropio}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-secondary">
                    {manifestacion.autor || '-'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-secondary">
                    {manifestacion.editorial || '-'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-secondary font-mono">
                    {manifestacion.isbnIssn || '-'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-md ${
                        (manifestacion.stockDisponible || 0) > 0
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {manifestacion.stockDisponible || 0}
                    </span>
                    <span className="text-xs text-text-secondary">
                      disponible{manifestacion.stockDisponible !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(manifestacion.id)}
                      className="p-1.5 rounded-md hover:bg-background-primary transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => onViewItems(manifestacion.id)}
                      className="p-1.5 rounded-md hover:bg-background-primary transition-colors"
                      title="Ver Items"
                    >
                      <Eye className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => onDelete(manifestacion.id)}
                      className="p-1.5 rounded-md hover:bg-background-primary transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-error" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

