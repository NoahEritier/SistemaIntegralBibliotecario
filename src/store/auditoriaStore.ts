import { create } from 'zustand'

export type AccionLog = 'INSERT' | 'UPDATE' | 'DELETE'

export interface LogAuditoria {
  id: string
  timestamp: string
  usuarioStaff: string
  accion: AccionLog
  entidadAfectada: string
  idRegistroAfectado: number | null
  valorAnterior: Record<string, any> | null
  valorNuevo: Record<string, any> | null
}

export interface AuditoriaState {
  logs: LogAuditoria[]
  addLog: (log: Omit<LogAuditoria, 'id' | 'timestamp'>) => void
  getLogs: (filtros?: {
    fechaDesde?: string
    fechaHasta?: string
    usuario?: string
    accion?: AccionLog
  }) => LogAuditoria[]
}

// Datos mock iniciales
const logsIniciales: LogAuditoria[] = [
  {
    id: '1',
    timestamp: '2024-12-15T10:30:00',
    usuarioStaff: 'admin',
    accion: 'DELETE',
    entidadAfectada: 'Manifestacion',
    idRegistroAfectado: 123,
    valorAnterior: { id: 123, titulo: 'Libro Eliminado', isbn: '123456789' },
    valorNuevo: null,
  },
  {
    id: '2',
    timestamp: '2024-12-15T09:15:00',
    usuarioStaff: 'maria.garcia',
    accion: 'UPDATE',
    entidadAfectada: 'UsuarioLector',
    idRegistroAfectado: 456,
    valorAnterior: { idEstadoUsuario: 1 },
    valorNuevo: { idEstadoUsuario: 2 },
  },
  {
    id: '3',
    timestamp: '2024-12-14T16:45:00',
    usuarioStaff: 'juan.perez',
    accion: 'UPDATE',
    entidadAfectada: 'Prestamo',
    idRegistroAfectado: 789,
    valorAnterior: { fechaVencimiento: '2024-12-10' },
    valorNuevo: { fechaVencimiento: '2024-12-20' },
  },
  {
    id: '4',
    timestamp: '2024-12-14T14:20:00',
    usuarioStaff: 'admin',
    accion: 'INSERT',
    entidadAfectada: 'Manifestacion',
    idRegistroAfectado: 999,
    valorAnterior: null,
    valorNuevo: { id: 999, titulo: 'Nuevo Libro', isbn: '987654321' },
  },
  {
    id: '5',
    timestamp: '2024-12-13T11:00:00',
    usuarioStaff: 'maria.garcia',
    accion: 'DELETE',
    entidadAfectada: 'Item',
    idRegistroAfectado: 321,
    valorAnterior: { id: 321, codigoBarras: 'ITEM-321' },
    valorNuevo: null,
  },
]

export const useAuditoriaStore = create<AuditoriaState>((set, get) => ({
  logs: logsIniciales,
  addLog: (log) => {
    const newLog: LogAuditoria = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    set((state) => ({
      logs: [newLog, ...state.logs],
    }))
  },
  getLogs: (filtros) => {
    let logs = get().logs

    if (filtros?.fechaDesde) {
      logs = logs.filter((log) => log.timestamp >= filtros.fechaDesde!)
    }

    if (filtros?.fechaHasta) {
      logs = logs.filter((log) => log.timestamp <= filtros.fechaHasta!)
    }

    if (filtros?.usuario) {
      logs = logs.filter((log) =>
        log.usuarioStaff.toLowerCase().includes(filtros.usuario!.toLowerCase())
      )
    }

    if (filtros?.accion) {
      logs = logs.filter((log) => log.accion === filtros.accion)
    }

    return logs
  },
}))




