import { create } from 'zustand'
import { usePoliticasStore, CategoriaUsuario, TipoMaterial } from './politicasStore'

export interface UsuarioLector {
  id: number
  legajoDni: string
  nombre: string
  apellido: string
  email: string
  fotoUrl?: string
  categoriaUsuario: CategoriaUsuario
  estadoUsuario: 'Activo' | 'Sancionado' | 'Inactivo'
  sancionesVigentes: Sancion[]
}

export interface Sancion {
  id: number
  motivo: string
  fechaInicio: string
  fechaFin: string
  activa: boolean
}

export interface Item {
  id: number
  codigoBarras: string
  titulo: string
  autor?: string
  tipoMaterial: TipoMaterial
  disponible: boolean
}

export interface Prestamo {
  id: number
  idItem: number
  idUsuario: number
  fechaPrestamo: string
  fechaVencimiento: string
  fechaDevolucion?: string
  renovacionesContador: number
  // Datos adicionales para la lista
  titulo?: string
  autor?: string
  codigoBarras?: string
  nombreUsuario?: string
  apellidoUsuario?: string
  legajoDni?: string
  estado?: 'Activo' | 'Vencido' | 'Devuelto' | 'Devuelto Tardío'
}

export interface CirculacionState {
  usuarioActual: UsuarioLector | null
  itemActual: Item | null
  prestamosActivos: Prestamo[]
  prestamosHistoricos: Prestamo[]
  getAllPrestamos: () => Prestamo[]
  buscarUsuario: (dni: string) => Promise<UsuarioLector | null>
  buscarItem: (codigoBarras: string) => Promise<Item | null>
  calcularFechaVencimiento: (
    categoriaUsuario: CategoriaUsuario,
    tipoMaterial: TipoMaterial
  ) => Date
  crearPrestamo: (itemId: number, usuarioId: number) => Prestamo | null
  registrarDevolucion: (prestamoId: number) => { esTardio: boolean; diasRetraso: number }
  limpiarEstado: () => void
}

// Datos mock
const usuariosMock: UsuarioLector[] = [
  {
    id: 1,
    legajoDni: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    categoriaUsuario: 'Estudiante',
    estadoUsuario: 'Activo',
    sancionesVigentes: [],
    fotoUrl: 'https://i.pravatar.cc/150?img=12',
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
    fotoUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 3,
    legajoDni: '11223344',
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@example.com',
    categoriaUsuario: 'Investigador',
    estadoUsuario: 'Activo',
    sancionesVigentes: [],
    fotoUrl: 'https://i.pravatar.cc/150?img=33',
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
    fotoUrl: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 5,
    legajoDni: '99887766',
    nombre: 'Roberto',
    apellido: 'Fernández',
    email: 'roberto.fernandez@example.com',
    categoriaUsuario: 'Vecino',
    estadoUsuario: 'Activo',
    sancionesVigentes: [],
    fotoUrl: 'https://i.pravatar.cc/150?img=15',
  },
]

const itemsMock: Item[] = [
  {
    id: 1,
    codigoBarras: 'BAR-001',
    titulo: 'Cien años de soledad',
    autor: 'García Márquez, Gabriel',
    tipoMaterial: 'Best Seller',
    disponible: true,
  },
  {
    id: 2,
    codigoBarras: 'BAR-002',
    titulo: 'El Quijote de la Mancha',
    autor: 'Cervantes, Miguel de',
    tipoMaterial: 'Libro Texto',
    disponible: true,
  },
  {
    id: 3,
    codigoBarras: 'BAR-003',
    titulo: '1984',
    autor: 'Orwell, George',
    tipoMaterial: 'Best Seller',
    disponible: false,
  },
  {
    id: 4,
    codigoBarras: 'BAR-004',
    titulo: 'Rayuela',
    autor: 'Cortázar, Julio',
    tipoMaterial: 'Best Seller',
    disponible: true,
  },
  {
    id: 5,
    codigoBarras: 'BAR-005',
    titulo: 'Ficciones',
    autor: 'Borges, Jorge Luis',
    tipoMaterial: 'Libro Texto',
    disponible: true,
  },
  {
    id: 6,
    codigoBarras: 'BAR-006',
    titulo: 'La ciudad y los perros',
    autor: 'Vargas Llosa, Mario',
    tipoMaterial: 'Best Seller',
    disponible: false,
  },
  {
    id: 7,
    codigoBarras: 'BAR-007',
    titulo: 'Pedro Páramo',
    autor: 'Rulfo, Juan',
    tipoMaterial: 'Libro Texto',
    disponible: true,
  },
  {
    id: 8,
    codigoBarras: 'BAR-008',
    titulo: 'El Aleph',
    autor: 'Borges, Jorge Luis',
    tipoMaterial: 'Best Seller',
    disponible: true,
  },
]

// Datos mock de préstamos históricos
const prestamosHistoricosMock: Prestamo[] = [
  {
    id: 1001,
    idItem: 1,
    idUsuario: 1,
    fechaPrestamo: '2024-11-01T10:00:00',
    fechaVencimiento: '2024-11-15T23:59:59',
    fechaDevolucion: '2024-11-14T15:30:00',
    renovacionesContador: 0,
    titulo: 'Cien años de soledad',
    autor: 'García Márquez, Gabriel',
    codigoBarras: 'BAR-001',
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    legajoDni: '12345678',
    estado: 'Devuelto',
  },
  {
    id: 1002,
    idItem: 2,
    idUsuario: 2,
    fechaPrestamo: '2024-10-15T09:00:00',
    fechaVencimiento: '2024-11-15T23:59:59',
    fechaDevolucion: '2024-11-20T16:00:00',
    renovacionesContador: 1,
    titulo: 'El Quijote de la Mancha',
    autor: 'Cervantes, Miguel de',
    codigoBarras: 'BAR-002',
    nombreUsuario: 'María',
    apellidoUsuario: 'García',
    legajoDni: '87654321',
    estado: 'Devuelto Tardío',
  },
  {
    id: 1003,
    idItem: 4,
    idUsuario: 3,
    fechaPrestamo: '2024-11-10T14:00:00',
    fechaVencimiento: '2024-11-24T23:59:59',
    fechaDevolucion: '2024-11-22T11:00:00',
    renovacionesContador: 0,
    titulo: 'Rayuela',
    autor: 'Cortázar, Julio',
    codigoBarras: 'BAR-004',
    nombreUsuario: 'Carlos',
    apellidoUsuario: 'López',
    legajoDni: '11223344',
    estado: 'Devuelto',
  },
  {
    id: 1004,
    idItem: 5,
    idUsuario: 4,
    fechaPrestamo: '2024-10-20T10:00:00',
    fechaVencimiento: '2024-11-03T23:59:59',
    fechaDevolucion: '2024-11-01T09:30:00',
    renovacionesContador: 0,
    titulo: 'Ficciones',
    autor: 'Borges, Jorge Luis',
    codigoBarras: 'BAR-005',
    nombreUsuario: 'Ana',
    apellidoUsuario: 'Martínez',
    legajoDni: '55667788',
    estado: 'Devuelto',
  },
  {
    id: 1005,
    idItem: 7,
    idUsuario: 5,
    fechaPrestamo: '2024-11-05T11:00:00',
    fechaVencimiento: '2024-11-19T23:59:59',
    fechaDevolucion: '2024-11-18T14:00:00',
    renovacionesContador: 1,
    titulo: 'Pedro Páramo',
    autor: 'Rulfo, Juan',
    codigoBarras: 'BAR-007',
    nombreUsuario: 'Roberto',
    apellidoUsuario: 'Fernández',
    legajoDni: '99887766',
    estado: 'Devuelto',
  },
  {
    id: 1006,
    idItem: 8,
    idUsuario: 1,
    fechaPrestamo: '2024-10-25T08:00:00',
    fechaVencimiento: '2024-11-08T23:59:59',
    fechaDevolucion: '2024-11-10T10:00:00',
    renovacionesContador: 0,
    titulo: 'El Aleph',
    autor: 'Borges, Jorge Luis',
    codigoBarras: 'BAR-008',
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    legajoDni: '12345678',
    estado: 'Devuelto Tardío',
  },
]

// Préstamos activos mock (para demostración)
const prestamosActivosMock: Prestamo[] = [
  {
    id: 2001,
    idItem: 1,
    idUsuario: 1,
    fechaPrestamo: '2024-12-10T10:00:00',
    fechaVencimiento: '2024-12-24T23:59:59',
    renovacionesContador: 0,
    titulo: 'Cien años de soledad',
    autor: 'García Márquez, Gabriel',
    codigoBarras: 'BAR-001',
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    legajoDni: '12345678',
    estado: 'Activo',
  },
  {
    id: 2002,
    idItem: 4,
    idUsuario: 3,
    fechaPrestamo: '2024-12-05T14:00:00',
    fechaVencimiento: '2024-12-19T23:59:59',
    renovacionesContador: 1,
    titulo: 'Rayuela',
    autor: 'Cortázar, Julio',
    codigoBarras: 'BAR-004',
    nombreUsuario: 'Carlos',
    apellidoUsuario: 'López',
    legajoDni: '11223344',
    estado: 'Activo',
  },
  {
    id: 2003,
    idItem: 5,
    idUsuario: 4,
    fechaPrestamo: '2024-11-25T09:00:00',
    fechaVencimiento: '2024-12-09T23:59:59',
    renovacionesContador: 0,
    titulo: 'Ficciones',
    autor: 'Borges, Jorge Luis',
    codigoBarras: 'BAR-005',
    nombreUsuario: 'Ana',
    apellidoUsuario: 'Martínez',
    legajoDni: '55667788',
    estado: 'Vencido', // Este está vencido
  },
]

export const useCirculacionStore = create<CirculacionState>((set, get) => ({
  usuarioActual: null,
  itemActual: null,
  prestamosActivos: prestamosActivosMock,
  prestamosHistoricos: prestamosHistoricosMock,

  buscarUsuario: async (dni: string) => {
    const usuario = usuariosMock.find((u) => u.legajoDni === dni)
    if (usuario) {
      set({ usuarioActual: usuario })
      return usuario
    }
    set({ usuarioActual: null })
    return null
  },

  buscarItem: async (codigoBarras: string) => {
    const item = itemsMock.find((i) => i.codigoBarras === codigoBarras)
    if (item) {
      set({ itemActual: item })
      return item
    }
    set({ itemActual: null })
    return null
  },

  calcularFechaVencimiento: (categoriaUsuario, tipoMaterial) => {
    const { getPolitica } = usePoliticasStore.getState()
    const politica = getPolitica(categoriaUsuario, tipoMaterial)
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + politica.diasPrestamo)
    return fecha
  },

  crearPrestamo: (itemId, usuarioId) => {
    const { usuarioActual, itemActual, calcularFechaVencimiento } = get()
    if (!usuarioActual || !itemActual) return null

    const fechaVencimiento = calcularFechaVencimiento(
      usuarioActual.categoriaUsuario,
      itemActual.tipoMaterial
    )

    const nuevoPrestamo: Prestamo = {
      id: Date.now(),
      idItem: itemId,
      idUsuario: usuarioId,
      fechaPrestamo: new Date().toISOString(),
      fechaVencimiento: fechaVencimiento.toISOString(),
      renovacionesContador: 0,
      titulo: itemActual.titulo,
      autor: itemActual.autor,
      codigoBarras: itemActual.codigoBarras,
      nombreUsuario: usuarioActual.nombre,
      apellidoUsuario: usuarioActual.apellido,
      legajoDni: usuarioActual.legajoDni,
      estado: 'Activo',
    }

    set((state) => ({
      prestamosActivos: [...state.prestamosActivos, nuevoPrestamo],
      itemActual: null,
    }))

    return nuevoPrestamo
  },

  registrarDevolucion: (prestamoId) => {
    const prestamos = get().prestamosActivos
    const prestamo = prestamos.find((p) => p.id === prestamoId)
    if (!prestamo) {
      return { esTardio: false, diasRetraso: 0 }
    }

    const fechaVencimiento = new Date(prestamo.fechaVencimiento)
    const fechaActual = new Date()
    const esTardio = fechaActual > fechaVencimiento
    const diasRetraso = esTardio
      ? Math.ceil((fechaActual.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Mover el préstamo a histórico con estado actualizado
    const prestamoFinalizado: Prestamo = {
      ...prestamo,
      fechaDevolucion: fechaActual.toISOString(),
      estado: esTardio ? 'Devuelto Tardío' : 'Devuelto',
    }

    set((state) => ({
      prestamosActivos: state.prestamosActivos.filter((p) => p.id !== prestamoId),
      prestamosHistoricos: [prestamoFinalizado, ...state.prestamosHistoricos],
    }))

    return { esTardio, diasRetraso }
  },

  getAllPrestamos: () => {
    const { prestamosActivos, prestamosHistoricos } = get()
    // Combinar activos e históricos, marcando los activos con su estado actual
    const activosConEstado = prestamosActivos.map((p) => {
      const fechaVencimiento = new Date(p.fechaVencimiento)
      const fechaActual = new Date()
      const estaVencido = fechaActual > fechaVencimiento
      return {
        ...p,
        estado: estaVencido ? 'Vencido' : 'Activo',
      }
    })
    return [...activosConEstado, ...prestamosHistoricos]
  },

  limpiarEstado: () => {
    set({ usuarioActual: null, itemActual: null })
  },
}))

