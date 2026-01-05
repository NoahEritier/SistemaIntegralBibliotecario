import { useSociosStore } from '@/store/sociosStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { DollarSign, BookOpen, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PrestamosMultasModalProps {
  isOpen: boolean
  onClose: () => void
  socioId: number
}

export function PrestamosMultasModal({
  isOpen,
  onClose,
  socioId,
}: PrestamosMultasModalProps) {
  const { getSocioById, condonarMulta, pagarMulta } = useSociosStore()
  const socio = getSocioById(socioId)

  if (!socio) {
    return null
  }

  const multasPendientes = socio.multas.filter((m) => m.estado === 'Pendiente')
  const totalPendiente = multasPendientes.reduce((sum, m) => sum + m.monto, 0)

  const handleCondonar = (multaId: number) => {
    if (window.confirm('¿Está seguro de condonar esta multa?')) {
      condonarMulta(multaId)
    }
  }

  const handlePagar = (multaId: number) => {
    if (window.confirm('¿Registrar el pago de esta multa?')) {
      pagarMulta(multaId)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Préstamos y Multas - ${socio.nombre} ${socio.apellido}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-primary border border-accent rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-accent-active" />
              <span className="text-sm font-medium text-text-secondary">
                Préstamos Activos
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {socio.prestamosActivos.length}
            </p>
          </div>
          <div className="bg-background-primary border border-accent rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-text-secondary">
                Multas Pendientes
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              ${totalPendiente.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Préstamos Activos */}
        <div>
          <h3 className="text-lg font-display text-text-primary mb-3">
            Préstamos Activos
          </h3>
          {socio.prestamosActivos.length === 0 ? (
            <p className="text-text-secondary text-sm">No hay préstamos activos</p>
          ) : (
            <div className="space-y-2">
              {socio.prestamosActivos.map((prestamo) => {
                const fechaVencimiento = new Date(prestamo.fechaVencimiento)
                const fechaActual = new Date()
                const estaVencido = fechaActual > fechaVencimiento
                const diasRestantes = Math.ceil(
                  (fechaVencimiento.getTime() - fechaActual.getTime()) /
                    (1000 * 60 * 60 * 24)
                )

                return (
                  <div
                    key={prestamo.id}
                    className="bg-background-primary border border-accent rounded-md p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">
                          Préstamo #{prestamo.idItem}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-text-secondary">
                          <p>
                            Fecha de préstamo:{' '}
                            {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-AR')}
                          </p>
                          <p>
                            Vencimiento:{' '}
                            <span
                              className={cn(
                                'font-medium',
                                estaVencido
                                  ? 'text-red-600'
                                  : diasRestantes <= 3
                                    ? 'text-orange-600'
                                    : 'text-text-primary'
                              )}
                            >
                              {fechaVencimiento.toLocaleDateString('es-AR')}
                            </span>
                          </p>
                          {!estaVencido && (
                            <p>
                              Días restantes:{' '}
                              <span
                                className={cn(
                                  'font-medium',
                                  diasRestantes <= 3 ? 'text-orange-600' : 'text-text-primary'
                                )}
                              >
                                {diasRestantes}
                              </span>
                            </p>
                          )}
                          <p>Renovaciones: {prestamo.renovacionesContador}</p>
                        </div>
                      </div>
                      {estaVencido && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Vencido</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Historial de Préstamos */}
        {socio.prestamosHistoricos.length > 0 && (
          <div>
            <h3 className="text-lg font-display text-text-primary mb-3">
              Historial de Préstamos
            </h3>
            <div className="space-y-2">
              {socio.prestamosHistoricos.slice(0, 5).map((prestamo) => (
                <div
                  key={prestamo.id}
                  className="bg-background-primary border border-accent rounded-md p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        Préstamo #{prestamo.idItem}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-text-secondary">
                        <p>
                          Prestado:{' '}
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-AR')}
                        </p>
                        <p>
                          Devuelto:{' '}
                          {prestamo.fechaDevolucion
                            ? new Date(prestamo.fechaDevolucion).toLocaleDateString('es-AR')
                            : 'No devuelto'}
                        </p>
                      </div>
                    </div>
                    {prestamo.fechaDevolucion && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multas */}
        <div>
          <h3 className="text-lg font-display text-text-primary mb-3">Multas</h3>
          {socio.multas.length === 0 ? (
            <p className="text-text-secondary text-sm">No hay multas registradas</p>
          ) : (
            <div className="space-y-2">
              {socio.multas.map((multa) => {
                const fechaVencimiento = new Date(multa.fechaVencimiento)
                const estaVencida = new Date() > fechaVencimiento

                return (
                  <div
                    key={multa.id}
                    className="bg-background-primary border border-accent rounded-md p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-red-600" />
                          <p className="font-medium text-text-primary">
                            ${multa.monto.toLocaleString('es-AR')}
                          </p>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              multa.estado === 'Pendiente'
                                ? 'bg-red-100 text-red-800'
                                : multa.estado === 'Pagada'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                            )}
                          >
                            {multa.estado}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-text-secondary">
                          <p>Motivo: {multa.motivo}</p>
                          <p>
                            Generada:{' '}
                            {new Date(multa.fechaGeneracion).toLocaleDateString('es-AR')}
                          </p>
                          <p>
                            Vencimiento:{' '}
                            <span
                              className={cn(
                                'font-medium',
                                estaVencida && multa.estado === 'Pendiente'
                                  ? 'text-red-600'
                                  : 'text-text-primary'
                              )}
                            >
                              {fechaVencimiento.toLocaleDateString('es-AR')}
                            </span>
                          </p>
                          {multa.fechaPago && (
                            <p>
                              Pagada:{' '}
                              {new Date(multa.fechaPago).toLocaleDateString('es-AR')}
                            </p>
                          )}
                        </div>
                      </div>
                      {multa.estado === 'Pendiente' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePagar(multa.id)}
                          >
                            Marcar como Pagada
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCondonar(multa.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Condonar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-accent">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  )
}




