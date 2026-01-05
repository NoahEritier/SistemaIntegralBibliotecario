import { create } from 'zustand'
import { UsuarioLector, Prestamo, Sancion } from './circulacionStore'
import { CategoriaUsuario } from './politicasStore'

export interface Multa {
  id: number
  idPrestamo: number
  idUsuario: number
  motivo: string
  monto: number
  fechaGeneracion: string
  fechaVencimiento: string
  fechaPago?: string
  estado: 'Pendiente' | 'Pagada' | 'Condonada'
}

export interface SocioCompleto extends UsuarioLector {
  prestamosActivos: Prestamo[]
  prestamosHistoricos: Prestamo[]
  multas: Multa[]
  fechaAlta: string
  fechaBaja?: string
  bloqueado: boolean
  motivoBloqueo?: string
}

export interface SociosState {
  socios: SocioCompleto[]
  getSocioById: (id: number) => SocioCompleto | undefined
  getSocioByDni: (dni: string) => SocioCompleto | undefined
  addSocio: (socio: Omit<SocioCompleto, 'id' | 'prestamosActivos' | 'prestamosHistoricos' | 'multas'>) => void
  updateSocio: (id: number, updates: Partial<SocioCompleto>) => void
  bloquearSocio: (id: number, motivo: string) => void
  desbloquearSocio: (id: number) => void
  darDeBaja: (id: number) => void
  reactivarSocio: (id: number) => void
  condonarMulta: (multaId: number) => void
  pagarMulta: (multaId: number) => void
  getPrestamosSocio: (idUsuario: number) => Prestamo[]
  getMultasSocio: (idUsuario: number) => Multa[]
}

// Datos mock
const sociosMock: SocioCompleto[] = [
  {
    id: 1,
    legajoDni: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    categoriaUsuario: 'Estudiante',
    estadoUsuario: 'Activo',
    sancionesVigentes: [],
    fechaAlta: '2024-01-15T10:00:00',
    bloqueado: false,
    prestamosActivos: [
      {
        id: 1,
        idItem: 1,
        idUsuario: 1,
        fechaPrestamo: '2024-12-01T10:00:00',
        fechaVencimiento: '2024-12-16T10:00:00',
        renovacionesContador: 0,
      },
    ],
    prestamosHistoricos: [
      {
        id: 10,
        idItem: 5,
        idUsuario: 1,
        fechaPrestamo: '2024-11-01T10:00:00',
        fechaVencimiento: '2024-11-16T10:00:00',
        fechaDevolucion: '2024-11-20T10:00:00',
        renovacionesContador: 0,
      },
    ],
    multas: [
      {
        id: 1,
        idPrestamo: 10,
        idUsuario: 1,
        motivo: 'Devolución tardía (4 días)',
        monto: 400,
        fechaGeneracion: '2024-11-20T10:00:00',
        fechaVencimiento: '2024-12-20T10:00:00',
        estado: 'Pendiente',
      },
    ],
  },
  {
    id: 2,
    legajoDni: '87654321',
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@example.com',
    categoriaUsuario: 'Docente',
    estadoUsuario: 'Sancionado',
    sancionesVigentes: [
      {
        id: 1,
        motivo: 'Devolución tardía',
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-15',
        activa: true,
      },
    ],
    fechaAlta: '2024-02-20T10:00:00',
    bloqueado: false,
    prestamosActivos: [],
    prestamosHistoricos: [],
    multas: [],
  },
  {
    id: 3,
    legajoDni: '11223344',
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@example.com',
    categoriaUsuario: 'Investigador',
    estadoUsuario: 'Inactivo',
    sancionesVigentes: [],
    fechaAlta: '2024-03-10T10:00:00',
    fechaBaja: '2024-11-30T10:00:00',
    bloqueado: true,
    motivoBloqueo: 'Incumplimiento reiterado de normas',
    prestamosActivos: [],
    prestamosHistoricos: [],
    multas: [],
  },
  {
    id: 4,
    legajoDni: '55667788',
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@example.com',
    categoriaUsuario: 'Estudiante',
    estadoUsuario: 'Activo',
    sancionesVigentes: [],
    fechaAlta: '2024-04-05T10:00:00',
    bloqueado: false,
    prestamosActivos: [
      {
        id: 2,
        idItem: 2,
        idUsuario: 4,
        fechaPrestamo: '2024-12-05T10:00:00',
        fechaVencimiento: '2024-12-20T10:00:00',
        renovacionesContador: 1,
      },
    ],
    prestamosHistoricos: [],
    multas: [
      {
        id: 2,
        idPrestamo: 15,
        idUsuario: 4,
        motivo: 'Daño en material',
        monto: 1500,
        fechaGeneracion: '2024-11-25T10:00:00',
        fechaVencimiento: '2024-12-25T10:00:00',
        estado: 'Pendiente',
      },
    ],
  },
]

export const useSociosStore = create<SociosState>((set, get) => ({
  socios: sociosMock,

  getSocioById: (id) => {
    return get().socios.find((s) => s.id === id)
  },

  getSocioByDni: (dni) => {
    return get().socios.find((s) => s.legajoDni === dni)
  },

  addSocio: (socio) => {
    const nuevoSocio: SocioCompleto = {
      ...socio,
      id: Date.now(),
      prestamosActivos: [],
      prestamosHistoricos: [],
      multas: [],
      fechaAlta: new Date().toISOString(),
      bloqueado: false,
    }
    set((state) => ({
      socios: [...state.socios, nuevoSocio],
    }))
  },

  updateSocio: (id, updates) => {
    set((state) => ({
      socios: state.socios.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  },

  bloquearSocio: (id, motivo) => {
    set((state) => ({
      socios: state.socios.map((s) =>
        s.id === id
          ? {
              ...s,
              bloqueado: true,
              motivoBloqueo: motivo,
              estadoUsuario: 'Sancionado' as const,
            }
          : s
      ),
    }))
  },

  desbloquearSocio: (id) => {
    set((state) => ({
      socios: state.socios.map((s) =>
        s.id === id
          ? {
              ...s,
              bloqueado: false,
              motivoBloqueo: undefined,
              estadoUsuario: s.sancionesVigentes.length > 0 ? ('Sancionado' as const) : ('Activo' as const),
            }
          : s
      ),
    }))
  },

  darDeBaja: (id) => {
    set((state) => ({
      socios: state.socios.map((s) =>
        s.id === id
          ? {
              ...s,
              estadoUsuario: 'Inactivo' as const,
              fechaBaja: new Date().toISOString(),
            }
          : s
      ),
    }))
  },

  reactivarSocio: (id) => {
    set((state) => ({
      socios: state.socios.map((s) =>
        s.id === id
          ? {
              ...s,
              estadoUsuario: 'Activo' as const,
              fechaBaja: undefined,
            }
          : s
      ),
    }))
  },

  condonarMulta: (multaId) => {
    set((state) => ({
      socios: state.socios.map((s) => ({
        ...s,
        multas: s.multas.map((m) =>
          m.id === multaId ? { ...m, estado: 'Condonada' as const, fechaPago: new Date().toISOString() } : m
        ),
      })),
    }))
  },

  pagarMulta: (multaId) => {
    set((state) => ({
      socios: state.socios.map((s) => ({
        ...s,
        multas: s.multas.map((m) =>
          m.id === multaId ? { ...m, estado: 'Pagada' as const, fechaPago: new Date().toISOString() } : m
        ),
      })),
    }))
  },

  getPrestamosSocio: (idUsuario) => {
    const socio = get().socios.find((s) => s.id === idUsuario)
    if (!socio) return []
    return [...socio.prestamosActivos, ...socio.prestamosHistoricos]
  },

  getMultasSocio: (idUsuario) => {
    const socio = get().socios.find((s) => s.id === idUsuario)
    if (!socio) return []
    return socio.multas
  },
}))




