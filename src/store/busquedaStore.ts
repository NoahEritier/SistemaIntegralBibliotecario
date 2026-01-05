import { create } from 'zustand'
import { ResultadoBusqueda } from './usuarioPublicoStore'
import { useArchivoStore } from './archivoStore'

export interface FiltrosBusqueda {
  autor?: string
  anio?: number
  tipoMaterial?: string
  disponible?: boolean
  tipoResultado?: 'biblioteca' | 'archivo' | 'todos'
}

export interface BusquedaState {
  resultados: ResultadoBusqueda[]
  filtros: FiltrosBusqueda
  buscar: (termino: string, filtros?: FiltrosBusqueda) => ResultadoBusqueda[]
  setFiltros: (filtros: Partial<FiltrosBusqueda>) => void
  limpiarFiltros: () => void
  obtenerAutoresUnicos: () => string[]
  obtenerAniosUnicos: () => number[]
}

// Datos mock para búsqueda
const resultadosMock: ResultadoBusqueda[] = [
  {
    id: 1,
    tipo: 'biblioteca',
    titulo: 'Cien años de soledad',
    autor: 'García Márquez, Gabriel',
    anio: 1967,
    tipoMaterial: 'Best Seller',
    disponible: true,
    resumen:
      'La novela narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Es una obra maestra del realismo mágico que explora temas como el amor, la soledad, el poder y el destino.',
    tematicas: ['Realismo mágico', 'Literatura latinoamericana', 'Ficción', 'Familias', 'Magia'],
  },
  {
    id: 2,
    tipo: 'biblioteca',
    titulo: 'El Quijote de la Mancha',
    autor: 'Cervantes, Miguel de',
    anio: 1605,
    tipoMaterial: 'Libro Texto',
    disponible: false,
    resumen:
      'Considerada la primera novela moderna, narra las aventuras de Alonso Quijano, un hidalgo que enloquece leyendo libros de caballerías y decide convertirse en caballero andante. Una sátira sobre la literatura de su época y una reflexión sobre la realidad y la ficción.',
    tematicas: ['Literatura clásica', 'Novela', 'Aventuras', 'Sátira', 'Literatura española'],
  },
  {
    id: 3,
    tipo: 'archivo',
    titulo: 'Acta de Sesión N° 1',
    codigoReferencia: 'AR-F01-SF01-SEC01-SER01-UD01',
    nivelDescripcion: 'Unidad Documental',
    anio: 1850,
  },
  {
    id: 4,
    tipo: 'biblioteca',
    titulo: '1984',
    autor: 'Orwell, George',
    anio: 1949,
    tipoMaterial: 'Best Seller',
    disponible: true,
    resumen:
      'Distopía que describe un futuro totalitario donde el Gran Hermano controla todos los aspectos de la vida. Winston Smith trabaja en el Ministerio de la Verdad y comienza a cuestionar el sistema. Una crítica poderosa sobre el poder, la vigilancia y la manipulación.',
    tematicas: ['Distopía', 'Ciencia ficción', 'Política', 'Totalitarismo', 'Literatura inglesa'],
  },
  {
    id: 5,
    tipo: 'archivo',
    titulo: 'Fondo Histórico Municipal',
    codigoReferencia: 'AR-F01',
    nivelDescripcion: 'Fondo',
  },
  {
    id: 6,
    tipo: 'biblioteca',
    titulo: 'Rayuela',
    autor: 'Cortázar, Julio',
    anio: 1963,
    tipoMaterial: 'Best Seller',
    disponible: true,
    resumen:
      'Novela experimental que puede leerse de forma tradicional o siguiendo un orden alternativo propuesto por el autor. Cuenta la historia de Horacio Oliveira en París y Buenos Aires, explorando temas existenciales y la búsqueda del sentido de la vida.',
    tematicas: ['Literatura experimental', 'Novela', 'Existencialismo', 'Literatura argentina', 'Vanguardia'],
  },
  {
    id: 7,
    tipo: 'biblioteca',
    titulo: 'Ficciones',
    autor: 'Borges, Jorge Luis',
    anio: 1944,
    tipoMaterial: 'Libro Texto',
    disponible: true,
    resumen:
      'Colección de cuentos que incluye algunas de las obras más importantes de Borges. Explora temas como el tiempo, los laberintos, la realidad y la ficción, con un estilo único que combina filosofía, literatura y matemáticas.',
    tematicas: ['Cuentos', 'Filosofía', 'Literatura argentina', 'Laberintos', 'Metaficción'],
  },
  {
    id: 8,
    tipo: 'biblioteca',
    titulo: 'La ciudad y los perros',
    autor: 'Vargas Llosa, Mario',
    anio: 1963,
    tipoMaterial: 'Best Seller',
    disponible: false,
  },
  {
    id: 9,
    tipo: 'archivo',
    titulo: 'Subfondo Secretaría',
    codigoReferencia: 'AR-F01-SF01',
    nivelDescripcion: 'Subfondo',
    anio: 1850,
  },
  {
    id: 10,
    tipo: 'archivo',
    titulo: 'Serie Actas de Sesiones',
    codigoReferencia: 'AR-F01-SF01-SEC01-SER01',
    nivelDescripcion: 'Serie',
    anio: 1850,
  },
  {
    id: 11,
    tipo: 'biblioteca',
    titulo: 'Pedro Páramo',
    autor: 'Rulfo, Juan',
    anio: 1955,
    tipoMaterial: 'Libro Texto',
    disponible: true,
  },
  {
    id: 12,
    tipo: 'biblioteca',
    titulo: 'El Aleph',
    autor: 'Borges, Jorge Luis',
    anio: 1949,
    tipoMaterial: 'Best Seller',
    disponible: true,
  },
]

export const useBusquedaStore = create<BusquedaState>((set, get) => ({
  resultados: [],
  filtros: {},

  buscar: (termino, filtrosAplicados) => {
    const filtros = filtrosAplicados || get().filtros
    let resultados = resultadosMock

    // Búsqueda por término
    if (termino.trim()) {
      const terminoLower = termino.toLowerCase()
      resultados = resultados.filter(
        (r) =>
          r.titulo.toLowerCase().includes(terminoLower) ||
          r.autor?.toLowerCase().includes(terminoLower) ||
          r.codigoReferencia?.toLowerCase().includes(terminoLower)
      )
    }

    // Aplicar filtros
    if (filtros.autor) {
      resultados = resultados.filter((r) =>
        r.autor?.toLowerCase().includes(filtros.autor!.toLowerCase())
      )
    }

    if (filtros.anio) {
      resultados = resultados.filter((r) => r.anio === filtros.anio)
    }

    if (filtros.tipoMaterial) {
      resultados = resultados.filter((r) => r.tipoMaterial === filtros.tipoMaterial)
    }

    if (filtros.disponible !== undefined) {
      resultados = resultados.filter((r) => r.disponible === filtros.disponible)
    }

    if (filtros.tipoResultado && filtros.tipoResultado !== 'todos') {
      resultados = resultados.filter((r) => r.tipo === filtros.tipoResultado)
    }

    set({ resultados })
    return resultados
  },

  setFiltros: (nuevosFiltros) => {
    set((state) => ({
      filtros: { ...state.filtros, ...nuevosFiltros },
    }))
  },

  limpiarFiltros: () => {
    set({ filtros: {} })
  },

  obtenerAutoresUnicos: () => {
    return Array.from(
      new Set(resultadosMock.filter((r) => r.autor).map((r) => r.autor!))
    ).sort()
  },

  obtenerAniosUnicos: () => {
    return Array.from(
      new Set(resultadosMock.filter((r) => r.anio).map((r) => r.anio!))
    ).sort((a, b) => b - a)
  },
}))

