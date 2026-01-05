import { useState } from 'react'
import { Book, Archive, Calendar, User, MapPin, BookOpen, Clock, FileText, Tag } from 'lucide-react'
import { ResultadoBusqueda } from '@/store/busquedaStore'
import { SlidePanel } from '@/components/ui/SlidePanel'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toastStore'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { useCirculacionStore } from '@/store/circulacionStore'
import { cn } from '@/utils/cn'

interface LibroDetallePanelProps {
  isOpen: boolean
  onClose: () => void
  libro: ResultadoBusqueda | null
}

export function LibroDetallePanel({ isOpen, onClose, libro }: LibroDetallePanelProps) {
  const { success, error, warning } = useToastStore()
  const { usuarioActual } = useUsuarioPublicoStore()
  const { crearPrestamo, buscarItem } = useCirculacionStore()
  const [procesando, setProcesando] = useState(false)

  if (!libro) return null

  const esBiblioteca = libro.tipo === 'biblioteca'
  const puedePrestar = esBiblioteca && libro.disponible !== undefined

  const handlePrestamo = async () => {
    if (!usuarioActual) {
      warning('Debe iniciar sesión para solicitar un préstamo')
      return
    }

    if (!libro.disponible) {
      error('Este libro no está disponible para préstamo')
      return
    }

    setProcesando(true)

    try {
      // Simular búsqueda del item por código
      const codigoBarras = `BAR-${String(libro.id).padStart(3, '0')}`
      const item = await buscarItem(codigoBarras)

      if (!item) {
        error('No se pudo encontrar el ejemplar del libro')
        setProcesando(false)
        return
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const nuevoPrestamo = crearPrestamo(item.id, usuarioActual.id)

      if (nuevoPrestamo) {
        success(
          `Préstamo solicitado exitosamente. Fecha de vencimiento: ${new Date(
            nuevoPrestamo.fechaVencimiento
          ).toLocaleDateString('es-AR')}`
        )
        onClose()
      } else {
        error('No se pudo procesar el préstamo')
      }
    } catch (err) {
      error('Error al procesar el préstamo')
    } finally {
      setProcesando(false)
    }
  }

  const handleReserva = async () => {
    if (!usuarioActual) {
      warning('Debe iniciar sesión para hacer una reserva')
      return
    }

    setProcesando(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simular creación de reserva
      const fechaVencimiento = new Date()
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 15)

      success(
        `Reserva realizada exitosamente. La reserva vence el ${fechaVencimiento.toLocaleDateString(
          'es-AR'
        )}. Se le notificará cuando el libro esté disponible.`
      )
      onClose()
    } catch (err) {
      error('Error al procesar la reserva')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Detalles del Libro">
      <div className="space-y-6">
        {/* Header con icono */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'p-4 rounded-lg flex-shrink-0',
              esBiblioteca ? 'bg-blue-100' : 'bg-amber-100'
            )}
          >
            {esBiblioteca ? (
              <Book className="w-8 h-8 text-blue-600" />
            ) : (
              <Archive className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-display text-text-primary mb-2">{libro.titulo}</h3>
            <span
              className={cn(
                'inline-block px-3 py-1 rounded-full text-xs font-medium',
                esBiblioteca
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              )}
            >
              {esBiblioteca ? 'Biblioteca' : 'Archivo Histórico'}
            </span>
          </div>
        </div>

        {/* Información del libro */}
        <div className="space-y-4">
          {libro.autor && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Autor</p>
                <p className="text-base text-text-primary">{libro.autor}</p>
              </div>
            </div>
          )}

          {libro.anio && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Año</p>
                <p className="text-base text-text-primary">{libro.anio}</p>
              </div>
            </div>
          )}

          {libro.tipoMaterial && (
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Tipo de Material</p>
                <p className="text-base text-text-primary">{libro.tipoMaterial}</p>
              </div>
            </div>
          )}

          {libro.codigoReferencia && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Código de Referencia</p>
                <p className="text-base text-text-primary font-mono">{libro.codigoReferencia}</p>
              </div>
            </div>
          )}

          {libro.nivelDescripcion && (
            <div className="flex items-start gap-3">
              <Archive className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Nivel de Descripción</p>
                <p className="text-base text-text-primary">{libro.nivelDescripcion}</p>
              </div>
            </div>
          )}

          {libro.disponible !== undefined && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Disponibilidad</p>
                <p
                  className={cn(
                    'text-base font-medium',
                    libro.disponible ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {libro.disponible ? 'Disponible' : 'No disponible'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resumen */}
        {libro.resumen && (
          <div className="pt-4 border-t border-accent">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
              <h4 className="text-base font-display text-text-primary">Resumen</h4>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-8">{libro.resumen}</p>
          </div>
        )}

        {/* Temáticas */}
        {libro.tematicas && libro.tematicas.length > 0 && (
          <div className="pt-4 border-t border-accent">
            <div className="flex items-center gap-3 mb-3">
              <Tag className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <h4 className="text-base font-display text-text-primary">Temáticas</h4>
            </div>
            <div className="flex flex-wrap gap-2 pl-8">
              {libro.tematicas.map((tematica, index) => (
                <span
                  key={index}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    'bg-accent/10 text-accent-active border border-accent/20'
                  )}
                >
                  {tematica}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        {puedePrestar && (
          <div className="pt-6 border-t border-accent space-y-3">
            {libro.disponible ? (
              <Button
                onClick={handlePrestamo}
                disabled={procesando}
                className="w-full"
                size="lg"
              >
                {procesando ? 'Procesando...' : 'Solicitar Préstamo'}
              </Button>
            ) : (
              <Button
                onClick={handleReserva}
                disabled={procesando}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {procesando ? 'Procesando...' : 'Reservar Libro'}
              </Button>
            )}
            {!libro.disponible && (
              <p className="text-sm text-text-secondary text-center">
                Este libro no está disponible actualmente. Puede reservarlo y se le notificará
                cuando esté disponible.
              </p>
            )}
          </div>
        )}
      </div>
    </SlidePanel>
  )
}

