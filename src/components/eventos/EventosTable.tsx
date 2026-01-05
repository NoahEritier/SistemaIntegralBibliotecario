import { useState } from 'react'
import { Plus, Edit2, Trash2, FileText, Users } from 'lucide-react'
import { useEventosStore } from '@/store/eventosStore'
import { useInscripcionesStore } from '@/store/inscripcionesStore'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { EventoModal } from './EventoModal'
import { InscripcionesEventoModal } from './InscripcionesEventoModal'

export function EventosTable() {
  const { eventos, deleteEvento } = useEventosStore()
  const { getInscripcionesEvento } = useInscripcionesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInscripcionesModalOpen, setIsInscripcionesModalOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<number | null>(null)
  const [eventoInscripciones, setEventoInscripciones] = useState<{
    id: number
    nombre: string
  } | null>(null)

  const handleCreate = () => {
    setEditingEvento(null)
    setIsModalOpen(true)
  }

  const handleEdit = (id: number) => {
    setEditingEvento(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      deleteEvento(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvento(null)
  }

  const handleVerInscripciones = (evento: typeof eventos[0]) => {
    setEventoInscripciones({ id: evento.id, nombre: evento.titulo })
    setIsInscripcionesModalOpen(true)
  }

  const handleCloseInscripcionesModal = () => {
    setIsInscripcionesModalOpen(false)
    setEventoInscripciones(null)
  }

  const columns: Column<typeof eventos[0]>[] = [
    {
      key: 'titulo',
      header: 'Título',
      sortable: true,
    },
    {
      key: 'tipoEvento',
      header: 'Tipo',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-accent/20 text-accent-active rounded text-xs font-medium">
          {value || 'Sin tipo'}
        </span>
      ),
    },
    {
      key: 'fechaHoraInicio',
      header: 'Fecha y Hora',
      sortable: true,
      render: (value) => {
        const date = new Date(value)
        return (
          <div>
            <div className="text-sm text-text-primary">
              {date.toLocaleDateString('es-AR')}
            </div>
            <div className="text-xs text-text-secondary">
              {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )
      },
    },
    {
      key: 'cupoMaximo',
      header: 'Cupo',
      render: (value) => (value ? value : '-'),
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (value) => {
        const estados = {
          BORRADOR: 'bg-gray-100 text-gray-800',
          PUBLICADO: 'bg-green-100 text-green-800',
          CANCELADO: 'bg-red-100 text-red-800',
          FINALIZADO: 'bg-blue-100 text-blue-800',
        }
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              estados[value as keyof typeof estados] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        )
      },
    },
    {
      key: 'bibliografiaVinculada',
      header: 'Bibliografía',
      render: (value: number[]) => {
        return (
          <span className="text-sm text-text-secondary">
            {value.length} {value.length === 1 ? 'libro' : 'libros'}
          </span>
        )
      },
    },
    {
      key: 'inscripciones',
      header: 'Inscripciones',
      render: (_, row) => {
        const inscripciones = getInscripcionesEvento(row.id)
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-active" />
            <span className="text-sm text-text-primary font-medium">{inscripciones.length}</span>
            {row.cupoMaximo && (
              <span className="text-xs text-text-secondary">
                / {row.cupoMaximo}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleVerInscripciones(row)}
            className="p-1 rounded hover:bg-background-primary text-blue-600"
            title="Ver inscripciones"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="p-1 rounded hover:bg-background-primary text-accent-active"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 rounded hover:bg-background-primary text-error"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display text-text-primary">Eventos Culturales</h3>
          <p className="text-sm text-text-secondary">
            Gestión de eventos y actividades culturales
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      <DataTable data={eventos} columns={columns} pageSize={10} searchable={true} />

      {isModalOpen && (
        <EventoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          eventoId={editingEvento}
        />
      )}

      {isInscripcionesModalOpen && eventoInscripciones && (
        <InscripcionesEventoModal
          isOpen={isInscripcionesModalOpen}
          onClose={handleCloseInscripcionesModal}
          eventoId={eventoInscripciones.id}
          eventoNombre={eventoInscripciones.nombre}
        />
      )}
    </div>
  )
}

