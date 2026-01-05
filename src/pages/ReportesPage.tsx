import { useState } from 'react'
import { useAuditoriaStore, AccionLog } from '@/store/auditoriaStore'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { LogAuditoria } from '@/store/auditoriaStore'

export function ReportesPage() {
  const { getLogs } = useAuditoriaStore()
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    usuario: '',
    accion: '' as AccionLog | '',
  })

  const logsFiltrados = getLogs({
    fechaDesde: filtros.fechaDesde || undefined,
    fechaHasta: filtros.fechaHasta || undefined,
    usuario: filtros.usuario || undefined,
    accion: filtros.accion || undefined,
  })

  const columns: Column<LogAuditoria>[] = [
    {
      key: 'timestamp',
      header: 'Fecha y Hora',
      sortable: true,
      render: (value) => {
        const date = new Date(value)
        return (
          <div>
            <div className="text-sm text-text-primary">
              {date.toLocaleDateString('es-AR')}
            </div>
            <div className="text-xs text-text-secondary">
              {date.toLocaleTimeString('es-AR')}
            </div>
          </div>
        )
      },
    },
    {
      key: 'usuarioStaff',
      header: 'Usuario',
      sortable: true,
    },
    {
      key: 'accion',
      header: 'Acción',
      sortable: true,
      render: (value: AccionLog) => {
        const colores = {
          INSERT: 'bg-green-100 text-green-800',
          UPDATE: 'bg-blue-100 text-blue-800',
          DELETE: 'bg-red-100 text-red-800',
        }
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              colores[value] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        )
      },
    },
    {
      key: 'entidadAfectada',
      header: 'Entidad',
      sortable: true,
    },
    {
      key: 'idRegistroAfectado',
      header: 'ID Registro',
      sortable: true,
      render: (value) => (value ? `#${value}` : '-'),
    },
    {
      key: 'valorAnterior',
      header: 'Valor Anterior',
      render: (value) => {
        if (!value) return <span className="text-text-secondary">-</span>
        return (
          <details className="cursor-pointer">
            <summary className="text-xs text-text-secondary hover:text-text-primary">
              Ver anterior
            </summary>
            <pre className="mt-2 text-xs bg-background-primary p-2 rounded overflow-auto max-w-xs">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        )
      },
    },
    {
      key: 'valorNuevo',
      header: 'Valor Nuevo',
      render: (value) => {
        if (!value) return <span className="text-text-secondary">-</span>
        return (
          <details className="cursor-pointer">
            <summary className="text-xs text-text-secondary hover:text-text-primary">
              Ver nuevo
            </summary>
            <pre className="mt-2 text-xs bg-background-primary p-2 rounded overflow-auto max-w-xs">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        )
      },
    },
  ]

  const handleResetFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      usuario: '',
      accion: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-background-secondary border border-accent rounded-md p-6">
        <h3 className="text-lg font-display text-text-primary mb-4">
          Auditoría y Seguridad - Logs del Sistema
        </h3>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Input
            type="date"
            label="Fecha Desde"
            value={filtros.fechaDesde}
            onChange={(e) =>
              setFiltros({ ...filtros, fechaDesde: e.target.value })
            }
          />
          <Input
            type="date"
            label="Fecha Hasta"
            value={filtros.fechaHasta}
            onChange={(e) =>
              setFiltros({ ...filtros, fechaHasta: e.target.value })
            }
          />
          <Input
            label="Usuario"
            placeholder="Buscar usuario..."
            value={filtros.usuario}
            onChange={(e) =>
              setFiltros({ ...filtros, usuario: e.target.value })
            }
          />
          <Select
            label="Acción"
            value={filtros.accion}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                accion: e.target.value as AccionLog | '',
              })
            }
          >
            <option value="">Todas</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </Select>
          <div className="flex items-end">
            <Button onClick={handleResetFiltros} variant="outline" className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Tabla de Logs */}
        <DataTable
          data={logsFiltrados}
          columns={columns}
          pageSize={10}
          searchable={false}
        />
      </div>
    </div>
  )
}
