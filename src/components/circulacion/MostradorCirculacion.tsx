import { useState, useRef, useEffect } from 'react'
import { User, Book, AlertCircle, CheckCircle, XCircle, Scan } from 'lucide-react'
import { useCirculacionStore } from '@/store/circulacionStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

interface SancionModalProps {
  isOpen: boolean
  onClose: () => void
  diasRetraso: number
  onGenerarSancion: () => void
}

function SancionModal({ isOpen, onClose, diasRetraso, onGenerarSancion }: SancionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Sanción" size="md">
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h4 className="font-medium">Devolución Tardía Detectada</h4>
          </div>
          <p className="text-sm text-red-700">
            El material fue devuelto con <strong>{diasRetraso} días de retraso</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Motivo de Sanción
          </label>
          <select className="w-full px-3 py-2 bg-background-secondary border border-accent rounded-md text-text-primary">
            <option>Devolución tardía</option>
            <option>Daño al material</option>
            <option>Pérdida de material</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Días de Suspensión
          </label>
          <Input type="number" defaultValue={diasRetraso * 2} min={1} />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-accent">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onGenerarSancion}>Generar Sanción</Button>
        </div>
      </div>
    </Modal>
  )
}

export function MostradorCirculacion() {
  const {
    usuarioActual,
    itemActual,
    prestamosActivos,
    buscarUsuario,
    buscarItem,
    crearPrestamo,
    registrarDevolucion,
    limpiarEstado,
  } = useCirculacionStore()

  const [dniInput, setDniInput] = useState('')
  const [codigoBarrasInput, setCodigoBarrasInput] = useState('')
  const [modo, setModo] = useState<'prestamo' | 'devolucion'>('prestamo')
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<number | null>(null)
  const [mostrarModalSancion, setMostrarModalSancion] = useState(false)
  const [diasRetraso, setDiasRetraso] = useState(0)

  const dniInputRef = useRef<HTMLInputElement>(null)
  const codigoBarrasInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (modo === 'prestamo') {
      dniInputRef.current?.focus()
    } else {
      codigoBarrasInputRef.current?.focus()
    }
  }, [modo])

  const handleBuscarUsuario = async () => {
    if (!dniInput.trim()) return
    await buscarUsuario(dniInput.trim())
  }

  const handleBuscarItem = async () => {
    if (!codigoBarrasInput.trim()) return
    await buscarItem(codigoBarrasInput.trim())
  }

  const handleNuevoPrestamo = () => {
    if (!usuarioActual || !itemActual) return

    const prestamo = crearPrestamo(itemActual.id, usuarioActual.id)
    if (prestamo) {
      alert(`✅ Préstamo registrado exitosamente\nFecha de vencimiento: ${new Date(prestamo.fechaVencimiento).toLocaleDateString('es-AR')}`)
      setCodigoBarrasInput('')
    }
  }

  const handleRegistrarDevolucion = () => {
    if (!prestamoSeleccionado) return

    const resultado = registrarDevolucion(prestamoSeleccionado)
    if (resultado.esTardio) {
      setDiasRetraso(resultado.diasRetraso)
      setMostrarModalSancion(true)
    } else {
      alert('✅ Devolución registrada exitosamente')
      setPrestamoSeleccionado(null)
      setCodigoBarrasInput('')
    }
  }

  const handleGenerarSancion = () => {
    alert(`✅ Sanción generada por ${diasRetraso} días de retraso`)
    setMostrarModalSancion(false)
    setPrestamoSeleccionado(null)
    setCodigoBarrasInput('')
    limpiarEstado()
  }

  const tieneSancionesVigentes = usuarioActual?.sancionesVigentes.some((s) => s.activa) || false
  const puedePrestar = usuarioActual && !tieneSancionesVigentes && itemActual

  return (
    <div className="space-y-6">
      {/* Selector de modo */}
      <div className="flex gap-2 bg-background-primary p-1 rounded-md border border-accent">
        <button
          onClick={() => {
            setModo('prestamo')
            limpiarEstado()
            setDniInput('')
            setCodigoBarrasInput('')
          }}
          className={cn(
            'flex-1 px-4 py-2 rounded text-sm font-medium transition-colors',
            modo === 'prestamo'
              ? 'bg-accent-active text-background-secondary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Préstamo
        </button>
        <button
          onClick={() => {
            setModo('devolucion')
            limpiarEstado()
            setDniInput('')
            setCodigoBarrasInput('')
          }}
          className={cn(
            'flex-1 px-4 py-2 rounded text-sm font-medium transition-colors',
            modo === 'devolucion'
              ? 'bg-accent-active text-background-secondary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Devolución
        </button>
      </div>

      {/* MODO PRÉSTAMO */}
      {modo === 'prestamo' && (
        <div className="space-y-6">
          {/* Input DNI */}
          <div className="bg-background-secondary border border-accent rounded-md p-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Escanear/Ingresar DNI del Usuario
            </label>
            <div className="flex gap-2">
              <Input
                ref={dniInputRef}
                value={dniInput}
                onChange={(e) => setDniInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleBuscarUsuario()
                }}
                placeholder="Ingrese DNI o Legajo"
                className="text-lg"
              />
              <Button onClick={handleBuscarUsuario} className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Información del Usuario */}
          {usuarioActual && (
            <div className="bg-background-secondary border border-accent rounded-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                  {usuarioActual.fotoUrl ? (
                    <img
                      src={usuarioActual.fotoUrl}
                      alt={usuarioActual.nombre}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-accent-active" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-display text-text-primary">
                      {usuarioActual.nombre} {usuarioActual.apellido}
                    </h3>
                    {usuarioActual.estadoUsuario === 'Activo' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mb-1">
                    DNI: {usuarioActual.legajoDni}
                  </p>
                  <p className="text-sm text-text-secondary mb-1">
                    Categoría: {usuarioActual.categoriaUsuario}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        usuarioActual.estadoUsuario === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {usuarioActual.estadoUsuario}
                    </span>
                  </div>

                  {/* Alerta de sanciones */}
                  {tieneSancionesVigentes && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-800 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Usuario con sanciones vigentes</span>
                      </div>
                      {usuarioActual.sancionesVigentes
                        .filter((s) => s.activa)
                        .map((sancion) => (
                          <p key={sancion.id} className="text-xs text-red-700">
                            {sancion.motivo} - Hasta:{' '}
                            {new Date(sancion.fechaFin).toLocaleDateString('es-AR')}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input Código de Barras */}
          {usuarioActual && !tieneSancionesVigentes && (
            <div className="bg-background-secondary border border-accent rounded-md p-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Escanear/Ingresar Código de Barras del Material
              </label>
              <div className="flex gap-2">
                <Input
                  ref={codigoBarrasInputRef}
                  value={codigoBarrasInput}
                  onChange={(e) => setCodigoBarrasInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleBuscarItem()
                  }}
                  placeholder="Ingrese código de barras"
                  className="text-lg"
                />
                <Button onClick={handleBuscarItem} className="flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  Buscar
                </Button>
              </div>
            </div>
          )}

          {/* Información del Item */}
          {itemActual && usuarioActual && !tieneSancionesVigentes && (
            <div className="bg-background-secondary border border-accent rounded-md p-6">
              <div className="flex items-start gap-4 mb-4">
                <Book className="w-12 h-12 text-accent-active" />
                <div className="flex-1">
                  <h3 className="text-lg font-display text-text-primary mb-1">
                    {itemActual.titulo}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Código: {itemActual.codigoBarras}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Tipo: {itemActual.tipoMaterial}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-accent">
                <Button
                  onClick={handleNuevoPrestamo}
                  disabled={!puedePrestar}
                  className="w-full"
                  size="lg"
                >
                  Registrar Préstamo
                </Button>
              </div>
            </div>
          )}

          {/* Botón bloqueado por sanciones */}
          {usuarioActual && tieneSancionesVigentes && (
            <div className="bg-background-secondary border border-red-300 rounded-md p-6">
              <Button disabled className="w-full" size="lg">
                Nuevo Préstamo (BLOQUEADO - Usuario con sanciones)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* MODO DEVOLUCIÓN */}
      {modo === 'devolucion' && (
        <div className="space-y-6">
          <div className="bg-background-secondary border border-accent rounded-md p-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Escanear/Ingresar Código de Barras del Material
            </label>
            <div className="flex gap-2">
              <Input
                ref={codigoBarrasInputRef}
                value={codigoBarrasInput}
                onChange={(e) => setCodigoBarrasInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleBuscarItem()
                }}
                placeholder="Ingrese código de barras"
                className="text-lg"
              />
              <Button onClick={handleBuscarItem} className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Buscar
              </Button>
            </div>
          </div>

          {itemActual && (
            <div className="bg-background-secondary border border-accent rounded-md p-6">
              <h3 className="text-lg font-display text-text-primary mb-4">
                {itemActual.titulo}
              </h3>
              <div className="space-y-2 mb-4">
                {prestamosActivos
                  .filter((p) => p.idItem === itemActual.id)
                  .map((prestamo) => (
                    <div
                      key={prestamo.id}
                      className={cn(
                        'p-3 border rounded-md cursor-pointer',
                        prestamoSeleccionado === prestamo.id
                          ? 'border-accent-active bg-accent/10'
                          : 'border-accent hover:bg-background-primary'
                      )}
                      onClick={() => setPrestamoSeleccionado(prestamo.id)}
                    >
                      <div className="text-sm">
                        <p className="text-text-primary">
                          Fecha de vencimiento:{' '}
                          {new Date(prestamo.fechaVencimiento).toLocaleDateString('es-AR')}
                        </p>
                        {new Date() > new Date(prestamo.fechaVencimiento) && (
                          <p className="text-red-600 font-medium mt-1">
                            ⚠️ Vencido
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              {prestamoSeleccionado && (
                <Button onClick={handleRegistrarDevolucion} className="w-full" size="lg">
                  Registrar Devolución
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <SancionModal
        isOpen={mostrarModalSancion}
        onClose={() => {
          setMostrarModalSancion(false)
          setPrestamoSeleccionado(null)
          setCodigoBarrasInput('')
        }}
        diasRetraso={diasRetraso}
        onGenerarSancion={handleGenerarSancion}
      />
    </div>
  )
}

