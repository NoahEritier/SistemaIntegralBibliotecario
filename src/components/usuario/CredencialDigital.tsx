import { QRCodeSVG } from 'qrcode.react'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { User } from 'lucide-react'

export function CredencialDigital() {
  const { usuarioActual } = useUsuarioPublicoStore()

  if (!usuarioActual) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-6 text-center">
        <p className="text-text-secondary">No hay información de usuario disponible</p>
      </div>
    )
  }

  const qrData = JSON.stringify({
    id: usuarioActual.id,
    legajoDni: usuarioActual.legajoDni,
    nombre: `${usuarioActual.nombre} ${usuarioActual.apellido}`,
    categoria: usuarioActual.categoriaUsuario,
  })

  return (
    <div className="bg-gradient-to-br from-accent-active to-accent border-2 border-accent-active rounded-lg p-6 text-background-secondary">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-background-secondary/20 rounded-full flex items-center justify-center">
          {usuarioActual.fotoUrl ? (
            <img
              src={usuarioActual.fotoUrl}
              alt={usuarioActual.nombre}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold">
            {usuarioActual.nombre} {usuarioActual.apellido}
          </h3>
          <p className="text-sm opacity-90">DNI: {usuarioActual.legajoDni}</p>
          <p className="text-sm opacity-90">{usuarioActual.categoriaUsuario}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-background-secondary/20 rounded-lg p-4">
        <div className="bg-background-secondary p-2 rounded">
          <QRCodeSVG value={qrData} size={100} level="H" />
        </div>
        <div className="flex-1">
          <p className="text-xs opacity-75 mb-1">Código de Socio</p>
          <p className="font-mono text-lg font-bold">{usuarioActual.legajoDni}</p>
          <p className="text-xs opacity-75 mt-2">
            Escanee este código para acceder a sus servicios
          </p>
        </div>
      </div>
    </div>
  )
}




