import { useState } from 'react'
import { Download, Loader2, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/ui'
import { Input, Button } from '@/components/ui'
import { catalogoService } from '@/services/catalogoService'
import type { Manifestacion } from '@/services/catalogoService'

interface ImportZ3950ModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (manifestacion: Manifestacion) => void
}

export function ImportZ3950Modal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportZ3950ModalProps) {
  const [isbn, setIsbn] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleImport = async () => {
    if (!isbn.trim()) {
      setError('Por favor ingrese un ISBN')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await catalogoService.importZ3950(isbn)
      setSuccess(true)
      setTimeout(() => {
        // El servicio devuelve { data: Manifestacion }
        onImportSuccess(response.data)
        handleClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al importar desde Z39.50')
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsbn('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar desde Z39.50"
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-background-primary border border-accent rounded-md p-4">
          <p className="text-sm text-text-secondary mb-4">
            Ingrese el ISBN o ISSN del material a importar. El sistema buscará
            automáticamente en las bases de datos Z39.50 configuradas.
          </p>
          <Input
            label="ISBN/ISSN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Ej: 9788432210468 o 978-84-322-1046-8"
            disabled={loading || success}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading && !success) {
                handleImport()
              }
            }}
          />
          <p className="text-xs text-text-secondary mt-2">
            <strong>ISBNs de prueba:</strong> 9788432210468, 9788491051884, 9788497592207, 9788432210475, 9788432210482
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error rounded-md p-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-success/10 border border-success rounded-md p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={1.5} />
            <p className="text-sm text-success">
              Importación exitosa. Redirigiendo...
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleImport}
            disabled={loading || success}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Importar
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
