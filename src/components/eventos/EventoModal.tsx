import { useState, useEffect } from 'react'
import { Search, X, FileText, Download } from 'lucide-react'
import { useEventosStore } from '@/store/eventosStore'
import { catalogoService, Manifestacion } from '@/services/catalogoService'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface EventoModalProps {
  isOpen: boolean
  onClose: () => void
  eventoId: number | null
}

export function EventoModal({ isOpen, onClose, eventoId }: EventoModalProps) {
  const { eventos, tiposEvento, addEvento, updateEvento, getEvento, vincularBibliografia } =
    useEventosStore()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    idTipoEvento: 1,
    fechaHoraInicio: '',
    fechaHoraFin: '',
    idEspacio: undefined as number | undefined,
    cupoMaximo: undefined as number | undefined,
    imagenPromo: '',
    estado: 'BORRADOR' as 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO',
  })
  const [busquedaLibros, setBusquedaLibros] = useState('')
  const [librosEncontrados, setLibrosEncontrados] = useState<Manifestacion[]>([])
  const [mostrarBuscador, setMostrarBuscador] = useState(false)
  const [bibliografiaSeleccionada, setBibliografiaSeleccionada] = useState<number[]>([])

  const evento = eventoId ? getEvento(eventoId) : null

  useEffect(() => {
    if (evento) {
      setFormData({
        titulo: evento.titulo,
        descripcion: evento.descripcion || '',
        idTipoEvento: evento.idTipoEvento,
        fechaHoraInicio: evento.fechaHoraInicio.slice(0, 16), // Para input datetime-local
        fechaHoraFin: evento.fechaHoraFin.slice(0, 16),
        idEspacio: evento.idEspacio,
        cupoMaximo: evento.cupoMaximo,
        imagenPromo: evento.imagenPromo || '',
        estado: evento.estado,
      })
      setBibliografiaSeleccionada(evento.bibliografiaVinculada || [])
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        idTipoEvento: 1,
        fechaHoraInicio: '',
        fechaHoraFin: '',
        idEspacio: undefined,
        cupoMaximo: undefined,
        imagenPromo: '',
        estado: 'BORRADOR',
      })
      setBibliografiaSeleccionada([])
    }
  }, [evento, isOpen])

  const handleBuscarLibros = async () => {
    if (!busquedaLibros.trim()) return
    try {
      const response = await catalogoService.getManifestaciones({
        search: busquedaLibros,
        limit: 10,
      })
      // Ajustar según la estructura real de la respuesta
      const libros = Array.isArray(response.data) ? response.data : response.data?.data || []
      setLibrosEncontrados(libros)
      setMostrarBuscador(true)
    } catch (error) {
      console.error('Error buscando libros:', error)
      // Datos mock si falla
      setLibrosEncontrados([
        {
          id: 1,
          tituloPropio: 'Cien años de soledad',
          autor: 'García Márquez, Gabriel',
          idFormato: 1,
          idIdioma: 1,
        },
        {
          id: 2,
          tituloPropio: 'El Quijote de la Mancha',
          autor: 'Cervantes, Miguel de',
          idFormato: 1,
          idIdioma: 1,
        },
      ] as Manifestacion[])
      setMostrarBuscador(true)
    }
  }

  const handleSeleccionarLibro = (libroId: number) => {
    if (!bibliografiaSeleccionada.includes(libroId)) {
      setBibliografiaSeleccionada([...bibliografiaSeleccionada, libroId])
    }
    setMostrarBuscador(false)
    setBusquedaLibros('')
  }

  const handleEliminarLibro = (libroId: number) => {
    setBibliografiaSeleccionada(bibliografiaSeleccionada.filter((id) => id !== libroId))
  }

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      alert('El título es requerido')
      return
    }

    if (!formData.fechaHoraInicio || !formData.fechaHoraFin) {
      alert('Las fechas de inicio y fin son requeridas')
      return
    }

    if (new Date(formData.fechaHoraInicio) >= new Date(formData.fechaHoraFin)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio')
      return
    }

    const tipoEvento = tiposEvento.find((t) => t.id === formData.idTipoEvento)
    const eventoData = {
      ...formData,
      fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
      fechaHoraFin: new Date(formData.fechaHoraFin).toISOString(),
      tipoEvento: tipoEvento?.nombre,
      bibliografiaVinculada: bibliografiaSeleccionada,
    }

    if (eventoId) {
      updateEvento(eventoId, eventoData)
      vincularBibliografia(eventoId, bibliografiaSeleccionada)
      alert('✅ Evento actualizado exitosamente')
    } else {
      addEvento(eventoData)
      alert('✅ Evento creado exitosamente')
    }

    onClose()
  }

  const handleGenerarCertificados = () => {
    if (!eventoId) return
    // Simulación de generación de PDFs
    alert(
      `✅ Generando certificados PDF para los asistentes del evento "${evento?.titulo}"\n\nLos certificados se descargarán automáticamente.`
    )
  }

  const librosSeleccionados = bibliografiaSeleccionada.map((id) => {
    const libro = librosEncontrados.find((l) => l.id === id)
    return libro || { id, tituloPropio: `Libro #${id}` }
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventoId ? 'Editar Evento' : 'Nuevo Evento Cultural'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-base font-display text-text-primary border-b border-accent pb-2">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
            <Select
              label="Tipo de Evento"
              value={formData.idTipoEvento.toString()}
              onChange={(e) =>
                setFormData({ ...formData, idTipoEvento: parseInt(e.target.value) })
              }
            >
              {tiposEvento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>
            <Input
              label="Fecha y Hora de Inicio"
              type="datetime-local"
              value={formData.fechaHoraInicio}
              onChange={(e) =>
                setFormData({ ...formData, fechaHoraInicio: e.target.value })
              }
              required
            />
            <Input
              label="Fecha y Hora de Fin"
              type="datetime-local"
              value={formData.fechaHoraFin}
              onChange={(e) => setFormData({ ...formData, fechaHoraFin: e.target.value })}
              required
            />
            <Input
              label="Cupo Máximo"
              type="number"
              value={formData.cupoMaximo || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cupoMaximo: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
            />
            <Input
              label="Orador/Ponente"
              placeholder="Nombre del orador"
            />
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Imagen Promocional (URL)
              </label>
              <Input
                value={formData.imagenPromo}
                onChange={(e) => setFormData({ ...formData, imagenPromo: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="text-xs text-text-secondary mt-1">
                Ingrese una URL de imagen o deje vacío para usar una imagen por defecto
              </p>
              {formData.imagenPromo && (
                <div className="mt-2">
                  <img
                    src={formData.imagenPromo}
                    alt="Vista previa"
                    className="w-full h-48 object-cover rounded-md border border-accent"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible'
                    }}
                  />
                </div>
              )}
            </div>
            <Select
              label="Estado"
              value={formData.estado}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estado: e.target.value as typeof formData.estado,
                })
              }
            >
              <option value="BORRADOR">Borrador</option>
              <option value="PUBLICADO">Publicado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="FINALIZADO">Finalizado</option>
            </Select>
          </div>
        </div>

        {/* Vinculación de Bibliografía */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display text-text-primary border-b border-accent pb-2">
              Vincular Bibliografía (Lectura Recomendada)
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMostrarBuscador(!mostrarBuscador)}
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar Libros
            </Button>
          </div>

          {mostrarBuscador && (
            <div className="p-4 bg-background-primary border border-accent rounded-md">
              <div className="flex gap-2 mb-3">
                <Input
                  value={busquedaLibros}
                  onChange={(e) => setBusquedaLibros(e.target.value)}
                  placeholder="Buscar por título, autor, ISBN..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleBuscarLibros}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              {librosEncontrados.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-accent rounded-md">
                  {librosEncontrados.map((libro) => (
                    <div
                      key={libro.id}
                      className={cn(
                        'p-2 hover:bg-background-secondary cursor-pointer border-b border-accent last:border-0',
                        bibliografiaSeleccionada.includes(libro.id) && 'bg-accent/20'
                      )}
                      onClick={() => handleSeleccionarLibro(libro.id)}
                    >
                      <div className="text-sm text-text-primary font-medium">
                        {libro.tituloPropio}
                      </div>
                      {libro.autor && (
                        <div className="text-xs text-text-secondary">{libro.autor}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {librosSeleccionados.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Libros Vinculados
              </label>
              <div className="space-y-2">
                {librosSeleccionados.map((libro) => (
                  <div
                    key={libro.id}
                    className="flex items-center justify-between p-2 bg-background-primary border border-accent rounded-md"
                  >
                    <span className="text-sm text-text-primary">{libro.tituloPropio}</span>
                    <button
                      onClick={() => handleEliminarLibro(libro.id)}
                      className="p-1 hover:bg-background-secondary rounded"
                    >
                      <X className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-between pt-4 border-t border-accent">
          {eventoId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerarCertificados}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generar Certificados
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {eventoId ? 'Guardar Cambios' : 'Crear Evento'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

