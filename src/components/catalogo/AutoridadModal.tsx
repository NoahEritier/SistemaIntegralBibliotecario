import { useState, useEffect } from 'react'
import { useAutoridadesStore, Autoridad, TipoAutoridad } from '@/store/autoridadesStore'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface AutoridadModalProps {
  isOpen: boolean
  onClose: () => void
  autoridad: Autoridad | null
  onAutoridadCreada?: (autoridad: Autoridad) => void
}

export function AutoridadModal({
  isOpen,
  onClose,
  autoridad,
  onAutoridadCreada,
}: AutoridadModalProps) {
  const { addAutoridad, updateAutoridad } = useAutoridadesStore()
  const [formData, setFormData] = useState({
    nombreNormalizado: '',
    tipo: 'PERSONA' as TipoAutoridad,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (autoridad) {
      setFormData({
        nombreNormalizado: autoridad.nombreNormalizado,
        tipo: autoridad.tipo,
      })
    } else {
      setFormData({
        nombreNormalizado: '',
        tipo: 'PERSONA',
      })
    }
    setErrors({})
  }, [autoridad, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombreNormalizado.trim()) {
      newErrors.nombreNormalizado = 'El nombre normalizado es requerido'
    } else if (formData.nombreNormalizado.trim().length < 3) {
      newErrors.nombreNormalizado = 'El nombre debe tener al menos 3 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    if (autoridad) {
      updateAutoridad(autoridad.id, formData)
    } else {
      const nuevaAutoridad = addAutoridad(formData)
      if (onAutoridadCreada) {
        onAutoridadCreada(nuevaAutoridad)
      }
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={autoridad ? 'Editar Autoridad' : 'Nueva Autoridad'}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-secondary mb-4">
            {autoridad
              ? 'Modifique los datos de la autoridad'
              : 'Cree una nueva autoridad para evitar duplicados en el catálogo'}
          </p>
        </div>

        <Input
          label="Nombre Normalizado"
          value={formData.nombreNormalizado}
          onChange={(e) =>
            setFormData({ ...formData, nombreNormalizado: e.target.value })
          }
          error={errors.nombreNormalizado}
          placeholder="Ej: García Márquez, Gabriel o Editorial Planeta"
          required
        />

        <Select
          label="Tipo de Autoridad"
          value={formData.tipo}
          onChange={(e) =>
            setFormData({ ...formData, tipo: e.target.value as TipoAutoridad })
          }
        >
          <option value="PERSONA">Persona</option>
          <option value="INSTITUCION">Institución</option>
        </Select>

        <div className="bg-background-primary border border-accent rounded-md p-3">
          <p className="text-xs text-text-secondary">
            <strong>Nota:</strong> El nombre debe seguir el formato estándar de catalogación:
            <br />
            • Personas: Apellido, Nombre (ej: García Márquez, Gabriel)
            <br />
            • Instituciones: Nombre completo (ej: Editorial Planeta)
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-accent">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {autoridad ? 'Guardar Cambios' : 'Crear Autoridad'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}




