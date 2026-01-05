import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, FileText } from 'lucide-react'
import { useArchivoStore, UnidadArchivistica, NivelDescripcion } from '@/store/archivoStore'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

interface TreeNodeProps {
  unidad: UnidadArchivistica
  nivel: number
  onSelect: (id: number) => void
  onAddChild: (idPadre: number) => void
  selectedId: number | null
}

function TreeNode({ unidad, nivel, onSelect, onAddChild, selectedId }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(nivel < 2) // Expandir primeros niveles por defecto
  const isSelected = selectedId === unidad.id
  const hasChildren = unidad.hijos.length > 0

  const iconosNivel: Record<NivelDescripcion, { icon: typeof Folder; color: string }> = {
    Fondo: { icon: Folder, color: 'text-blue-600' },
    Subfondo: { icon: Folder, color: 'text-green-600' },
    Sección: { icon: Folder, color: 'text-yellow-600' },
    Serie: { icon: Folder, color: 'text-orange-600' },
    'Unidad Documental': { icon: FileText, color: 'text-purple-600' },
  }

  const icono = iconosNivel[unidad.nivelDescripcion]
  const Icon = isExpanded ? FolderOpen : icono.icon

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group hover:bg-background-primary transition-colors',
          isSelected && 'bg-accent/20 border border-accent-active',
          !isSelected && 'border border-transparent'
        )}
        style={{ paddingLeft: `${nivel * 1.5 + 0.5}rem` }}
        onClick={() => onSelect(unidad.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5 hover:bg-background-secondary rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <Icon className={cn('w-4 h-4 flex-shrink-0', icono.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-secondary">
              {unidad.codigoReferencia}
            </span>
            <span className="text-sm font-medium text-text-primary truncate">
              {unidad.titulo}
            </span>
          </div>
          <div className="text-xs text-text-secondary">{unidad.nivelDescripcion}</div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddChild(unidad.id)
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background-secondary rounded transition-opacity"
          title="Agregar unidad hija"
        >
          <Plus className="w-3 h-3 text-accent-active" />
        </button>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {unidad.hijos.map((hijo) => (
            <TreeNode
              key={hijo.id}
              unidad={hijo}
              nivel={nivel + 1}
              onSelect={onSelect}
              onAddChild={onAddChild}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ArchivoTreeViewProps {
  onAddRoot: () => void
}

export function ArchivoTreeView({ onAddRoot }: ArchivoTreeViewProps) {
  const { unidades, unidadSeleccionada, seleccionarUnidad, agregarUnidad, generarCodigoReferencia } =
    useArchivoStore()

  const handleAddChild = (idPadre: number) => {
    const codigoReferencia = generarCodigoReferencia(idPadre)
    
    // Determinar nivel según el padre
    const buscarUnidad = (
      unidades: UnidadArchivistica[],
      id: number
    ): UnidadArchivistica | null => {
      for (const unidad of unidades) {
        if (unidad.id === id) return unidad
        const encontrada = buscarUnidad(unidad.hijos, id)
        if (encontrada) return encontrada
      }
      return null
    }

    const padre = buscarUnidad(unidades, idPadre)
    if (!padre) return

    const siguienteNivel: NivelDescripcion =
      padre.nivelDescripcion === 'Fondo'
        ? 'Subfondo'
        : padre.nivelDescripcion === 'Subfondo'
          ? 'Sección'
          : padre.nivelDescripcion === 'Sección'
            ? 'Serie'
            : 'Unidad Documental'

    const nuevoId = Date.now()
    agregarUnidad({
      idPadre,
      codigoReferencia,
      titulo: `Nueva ${siguienteNivel}`,
      idNivelDescripcion: siguienteNivel === 'Subfondo' ? 2 : siguienteNivel === 'Sección' ? 3 : siguienteNivel === 'Serie' ? 4 : 5,
      nivelDescripcion: siguienteNivel,
    })

    // La nueva unidad se seleccionará automáticamente cuando se actualice el estado
    // El store maneja la selección internamente
  }

  return (
    <div className="h-full flex flex-col bg-background-secondary border border-accent rounded-md">
      <div className="p-4 border-b border-accent flex items-center justify-between">
        <h3 className="text-lg font-display text-text-primary">Estructura Archivística</h3>
        <Button size="sm" onClick={onAddRoot}>
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Fondo
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {unidades.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p className="mb-2">No hay unidades archivísticas</p>
            <Button size="sm" onClick={onAddRoot}>
              Crear primer fondo
            </Button>
          </div>
        ) : (
          unidades.map((unidad) => (
            <TreeNode
              key={unidad.id}
              unidad={unidad}
              nivel={0}
              onSelect={seleccionarUnidad}
              onAddChild={handleAddChild}
              selectedId={unidadSeleccionada?.id || null}
            />
          ))
        )}
      </div>
    </div>
  )
}

