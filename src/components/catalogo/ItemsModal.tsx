import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, MapPin, Calendar, FileText, QrCode } from 'lucide-react'
import { Modal } from '@/components/ui'
import { Button, Input, Select } from '@/components/ui'
import { catalogoService, type Item } from '@/services/catalogoService'

interface ItemsModalProps {
  isOpen: boolean
  onClose: () => void
  manifestacionId: number
  manifestacionTitulo: string
}

export function ItemsModal({
  isOpen,
  onClose,
  manifestacionId,
  manifestacionTitulo,
}: ItemsModalProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    codigoBarras: '',
    numeroInventario: '',
    idUbicacionFisica: undefined as number | undefined,
    idEstadoConservacion: undefined as number | undefined,
    idProcedencia: undefined as number | undefined,
    disponiblePrestamo: true,
    fechaAdquisicion: '',
  })

  // Datos mock para selects
  const ubicacionesMock = [
    { value: '', label: 'Seleccionar...' },
    { value: '1', label: 'Sala A - Estante 1' },
    { value: '2', label: 'Sala A - Estante 2' },
    { value: '3', label: 'Sala B - Estante 1' },
    { value: '4', label: 'Sala B - Estante 2' },
    { value: '5', label: 'Depósito - Estante 3' },
  ]

  const estadosConservacionMock = [
    { value: '', label: 'Seleccionar...' },
    { value: '1', label: 'Excelente' },
    { value: '2', label: 'Bueno' },
    { value: '3', label: 'Regular' },
    { value: '4', label: 'Requiere Reparación' },
    { value: '5', label: 'Dañado' },
  ]

  const procedenciasMock = [
    { value: '', label: 'Seleccionar...' },
    { value: '1', label: 'Compra' },
    { value: '2', label: 'Donación' },
    { value: '3', label: 'Canje' },
    { value: '4', label: 'Depósito Legal' },
  ]

  const generarCodigoBarras = () => {
    // Generar código de barras único (simulado)
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `BAR-${timestamp}-${random}`
  }

  const generarNumeroInventario = () => {
    // Generar número de inventario secuencial
    const siguienteNumero = items.length + 1
    return `INV-${siguienteNumero.toString().padStart(6, '0')}`
  }

  useEffect(() => {
    if (isOpen) {
      loadItems()
    }
  }, [isOpen, manifestacionId])

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await catalogoService.getItems(manifestacionId)
      setItems(response.data.data || [])
    } catch (error) {
      console.error('Error cargando items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      codigoBarras: generarCodigoBarras(),
      numeroInventario: generarNumeroInventario(),
      idUbicacionFisica: undefined,
      idEstadoConservacion: undefined,
      idProcedencia: undefined,
      disponiblePrestamo: true,
      fechaAdquisicion: new Date().toISOString().split('T')[0],
    })
  }

  const handleSave = async () => {
    // Validaciones
    if (!formData.codigoBarras.trim()) {
      alert('El código de barras es requerido')
      return
    }
    if (!formData.numeroInventario.trim()) {
      alert('El número de inventario es requerido')
      return
    }

    // Verificar duplicados
    const codigoBarrasDuplicado = items.some(
      (i) => i.codigoBarras === formData.codigoBarras && i.id !== editingId
    )
    if (codigoBarrasDuplicado) {
      alert('Ya existe un ejemplar con este código de barras')
      return
    }

    const numeroInventarioDuplicado = items.some(
      (i) => i.numeroInventario === formData.numeroInventario && i.id !== editingId
    )
    if (numeroInventarioDuplicado) {
      alert('Ya existe un ejemplar con este número de inventario')
      return
    }

    try {
      if (editingId) {
        await catalogoService.updateItem(editingId, formData)
      } else {
        await catalogoService.createItem(manifestacionId, formData)
      }
      await loadItems()
      setIsCreating(false)
      setEditingId(null)
      setFormData({
        codigoBarras: '',
        numeroInventario: '',
        idUbicacionFisica: undefined,
        idEstadoConservacion: undefined,
        idProcedencia: undefined,
        disponiblePrestamo: true,
        fechaAdquisicion: '',
      })
    } catch (error) {
      console.error('Error guardando item:', error)
      alert('Error al guardar el item')
    }
  }

  const handleEdit = (item: Item) => {
    setEditingId(item.id)
    setFormData({
      codigoBarras: item.codigoBarras,
      numeroInventario: item.numeroInventario,
      idUbicacionFisica: item.idUbicacionFisica,
      idEstadoConservacion: item.idEstadoConservacion,
      idProcedencia: item.idProcedencia,
      disponiblePrestamo: item.disponiblePrestamo,
      fechaAdquisicion: item.fechaAdquisicion
        ? new Date(item.fechaAdquisicion).toISOString().split('T')[0]
        : '',
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este ejemplar?')) {
      try {
        await catalogoService.deleteItem(id)
        await loadItems()
      } catch (error) {
        console.error('Error eliminando item:', error)
        alert('Error al eliminar el item')
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ejemplares - ${manifestacionTitulo}`}
      size="xl"
    >
      <div className="space-y-4">
        {/* Resumen de stock */}
        <div className="bg-background-primary border border-accent rounded-md p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-text-secondary mb-1">Total Ejemplares</p>
              <p className="text-2xl font-bold text-text-primary">{items.length}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Disponibles</p>
              <p className="text-2xl font-bold text-success">
                {items.filter((i) => i.disponiblePrestamo).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">No Disponibles</p>
              <p className="text-2xl font-bold text-error">
                {items.filter((i) => !i.disponiblePrestamo).length}
              </p>
            </div>
          </div>
        </div>
        {/* Botón crear */}
        {!isCreating && (
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleCreate}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              Nuevo Ejemplar
            </Button>
          </div>
        )}

        {/* Formulario crear/editar */}
        {isCreating && (
          <div className="bg-background-primary border border-accent rounded-md p-4 space-y-4">
            <h4 className="text-sm font-display text-text-primary">
              {editingId ? 'Editar Ejemplar' : 'Nuevo Ejemplar'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Código de Barras"
                  value={formData.codigoBarras}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoBarras: e.target.value })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, codigoBarras: generarCodigoBarras() })}
                  className="mt-1 flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  Generar
                </Button>
              </div>
              <div>
                <Input
                  label="Número de Inventario"
                  value={formData.numeroInventario}
                  onChange={(e) =>
                    setFormData({ ...formData, numeroInventario: e.target.value })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({ ...formData, numeroInventario: generarNumeroInventario() })
                  }
                  className="mt-1 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Generar
                </Button>
              </div>
              <Select
                label="Ubicación Física"
                value={formData.idUbicacionFisica?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idUbicacionFisica: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                {ubicacionesMock.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Estado de Conservación"
                value={formData.idEstadoConservacion?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idEstadoConservacion: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                {estadosConservacionMock.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Procedencia"
                value={formData.idProcedencia?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idProcedencia: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              >
                {procedenciasMock.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Fecha de Adquisición"
                type="date"
                value={formData.fechaAdquisicion}
                onChange={(e) =>
                  setFormData({ ...formData, fechaAdquisicion: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="disponiblePrestamo"
                checked={formData.disponiblePrestamo}
                onChange={(e) =>
                  setFormData({ ...formData, disponiblePrestamo: e.target.checked })
                }
                className="w-4 h-4 border-accent rounded"
              />
              <label
                htmlFor="disponiblePrestamo"
                className="text-sm text-text-primary"
              >
                Disponible para préstamo
              </label>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setEditingId(null)
                }}
              >
                Cancelar
              </Button>
              <Button variant="default" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de items */}
        {loading ? (
          <div className="text-center py-8 text-text-secondary">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Package className="w-12 h-12 mx-auto mb-2 text-text-secondary opacity-50" />
            <p>No hay ejemplares registrados</p>
          </div>
        ) : (
          <div className="border border-accent rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-background-primary border-b border-accent">
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Código Barras
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Inventario
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Ubicación
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Estado Conservación
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Disponible
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-display text-accent-active">
                      Acciones
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-accent hover:bg-background-primary transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary font-mono">
                        {item.codigoBarras}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {item.numeroInventario}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        {item.ubicacionFisica ? (
                          <>
                            <MapPin className="w-3 h-3" />
                            {item.ubicacionFisica}
                          </>
                        ) : (
                          <span className="text-text-secondary opacity-50">Sin ubicación</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.estadoConservacion ? (
                        <span className="text-xs px-2 py-1 rounded-md bg-accent/20 text-accent-active">
                          {item.estadoConservacion}
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary opacity-50">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-md ${
                          item.disponiblePrestamo
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        {item.disponiblePrestamo ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-md hover:bg-background-primary transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-md hover:bg-background-primary transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-error" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  )
}
