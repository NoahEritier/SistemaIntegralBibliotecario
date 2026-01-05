import { CredencialDigital } from '@/components/usuario/CredencialDigital'
import { MisPrestamosTable } from '@/components/usuario/MisPrestamosTable'

export function MisPrestamosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-text-primary">Mi Cuenta</h2>
        <p className="text-sm text-text-secondary mt-1">
          Dashboard personal y gestión de préstamos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CredencialDigital />
        <div className="bg-background-secondary border border-accent rounded-md p-6">
          <h3 className="text-lg font-display text-text-primary mb-4">Información Personal</h3>
          <div className="space-y-2 text-sm">
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Email:</span> usuario@example.com
            </p>
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Teléfono:</span> +54 11 1234-5678
            </p>
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Dirección:</span> Calle Falsa 123
            </p>
          </div>
        </div>
      </div>

      <MisPrestamosTable />
    </div>
  )
}
