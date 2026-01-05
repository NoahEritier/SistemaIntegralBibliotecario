import { AlertCircle, Info, AlertTriangle, Package, ShieldAlert } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useEffect, useState } from 'react'

interface Alerta {
  id: string
  tipo: 'info' | 'warning' | 'error'
  mensaje: string
  fecha: string
  icon?: React.ComponentType<{ className?: string }>
}

interface AlertasTableProps {
  alertas?: Alerta[]
  autoGenerar?: boolean
}

// Datos mock para stock y sanciones
const stockInsumos = {
  etiquetas: { actual: 150, minimo: 1000, porcentaje: 15 },
  cajasArchivo: { actual: 25, minimo: 200, porcentaje: 12.5 },
  sobresAcidFree: { actual: 80, minimo: 500, porcentaje: 16 },
}

const sancionesGraves = [
  { id: 1, usuario: 'Juan Pérez', motivo: 'Daño grave a material', fecha: '2024-12-10' },
  { id: 2, usuario: 'María García', motivo: 'Pérdida de material', fecha: '2024-12-12' },
  { id: 3, usuario: 'Carlos López', motivo: 'Incumplimiento reiterado', fecha: '2024-12-14' },
]

const tipoConfig = {
  info: {
    icon: Info,
    color: 'text-accent',
    bgColor: 'bg-background-primary',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-accent-active',
    bgColor: 'bg-background-primary',
  },
  error: {
    icon: AlertCircle,
    color: 'text-error',
    bgColor: 'bg-background-primary',
  },
}

export function AlertasTable({ alertas: alertasProp, autoGenerar = false }: AlertasTableProps) {
  const [alertasGeneradas, setAlertasGeneradas] = useState<Alerta[]>([])

  useEffect(() => {
    if (autoGenerar) {
      const nuevasAlertas: Alerta[] = []

      // Alertas de stock bajo
      Object.entries(stockInsumos).forEach(([insumo, datos]) => {
        if (datos.porcentaje < 20) {
          nuevasAlertas.push({
            id: `stock-${insumo}`,
            tipo: 'warning',
            mensaje: `Stock de ${insumo} bajo (${datos.porcentaje}% restante - ${datos.actual}/${datos.minimo} unidades)`,
            fecha: 'Reciente',
            icon: Package,
          })
        }
      })

      // Alertas de sanciones graves
      if (sancionesGraves.length > 0) {
        nuevasAlertas.push({
          id: 'sanciones-graves',
          tipo: 'error',
          mensaje: `${sancionesGraves.length} sanciones apeladas pendientes de revisión`,
          fecha: 'Reciente',
          icon: ShieldAlert,
        })
      }

      setAlertasGeneradas(nuevasAlertas)
    }
  }, [autoGenerar])

  const alertas = alertasProp || alertasGeneradas

  if (alertas.length === 0) {
    return (
      <div className="bg-background-secondary border border-accent rounded-md p-6">
        <h3 className="text-lg font-display text-text-primary mb-4">
          Alertas de Gestión
        </h3>
        <p className="text-text-secondary text-sm">No hay alertas en este momento</p>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <h3 className="text-lg font-display text-text-primary mb-4">
        Alertas de Gestión
      </h3>
      <div className="space-y-2">
        {alertas.map((alerta) => {
          const config = tipoConfig[alerta.tipo]
          const Icon = alerta.icon || config.icon
          return (
            <div
              key={alerta.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-md border border-accent',
                config.bgColor
              )}
            >
              <div className={cn('mt-0.5', config.color)}>
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{alerta.mensaje}</p>
                <p className="text-xs text-text-secondary mt-1">{alerta.fecha}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}



