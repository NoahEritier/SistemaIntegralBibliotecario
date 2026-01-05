import { useState } from 'react'
import { useArchivoStore } from '@/store/archivoStore'
import { ArchivoTreeView } from '@/components/archivo/ArchivoTreeView'
import { FormularioISAD } from '@/components/archivo/FormularioISAD'
import { CargaArchivos } from '@/components/archivo/CargaArchivos'
import { VisorDocumentos } from '@/components/archivo/VisorDocumentos'

export function FondoDocumentalPage() {
  const { unidadSeleccionada, agregarUnidad, generarCodigoReferencia } = useArchivoStore()
  const [mostrarArchivos, setMostrarArchivos] = useState(true)

  const handleAddRoot = () => {
    const codigoReferencia = generarCodigoReferencia(null)
    agregarUnidad({
      idPadre: null,
      codigoReferencia,
      titulo: 'Nuevo Fondo',
      idNivelDescripcion: 1,
      nivelDescripcion: 'Fondo',
    })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Tree View Lateral */}
      <div className="w-80 flex-shrink-0">
        <ArchivoTreeView onAddRoot={handleAddRoot} />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Formulario ISAD-G */}
        <div className="flex-1 min-h-0">
          <FormularioISAD />
        </div>

        {/* Gestión de Archivos (solo para Unidad Documental) */}
        {unidadSeleccionada &&
          unidadSeleccionada.nivelDescripcion === 'Unidad Documental' && (
            <div className="bg-background-secondary border border-accent rounded-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-display text-text-primary">
                  Activos Digitales
                </h4>
                <button
                  onClick={() => setMostrarArchivos(!mostrarArchivos)}
                  className="text-sm text-accent-active hover:underline"
                >
                  {mostrarArchivos ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {mostrarArchivos && (
                <div className="space-y-6">
                  <CargaArchivos idUnidad={unidadSeleccionada.id} />
                  <VisorDocumentos
                    objetosDigitales={unidadSeleccionada.objetosDigitales}
                    idUnidad={unidadSeleccionada.id}
                  />
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
