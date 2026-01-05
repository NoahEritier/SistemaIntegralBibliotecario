import { EventosTable } from '@/components/eventos/EventosTable'
import { EventosPublicos } from '@/components/eventos/EventosPublicos'
import { useAuthStore } from '@/store/authStore'

export function EventosPage() {
  const { role } = useAuthStore()
  const esUsuarioPublico = role === 'USUARIO'

  if (esUsuarioPublico) {
    return <EventosPublicos />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-text-primary">
          Gestión de Eventos y Cultura
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Administración de eventos culturales y actividades
        </p>
      </div>
      <EventosTable />
    </div>
  )
}



