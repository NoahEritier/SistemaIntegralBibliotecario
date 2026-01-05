import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { usePoliticasStore, CategoriaUsuario, TipoMaterial } from '@/store/politicasStore'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export function MatrizPoliticas() {
  const { politicas, updatePolitica } = usePoliticasStore()
  const [editingCell, setEditingCell] = useState<{
    categoria: CategoriaUsuario
    material: TipoMaterial
  } | null>(null)
  const [editValues, setEditValues] = useState({
    diasPrestamo: 0,
    cantidadMaxima: 0,
    renovacionesPermitidas: 0,
  })

  const categorias: CategoriaUsuario[] = ['Estudiante', 'Docente', 'Investigador', 'Vecino']
  const materiales: TipoMaterial[] = ['Libro Texto', 'Best Seller', 'DVD', 'Sala']

  const handleCellClick = (categoria: CategoriaUsuario, material: TipoMaterial) => {
    const politica = politicas[categoria][material]
    setEditValues({
      diasPrestamo: politica.diasPrestamo,
      cantidadMaxima: politica.cantidadMaxima,
      renovacionesPermitidas: politica.renovacionesPermitidas,
    })
    setEditingCell({ categoria, material })
  }

  const handleSave = () => {
    if (editingCell) {
      updatePolitica(editingCell.categoria, editingCell.material, editValues)
      setEditingCell(null)
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-display text-text-primary mb-2">
          Motor de Políticas de Circulación
        </h3>
        <p className="text-sm text-text-secondary">
          Haz clic en una celda para editar los parámetros de préstamo
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary bg-background-primary border border-accent sticky left-0 z-10">
                Categoría / Material
              </th>
              {materiales.map((material) => (
                <th
                  key={material}
                  className="px-4 py-3 text-center text-sm font-medium text-text-primary bg-background-primary border border-accent min-w-[180px]"
                >
                  {material}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria}>
                <td className="px-4 py-3 text-sm font-medium text-text-primary bg-background-primary border border-accent sticky left-0 z-10">
                  {categoria}
                </td>
                {materiales.map((material) => {
                  const politica = politicas[categoria][material]
                  const isEditing =
                    editingCell?.categoria === categoria &&
                    editingCell?.material === material

                  return (
                    <td
                      key={material}
                      className={cn(
                        'px-4 py-3 border border-accent text-center',
                        isEditing && 'bg-accent/10'
                      )}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            type="number"
                            value={editValues.diasPrestamo}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                diasPrestamo: parseInt(e.target.value) || 0,
                              })
                            }
                            className="text-xs"
                            placeholder="Días"
                          />
                          <Input
                            type="number"
                            value={editValues.cantidadMaxima}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                cantidadMaxima: parseInt(e.target.value) || 0,
                              })
                            }
                            className="text-xs"
                            placeholder="Cant. Máx"
                          />
                          <Input
                            type="number"
                            value={editValues.renovacionesPermitidas}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                renovacionesPermitidas: parseInt(e.target.value) || 0,
                              })
                            }
                            className="text-xs"
                            placeholder="Renov."
                          />
                          <div className="flex gap-1 justify-center mt-2">
                            <button
                              onClick={handleSave}
                              className="p-1 h-6 w-6 rounded hover:bg-accent-active flex items-center justify-center"
                              title="Guardar"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 h-6 w-6 rounded hover:bg-background-primary flex items-center justify-center"
                              title="Cancelar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-background-primary p-2 rounded transition-colors"
                          onClick={() => handleCellClick(categoria, material)}
                        >
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="text-text-secondary">Días: </span>
                              <span className="font-medium">{politica.diasPrestamo}</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Cant. Máx: </span>
                              <span className="font-medium">{politica.cantidadMaxima}</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Renov.: </span>
                              <span className="font-medium">{politica.renovacionesPermitidas}</span>
                            </div>
                          </div>
                          <Edit2 className="w-3 h-3 text-text-secondary mt-1 mx-auto" />
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

