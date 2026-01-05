import { create } from 'zustand'
import { usePoliticasStore, CategoriaUsuario, TipoMaterial } from './politicasStore'
import { useCirculacionStore, Prestamo } from './circulacionStore'

export interface UsuarioPublico {
  id: number
  legajoDni: string
  nombre: string
  apellido: string
  email: string
  categoriaUsuario: CategoriaUsuario
  fotoUrl?: string
}

export interface ResultadoBusqueda {
  id: number
  tipo: 'biblioteca' | 'archivo'
  titulo: string
  autor?: string
  anio?: number
  tipoMaterial?: TipoMaterial
  disponible?: boolean
  codigoReferencia?: string
  nivelDescripcion?: string
  resumen?: string
  tematicas?: string[]
}

export interface Reserva {
  id: number
  idItem: number
  idUsuario: number
  fechaReserva: string
  fechaVencimiento: string
  activa: boolean
}

export interface UsuarioPublicoState {
  usuarioActual: UsuarioPublico | null
  prestamosUsuario: Prestamo[]
  reservasUsuario: Reserva[]
  setUsuarioActual: (usuario: UsuarioPublico) => void
  getPrestamosUsuario: (usuarioId: number) => Prestamo[]
  renovarPrestamo: (
    prestamoId: number,
    usuarioId: number,
    categoriaUsuario: CategoriaUsuario,
    tipoMaterial: TipoMaterial
  ) => { exito: boolean; mensaje: string; nuevaFecha?: string }
  inscribirseEvento: (eventoId: number, usuarioId: number) => boolean
}

// Datos mock
const usuarioMock: UsuarioPublico = {
  id: 1,
  legajoDni: '12345678',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@example.com',
  categoriaUsuario: 'Estudiante',
}

const prestamosMock: Prestamo[] = [
  {
    id: 1,
    idItem: 1,
    idUsuario: 1,
    titulo: 'Cien años de soledad',
    autor: 'García Márquez, Gabriel',
    tipoMaterial: 'Best Seller',
    fechaPrestamo: '2024-12-01T10:00:00',
    fechaVencimiento: '2024-12-16T10:00:00',
    renovacionesContador: 0,
  },
  {
    id: 2,
    idItem: 2,
    idUsuario: 1,
    titulo: 'El Quijote de la Mancha',
    autor: 'Cervantes, Miguel de',
    tipoMaterial: 'Libro Texto',
    fechaPrestamo: '2024-12-05T10:00:00',
    fechaVencimiento: '2024-12-20T10:00:00',
    renovacionesContador: 1,
  },
]

const reservasMock: Reserva[] = [
  {
    id: 1,
    idItem: 3,
    idUsuario: 2, // Otro usuario tiene reserva
    fechaReserva: '2024-12-10T10:00:00',
    fechaVencimiento: '2024-12-25T10:00:00',
    activa: true,
  },
]

export const useUsuarioPublicoStore = create<UsuarioPublicoState>((set, get) => ({
  usuarioActual: usuarioMock,
  prestamosUsuario: prestamosMock,
  reservasUsuario: reservasMock,

  setUsuarioActual: (usuario) => {
    set({ usuarioActual: usuario })
  },

  getPrestamosUsuario: (usuarioId) => {
    return get().prestamosUsuario.filter((p) => p.idUsuario === usuarioId)
  },

  renovarPrestamo: (prestamoId, usuarioId, categoriaUsuario, tipoMaterial) => {
    const prestamo = get().prestamosUsuario.find(
      (p) => p.id === prestamoId && p.idUsuario === usuarioId
    )

    if (!prestamo) {
      return { exito: false, mensaje: 'Préstamo no encontrado' }
    }

    // Verificar si hay reservas de otros usuarios
    const itemTieneReservas = get().reservasUsuario.some(
      (r) => r.idItem === prestamo.idItem && r.idUsuario !== usuarioId && r.activa
    )

    if (itemTieneReservas) {
      return {
        exito: false,
        mensaje: 'No se puede renovar: el material tiene reservas de otros usuarios',
      }
    }

    // Obtener política de renovaciones
    const { getPolitica } = usePoliticasStore.getState()
    const politica = getPolitica(categoriaUsuario, tipoMaterial)

    // Verificar límite de renovaciones
    if (prestamo.renovacionesContador >= politica.renovacionesPermitidas) {
      return {
        exito: false,
        mensaje: `Límite de renovaciones alcanzado (${politica.renovacionesPermitidas})`,
      }
    }

    // Calcular nueva fecha de vencimiento
    const fechaActual = new Date()
    const fechaVencimientoActual = new Date(prestamo.fechaVencimiento)
    const diasExtra = politica.diasPrestamo
    const nuevaFechaVencimiento = new Date(fechaVencimientoActual)
    nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + diasExtra)

    // Verificar si la nueva fecha excede el límite de la política
    const fechaLimite = new Date(fechaActual)
    fechaLimite.setDate(fechaLimite.getDate() + politica.diasPrestamo * 2) // Límite máximo

    if (nuevaFechaVencimiento > fechaLimite) {
      return {
        exito: false,
        mensaje: 'No se puede renovar: excedería el límite máximo de préstamo',
      }
    }

    // Actualizar préstamo
    set((state) => ({
      prestamosUsuario: state.prestamosUsuario.map((p) =>
        p.id === prestamoId
          ? {
              ...p,
              fechaVencimiento: nuevaFechaVencimiento.toISOString(),
              renovacionesContador: p.renovacionesContador + 1,
            }
          : p
      ),
    }))

    return {
      exito: true,
      mensaje: 'Préstamo renovado exitosamente',
      nuevaFecha: nuevaFechaVencimiento.toISOString(),
    }
  },

  inscribirseEvento: (eventoId, usuarioId) => {
    // Esta lógica se manejará en el store de eventos
    return true
  },
}))

