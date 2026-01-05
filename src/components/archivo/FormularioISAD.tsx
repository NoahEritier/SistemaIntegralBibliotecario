import { useState, useEffect } from 'react'
import { useArchivoStore } from '@/store/archivoStore'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

const nivelesDescripcion = [
  { value: '1', label: 'Fondo' },
  { value: '2', label: 'Subfondo' },
  { value: '3', label: 'Sección' },
  { value: '4', label: 'Serie' },
  { value: '5', label: 'Unidad Documental' },
]

const condicionesAcceso = [
  { value: '1', label: 'Acceso libre' },
  { value: '2', label: 'Acceso restringido' },
  { value: '3', label: 'Acceso condicionado' },
  { value: '4', label: 'Confidencial' },
]

export function FormularioISAD() {
  const {
    unidadSeleccionada,
    actualizarUnidad,
    agregarUnidad,
    generarCodigoReferencia,
  } = useArchivoStore()

  const [formData, setFormData] = useState({
    codigoReferencia: '',
    titulo: '',
    idNivelDescripcion: 1,
    productorNombre: '',
    fechaInicio: '',
    fechaFin: '',
    volumenSoporte: '',
    alcanceContenido: '',
    historiaArchivistica: '',
    idCondicionAcceso: undefined as number | undefined,
  })

  useEffect(() => {
    if (unidadSeleccionada) {
      setFormData({
        codigoReferencia: unidadSeleccionada.codigoReferencia,
        titulo: unidadSeleccionada.titulo,
        idNivelDescripcion: unidadSeleccionada.idNivelDescripcion,
        productorNombre: unidadSeleccionada.productorNombre || '',
        fechaInicio: unidadSeleccionada.fechaInicio
          ? unidadSeleccionada.fechaInicio.split('T')[0]
          : '',
        fechaFin: unidadSeleccionada.fechaFin
          ? unidadSeleccionada.fechaFin.split('T')[0]
          : '',
        volumenSoporte: unidadSeleccionada.volumenSoporte || '',
        alcanceContenido: unidadSeleccionada.alcanceContenido || '',
        historiaArchivistica: unidadSeleccionada.historiaArchivistica || '',
        idCondicionAcceso: unidadSeleccionada.idCondicionAcceso,
      })
    } else {
      setFormData({
        codigoReferencia: '',
        titulo: '',
        idNivelDescripcion: 1,
        productorNombre: '',
        fechaInicio: '',
        fechaFin: '',
        volumenSoporte: '',
        alcanceContenido: '',
        historiaArchivistica: '',
        idCondicionAcceso: undefined,
      })
    }
  }, [unidadSeleccionada])

  const handleSave = () => {
    if (!formData.titulo || !formData.codigoReferencia) {
      alert('Por favor complete el código de referencia y el título')
      return
    }

    if (unidadSeleccionada) {
      actualizarUnidad(unidadSeleccionada.id, {
        ...formData,
        fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : undefined,
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : undefined,
      })
      alert('✅ Unidad archivística actualizada')
    } else {
      // Crear nueva unidad raíz
      const codigoReferencia = generarCodigoReferencia(null)
      agregarUnidad({
        idPadre: null,
        codigoReferencia,
        titulo: formData.titulo,
        idNivelDescripcion: formData.idNivelDescripcion,
        nivelDescripcion: nivelesDescripcion.find((n) => n.value === formData.idNivelDescripcion.toString())?.label as any || 'Fondo',
        productorNombre: formData.productorNombre || undefined,
        fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : undefined,
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : undefined,
        volumenSoporte: formData.volumenSoporte || undefined,
        alcanceContenido: formData.alcanceContenido || undefined,
        historiaArchivistica: formData.historiaArchivistica || undefined,
        idCondicionAcceso: formData.idCondicionAcceso,
      })
      alert('✅ Nueva unidad archivística creada')
    }
  }

  if (!unidadSeleccionada) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Seleccione una unidad archivística del árbol para editar
          </p>
          <Button onClick={() => {
            const codigoReferencia = generarCodigoReferencia(null)
            agregarUnidad({
              idPadre: null,
              codigoReferencia,
              titulo: 'Nuevo Fondo',
              idNivelDescripcion: 1,
              nivelDescripcion: 'Fondo',
            })
          }}>
            Crear Nuevo Fondo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-display text-text-primary mb-2">
          Formulario ISAD-G
        </h3>
        <p className="text-sm text-text-secondary">
          Código: <span className="font-mono">{unidadSeleccionada.codigoReferencia}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Identificación */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Identificación
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código de Referencia"
              value={formData.codigoReferencia}
              onChange={(e) => setFormData({ ...formData, codigoReferencia: e.target.value })}
              required
            />
            <Input
              label="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
            <Select
              label="Nivel de Descripción"
              value={formData.idNivelDescripcion.toString()}
              onChange={(e) =>
                setFormData({ ...formData, idNivelDescripcion: parseInt(e.target.value) })
              }
            >
              {nivelesDescripcion.map((nivel) => (
                <option key={nivel.value} value={nivel.value}>
                  {nivel.label}
                </option>
              ))}
            </Select>
            <Input
              label="Productor/Nombre"
              value={formData.productorNombre}
              onChange={(e) => setFormData({ ...formData, productorNombre: e.target.value })}
            />
          </div>
        </div>

        {/* Fechas Extremas */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Fechas Extremas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            />
            <Input
              label="Fecha de Fin"
              type="date"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
            />
          </div>
        </div>

        {/* Volumen y Soporte */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Volumen y Soporte
          </h4>
          <Input
            label="Volumen de Soporte"
            value={formData.volumenSoporte}
            onChange={(e) => setFormData({ ...formData, volumenSoporte: e.target.value })}
            placeholder="Ej: 150 cajas, 25 metros lineales"
          />
        </div>

        {/* Alcance y Contenido */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Alcance y Contenido
          </h4>
          <Textarea
            label="Alcance y Contenido"
            value={formData.alcanceContenido}
            onChange={(e) => setFormData({ ...formData, alcanceContenido: e.target.value })}
            rows={4}
            placeholder="Descripción del contenido y alcance de la unidad archivística..."
          />
        </div>

        {/* Historia Archivística */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Historia Archivística
          </h4>
          <Textarea
            label="Historia Archivística"
            value={formData.historiaArchivistica}
            onChange={(e) => setFormData({ ...formData, historiaArchivistica: e.target.value })}
            rows={3}
            placeholder="Historia de la unidad, transferencias, etc..."
          />
        </div>

        {/* Condiciones de Acceso */}
        <div className="space-y-4">
          <h4 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Condiciones de Acceso
          </h4>
          <Select
            label="Condición de Acceso"
            value={formData.idCondicionAcceso?.toString() || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                idCondicionAcceso: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          >
            <option value="">Seleccionar...</option>
            {condicionesAcceso.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Botón Guardar */}
        <div className="pt-4 border-t border-accent">
          <Button onClick={handleSave} className="w-full">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}

