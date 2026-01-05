import { Search, X } from 'lucide-react'
import { Input, Select, Button } from '@/components/ui'
import { catalogoService } from '@/services/catalogoService'
import { useState, useEffect } from 'react'

interface FiltrosCatalogoProps {
  search: string
  onSearchChange: (value: string) => void
  filtros: {
    editorial?: string
    formato?: string
    idioma?: string
  }
  onFiltrosChange: (filtros: {
    editorial?: string
    formato?: string
    idioma?: string
  }) => void
}

export function FiltrosCatalogo({
  search,
  onSearchChange,
  filtros,
  onFiltrosChange,
}: FiltrosCatalogoProps) {
  const [editoriales, setEditoriales] = useState<Array<{ id: number; nombre: string }>>([])
  const [formatos, setFormatos] = useState<Array<{ id: number; nombre: string }>>([])
  const [idiomas, setIdiomas] = useState<Array<{ id: number; nombre: string }>>([])
  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    try {
      const [editorialesRes, formatosRes, idiomasRes] = await Promise.all([
        catalogoService.getEditoriales(),
        catalogoService.getFormatos(),
        catalogoService.getIdiomas(),
      ])
      // El servicio devuelve { data: Array } directamente
      setEditoriales(editorialesRes.data || [])
      setFormatos(formatosRes.data || [])
      setIdiomas(idiomasRes.data || [])
    } catch (error) {
      console.error('Error cargando opciones:', error)
      // Usar datos mock como fallback
      setEditoriales([
        { id: 1, nombre: 'Editorial Planeta' },
        { id: 2, nombre: 'Penguin Random House' },
        { id: 3, nombre: 'Editorial Sudamericana' },
      ])
      setFormatos([
        { id: 1, nombre: 'Libro' },
        { id: 2, nombre: 'Revista' },
        { id: 3, nombre: 'DVD' },
        { id: 4, nombre: 'CD' },
      ])
      setIdiomas([
        { id: 1, nombre: 'Español' },
        { id: 2, nombre: 'Inglés' },
        { id: 3, nombre: 'Francés' },
      ])
    }
  }

  const handleClearFilters = () => {
    onSearchChange('')
    onFiltrosChange({})
  }

  const hasActiveFilters = search || filtros.editorial || filtros.formato || filtros.idioma

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-4 space-y-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          placeholder="Buscar por título, autor o ISBN..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Editorial"
          options={[
            { value: '', label: 'Todas' },
            ...editoriales.map((e) => ({ value: e.nombre, label: e.nombre })),
          ]}
          value={filtros.editorial || ''}
          onChange={(e) =>
            onFiltrosChange({
              ...filtros,
              editorial: e.target.value || undefined,
            })
          }
        />
        <Select
          label="Formato"
          options={[
            { value: '', label: 'Todos' },
            ...formatos.map((f) => ({ value: f.nombre, label: f.nombre })),
          ]}
          value={filtros.formato || ''}
          onChange={(e) =>
            onFiltrosChange({
              ...filtros,
              formato: e.target.value || undefined,
            })
          }
        />
        <Select
          label="Idioma"
          options={[
            { value: '', label: 'Todos' },
            ...idiomas.map((i) => ({ value: i.nombre, label: i.nombre })),
          ]}
          value={filtros.idioma || ''}
          onChange={(e) =>
            onFiltrosChange({
              ...filtros,
              idioma: e.target.value || undefined,
            })
          }
        />
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  )
}
