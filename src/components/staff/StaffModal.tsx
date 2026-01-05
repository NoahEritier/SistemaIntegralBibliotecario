import { useState, useEffect } from 'react'
import { useStaffStore, UsuarioStaff, Permiso } from '@/store/staffStore'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  staff: UsuarioStaff | null
}

const permisosDisponibles: Permiso[] = [
  'borrar_libros',
  'condonar_multas',
  'crear_usuarios',
  'editar_catalogo',
  'ver_reportes',
  'gestionar_staff',
  'configurar_politicas',
  'ver_auditoria',
]

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

const roles = ['Director', 'Bibliotecario', 'Archivista', 'Asistente']

export function StaffModal({ isOpen, onClose, staff }: StaffModalProps) {
  const { addStaff, updateStaff } = useStaffStore()
  const [formData, setFormData] = useState({
    username: '',
    nombreCompleto: '',
    email: '',
    rol: 'Bibliotecario',
    permisos: [] as Permiso[],
    activo: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (staff) {
      setFormData({
        username: staff.username,
        nombreCompleto: staff.nombreCompleto,
        email: staff.email,
        rol: staff.rol,
        permisos: staff.permisos,
        activo: staff.activo,
      })
    } else {
      setFormData({
        username: '',
        nombreCompleto: '',
        email: '',
        rol: 'Bibliotecario',
        permisos: [],
        activo: true,
      })
    }
    setErrors({})
  }, [staff, isOpen])

  const handleTogglePermiso = (permiso: Permiso) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter((p) => p !== permiso)
        : [...prev.permisos, permiso],
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    if (staff) {
      updateStaff(staff.id, formData)
    } else {
      addStaff(formData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? 'Editar Usuario Staff' : 'Nuevo Usuario Staff'}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de Usuario"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            error={errors.username}
            disabled={!!staff}
          />
          <Input
            label="Nombre Completo"
            value={formData.nombreCompleto}
            onChange={(e) =>
              setFormData({ ...formData, nombreCompleto: e.target.value })
            }
            error={errors.nombreCompleto}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
          />
          <Select
            label="Rol"
            value={formData.rol}
            onChange={(e) =>
              setFormData({ ...formData, rol: e.target.value })
            }
          >
            {roles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Permisos Granulares
          </label>
          <div className="grid grid-cols-2 gap-2 p-4 bg-background-primary rounded-md border border-accent">
            {permisosDisponibles.map((permiso) => (
              <label
                key={permiso}
                className="flex items-center gap-2 cursor-pointer hover:bg-background-secondary p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.permisos.includes(permiso)}
                  onChange={() => handleTogglePermiso(permiso)}
                  className="w-4 h-4 text-accent-active rounded focus:ring-accent-active"
                />
                <span className="text-sm text-text-primary">
                  {permisosLabels[permiso]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
              className="w-4 h-4 text-accent-active rounded focus:ring-accent-active"
            />
            <span className="text-sm text-text-primary">Usuario Activo</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-accent">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {staff ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}




