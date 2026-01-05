import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CategoriaUsuario = 'Estudiante' | 'Docente' | 'Investigador' | 'Vecino'
export type TipoMaterial = 'Libro Texto' | 'Best Seller' | 'DVD' | 'Sala'

export interface PoliticaCirculacion {
  diasPrestamo: number
  cantidadMaxima: number
  renovacionesPermitidas: number
}

export interface PoliticasState {
  politicas: Record<CategoriaUsuario, Record<TipoMaterial, PoliticaCirculacion>>
  updatePolitica: (
    categoria: CategoriaUsuario,
    material: TipoMaterial,
    politica: Partial<PoliticaCirculacion>
  ) => void
  getPolitica: (
    categoria: CategoriaUsuario,
    material: TipoMaterial
  ) => PoliticaCirculacion
}

const politicasIniciales: Record<CategoriaUsuario, Record<TipoMaterial, PoliticaCirculacion>> = {
  Estudiante: {
    'Libro Texto': { diasPrestamo: 15, cantidadMaxima: 3, renovacionesPermitidas: 2 },
    'Best Seller': { diasPrestamo: 7, cantidadMaxima: 2, renovacionesPermitidas: 1 },
    'DVD': { diasPrestamo: 5, cantidadMaxima: 2, renovacionesPermitidas: 0 },
    'Sala': { diasPrestamo: 0, cantidadMaxima: 0, renovacionesPermitidas: 0 },
  },
  Docente: {
    'Libro Texto': { diasPrestamo: 30, cantidadMaxima: 10, renovacionesPermitidas: 3 },
    'Best Seller': { diasPrestamo: 14, cantidadMaxima: 5, renovacionesPermitidas: 2 },
    'DVD': { diasPrestamo: 7, cantidadMaxima: 3, renovacionesPermitidas: 1 },
    'Sala': { diasPrestamo: 0, cantidadMaxima: 0, renovacionesPermitidas: 0 },
  },
  Investigador: {
    'Libro Texto': { diasPrestamo: 60, cantidadMaxima: 15, renovacionesPermitidas: 5 },
    'Best Seller': { diasPrestamo: 21, cantidadMaxima: 8, renovacionesPermitidas: 3 },
    'DVD': { diasPrestamo: 14, cantidadMaxima: 5, renovacionesPermitidas: 2 },
    'Sala': { diasPrestamo: 0, cantidadMaxima: 0, renovacionesPermitidas: 0 },
  },
  Vecino: {
    'Libro Texto': { diasPrestamo: 10, cantidadMaxima: 2, renovacionesPermitidas: 1 },
    'Best Seller': { diasPrestamo: 5, cantidadMaxima: 1, renovacionesPermitidas: 0 },
    'DVD': { diasPrestamo: 3, cantidadMaxima: 1, renovacionesPermitidas: 0 },
    'Sala': { diasPrestamo: 0, cantidadMaxima: 0, renovacionesPermitidas: 0 },
  },
}

export const usePoliticasStore = create<PoliticasState>()(
  persist(
    (set, get) => ({
      politicas: politicasIniciales,
      updatePolitica: (categoria, material, politica) => {
        set((state) => ({
          politicas: {
            ...state.politicas,
            [categoria]: {
              ...state.politicas[categoria],
              [material]: {
                ...state.politicas[categoria][material],
                ...politica,
              },
            },
          },
        }))
      },
      getPolitica: (categoria, material) => {
        return get().politicas[categoria][material]
      },
    }),
    {
      name: 'politicas-circulacion-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

