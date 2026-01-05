import { useState, useEffect } from 'react'
import { Search, Book, Archive, Filter, X } from 'lucide-react'
import { useBusquedaStore, ResultadoBusqueda } from '@/store/busquedaStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { LibroDetallePanel } from './LibroDetallePanel'
import { useDebounce } from '@/hooks/useDebounce'
import { useToastStore } from '@/store/toastStore'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { useCirculacionStore } from '@/store/circulacionStore'
import { cn } from '@/utils/cn'

export function BuscadorOPAC() {
  const {
    resultados,
    filtros,
    buscar,
    setFiltros,
    limpiarFiltros,
    obtenerAutoresUnicos,
    obtenerAniosUnicos,
  } = useBusquedaStore()
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [haBuscado, setHaBuscado] = useState(false)
  const [libroSeleccionado, setLibroSeleccionado] = useState<ResultadoBusqueda | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { success, error, warning } = useToastStore()
  const { usuarioActual } = useUsuarioPublicoStore()
  const { crearPrestamo, buscarItem } = useCirculacionStore()
  const [procesandoId, setProcesandoId] = useState<number | null>(null)

  const debouncedTermino = useDebounce(terminoBusqueda, 500)

  const autoresUnicos = obtenerAutoresUnicos()
  const aniosUnicos = obtenerAniosUnicos()

  // Búsqueda automática con debounce
  useEffect(() => {
    if (debouncedTermino.trim()) {
      buscar(debouncedTermino, filtros)
      setHaBuscado(true)
    } else if (haBuscado && !debouncedTermino.trim()) {
      // Si se borra el término de búsqueda, limpiar resultados
      setHaBuscado(false)
    }
  }, [debouncedTermino, filtros])

  const handleBuscar = () => {
    if (!terminoBusqueda.trim()) return
    buscar(terminoBusqueda, filtros)
    setHaBuscado(true)
  }

  // Aplicar filtros cuando cambian
  const handleFiltroChange = (nuevoFiltro: Partial<typeof filtros>) => {
    const nuevosFiltros = { ...filtros, ...nuevoFiltro }
    setFiltros(nuevoFiltro)
    if (terminoBusqueda.trim()) {
      buscar(terminoBusqueda, nuevosFiltros)
      setHaBuscado(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar()
    }
  }

  const handleLibroClick = (libro: ResultadoBusqueda) => {
    setLibroSeleccionado(libro)
    setIsPanelOpen(true)
  }

  const handlePrestamo = async (libro: ResultadoBusqueda, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!usuarioActual) {
      warning('Debe iniciar sesión para solicitar un préstamo')
      return
    }

    if (!libro.disponible) {
      error('Este libro no está disponible para préstamo')
      return
    }

    setProcesandoId(libro.id)

    try {
      const codigoBarras = `BAR-${String(libro.id).padStart(3, '0')}`
      const item = await buscarItem(codigoBarras)

      if (!item) {
        error('No se pudo encontrar el ejemplar del libro')
        setProcesandoId(null)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      const nuevoPrestamo = crearPrestamo(item.id, usuarioActual.id)

      if (nuevoPrestamo) {
        success(
          `Préstamo solicitado exitosamente. Fecha de vencimiento: ${new Date(
            nuevoPrestamo.fechaVencimiento
          ).toLocaleDateString('es-AR')}`
        )
      } else {
        error('No se pudo procesar el préstamo')
      }
    } catch (err) {
      error('Error al procesar el préstamo')
    } finally {
      setProcesandoId(null)
    }
  }

  const handleReserva = async (libro: ResultadoBusqueda, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!usuarioActual) {
      warning('Debe iniciar sesión para hacer una reserva')
      return
    }

    setProcesandoId(libro.id)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const fechaVencimiento = new Date()
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 15)

      success(
        `Reserva realizada exitosamente. La reserva vence el ${fechaVencimiento.toLocaleDateString(
          'es-AR'
        )}. Se le notificará cuando el libro esté disponible.`
      )
    } catch (err) {
      error('Error al procesar la reserva')
    } finally {
      setProcesandoId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda Principal */}
      <div className="bg-background-secondary border border-accent rounded-md p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-display text-text-primary mb-2 text-center">
            Catálogo Público (OPAC)
          </h1>
          <p className="text-center text-text-secondary mb-6">
            Busque en libros y documentos del archivo histórico
          </p>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar por título, autor, ISBN, código de referencia..."
                className="pl-10 text-lg"
              />
            </div>
            <Button onClick={handleBuscar} size="lg">
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={cn(mostrarFiltros && 'bg-accent/20')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Panel lateral de detalles */}
      <LibroDetallePanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          setLibroSeleccionado(null)
        }}
        libro={libroSeleccionado}
      />

      <div className="flex gap-6">
        {/* Sidebar de Filtros */}
        {mostrarFiltros && (
          <div className="w-64 flex-shrink-0 bg-background-secondary border border-accent rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display text-text-primary">Filtros</h3>
              <button
                onClick={() => {
                  limpiarFiltros()
                  if (haBuscado && terminoBusqueda.trim()) {
                    buscar(terminoBusqueda, {})
                  }
                }}
                className="text-xs text-accent-active hover:underline"
              >
                Limpiar
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label="Tipo de Resultado"
                value={filtros.tipoResultado || 'todos'}
                onChange={(e) =>
                  handleFiltroChange({
                    tipoResultado: e.target.value === 'todos' ? undefined : (e.target.value as any),
                  })
                }
              >
                <option value="todos">Todos</option>
                <option value="biblioteca">Biblioteca</option>
                <option value="archivo">Archivo Histórico</option>
              </Select>

              <Select
                label="Autor"
                value={filtros.autor || ''}
                onChange={(e) => handleFiltroChange({ autor: e.target.value || undefined })}
              >
                <option value="">Todos los autores</option>
                {autoresUnicos.map((autor) => (
                  <option key={autor} value={autor}>
                    {autor}
                  </option>
                ))}
              </Select>

              <Select
                label="Año"
                value={filtros.anio?.toString() || ''}
                onChange={(e) =>
                  handleFiltroChange({
                    anio: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                <option value="">Todos los años</option>
                {aniosUnicos.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </Select>

              <Select
                label="Tipo de Material"
                value={filtros.tipoMaterial || ''}
                onChange={(e) =>
                  handleFiltroChange({ tipoMaterial: e.target.value || undefined })
                }
              >
                <option value="">Todos los tipos</option>
                <option value="Libro Texto">Libro Texto</option>
                <option value="Best Seller">Best Seller</option>
                <option value="DVD">DVD</option>
                <option value="Sala">Sala</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Disponibilidad
                </label>
                <select
                  value={filtros.disponible === undefined ? '' : filtros.disponible.toString()}
                  onChange={(e) =>
                    handleFiltroChange({
                      disponible:
                        e.target.value === '' ? undefined : e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 bg-background-secondary border border-accent rounded-md text-text-primary text-sm"
                >
                  <option value="">Todas</option>
                  <option value="true">Disponible</option>
                  <option value="false">No disponible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        <div className="flex-1">
              {!haBuscado ? (
            <div className="bg-background-secondary border border-accent rounded-md p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
              <p className="text-text-secondary">
                Ingrese un término de búsqueda para comenzar
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Busque libros, documentos del archivo histórico, autores y más
              </p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="bg-background-secondary border border-accent rounded-md p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
              <p className="text-text-secondary">
                No se encontraron resultados para su búsqueda
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setTerminoBusqueda('')
                  limpiarFiltros()
                  setHaBuscado(false)
                }}
                className="mt-4"
              >
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  {resultados.length} resultado(s) encontrado(s)
                </p>
              </div>

              {resultados.map((resultado) => (
                <ResultadoCard
                  key={resultado.id}
                  resultado={resultado}
                  onClick={() => handleLibroClick(resultado)}
                  onPrestamo={(e) => handlePrestamo(resultado, e)}
                  onReserva={(e) => handleReserva(resultado, e)}
                  procesando={procesandoId === resultado.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultadoCard({
  resultado,
  onClick,
  onPrestamo,
  onReserva,
  procesando,
}: {
  resultado: ResultadoBusqueda
  onClick: () => void
  onPrestamo: (e: React.MouseEvent) => void
  onReserva: (e: React.MouseEvent) => void
  procesando: boolean
}) {
  const esBiblioteca = resultado.tipo === 'biblioteca'
  const puedePrestar = esBiblioteca && resultado.disponible !== undefined

  return (
    <div
      onClick={onClick}
      className="bg-background-secondary border border-accent rounded-md p-6 hover:border-accent-active transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'p-3 rounded-md flex-shrink-0',
            esBiblioteca ? 'bg-blue-100' : 'bg-amber-100'
          )}
        >
          {esBiblioteca ? (
            <Book className="w-6 h-6 text-blue-600" />
          ) : (
            <Archive className="w-6 h-6 text-amber-600" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-display text-text-primary">{resultado.titulo}</h3>
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                esBiblioteca
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              )}
            >
              {esBiblioteca ? 'Biblioteca' : 'Archivo Histórico'}
            </span>
          </div>

          <div className="space-y-1 text-sm text-text-secondary mb-4">
            {resultado.autor && <p>Autor: {resultado.autor}</p>}
            {resultado.anio && <p>Año: {resultado.anio}</p>}
            {resultado.codigoReferencia && (
              <p className="font-mono">Código: {resultado.codigoReferencia}</p>
            )}
            {resultado.nivelDescripcion && <p>Nivel: {resultado.nivelDescripcion}</p>}
            {resultado.tipoMaterial && <p>Tipo: {resultado.tipoMaterial}</p>}
            {resultado.disponible !== undefined && (
              <p>
                Disponible:{' '}
                <span
                  className={cn(
                    'font-medium',
                    resultado.disponible ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {resultado.disponible ? 'Sí' : 'No'}
                </span>
              </p>
            )}
          </div>

          {/* Botones de acción */}
          {puedePrestar && (
            <div className="flex gap-2 pt-2 border-t border-accent" onClick={(e) => e.stopPropagation()}>
              {resultado.disponible ? (
                <Button
                  onClick={onPrestamo}
                  disabled={procesando}
                  size="sm"
                  className="flex-1"
                >
                  {procesando ? 'Procesando...' : 'Solicitar Préstamo'}
                </Button>
              ) : (
                <Button
                  onClick={onReserva}
                  disabled={procesando}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {procesando ? 'Procesando...' : 'Reservar'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

