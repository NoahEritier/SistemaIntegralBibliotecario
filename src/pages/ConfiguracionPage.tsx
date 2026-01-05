import { MatrizPoliticas } from '@/components/configuracion/MatrizPoliticas'
import { StaffTable } from '@/components/staff/StaffTable'
import { useAuthStore } from '@/store/authStore'

export function ConfiguracionPage() {
  const { role } = useAuthStore()

  return (
    <div className="space-y-6">
      {role === 'DIRECTOR' && (
        <>
          <div>
            <h2 className="text-2xl font-display text-text-primary">Configuración</h2>
            <p className="text-sm text-text-secondary mt-1">
              Gestión de políticas y personal del sistema
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-display text-text-primary mb-4">
                Gestión de Staff
              </h3>
              <StaffTable />
            </div>

            <div>
              <h3 className="text-lg font-display text-text-primary mb-4">
                Motor de Políticas de Circulación
              </h3>
              <MatrizPoliticas />
            </div>
          </div>
        </>
      )}
      {role !== 'DIRECTOR' && <MatrizPoliticas />}
    </div>
  )
}
