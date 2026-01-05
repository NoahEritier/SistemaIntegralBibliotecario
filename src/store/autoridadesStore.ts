import { create } from 'zustand'

export type TipoAutoridad = 'PERSONA' | 'INSTITUCION'

export interface Autoridad {
  id: number
  nombreNormalizado: string
  tipo: TipoAutoridad
  fechaCreacion: string
  fechaModificacion?: string
}

export interface AutoridadesState {
  autoridades: Autoridad[]
  addAutoridad: (autoridad: Omit<Autoridad, 'id' | 'fechaCreacion'>) => Autoridad
  updateAutoridad: (id: number, updates: Partial<Autoridad>) => void
  deleteAutoridad: (id: number) => void
  getAutoridad: (id: number) => Autoridad | undefined
  buscarAutoridades: (termino: string) => Autoridad[]
  getAutoridadesByTipo: (tipo: TipoAutoridad) => Autoridad[]
}

// Datos mock iniciales
const autoridadesIniciales: Autoridad[] = [
  {
    id: 1,
    nombreNormalizado: 'García Márquez, Gabriel',
    tipo: 'PERSONA',
    fechaCreacion: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    nombreNormalizado: 'Borges, Jorge Luis',
    tipo: 'PERSONA',
    fechaCreacion: '2024-01-15T10:00:00',
  },
  {
    id: 3,
    nombreNormalizado: 'Cortázar, Julio',
    tipo: 'PERSONA',
    fechaCreacion: '2024-01-15T10:00:00',
  },
  {
    id: 4,
    nombreNormalizado: 'Editorial Sudamericana',
    tipo: 'INSTITUCION',
    fechaCreacion: '2024-01-15T10:00:00',
  },
  {
    id: 5,
    nombreNormalizado: 'Editorial Planeta',
    tipo: 'INSTITUCION',
    fechaCreacion: '2024-01-15T10:00:00',
  },
  {
    id: 6,
    nombreNormalizado: 'Cervantes, Miguel de',
    tipo: 'PERSONA',
    fechaCreacion: '2024-01-15T10:00:00',
  },
]

export const useAutoridadesStore = create<AutoridadesState>((set, get) => ({
  autoridades: autoridadesIniciales,

  addAutoridad: (autoridad) => {
    const nuevaAutoridad: Autoridad = {
      ...autoridad,
      id: Date.now(),
      fechaCreacion: new Date().toISOString(),
    }
    set((state) => ({
      autoridades: [...state.autoridades, nuevaAutoridad],
    }))
    return nuevaAutoridad
  },

  updateAutoridad: (id, updates) => {
    set((state) => ({
      autoridades: state.autoridades.map((a) =>
        a.id === id
          ? { ...a, ...updates, fechaModificacion: new Date().toISOString() }
          : a
      ),
    }))
  },

  deleteAutoridad: (id) => {
    set((state) => ({
      autoridades: state.autoridades.filter((a) => a.id !== id),
    }))
  },

  getAutoridad: (id) => {
    return get().autoridades.find((a) => a.id === id)
  },

  buscarAutoridades: (termino) => {
    const terminoLower = termino.toLowerCase()
    return get().autoridades.filter((a) =>
      a.nombreNormalizado.toLowerCase().includes(terminoLower)
    )
  },

  getAutoridadesByTipo: (tipo) => {
    return get().autoridades.filter((a) => a.tipo === tipo)
  },
}))




