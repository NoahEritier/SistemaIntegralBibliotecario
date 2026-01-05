import { useState } from 'react'
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { usePoliticasStore } from '@/store/politicasStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function MisPrestamosTable() {
  const { usuarioActual, prestamosUsuario, renovarPrestamo } = useUsuarioPublicoStore()
  const [renovandoId, setRenovandoId] = useState<number | null>(null)

  if (!usuarioActual) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-6 text-center">
        <p className="text-text-secondary">Debe iniciar sesión para ver sus préstamos</p>
      </div>
    )
  }

  const prestamos = prestamosUsuario.filter((p) => p.idUsuario === usuarioActual.id)

  const handleRenovar = async (prestamoId: number, tipoMaterial: string) => {
    setRenovandoId(prestamoId)
    
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const resultado = renovarPrestamo(
      prestamoId,
      usuarioActual.id,
      usuarioActual.categoriaUsuario,
      tipoMaterial as any
    )

    setRenovandoId(null)

    if (resultado.exito && resultado.nuevaFecha) {
      alert(
        `✅ ${resultado.mensaje}\nNueva fecha de vencimiento: ${new Date(resultado.nuevaFecha).toLocaleDateString('es-AR')}`
      )
    } else {
      alert(`❌ ${resultado.mensaje}`)
    }
  }

  if (prestamos.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-6 text-center">
        <p className="text-text-secondary">No tiene préstamos activos</p>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md overflow-hidden">
      <div className="p-4 border-b border-accent">
        <h3 className="text-lg font-display text-text-primary">Mis Préstamos</h3>
        <p className="text-sm text-text-secondary">
          {prestamos.length} préstamo(s) activo(s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent bg-background-primary">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Título
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Fecha de Préstamo
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Fecha de Vencimiento
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Renovaciones
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((prestamo) => {
              const fechaVencimiento = new Date(prestamo.fechaVencimiento)
              const fechaActual = new Date()
              const diasRestantes = Math.ceil(
                (fechaVencimiento.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24)
              )
              const estaVencido = fechaActual > fechaVencimiento
              const estaPorVencer = diasRestantes <= 3 && diasRestantes > 0


              // Obtener política para validar renovación
              const { getPolitica } = usePoliticasStore.getState()
              const tipoMaterial = (prestamo.tipoMaterial as any) || 'Best Seller'
              const politica = getPolitica(usuarioActual.categoriaUsuario, tipoMaterial)
              const puedeRenovar =
                prestamo.renovacionesContador < politica.renovacionesPermitidas &&
                !estaVencido

              return (
                <tr
                  key={prestamo.id}
                  className="border-b border-accent hover:bg-background-primary transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm text-text-primary font-medium">
                      {prestamo.titulo || `Libro #${prestamo.idItem}`}
                    </div>
                    {prestamo.autor && (
                      <div className="text-xs text-text-secondary">{prestamo.autor}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm',
                          estaVencido
                            ? 'text-red-600 font-medium'
                            : estaPorVencer
                              ? 'text-orange-600 font-medium'
                              : 'text-text-primary'
                        )}
                      >
                        {fechaVencimiento.toLocaleDateString('es-AR')}
                      </span>
                      {estaVencido && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      {estaPorVencer && !estaVencido && (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    {!estaVencido && (
                      <p className="text-xs text-text-secondary mt-1">
                        {diasRestantes > 0
                          ? `${diasRestantes} día(s) restante(s)`
                          : 'Vence hoy'}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {prestamo.renovacionesContador} / {politica.renovacionesPermitidas}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        estaVencido
                          ? 'bg-red-100 text-red-800'
                          : estaPorVencer
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                      )}
                    >
                      {estaVencido
                        ? 'Vencido'
                        : estaPorVencer
                          ? 'Por vencer'
                          : 'Activo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRenovar(prestamo.id, tipoMaterial)
                      }
                      disabled={!puedeRenovar || renovandoId === prestamo.id}
                      className="flex items-center gap-2"
                    >
                      {renovandoId === prestamo.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Renovando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Renovar
                        </>
                      )}
                    </Button>
                    {!puedeRenovar && (
                      <p className="text-xs text-text-secondary mt-1">
                        {estaVencido
                          ? 'No se puede renovar: préstamo vencido'
                          : 'Límite de renovaciones alcanzado'}
                      </p>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

