import { create } from 'zustand'

export interface Evento {
  id: number
  titulo: string
  descripcion?: string
  idTipoEvento: number
  tipoEvento?: string
  fechaHoraInicio: string
  fechaHoraFin: string
  idEspacio?: number
  espacio?: string
  cupoMaximo?: number
  imagenPromo?: string
  estado: 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO'
  bibliografiaVinculada: number[] // IDs de manifestaciones
}

export interface TipoEvento {
  id: number
  nombre: string
}

export interface EventosState {
  eventos: Evento[]
  tiposEvento: TipoEvento[]
  addEvento: (evento: Omit<Evento, 'id'>) => void
  updateEvento: (id: number, updates: Partial<Evento>) => void
  deleteEvento: (id: number) => void
  getEvento: (id: number) => Evento | undefined
  vincularBibliografia: (eventoId: number, manifestacionIds: number[]) => void
  getEventosByTipo: (idTipoEvento: number) => Evento[]
  getTipoEvento: (id: number) => TipoEvento | undefined
}

// Datos mock
const tiposEventoMock: TipoEvento[] = [
  { id: 1, nombre: 'Conferencia' },
  { id: 2, nombre: 'Taller' },
  { id: 3, nombre: 'Charla' },
  { id: 4, nombre: 'Presentación de Libro' },
  { id: 5, nombre: 'Exposición' },
  { id: 6, nombre: 'Seminario' },
  { id: 7, nombre: 'Curso' },
  { id: 8, nombre: 'Actividad Cultural' },
]

const eventosMock: Evento[] = [
  {
    id: 1,
    titulo: 'Conferencia: Literatura Latinoamericana',
    descripcion: 'Análisis profundo de la obra de García Márquez, Borges, Cortázar y otros grandes autores latinoamericanos. Exploraremos las corrientes literarias del siglo XX.',
    idTipoEvento: 1,
    tipoEvento: 'Conferencia',
    fechaHoraInicio: '2024-12-20T18:00:00',
    fechaHoraFin: '2024-12-20T20:00:00',
    cupoMaximo: 50,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [1, 2],
    imagenPromo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    titulo: 'Taller de Escritura Creativa',
    descripcion: 'Taller práctico para desarrollar habilidades de escritura. Aprende técnicas narrativas, construcción de personajes y desarrollo de tramas.',
    idTipoEvento: 2,
    tipoEvento: 'Taller',
    fechaHoraInicio: '2024-12-25T10:00:00',
    fechaHoraFin: '2024-12-25T13:00:00',
    cupoMaximo: 20,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [3],
    imagenPromo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    titulo: 'Charla: Historia del Arte Argentino',
    descripcion: 'Recorrido por los principales movimientos artísticos argentinos desde el siglo XIX hasta la actualidad.',
    idTipoEvento: 3,
    tipoEvento: 'Charla',
    fechaHoraInicio: '2024-12-22T16:00:00',
    fechaHoraFin: '2024-12-22T17:30:00',
    cupoMaximo: 30,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [],
    imagenPromo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    titulo: 'Seminario: Filosofía Contemporánea',
    descripcion: 'Seminario intensivo sobre las corrientes filosóficas del siglo XX y XXI. Análisis de textos fundamentales.',
    idTipoEvento: 6,
    tipoEvento: 'Seminario',
    fechaHoraInicio: '2025-01-10T14:00:00',
    fechaHoraFin: '2025-01-10T18:00:00',
    cupoMaximo: 25,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [1],
    imagenPromo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    titulo: 'Curso: Introducción a la Investigación',
    descripcion: 'Curso básico sobre metodología de investigación académica. Herramientas y técnicas fundamentales.',
    idTipoEvento: 7,
    tipoEvento: 'Curso',
    fechaHoraInicio: '2025-01-15T09:00:00',
    fechaHoraFin: '2025-01-15T12:00:00',
    cupoMaximo: 15,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [2, 3],
    imagenPromo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
  },
  {
    id: 6,
    titulo: 'Presentación: Nuevo Libro de Historia Local',
    descripcion: 'Presentación del libro "Historia de Nuestra Ciudad" con la presencia del autor y firma de ejemplares.',
    idTipoEvento: 4,
    tipoEvento: 'Presentación de Libro',
    fechaHoraInicio: '2025-01-20T19:00:00',
    fechaHoraFin: '2025-01-20T21:00:00',
    cupoMaximo: 40,
    estado: 'PUBLICADO',
    bibliografiaVinculada: [],
    imagenPromo: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=400&fit=crop',
  },
]

export const useEventosStore = create<EventosState>((set, get) => ({
  eventos: eventosMock,
  tiposEvento: tiposEventoMock,

  addEvento: (evento) => {
    const nuevoEvento: Evento = {
      ...evento,
      id: Date.now(),
    }
    set((state) => ({
      eventos: [...state.eventos, nuevoEvento],
    }))
  },

  updateEvento: (id, updates) => {
    set((state) => ({
      eventos: state.eventos.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }))
  },

  deleteEvento: (id) => {
    set((state) => ({
      eventos: state.eventos.filter((e) => e.id !== id),
    }))
  },

  getEvento: (id) => {
    return get().eventos.find((e) => e.id === id)
  },

  vincularBibliografia: (eventoId, manifestacionIds) => {
    set((state) => ({
      eventos: state.eventos.map((e) =>
        e.id === eventoId ? { ...e, bibliografiaVinculada: manifestacionIds } : e
      ),
    }))
  },

  getEventosByTipo: (idTipoEvento) => {
    return get().eventos.filter((e) => e.idTipoEvento === idTipoEvento)
  },

  getTipoEvento: (id) => {
    return get().tiposEvento.find((t) => t.id === id)
  },
}))

