import { useState } from 'react'
import { Edit2, Trash2, Plus, UserCheck, UserX } from 'lucide-react'
import { useStaffStore, UsuarioStaff, Permiso } from '@/store/staffStore'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { StaffModal } from './StaffModal'

const permisosLabels: Record<Permiso, string> = {
  borrar_libros: 'Borrar Libros',
  condonar_multas: 'Condonar Multas',
  crear_usuarios: 'Crear Usuarios',
  editar_catalogo: 'Editar Catálogo',
  ver_reportes: 'Ver Reportes',
  gestionar_staff: 'Gestionar Staff',
  configurar_politicas: 'Configurar Políticas',
  ver_auditoria: 'Ver Auditoría',
}

export function StaffTable() {
  const { staff, deleteStaff } = useStaffStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<UsuarioStaff | null>(null)

  const handleEdit = (staffMember: UsuarioStaff) => {
    setEditingStaff(staffMember)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingStaff(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      deleteStaff(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStaff(null)
  }

  const columns: Column<UsuarioStaff>[] = [
    {
      key: 'username',
      header: 'Usuario',
      sortable: true,
    },
    {
      key: 'nombreCompleto',
      header: 'Nombre Completo',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'rol',
      header: 'Rol',
      sortable: true,
    },
    {
      key: 'permisos',
      header: 'Permisos',
      render: (value: Permiso[]) => {
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 3).map((permiso) => (
              <span
                key={permiso}
                className="px-2 py-0.5 bg-accent/20 text-accent-active text-xs rounded"
              >
                {permisosLabels[permiso]}
              </span>
            ))}
            {value.length > 3 && (
              <span className="text-xs text-text-secondary">
                +{value.length - 3} más
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (value: boolean) => {
        return value ? (
          <div className="flex items-center gap-1 text-green-600">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm">Activo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <UserX className="w-4 h-4" />
            <span className="text-sm">Inactivo</span>
          </div>
        )
      },
    },
    {
      key: 'fechaCreacion',
      header: 'Fecha Creación',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('es-AR'),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
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
          <h3 className="text-lg font-display text-text-primary">Gestión de Staff</h3>
          <p className="text-sm text-text-secondary">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <DataTable data={staff} columns={columns} pageSize={10} searchable={true} />

      {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          staff={editingStaff}
        />
      )}
    </div>
  )
}




