import { useState } from 'react'
import { Calendar, Users, MapPin, BookOpen, CheckCircle, XCircle, Filter } from 'lucide-react'
import { useEventosStore } from '@/store/eventosStore'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { useInscripcionesStore } from '@/store/inscripcionesStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'

export function EventosPublicos() {
  const { eventos, tiposEvento } = useEventosStore()
  const { usuarioActual } = useUsuarioPublicoStore()
  const { isAuthenticated } = useAuthStore()
  const { inscribirseEvento, estaInscrito, desinscribirseEvento } = useInscripcionesStore()
  const [inscribiendoId, setInscribiendoId] = useState<number | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<number | 'todos'>('todos')

  // Filtrar solo eventos publicados
  let eventosPublicos = eventos.filter((e) => e.estado === 'PUBLICADO')

  // Aplicar filtro por tipo
  if (filtroTipo !== 'todos') {
    eventosPublicos = eventosPublicos.filter((e) => e.idTipoEvento === filtroTipo)
  }

  const handleInscribirse = async (eventoId: number) => {
    if (!isAuthenticated || !usuarioActual) {
      alert('Debe iniciar sesión para inscribirse a eventos')
      return
    }

    const evento = eventos.find((e) => e.id === eventoId)
    if (!evento) return

    // Verificar si ya está inscrito
    if (estaInscrito(eventoId, usuarioActual.id)) {
      alert('Ya estás inscrito a este evento')
      return
    }

    // Verificar cupo
    const inscripciones = useInscripcionesStore.getState().getInscripcionesEvento(eventoId)
    const cuposOcupados = inscripciones.length
    if (evento.cupoMaximo && cuposOcupados >= evento.cupoMaximo) {
      alert('❌ No hay cupos disponibles para este evento')
      return
    }

    setInscribiendoId(eventoId)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const resultado = inscribirseEvento(eventoId, usuarioActual.id)

    setInscribiendoId(null)

    if (resultado.exito) {
      alert(`✅ ${resultado.mensaje}\nEvento: "${evento.titulo}"`)
    } else {
      alert(`❌ ${resultado.mensaje}`)
    }
  }

  const handleDesinscribirse = async (eventoId: number) => {
    if (!isAuthenticated || !usuarioActual) return

    setInscribiendoId(eventoId)
    await new Promise((resolve) => setTimeout(resolve, 300))
    desinscribirseEvento(eventoId, usuarioActual.id)
    setInscribiendoId(null)
    alert('Te has desinscrito del evento')
  }

  if (eventosPublicos.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-12 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
        <p className="text-text-secondary">No hay eventos disponibles en este momento</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-text-primary">Eventos Culturales</h2>
          <p className="text-sm text-text-secondary mt-1">
            Descubra y participe en nuestras actividades culturales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <Select
            value={filtroTipo === 'todos' ? 'todos' : filtroTipo.toString()}
            onChange={(e) =>
              setFiltroTipo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))
            }
            className="w-48"
          >
            <option value="todos">Todos los tipos</option>
            {tiposEvento.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventosPublicos.map((evento) => {
          const fechaInicio = new Date(evento.fechaHoraInicio)
          const fechaFin = new Date(evento.fechaHoraFin)
          const yaPaso = new Date() > fechaFin
          const inscripciones = useInscripcionesStore.getState().getInscripcionesEvento(evento.id)
          const cuposOcupados = inscripciones.length
          const cupoDisponible = evento.cupoMaximo
            ? cuposOcupados < evento.cupoMaximo
            : true
          const yaInscrito =
            isAuthenticated && usuarioActual
              ? estaInscrito(evento.id, usuarioActual.id)
              : false

          return (
            <div
              key={evento.id}
              className="bg-background-secondary border border-accent rounded-md overflow-hidden hover:border-accent-active transition-colors"
            >
              {/* Imagen del evento */}
              {evento.imagenPromo && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={evento.imagenPromo}
                    alt={evento.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible'
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-display text-text-primary mb-2">
                      {evento.titulo}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {evento.descripcion}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      yaPaso
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                    )}
                  >
                    {yaPaso ? 'Finalizado' : 'Activo'}
                  </span>
                </div>

              <div className="space-y-2 mb-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {fechaInicio.toLocaleDateString('es-AR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {fechaInicio.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {fechaFin.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {evento.espacio && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{evento.espacio}</span>
                  </div>
                )}
                {evento.cupoMaximo !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {cuposOcupados} / {evento.cupoMaximo} inscritos
                      {cupoDisponible && ` (${evento.cupoMaximo - cuposOcupados} disponible${evento.cupoMaximo - cuposOcupados === 1 ? '' : 's'})`}
                    </span>
                  </div>
                )}
                {evento.tipoEvento && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-accent/20 text-accent-active rounded text-xs font-medium">
                      {evento.tipoEvento}
                    </span>
                  </div>
                )}
                {evento.bibliografiaVinculada.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {evento.bibliografiaVinculada.length}{' '}
                      {evento.bibliografiaVinculada.length === 1
                        ? 'libro recomendado'
                        : 'libros recomendados'}
                    </span>
                  </div>
                )}
              </div>

              {yaInscrito ? (
                <Button
                  onClick={() => handleDesinscribirse(evento.id)}
                  disabled={inscribiendoId === evento.id || yaPaso}
                  className="w-full"
                  variant="outline"
                >
                  {inscribiendoId === evento.id ? (
                    'Desinscribiendo...'
                  ) : yaPaso ? (
                    'Evento finalizado'
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Desinscribirme
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handleInscribirse(evento.id)}
                  disabled={!cupoDisponible || yaPaso || inscribiendoId === evento.id}
                  className="w-full"
                  variant={cupoDisponible && !yaPaso ? 'default' : 'outline'}
                >
                  {inscribiendoId === evento.id ? (
                    'Inscribiendo...'
                  ) : !cupoDisponible ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Sin cupos
                    </>
                  ) : yaPaso ? (
                    'Evento finalizado'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Inscribirme
                    </>
                  )}
                </Button>
              )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

