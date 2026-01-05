import { create } from 'zustand'

export type NivelDescripcion = 'Fondo' | 'Subfondo' | 'Sección' | 'Serie' | 'Unidad Documental'

export interface UnidadArchivistica {
  id: number
  idPadre: number | null
  codigoReferencia: string
  titulo: string
  idNivelDescripcion: number
  nivelDescripcion: NivelDescripcion
  productorNombre?: string
  fechaInicio?: string
  fechaFin?: string
  volumenSoporte?: string
  alcanceContenido?: string
  historiaArchivistica?: string
  idCondicionAcceso?: number
  hijos: UnidadArchivistica[]
  objetosDigitales: ObjetoDigital[]
}

export interface ObjetoDigital {
  id: number
  idUnidadArchivistica: number
  nombreArchivo: string
  rutaAlmacenamiento: string
  tipoMime: string
  pesoKb?: number
  ocrTexto?: string
  file?: File // Para archivos nuevos
  url?: string // Para preview
}

export interface ArchivoState {
  unidades: UnidadArchivistica[]
  unidadSeleccionada: UnidadArchivistica | null
  seleccionarUnidad: (id: number) => void
  agregarUnidad: (unidad: Omit<UnidadArchivistica, 'id' | 'hijos' | 'objetosDigitales'>) => void
  actualizarUnidad: (id: number, updates: Partial<UnidadArchivistica>) => void
  eliminarUnidad: (id: number) => void
  agregarObjetoDigital: (idUnidad: number, objeto: Omit<ObjetoDigital, 'id'>) => void
  eliminarObjetoDigital: (idUnidad: number, idObjeto: number) => void
  generarCodigoReferencia: (idPadre: number | null) => string
  obtenerRutaCompleta: (id: number) => string[]
}

// Datos mock iniciales
const unidadesMock: UnidadArchivistica[] = [
  {
    id: 1,
    idPadre: null,
    codigoReferencia: 'AR-F01',
    titulo: 'Fondo Histórico Municipal',
    idNivelDescripcion: 1,
    nivelDescripcion: 'Fondo',
    productorNombre: 'Municipalidad de Buenos Aires',
    fechaInicio: '1850-01-01',
    fechaFin: '1950-12-31',
    volumenSoporte: '150 cajas',
    alcanceContenido: 'Documentación histórica del municipio',
    historiaArchivistica: 'Fondo transferido en 1960',
    hijos: [
      {
        id: 2,
        idPadre: 1,
        codigoReferencia: 'AR-F01-SF01',
        titulo: 'Subfondo Secretaría',
        idNivelDescripcion: 2,
        nivelDescripcion: 'Subfondo',
        hijos: [
          {
            id: 3,
            idPadre: 2,
            codigoReferencia: 'AR-F01-SF01-SEC01',
            titulo: 'Sección Actas',
            idNivelDescripcion: 3,
            nivelDescripcion: 'Sección',
            hijos: [
              {
                id: 4,
                idPadre: 3,
                codigoReferencia: 'AR-F01-SF01-SEC01-SER01',
                titulo: 'Serie Actas de Sesiones',
                idNivelDescripcion: 4,
                nivelDescripcion: 'Serie',
                hijos: [
                  {
                    id: 5,
                    idPadre: 4,
                    codigoReferencia: 'AR-F01-SF01-SEC01-SER01-UD01',
                    titulo: 'Acta de Sesión N° 1',
                    idNivelDescripcion: 5,
                    nivelDescripcion: 'Unidad Documental',
                    fechaInicio: '1850-01-15',
                    fechaFin: '1850-01-15',
                    volumenSoporte: '1 expediente',
                    alcanceContenido: 'Primera acta de sesión del consejo municipal',
                    objetosDigitales: [
                      {
                        id: 1,
                        idUnidadArchivistica: 5,
                        nombreArchivo: 'acta_sesion_001.pdf',
                        rutaAlmacenamiento: '/archivos/AR-F01-SF01-SEC01-SER01-UD01/acta_sesion_001.pdf',
                        tipoMime: 'application/pdf',
                        pesoKb: 2500,
                        ocrTexto: 'ACTA DE SESIÓN NÚMERO UNO\n\nEn la ciudad de Buenos Aires, a los quince días del mes de enero del año mil ochocientos cincuenta, se reunió el Consejo Municipal...',
                        url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // PDF de ejemplo
                      },
                    ],
                    hijos: [],
                  },
                ],
                objetosDigitales: [],
              },
            ],
            objetosDigitales: [],
          },
        ],
        objetosDigitales: [],
      },
    ],
    objetosDigitales: [],
  },
]

export const useArchivoStore = create<ArchivoState>((set, get) => ({
  unidades: unidadesMock,
  unidadSeleccionada: null,

  seleccionarUnidad: (id) => {
    const buscarUnidad = (
      unidades: UnidadArchivistica[]
    ): UnidadArchivistica | null => {
      for (const unidad of unidades) {
        if (unidad.id === id) return unidad
        const encontrada = buscarUnidad(unidad.hijos)
        if (encontrada) return encontrada
      }
      return null
    }

    const unidad = buscarUnidad(get().unidades)
    set({ unidadSeleccionada: unidad || null })
  },

  agregarUnidad: (unidad) => {
    const nuevaUnidad: UnidadArchivistica = {
      ...unidad,
      id: Date.now(),
      hijos: [],
      objetosDigitales: [],
    }

    const agregarRecursivo = (unidades: UnidadArchivistica[]): UnidadArchivistica[] => {
      if (unidad.idPadre === null) {
        return [...unidades, nuevaUnidad]
      }

      return unidades.map((u) => {
        if (u.id === unidad.idPadre) {
          return { ...u, hijos: [...u.hijos, nuevaUnidad] }
        }
        return { ...u, hijos: agregarRecursivo(u.hijos) }
      })
    }

    set((state) => ({
      unidades: agregarRecursivo(state.unidades),
      unidadSeleccionada: nuevaUnidad, // Seleccionar automáticamente la nueva unidad
    }))
  },

  actualizarUnidad: (id, updates) => {
    const actualizarRecursivo = (
      unidades: UnidadArchivistica[]
    ): UnidadArchivistica[] => {
      return unidades.map((u) => {
        if (u.id === id) {
          return { ...u, ...updates }
        }
        return { ...u, hijos: actualizarRecursivo(u.hijos) }
      })
    }

    set((state) => ({
      unidades: actualizarRecursivo(state.unidades),
      unidadSeleccionada:
        state.unidadSeleccionada?.id === id
          ? { ...state.unidadSeleccionada, ...updates }
          : state.unidadSeleccionada,
    }))
  },

  eliminarUnidad: (id) => {
    const eliminarRecursivo = (
      unidades: UnidadArchivistica[]
    ): UnidadArchivistica[] => {
      return unidades
        .filter((u) => u.id !== id)
        .map((u) => ({ ...u, hijos: eliminarRecursivo(u.hijos) }))
    }

    set((state) => ({
      unidades: eliminarRecursivo(state.unidades),
      unidadSeleccionada:
        state.unidadSeleccionada?.id === id ? null : state.unidadSeleccionada,
    }))
  },

  agregarObjetoDigital: (idUnidad, objeto) => {
    const nuevoObjeto: ObjetoDigital = {
      ...objeto,
      id: Date.now(),
    }

    const agregarObjetoRecursivo = (
      unidades: UnidadArchivistica[]
    ): UnidadArchivistica[] => {
      return unidades.map((u) => {
        if (u.id === idUnidad) {
          return {
            ...u,
            objetosDigitales: [...u.objetosDigitales, nuevoObjeto],
          }
        }
        return { ...u, hijos: agregarObjetoRecursivo(u.hijos) }
      })
    }

    set((state) => ({
      unidades: agregarObjetoRecursivo(state.unidades),
      unidadSeleccionada:
        state.unidadSeleccionada?.id === idUnidad
          ? {
              ...state.unidadSeleccionada,
              objetosDigitales: [...state.unidadSeleccionada.objetosDigitales, nuevoObjeto],
            }
          : state.unidadSeleccionada,
    }))
  },

  eliminarObjetoDigital: (idUnidad, idObjeto) => {
    const eliminarObjetoRecursivo = (
      unidades: UnidadArchivistica[]
    ): UnidadArchivistica[] => {
      return unidades.map((u) => {
        if (u.id === idUnidad) {
          return {
            ...u,
            objetosDigitales: u.objetosDigitales.filter((o) => o.id !== idObjeto),
          }
        }
        return { ...u, hijos: eliminarObjetoRecursivo(u.hijos) }
      })
    }

    set((state) => ({
      unidades: eliminarObjetoRecursivo(state.unidades),
      unidadSeleccionada:
        state.unidadSeleccionada?.id === idUnidad
          ? {
              ...state.unidadSeleccionada,
              objetosDigitales: state.unidadSeleccionada.objetosDigitales.filter(
                (o) => o.id !== idObjeto
              ),
            }
          : state.unidadSeleccionada,
    }))
  },

  generarCodigoReferencia: (idPadre) => {
    if (idPadre === null) {
      // Generar código para fondo raíz
      const fondos = get().unidades.filter((u) => u.idPadre === null)
      const numero = fondos.length + 1
      return `AR-F${numero.toString().padStart(2, '0')}`
    }

    const buscarUnidad = (
      unidades: UnidadArchivistica[],
      id: number
    ): UnidadArchivistica | null => {
      for (const unidad of unidades) {
        if (unidad.id === id) return unidad
        const encontrada = buscarUnidad(unidad.hijos, id)
        if (encontrada) return encontrada
      }
      return null
    }

    const padre = buscarUnidad(get().unidades, idPadre)
    if (!padre) return 'AR-UNKNOWN'

    // Contar hijos del mismo nivel
    const hermanos = padre.hijos
    const numero = hermanos.length + 1

    // Generar sufijo según nivel
    const sufijos: Record<NivelDescripcion, string> = {
      Fondo: 'F',
      Subfondo: 'SF',
      Sección: 'SEC',
      Serie: 'SER',
      'Unidad Documental': 'UD',
    }

    const nivel = padre.nivelDescripcion
    const siguienteNivel: NivelDescripcion =
      nivel === 'Fondo'
        ? 'Subfondo'
        : nivel === 'Subfondo'
          ? 'Sección'
          : nivel === 'Sección'
            ? 'Serie'
            : 'Unidad Documental'

    const sufijo = sufijos[siguienteNivel]
    return `${padre.codigoReferencia}-${sufijo}${numero.toString().padStart(2, '0')}`
  },

  obtenerRutaCompleta: (id) => {
    const buscarRuta = (
      unidades: UnidadArchivistica[],
      id: number,
      ruta: string[] = []
    ): string[] | null => {
      for (const unidad of unidades) {
        const nuevaRuta = [...ruta, unidad.titulo]
        if (unidad.id === id) return nuevaRuta
        const encontrada = buscarRuta(unidad.hijos, id, nuevaRuta)
        if (encontrada) return encontrada
      }
      return null
    }

    return buscarRuta(get().unidades, id) || []
  },
}))

