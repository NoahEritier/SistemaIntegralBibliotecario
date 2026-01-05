import { useInscripcionesStore } from '@/store/inscripcionesStore'
import { useSociosStore } from '@/store/sociosStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InscripcionesEventoModalProps {
  isOpen: boolean
  onClose: () => void
  eventoId: number
  eventoNombre: string
}

export function InscripcionesEventoModal({
  isOpen,
  onClose,
  eventoId,
  eventoNombre,
}: InscripcionesEventoModalProps) {
  const { getInscripcionesEvento, marcarAsistencia } = useInscripcionesStore()
  const sociosStore = useSociosStore()

  const inscripciones = getInscripcionesEvento(eventoId)

  const handleMarcarAsistencia = (idInscripcion: number, asistio: boolean) => {
    marcarAsistencia(idInscripcion, asistio)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inscripciones - ${eventoNombre}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Resumen */}
        <div className="bg-background-primary border border-accent rounded-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-accent-active" />
            <span className="text-sm font-medium text-text-secondary">Total de Inscripciones</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{inscripciones.length}</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-text-secondary">
              Asistieron:{' '}
              <span className="font-medium text-green-600">
                {inscripciones.filter((i) => i.asistio).length}
              </span>
            </span>
            <span className="text-text-secondary">
              No asistieron:{' '}
              <span className="font-medium text-gray-600">
                {inscripciones.filter((i) => !i.asistio).length}
              </span>
            </span>
          </div>
        </div>

        {/* Lista de inscripciones */}
        {inscripciones.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay inscripciones para este evento</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-base font-display text-text-primary mb-3">
              Lista de Inscritos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent bg-background-primary">
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      DNI/Legajo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Fecha Inscripción
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Asistencia
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.map((inscripcion, index) => {
                    const socio = sociosStore.getSocioById(inscripcion.idUsuario)

                    return (
                      <tr
                        key={inscripcion.id}
                        className="border-b border-accent hover:bg-background-primary transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-text-secondary">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-text-primary font-medium">
                            {socio
                              ? `${socio.nombre} ${socio.apellido}`
                              : `Usuario #${inscripcion.idUsuario}`}
                          </div>
                          {socio && (
                            <div className="text-xs text-text-secondary">
                              {socio.categoriaUsuario}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {socio?.legajoDni || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {socio?.email || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-AR')}
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {new Date(inscripcion.fechaInscripcion).toLocaleTimeString('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit',
                              inscripcion.asistio
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            )}
                          >
                            {inscripcion.asistio ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Asistió
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                No asistió
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {!inscripcion.asistio ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarcarAsistencia(inscripcion.id, true)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marcar Asistencia
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarcarAsistencia(inscripcion.id, false)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Quitar Asistencia
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-accent">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  )
}


