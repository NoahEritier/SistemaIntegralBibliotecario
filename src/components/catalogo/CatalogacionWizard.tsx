import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Download, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { AutoridadModal } from './AutoridadModal'
import { useAutoridadesStore, Autoridad } from '@/store/autoridadesStore'
import { catalogoService } from '@/services/catalogoService'
import { cn } from '@/utils/cn'

interface ObraData {
  tituloUniforme: string
  idAutorPrincipal: number | null
  autorPrincipalNombre: string
  notasGenerales?: string
}

interface ManifestacionData {
  isbnIssn?: string
  tituloPropio: string
  subtitulo?: string
  idEditorial?: number
  editorialNombre?: string
  numeroEdicion?: string
  lugarPublicacion?: string
  anioPublicacion?: number
  descripcionFisica?: string
  idFormato: number
  idIdioma: number
  idPais?: number
}

interface ItemData {
  codigoBarras: string
  numeroInventario: string
  idUbicacionFisica?: number
  ubicacionFisica?: string
  idEstadoConservacion?: number
  estadoConservacion?: string
}

interface CatalogacionWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: {
    obra: ObraData
    manifestacion: ManifestacionData
    items: ItemData[]
  }) => void
}


const editorialesMock = [
  { value: '1', label: 'Editorial Planeta' },
  { value: '2', label: 'Penguin Random House' },
  { value: '3', label: 'Editorial Sudamericana' },
]

const formatosMock = [
  { value: '1', label: 'Libro Texto' },
  { value: '2', label: 'Best Seller' },
  { value: '3', label: 'DVD' },
  { value: '4', label: 'Sala' },
]

const idiomasMock = [
  { value: '1', label: 'Español' },
  { value: '2', label: 'Inglés' },
  { value: '3', label: 'Francés' },
]

const ubicacionesMock = [
  { value: '1', label: 'Sala A - Estante 1' },
  { value: '2', label: 'Sala A - Estante 2' },
  { value: '3', label: 'Sala B - Estante 1' },
]

const estadosConservacionMock = [
  { value: '1', label: 'Excelente' },
  { value: '2', label: 'Bueno' },
  { value: '3', label: 'Regular' },
  { value: '4', label: 'Requiere Reparación' },
]

export function CatalogacionWizard({
  isOpen,
  onClose,
  onComplete,
}: CatalogacionWizardProps) {
  const [step, setStep] = useState(1)
  const [obraData, setObraData] = useState<ObraData>({
    tituloUniforme: '',
    idAutorPrincipal: null,
    autorPrincipalNombre: '',
  })
  const [manifestacionData, setManifestacionData] = useState<ManifestacionData>({
    tituloPropio: '',
    idFormato: 1,
    idIdioma: 1,
  })
  const [items, setItems] = useState<ItemData[]>([])
  const [busquedaAutoridad, setBusquedaAutoridad] = useState('')
  const [autoridadesEncontradas, setAutoridadesEncontradas] = useState<Autoridad[]>([])
  const [mostrarBusquedaAutoridad, setMostrarBusquedaAutoridad] = useState(false)
  const [isAutoridadModalOpen, setIsAutoridadModalOpen] = useState(false)

  const { buscarAutoridades } = useAutoridadesStore()

  const handleBuscarAutoridad = () => {
    if (busquedaAutoridad.trim()) {
      const encontradas = buscarAutoridades(busquedaAutoridad)
      setAutoridadesEncontradas(encontradas)
      setMostrarBusquedaAutoridad(true)
    } else {
      setAutoridadesEncontradas([])
      setMostrarBusquedaAutoridad(false)
    }
  }

  const handleCrearAutoridad = () => {
    setIsAutoridadModalOpen(true)
  }

  const handleAutoridadCreada = (nuevaAutoridad: Autoridad) => {
    // Seleccionar automáticamente la nueva autoridad creada
    handleSeleccionarAutoridad(nuevaAutoridad)
  }

  const handleSeleccionarAutoridad = (autoridad: Autoridad) => {
    setObraData({
      ...obraData,
      idAutorPrincipal: autoridad.id,
      autorPrincipalNombre: autoridad.nombreNormalizado,
    })
    setMostrarBusquedaAutoridad(false)
    setBusquedaAutoridad('')
  }

  const handleImportarZ3950 = async () => {
    // Simulación de importación Z39.50
    const isbn = prompt('Ingrese el ISBN a importar:')
    if (!isbn) return

    try {
      const response = await catalogoService.importZ3950(isbn)
      const imported = response.data
      
      setManifestacionData({
        ...manifestacionData,
        isbnIssn: imported.isbnIssn,
        tituloPropio: imported.tituloPropio,
        subtitulo: imported.subtitulo,
        anioPublicacion: imported.anioPublicacion,
        lugarPublicacion: imported.lugarPublicacion,
        numeroEdicion: imported.numeroEdicion,
        descripcionFisica: imported.descripcionFisica,
        idFormato: imported.idFormato || manifestacionData.idFormato,
        idIdioma: imported.idIdioma || manifestacionData.idIdioma,
        idEditorial: imported.idEditorial,
        editorialNombre: imported.editorial,
      })

      // Mostrar toast (simulado con alert por ahora)
      alert('✅ Registro importado de BNMM (Biblioteca Nacional Mariano Moreno)')
    } catch (error) {
      console.error('Error importando:', error)
      alert('Error al importar desde Z39.50')
    }
  }

  const handleAgregarItem = () => {
    const nuevoItem: ItemData = {
      codigoBarras: `BAR-${Date.now()}`,
      numeroInventario: `INV-${Date.now()}`,
    }
    setItems([...items, nuevoItem])
  }

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleActualizarItem = (index: number, campo: keyof ItemData, valor: any) => {
    const nuevosItems = [...items]
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor }
    setItems(nuevosItems)
  }

  const handleSiguiente = () => {
    if (step === 1) {
      if (!obraData.tituloUniforme || !obraData.idAutorPrincipal) {
        alert('Por favor complete el título uniforme y seleccione un autor principal')
        return
      }
    } else if (step === 2) {
      if (!manifestacionData.tituloPropio) {
        alert('Por favor complete el título propio')
        return
      }
    }
    setStep(step + 1)
  }

  const handleAnterior = () => {
    setStep(step - 1)
  }

  const handleFinalizar = () => {
    if (items.length === 0) {
      alert('Debe agregar al menos un ítem')
      return
    }
    onComplete({
      obra: obraData,
      manifestacion: manifestacionData,
      items,
    })
    // Resetear formulario
    setStep(1)
    setObraData({ tituloUniforme: '', idAutorPrincipal: null, autorPrincipalNombre: '' })
    setManifestacionData({ tituloPropio: '', idFormato: 1, idIdioma: 1 })
    setItems([])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catalogación Bibliográfica (FRBR)" size="xl">
      <div className="space-y-6">
        {/* Indicador de pasos */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-medium',
                  step >= s
                    ? 'bg-accent-active text-background-secondary'
                    : 'bg-background-primary text-text-secondary border border-accent'
                )}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    step > s ? 'bg-accent-active' : 'bg-accent'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Paso 1: Obra */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display text-text-primary">Paso A: Obra</h3>
            <Input
              label="Título Uniforme"
              value={obraData.tituloUniforme}
              onChange={(e) =>
                setObraData({ ...obraData, tituloUniforme: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Autor Principal
              </label>
              <div className="flex gap-2">
                <Input
                  value={busquedaAutoridad}
                  onChange={(e) => {
                    setBusquedaAutoridad(e.target.value)
                    if (e.target.value.trim()) {
                      handleBuscarAutoridad()
                    } else {
                      setAutoridadesEncontradas([])
                      setMostrarBusquedaAutoridad(false)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleBuscarAutoridad()
                    }
                  }}
                  placeholder="Buscar en tabla de autoridades..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleBuscarAutoridad}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
                <Button
                  type="button"
                  onClick={handleCrearAutoridad}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                  Nueva
                </Button>
              </div>
              {obraData.autorPrincipalNombre && (
                <div className="mt-2 p-2 bg-accent/20 rounded text-sm text-text-primary flex items-center justify-between">
                  <span>
                    Seleccionado: <strong>{obraData.autorPrincipalNombre}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setObraData({
                        ...obraData,
                        idAutorPrincipal: null,
                        autorPrincipalNombre: '',
                      })
                    }}
                    className="text-xs text-accent-active hover:underline ml-4"
                  >
                    Cambiar
                  </button>
                </div>
              )}
              {mostrarBusquedaAutoridad && (
                <div className="mt-2 border border-accent rounded-md max-h-40 overflow-y-auto">
                  {autoridadesEncontradas.length > 0 ? (
                    autoridadesEncontradas.map((autoridad) => (
                      <div
                        key={autoridad.id}
                        className="p-2 hover:bg-background-primary cursor-pointer border-b border-accent last:border-0"
                        onClick={() => handleSeleccionarAutoridad(autoridad)}
                      >
                        <div className="text-sm text-text-primary">
                          {autoridad.nombreNormalizado}
                        </div>
                        <div className="text-xs text-text-secondary">{autoridad.tipo}</div>
                      </div>
                    ))
                  ) : busquedaAutoridad.trim() ? (
                    <div className="p-4 text-center text-sm text-text-secondary">
                      <p>No se encontraron autoridades</p>
                      <button
                        type="button"
                        onClick={handleCrearAutoridad}
                        className="mt-2 text-accent-active hover:underline"
                      >
                        Crear nueva autoridad
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <Input
              label="Notas Generales (Opcional)"
              value={obraData.notasGenerales || ''}
              onChange={(e) =>
                setObraData({ ...obraData, notasGenerales: e.target.value })
              }
            />
          </div>
        )}

        {/* Paso 2: Manifestación */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display text-text-primary">Paso B: Manifestación</h3>
              <Button
                type="button"
                variant="outline"
                onClick={handleImportarZ3950}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Importar Z39.50
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ISBN/ISSN"
                value={manifestacionData.isbnIssn || ''}
                onChange={(e) =>
                  setManifestacionData({ ...manifestacionData, isbnIssn: e.target.value })
                }
              />
              <Input
                label="Título Propio"
                value={manifestacionData.tituloPropio}
                onChange={(e) =>
                  setManifestacionData({ ...manifestacionData, tituloPropio: e.target.value })
                }
                required
              />
              <Input
                label="Subtítulo"
                value={manifestacionData.subtitulo || ''}
                onChange={(e) =>
                  setManifestacionData({ ...manifestacionData, subtitulo: e.target.value })
                }
              />
              <Select
                label="Editorial"
                value={manifestacionData.idEditorial?.toString() || ''}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    idEditorial: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                <option value="">Seleccionar...</option>
                {editorialesMock.map((ed) => (
                  <option key={ed.value} value={ed.value}>
                    {ed.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Número de Edición"
                value={manifestacionData.numeroEdicion || ''}
                onChange={(e) =>
                  setManifestacionData({ ...manifestacionData, numeroEdicion: e.target.value })
                }
              />
              <Input
                label="Año de Publicación"
                type="number"
                value={manifestacionData.anioPublicacion || ''}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    anioPublicacion: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
              <Input
                label="Lugar de Publicación"
                value={manifestacionData.lugarPublicacion || ''}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    lugarPublicacion: e.target.value,
                  })
                }
              />
              <Input
                label="Descripción Física"
                value={manifestacionData.descripcionFisica || ''}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    descripcionFisica: e.target.value,
                  })
                }
                placeholder="Ej: 300 p.; 23 cm"
              />
              <Select
                label="Formato"
                value={manifestacionData.idFormato.toString()}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    idFormato: parseInt(e.target.value),
                  })
                }
                required
              >
                {formatosMock.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Idioma"
                value={manifestacionData.idIdioma.toString()}
                onChange={(e) =>
                  setManifestacionData({
                    ...manifestacionData,
                    idIdioma: parseInt(e.target.value),
                  })
                }
                required
              >
                {idiomasMock.map((idioma) => (
                  <option key={idioma.value} value={idioma.value}>
                    {idioma.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Paso 3: Items */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display text-text-primary">Paso C: Ítems</h3>
              <Button type="button" onClick={handleAgregarItem}>
                + Agregar Ítem
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                No hay ítems agregados. Haga clic en "Agregar Ítem" para comenzar.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-accent rounded-md bg-background-primary"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-primary">Ítem #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarItem(index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Código de Barras"
                        value={item.codigoBarras}
                        onChange={(e) =>
                          handleActualizarItem(index, 'codigoBarras', e.target.value)
                        }
                      />
                      <Input
                        label="Número de Inventario"
                        value={item.numeroInventario}
                        onChange={(e) =>
                          handleActualizarItem(index, 'numeroInventario', e.target.value)
                        }
                      />
                      <Select
                        label="Ubicación Física"
                        value={item.idUbicacionFisica?.toString() || ''}
                        onChange={(e) =>
                          handleActualizarItem(
                            index,
                            'idUbicacionFisica',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {ubicacionesMock.map((ubic) => (
                          <option key={ubic.value} value={ubic.value}>
                            {ubic.label}
                          </option>
                        ))}
                      </Select>
                      <Select
                        label="Estado de Conservación"
                        value={item.idEstadoConservacion?.toString() || ''}
                        onChange={(e) =>
                          handleActualizarItem(
                            index,
                            'idEstadoConservacion',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      >
                        <option value="">Seleccionar...</option>
                        {estadosConservacionMock.map((estado) => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex items-center justify-between pt-4 border-t border-accent">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? onClose : handleAnterior}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleSiguiente}
              className="flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinalizar}>
              Finalizar Catalogación
            </Button>
          )}
        </div>
      </div>

      {/* Modal de creación de autoridad */}
      <AutoridadModal
        isOpen={isAutoridadModalOpen}
        onClose={() => setIsAutoridadModalOpen(false)}
        autoridad={null}
        onAutoridadCreada={handleAutoridadCreada}
      />
    </Modal>
  )
}

