import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw, X, Download } from 'lucide-react'
import { useArchivoStore, ObjetoDigital } from '@/store/archivoStore'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

interface VisorDocumentosProps {
  objetosDigitales: ObjetoDigital[]
  idUnidad: number
}

export function VisorDocumentos({ objetosDigitales, idUnidad }: VisorDocumentosProps) {
  const { eliminarObjetoDigital } = useArchivoStore()
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<ObjetoDigital | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rotacion, setRotacion] = useState(0)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotacion((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoom(100)
    setRotacion(0)
  }

  const handleOpen = (objeto: ObjetoDigital) => {
    setObjetoSeleccionado(objeto)
    setZoom(100)
    setRotacion(0)
  }

  const handleClose = () => {
    setObjetoSeleccionado(null)
    handleReset()
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este objeto digital?')) {
      eliminarObjetoDigital(idUnidad, id)
    }
  }

  if (objetosDigitales.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p>No hay objetos digitales asociados a esta unidad</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
        Objetos Digitales ({objetosDigitales.length})
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {objetosDigitales.map((objeto) => (
          <div
            key={objeto.id}
            className="border border-accent rounded-md p-3 bg-background-primary hover:border-accent-active transition-colors cursor-pointer"
            onClick={() => handleOpen(objeto)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {objeto.nombreArchivo}
                </p>
                <p className="text-xs text-text-secondary">
                  {objeto.pesoKb ? `${objeto.pesoKb} KB` : ''} • {objeto.tipoMime}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(objeto.id)
                }}
                className="p-1 hover:bg-background-secondary rounded ml-2"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            {objeto.tipoMime === 'application/pdf' ? (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                <span className="text-xs text-red-800 font-medium">PDF</span>
              </div>
            ) : objeto.tipoMime.startsWith('image/') ? (
              <div className="aspect-video bg-background-secondary rounded overflow-hidden">
                {objeto.url ? (
                  <img
                    src={objeto.url}
                    alt={objeto.nombreArchivo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary">
                    Imagen
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Modal Visor */}
      {objetoSeleccionado && (
        <Modal
          isOpen={!!objetoSeleccionado}
          onClose={handleClose}
          title={objetoSeleccionado.nombreArchivo}
          size="xl"
        >
          <div className="space-y-4">
            {/* Controles */}
            <div className="flex items-center justify-between p-3 bg-background-primary rounded-md border border-accent">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-text-primary min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button size="sm" variant="outline" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Visor */}
            <div className="border border-accent rounded-md overflow-hidden bg-background-primary">
              <div
                className="overflow-auto"
                style={{
                  maxHeight: '70vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                }}
              >
                {objetoSeleccionado.tipoMime === 'application/pdf' ? (
                  <iframe
                    src={objetoSeleccionado.url || objetoSeleccionado.rutaAlmacenamiento}
                    className="border-0"
                    style={{
                      width: `${zoom}%`,
                      height: `${zoom * 1.4}%`,
                      transform: `rotate(${rotacion}deg)`,
                      transition: 'transform 0.3s',
                    }}
                    title={objetoSeleccionado.nombreArchivo}
                  />
                ) : objetoSeleccionado.tipoMime.startsWith('image/') ? (
                  <img
                    src={objetoSeleccionado.url || objetoSeleccionado.rutaAlmacenamiento}
                    alt={objetoSeleccionado.nombreArchivo}
                    style={{
                      width: `${zoom}%`,
                      transform: `rotate(${rotacion}deg)`,
                      transition: 'transform 0.3s',
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                ) : (
                  <div className="text-center text-text-secondary">
                    Tipo de archivo no soportado para visualización
                  </div>
                )}
              </div>
            </div>

            {/* Campo OCR */}
            {objetoSeleccionado.ocrTexto && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Texto Extraído (OCR)
                </label>
                <textarea
                  readOnly
                  value={objetoSeleccionado.ocrTexto}
                  className="w-full px-3 py-2 bg-background-primary border border-accent rounded-md text-text-primary text-sm font-mono resize-none"
                  rows={6}
                  placeholder="El texto extraído mediante OCR aparecerá aquí..."
                />
                <p className="text-xs text-text-secondary">
                  Este texto permite realizar búsquedas por contenido completo dentro del
                  documento
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}




