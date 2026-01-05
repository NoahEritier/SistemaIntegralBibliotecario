import { useState, useEffect } from 'react'
import { useSociosStore, SocioCompleto } from '@/store/sociosStore'
import { CategoriaUsuario } from '@/store/politicasStore'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface SocioModalProps {
  isOpen: boolean
  onClose: () => void
  socio: SocioCompleto | null
}

const categoriasUsuario: CategoriaUsuario[] = [
  'Estudiante',
  'Docente',
  'Investigador',
  'Vecino',
]

const estadosUsuario = ['Activo', 'Sancionado', 'Inactivo']

export function SocioModal({ isOpen, onClose, socio }: SocioModalProps) {
  const { addSocio, updateSocio } = useSociosStore()
  const [formData, setFormData] = useState({
    legajoDni: '',
    nombre: '',
    apellido: '',
    email: '',
    categoriaUsuario: 'Estudiante' as CategoriaUsuario,
    estadoUsuario: 'Activo' as 'Activo' | 'Sancionado' | 'Inactivo',
    fotoUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (socio) {
      setFormData({
        legajoDni: socio.legajoDni,
        nombre: socio.nombre,
        apellido: socio.apellido,
        email: socio.email,
        categoriaUsuario: socio.categoriaUsuario,
        estadoUsuario: socio.estadoUsuario,
        fotoUrl: socio.fotoUrl || '',
      })
    } else {
      setFormData({
        legajoDni: '',
        nombre: '',
        apellido: '',
        email: '',
        categoriaUsuario: 'Estudiante',
        estadoUsuario: 'Activo',
        fotoUrl: '',
      })
    }
    setErrors({})
  }, [socio, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.legajoDni.trim()) {
      newErrors.legajoDni = 'El DNI/Legajo es requerido'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
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

    if (socio) {
      updateSocio(socio.id, formData)
    } else {
      addSocio(formData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={socio ? 'Editar Socio' : 'Nuevo Socio'}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="DNI/Legajo"
            value={formData.legajoDni}
            onChange={(e) =>
              setFormData({ ...formData, legajoDni: e.target.value })
            }
            error={errors.legajoDni}
            disabled={!!socio}
          />
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            error={errors.nombre}
          />
          <Input
            label="Apellido"
            value={formData.apellido}
            onChange={(e) =>
              setFormData({ ...formData, apellido: e.target.value })
            }
            error={errors.apellido}
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
            label="Categoría"
            value={formData.categoriaUsuario}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoriaUsuario: e.target.value as CategoriaUsuario,
              })
            }
          >
            {categoriasUsuario.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Select
            label="Estado"
            value={formData.estadoUsuario}
            onChange={(e) =>
              setFormData({
                ...formData,
                estadoUsuario: e.target.value as 'Activo' | 'Sancionado' | 'Inactivo',
              })
            }
          >
            {estadosUsuario.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Select>
          <Input
            label="URL de Foto (opcional)"
            value={formData.fotoUrl}
            onChange={(e) =>
              setFormData({ ...formData, fotoUrl: e.target.value })
            }
            className="md:col-span-2"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-accent">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {socio ? 'Guardar Cambios' : 'Crear Socio'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}




