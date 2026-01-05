import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { useArchivoStore } from '@/store/archivoStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface CargaArchivosProps {
  idUnidad: number
}

export function CargaArchivos({ idUnidad }: CargaArchivosProps) {
  const { agregarObjetoDigital, unidadSeleccionada } = useArchivoStore()
  const [isDragging, setIsDragging] = useState(false)
  const [archivos, setArchivos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      setArchivos((prev) => [...prev, ...files])
    },
    []
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setArchivos((prev) => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (archivos.length === 0) return

    for (const archivo of archivos) {
      // Simular OCR para PDFs e imágenes
      let ocrTexto = ''
      if (archivo.type === 'application/pdf' || archivo.type.startsWith('image/')) {
        ocrTexto = `Texto extraído mediante OCR del archivo ${archivo.name}:\n\nEste es un texto simulado extraído del documento. En producción, este texto se generaría mediante un proceso de reconocimiento óptico de caracteres (OCR) que analizaría el contenido del documento y extraería el texto legible para permitir búsquedas por texto completo.\n\nEl documento contiene información relevante sobre la unidad archivística y puede ser utilizado para realizar búsquedas dentro del sistema.`
      }

      const url = URL.createObjectURL(archivo)

      agregarObjetoDigital(idUnidad, {
        idUnidadArchivistica: idUnidad,
        nombreArchivo: archivo.name,
        rutaAlmacenamiento: `/archivos/${unidadSeleccionada?.codigoReferencia}/${archivo.name}`,
        tipoMime: archivo.type,
        pesoKb: Math.round(archivo.size / 1024),
        ocrTexto,
        file: archivo,
        url,
      })
    }

    alert(`✅ ${archivos.length} archivo(s) cargado(s) exitosamente`)
    setArchivos([])
  }

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return FileText
    if (type.startsWith('image/')) return ImageIcon
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
        Gestión de Activos Digitales (DAM)
      </h4>

      {/* Área de Drag & Drop */}
      <div
        className={cn(
          'border-2 border-dashed rounded-md p-8 text-center transition-colors',
          isDragging
            ? 'border-accent-active bg-accent/10'
            : 'border-accent hover:border-accent-active bg-background-primary'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-accent-active" />
        <p className="text-text-primary font-medium mb-2">
          Arrastre archivos aquí o haga clic para seleccionar
        </p>
        <p className="text-sm text-text-secondary mb-4">
          Formatos soportados: PDF, Imágenes (JPG, PNG, TIFF)
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Seleccionar Archivos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Lista de archivos seleccionados */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-text-primary">
            Archivos seleccionados ({archivos.length})
          </h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {archivos.map((archivo, index) => {
              const Icon = getFileIcon(archivo.type)
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-background-primary border border-accent rounded-md"
                >
                  <Icon className="w-5 h-5 text-accent-active flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {archivo.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatFileSize(archivo.size)} • {archivo.type}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:bg-background-secondary rounded"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              )
            })}
          </div>
          <Button onClick={handleUpload} className="w-full">
            Cargar Archivos
          </Button>
        </div>
      )}
    </div>
  )
}




