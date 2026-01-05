import { create } from 'zustand'

export interface Inscripcion {
  id: number
  idEvento: number
  idUsuario: number
  fechaInscripcion: string
  asistio: boolean
}

export interface InscripcionesState {
  inscripciones: Inscripcion[]
  inscribirseEvento: (idEvento: number, idUsuario: number) => { exito: boolean; mensaje: string }
  desinscribirseEvento: (idEvento: number, idUsuario: number) => void
  getInscripcionesUsuario: (idUsuario: number) => Inscripcion[]
  getInscripcionesEvento: (idEvento: number) => Inscripcion[]
  estaInscrito: (idEvento: number, idUsuario: number) => boolean
  marcarAsistencia: (idInscripcion: number, asistio: boolean) => void
}

// Datos mock iniciales
const inscripcionesIniciales: Inscripcion[] = [
  {
    id: 1,
    idEvento: 1,
    idUsuario: 1,
    fechaInscripcion: '2024-12-10T10:00:00',
    asistio: false,
  },
  {
    id: 2,
    idEvento: 1,
    idUsuario: 2,
    fechaInscripcion: '2024-12-11T14:30:00',
    asistio: true,
  },
  {
    id: 3,
    idEvento: 1,
    idUsuario: 4,
    fechaInscripcion: '2024-12-12T09:15:00',
    asistio: false,
  },
  {
    id: 4,
    idEvento: 2,
    idUsuario: 1,
    fechaInscripcion: '2024-12-15T11:00:00',
    asistio: false,
  },
  {
    id: 5,
    idEvento: 2,
    idUsuario: 3,
    fechaInscripcion: '2024-12-16T16:45:00',
    asistio: false,
  },
]

export const useInscripcionesStore = create<InscripcionesState>((set, get) => ({
  inscripciones: inscripcionesIniciales,

  inscribirseEvento: (idEvento, idUsuario) => {
    // Verificar si ya está inscrito
    const yaInscrito = get().estaInscrito(idEvento, idUsuario)
    if (yaInscrito) {
      return { exito: false, mensaje: 'Ya estás inscrito a este evento' }
    }

    const nuevaInscripcion: Inscripcion = {
      id: Date.now(),
      idEvento,
      idUsuario,
      fechaInscripcion: new Date().toISOString(),
      asistio: false,
    }

    set((state) => ({
      inscripciones: [...state.inscripciones, nuevaInscripcion],
    }))

    return { exito: true, mensaje: 'Inscripción exitosa' }
  },

  desinscribirseEvento: (idEvento, idUsuario) => {
    set((state) => ({
      inscripciones: state.inscripciones.filter(
        (i) => !(i.idEvento === idEvento && i.idUsuario === idUsuario)
      ),
    }))
  },

  getInscripcionesUsuario: (idUsuario) => {
    return get().inscripciones.filter((i) => i.idUsuario === idUsuario)
  },

  getInscripcionesEvento: (idEvento) => {
    return get().inscripciones.filter((i) => i.idEvento === idEvento)
  },

  estaInscrito: (idEvento, idUsuario) => {
    return get().inscripciones.some(
      (i) => i.idEvento === idEvento && i.idUsuario === idUsuario
    )
  },

  marcarAsistencia: (idInscripcion, asistio) => {
    set((state) => ({
      inscripciones: state.inscripciones.map((i) =>
        i.id === idInscripcion ? { ...i, asistio } : i
      ),
    }))
  },
}))

