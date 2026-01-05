import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface BloquearSocioModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void
  nombreSocio: string
}

export function BloquearSocioModal({
  isOpen,
  onClose,
  onConfirm,
  nombreSocio,
}: BloquearSocioModalProps) {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!motivo.trim()) {
      setError('El motivo del bloqueo es requerido')
      return
    }

    onConfirm(motivo.trim())
    setMotivo('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setMotivo('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Bloquear Socio: ${nombreSocio}`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Ingrese el motivo del bloqueo. El socio no podrá realizar préstamos mientras esté
          bloqueado.
        </p>

        <Textarea
          label="Motivo del Bloqueo"
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value)
            setError('')
          }}
          error={error}
          rows={4}
          placeholder="Ej: Devolución tardía reiterada, daño en material, incumplimiento de normas..."
          required
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-accent">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
            Bloquear Socio
          </Button>
        </div>
      </div>
    </Modal>
  )
}




