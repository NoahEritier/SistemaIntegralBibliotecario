import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui'
import { Pagination } from '@/components/ui'
import { TablaCatalogo } from '@/components/catalogo/TablaCatalogo'
import { FormularioManifestacion } from '@/components/catalogo/FormularioManifestacion'
import { ItemsModal } from '@/components/catalogo/ItemsModal'
import { ImportZ3950Modal } from '@/components/catalogo/ImportZ3950Modal'
import { FiltrosCatalogo } from '@/components/catalogo/FiltrosCatalogo'
import { CatalogacionWizard } from '@/components/catalogo/CatalogacionWizard'
import {
  catalogoService,
  type Manifestacion,
  type SearchParams,
} from '@/services/catalogoService'
import { useDebounce } from '@/hooks/useDebounce'

export function CatalogoPage() {
  const [manifestaciones, setManifestaciones] = useState<Manifestacion[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedManifestacionId, setSelectedManifestacionId] = useState<number | null>(null)
  const [selectedManifestacionTitulo, setSelectedManifestacionTitulo] = useState('')

  // Paginación y filtros
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [filtros, setFiltros] = useState<{
    editorial?: string
    formato?: string
    idioma?: string
  }>({})

  const debouncedSearch = useDebounce(search, 500)

  // Cargar manifestaciones
  const loadManifestaciones = useCallback(async () => {
    setLoading(true)
    try {
      const params: SearchParams = {
        page,
        limit,
        search: debouncedSearch || undefined,
        ...filtros,
      }
      const response = await catalogoService.getManifestaciones(params)
      
      // El servicio devuelve { data: PaginatedResponse }
      // PaginatedResponse tiene { data: Manifestacion[], total, page, limit, totalPages }
      const paginatedData = response.data
      
      setManifestaciones(paginatedData.data || [])
      setTotal(paginatedData.total || 0)
      setTotalPages(paginatedData.totalPages || 0)
    } catch (error) {
      console.error('Error cargando manifestaciones:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, filtros])

  useEffect(() => {
    loadManifestaciones()
  }, [loadManifestaciones])

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filtros])

  const handleCreate = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
    setIsModalOpen(true)
  }

  const handleViewItems = (id: number) => {
    const manifestacion = manifestaciones.find((m) => m.id === id)
    if (manifestacion) {
      setSelectedManifestacionId(id)
      setSelectedManifestacionTitulo(manifestacion.tituloPropio)
      setIsItemsModalOpen(true)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta manifestación?')) {
      try {
        await catalogoService.deleteManifestacion(id)
        await loadManifestaciones()
      } catch (error) {
        console.error('Error eliminando manifestación:', error)
        alert('Error al eliminar la manifestación')
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingId) {
        await catalogoService.updateManifestacion(editingId, data)
      } else {
        await catalogoService.createManifestacion(data)
      }
      setIsModalOpen(false)
      setEditingId(null)
      await loadManifestaciones()
    } catch (error) {
      console.error('Error guardando manifestación:', error)
      alert('Error al guardar la manifestación')
    }
  }

  const handleImportSuccess = async (manifestacion: Manifestacion) => {
    console.log('[CatalogoPage] Libro importado recibido:', manifestacion)
    
    // La manifestación ya fue guardada por el servicio mock
    // Recargar la lista para mostrar el nuevo libro
    // Forzar recarga desde la página 1 para asegurar que se vea el nuevo libro
    setPage(1)
    await loadManifestaciones()
    
    // Esperar un momento para que se actualice el estado
    setTimeout(() => {
      // Verificar que el libro esté en la lista
      const libroEncontrado = manifestaciones.find(m => m.id === manifestacion.id || m.isbnIssn === manifestacion.isbnIssn)
      console.log('[CatalogoPage] Libro encontrado en lista después de recargar:', libroEncontrado)
      console.log('[CatalogoPage] Total de libros en estado:', manifestaciones.length)
      console.log('[CatalogoPage] IDs en estado:', manifestaciones.map(m => ({ id: m.id, titulo: m.tituloPropio })))
      
      if (libroEncontrado) {
        alert(`✅ Libro importado exitosamente!\n\nTítulo: ${manifestacion.tituloPropio}\nAutor: ${manifestacion.autor || 'N/A'}\nISBN: ${manifestacion.isbnIssn || 'N/A'}\n\nEl libro ya está disponible en el catálogo.`)
      } else {
        alert(`✅ Libro importado exitosamente!\n\nTítulo: ${manifestacion.tituloPropio}\nAutor: ${manifestacion.autor || 'N/A'}\nISBN: ${manifestacion.isbnIssn || 'N/A'}\n\nNota: El libro fue guardado. Si no aparece en la lista, recarga la página.`)
      }
    }, 500)
  }

  const manifestacionEditando = editingId
    ? manifestaciones.find((m) => m.id === editingId)
    : null

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-text-primary">Catálogo Bibliográfico</h2>
          <p className="text-sm text-text-secondary mt-1">
            Gestión de manifestaciones y ejemplares
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nueva Catalogación (Wizard FRBR)
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Importar Z39.50
          </Button>
          <Button
            variant="default"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nueva Manifestación
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <FiltrosCatalogo
        search={search}
        onSearchChange={setSearch}
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      {/* Tabla */}
      {loading ? (
        <div className="bg-background-secondary border border-accent rounded-md p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-text-secondary" />
          <p className="text-text-secondary">Cargando manifestaciones...</p>
        </div>
      ) : (
        <>
          <TablaCatalogo
            manifestaciones={manifestaciones}
            onEdit={handleEdit}
            onViewItems={handleViewItems}
            onDelete={handleDelete}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-background-secondary border border-accent rounded-md p-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                total={total}
                limit={limit}
              />
            </div>
          )}
        </>
      )}

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingId(null)
        }}
        title={editingId ? 'Editar Manifestación' : 'Nueva Manifestación'}
        size="xl"
      >
        <FormularioManifestacion
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingId(null)
          }}
          initialData={manifestacionEditando}
        />
      </Modal>

      {/* Modal de Items */}
      {selectedManifestacionId && (
        <ItemsModal
          isOpen={isItemsModalOpen}
          onClose={() => {
            setIsItemsModalOpen(false)
            setSelectedManifestacionId(null)
          }}
          manifestacionId={selectedManifestacionId}
          manifestacionTitulo={selectedManifestacionTitulo}
        />
      )}

      {/* Modal de Importación Z39.50 */}
      <ImportZ3950Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Wizard de Catalogación FRBR */}
      <CatalogacionWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={async (data) => {
          try {
            // Crear la manifestación con los datos del wizard
            const manifestacionData = {
              ...data.manifestacion,
              autor: data.obra.autorPrincipalNombre,
            }
            
            const manifestacion = await catalogoService.createManifestacion(manifestacionData)
            
            // Crear los items asociados
            for (const item of data.items) {
              await catalogoService.createItem(manifestacion.data.id, {
                codigoBarras: item.codigoBarras,
                numeroInventario: item.numeroInventario,
                idUbicacionFisica: item.idUbicacionFisica,
                idEstadoConservacion: item.idEstadoConservacion,
                disponiblePrestamo: true,
              })
            }
            
            alert('✅ Catalogación completada exitosamente')
            setIsWizardOpen(false)
            await loadManifestaciones()
          } catch (error) {
            console.error('Error guardando catalogación:', error)
            alert('Error al guardar la catalogación')
          }
        }}
      />
    </div>
  )
}
