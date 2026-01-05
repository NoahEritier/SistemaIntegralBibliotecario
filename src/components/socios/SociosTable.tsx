import { useState } from 'react'
import { Edit2, Trash2, Plus, UserCheck, UserX, Ban, Eye, DollarSign } from 'lucide-react'
import { useSociosStore, SocioCompleto } from '@/store/sociosStore'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { SocioModal } from './SocioModal'
import { PrestamosMultasModal } from './PrestamosMultasModal'
import { BloquearSocioModal } from './BloquearSocioModal'
import { cn } from '@/utils/cn'

export function SociosTable() {
  const { socios, darDeBaja, bloquearSocio } = useSociosStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrestamosModalOpen, setIsPrestamosModalOpen] = useState(false)
  const [isBloquearModalOpen, setIsBloquearModalOpen] = useState(false)
  const [editingSocio, setEditingSocio] = useState<SocioCompleto | null>(null)
  const [selectedSocioId, setSelectedSocioId] = useState<number | null>(null)
  const [socioABloquear, setSocioABloquear] = useState<SocioCompleto | null>(null)

  const handleEdit = (socio: SocioCompleto) => {
    setEditingSocio(socio)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingSocio(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas dar de baja este socio?')) {
      darDeBaja(id)
    }
  }

  const handleViewPrestamos = (socio: SocioCompleto) => {
    setSelectedSocioId(socio.id)
    setIsPrestamosModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSocio(null)
  }

  const handleClosePrestamosModal = () => {
    setIsPrestamosModalOpen(false)
    setSelectedSocioId(null)
  }

  const columns: Column<SocioCompleto>[] = [
    {
      key: 'legajoDni',
      header: 'DNI/Legajo',
      sortable: true,
    },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (_, row) => (
        <div>
          <div className="font-medium text-text-primary">
            {row.nombre} {row.apellido}
          </div>
          <div className="text-xs text-text-secondary">{row.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'categoriaUsuario',
      header: 'Categoría',
      sortable: true,
    },
    {
      key: 'estadoUsuario',
      header: 'Estado',
      render: (value: string, row) => {
        const isBloqueado = row.bloqueado
        const estado = isBloqueado ? 'Bloqueado' : value
        const colorClass =
          estado === 'Activo'
            ? 'text-green-600'
            : estado === 'Sancionado' || estado === 'Bloqueado'
              ? 'text-red-600'
              : 'text-gray-600'

        return (
          <div className="flex items-center gap-1">
            {estado === 'Activo' ? (
              <UserCheck className={cn('w-4 h-4', colorClass)} />
            ) : (
              <UserX className={cn('w-4 h-4', colorClass)} />
            )}
            <span className={cn('text-sm font-medium', colorClass)}>{estado}</span>
          </div>
        )
      },
      sortable: true,
    },
    {
      key: 'prestamosActivos',
      header: 'Préstamos',
      render: (value: any[]) => (
        <div className="text-sm">
          <span className="font-medium text-text-primary">{value.length}</span>
          <span className="text-text-secondary"> activo(s)</span>
        </div>
      ),
    },
    {
      key: 'multas',
      header: 'Multas',
      render: (value: any[]) => {
        const pendientes = value.filter((m) => m.estado === 'Pendiente')
        const totalPendiente = pendientes.reduce((sum, m) => sum + m.monto, 0)
        return (
          <div className="text-sm">
            {pendientes.length > 0 ? (
              <span className="font-medium text-red-600">
                ${totalPendiente.toLocaleString('es-AR')}
              </span>
            ) : (
              <span className="text-text-secondary">Sin multas</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'fechaAlta',
      header: 'Fecha Alta',
      render: (value: string) => new Date(value).toLocaleDateString('es-AR'),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewPrestamos(row)}
            className="p-1 rounded hover:bg-background-primary text-accent-active"
            title="Ver préstamos y multas"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 rounded hover:bg-background-primary text-accent-active"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {row.bloqueado ? (
            <button
              onClick={() => {
                const { desbloquearSocio } = useSociosStore.getState()
                desbloquearSocio(row.id)
              }}
              className="p-1 rounded hover:bg-background-primary text-green-600"
              title="Desbloquear"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setSocioABloquear(row)
                setIsBloquearModalOpen(true)
              }}
              className="p-1 rounded hover:bg-background-primary text-orange-600"
              title="Bloquear"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 rounded hover:bg-background-primary text-error"
            title="Dar de baja"
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
          <h3 className="text-lg font-display text-text-primary">Gestión de Socios</h3>
          <p className="text-sm text-text-secondary">
            Administra los socios (lectores) de la biblioteca
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Socio
        </Button>
      </div>

      <DataTable data={socios} columns={columns} pageSize={10} searchable={true} />

      {isModalOpen && (
        <SocioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          socio={editingSocio}
        />
      )}

      {isPrestamosModalOpen && selectedSocioId && (
        <PrestamosMultasModal
          isOpen={isPrestamosModalOpen}
          onClose={handleClosePrestamosModal}
          socioId={selectedSocioId}
        />
      )}

      {isBloquearModalOpen && socioABloquear && (
        <BloquearSocioModal
          isOpen={isBloquearModalOpen}
          onClose={() => {
            setIsBloquearModalOpen(false)
            setSocioABloquear(null)
          }}
          onConfirm={(motivo) => {
            bloquearSocio(socioABloquear.id, motivo)
          }}
          nombreSocio={`${socioABloquear.nombre} ${socioABloquear.apellido}`}
        />
      )}
    </div>
  )
}

