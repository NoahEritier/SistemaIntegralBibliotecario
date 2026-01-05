import { apiClient } from './api'

export interface Manifestacion {
  id: number
  idObra?: number
  isbnIssn?: string
  tituloPropio: string
  subtitulo?: string
  idEditorial?: number
  editorial?: string
  idFormato: number
  formato?: string
  idIdioma: number
  idioma?: string
  idPais?: number
  pais?: string
  numeroEdicion?: string
  lugarPublicacion?: string
  anioPublicacion?: number
  descripcionFisica?: string
  imagenTapaUrl?: string
  stockDisponible?: number
  portada?: string
  autor?: string
}

export interface Item {
  id: number
  idManifestacion: number
  codigoBarras: string
  numeroInventario: string
  idUbicacionFisica?: number
  ubicacionFisica?: string
  idProcedencia?: number
  procedencia?: string
  idEstadoConservacion?: number
  estadoConservacion?: string
  disponiblePrestamo: boolean
  fechaAdquisicion?: string
}

export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  editorial?: string
  formato?: string
  idioma?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class CatalogoService {
  // CRUD de Manifestaciones
  async getManifestaciones(params?: SearchParams) {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.editorial) queryParams.append('editorial', params.editorial)
      if (params?.formato) queryParams.append('formato', params.formato)
      if (params?.idioma) queryParams.append('idioma', params.idioma)

      const query = queryParams.toString()
      return await apiClient.get<PaginatedResponse<Manifestacion>>(
        `/manifestaciones${query ? `?${query}` : ''}`
      )
    } catch (error) {
      // Fallback al mock service si falla la conexión
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getManifestaciones(params)
    }
  }

  async getManifestacion(id: number) {
    try {
      return await apiClient.get<Manifestacion>(`/manifestaciones/${id}`)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getManifestacion(id)
    }
  }

  async createManifestacion(data: Partial<Manifestacion>) {
    try {
      return await apiClient.post<Manifestacion>('/manifestaciones', data)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().createManifestacion(data)
    }
  }

  async updateManifestacion(id: number, data: Partial<Manifestacion>) {
    try {
      return await apiClient.put<Manifestacion>(`/manifestaciones/${id}`, data)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().updateManifestacion(id, data)
    }
  }

  async deleteManifestacion(id: number) {
    try {
      return await apiClient.delete<void>(`/manifestaciones/${id}`)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().deleteManifestacion(id)
    }
  }

  // Gestión de Items
  async getItems(manifestacionId: number) {
    try {
      return await apiClient.get<Item[]>(`/manifestaciones/${manifestacionId}/items`)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getItems(manifestacionId)
    }
  }

  async createItem(manifestacionId: number, data: Partial<Item>) {
    try {
      return await apiClient.post<Item>(`/manifestaciones/${manifestacionId}/items`, data)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().createItem(manifestacionId, data)
    }
  }

  async updateItem(itemId: number, data: Partial<Item>) {
    try {
      return await apiClient.put<Item>(`/items/${itemId}`, data)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().updateItem(itemId, data)
    }
  }

  async deleteItem(itemId: number) {
    try {
      return await apiClient.delete<void>(`/items/${itemId}`)
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().deleteItem(itemId)
    }
  }

  // Importación Z39.50
  async importZ3950(isbn: string) {
    try {
      return await apiClient.post<Manifestacion>('/manifestaciones/import-z3950', { isbn })
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().importZ3950(isbn)
    }
  }

  // Obtener opciones para filtros
  async getEditoriales() {
    try {
      return await apiClient.get<Array<{ id: number; nombre: string }>>('/editoriales')
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getEditoriales()
    }
  }

  async getFormatos() {
    try {
      return await apiClient.get<Array<{ id: number; nombre: string }>>('/formatos')
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getFormatos()
    }
  }

  async getIdiomas() {
    try {
      return await apiClient.get<Array<{ id: number; nombre: string }>>('/idiomas')
    } catch (error) {
      console.warn('[CatalogoService] API failed, using mock service fallback')
      return getMockCatalogoService().getIdiomas()
    }
  }
}

// Mock service para desarrollo sin backend (NO extiende CatalogoService para evitar recursión)
class MockCatalogoService {
  private manifestaciones: Manifestacion[] = [
    {
      id: 1,
      tituloPropio: 'El Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      editorial: 'Editorial Planeta',
      isbnIssn: '978-84-08-12345-6',
      stockDisponible: 5,
      portada: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      imagenTapaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      anioPublicacion: 1605,
      lugarPublicacion: 'Madrid',
      numeroEdicion: 'Edición conmemorativa',
      descripcionFisica: '2 v. ; 24 cm',
      idFormato: 1,
      idIdioma: 1,
    },
    {
      id: 2,
      tituloPropio: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana',
      isbnIssn: '978-84-08-23456-7',
      stockDisponible: 3,
      portada: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      imagenTapaUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      anioPublicacion: 1967,
      lugarPublicacion: 'Buenos Aires',
      numeroEdicion: '1ª edición',
      descripcionFisica: '471 p. ; 23 cm',
      idFormato: 1,
      idIdioma: 1,
      stockDisponible: 2, // 2 items disponibles de 3 totales
    },
    {
      id: 3,
      tituloPropio: '1984',
      autor: 'George Orwell',
      editorial: 'Penguin Random House',
      isbnIssn: '978-84-08-34567-8',
      stockDisponible: 8,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop',
      anioPublicacion: 1949,
      lugarPublicacion: 'Londres',
      numeroEdicion: 'Edición definitiva',
      descripcionFisica: '352 p. ; 20 cm',
      idFormato: 1,
      idIdioma: 2,
      stockDisponible: 0, // 0 items disponibles (1 prestado)
    },
    {
      id: 4,
      tituloPropio: 'Rayuela',
      autor: 'Julio Cortázar',
      editorial: 'Editorial Sudamericana',
      isbnIssn: '978-84-08-45678-9',
      stockDisponible: 4,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
      anioPublicacion: 1963,
      lugarPublicacion: 'Buenos Aires',
      numeroEdicion: 'Edición especial',
      descripcionFisica: '736 p. ; 23 cm',
      idFormato: 1,
      idIdioma: 1,
      stockDisponible: 1, // 1 item disponible
    },
    {
      id: 5,
      tituloPropio: 'Ficciones',
      autor: 'Jorge Luis Borges',
      editorial: 'Editorial Sudamericana',
      isbnIssn: '978-84-08-56789-0',
      stockDisponible: 6,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
      anioPublicacion: 1944,
      lugarPublicacion: 'Buenos Aires',
      numeroEdicion: 'Edición crítica',
      descripcionFisica: '192 p. ; 20 cm',
      idFormato: 1,
      idIdioma: 1,
      stockDisponible: 2, // 2 items disponibles
    },
    {
      id: 6,
      tituloPropio: 'La ciudad y los perros',
      autor: 'Mario Vargas Llosa',
      editorial: 'Editorial Planeta',
      isbnIssn: '978-84-08-67890-1',
      stockDisponible: 2,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=300&fit=crop',
      anioPublicacion: 1963,
      lugarPublicacion: 'Barcelona',
      numeroEdicion: 'Edición revisada',
      descripcionFisica: '448 p. ; 22 cm',
      idFormato: 1,
      idIdioma: 1,
    },
    {
      id: 7,
      tituloPropio: 'Pedro Páramo',
      autor: 'Juan Rulfo',
      editorial: 'Editorial Planeta',
      isbnIssn: '978-84-08-78901-2',
      stockDisponible: 5,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=300&fit=crop',
      anioPublicacion: 1955,
      lugarPublicacion: 'México D.F.',
      numeroEdicion: 'Edición conmemorativa',
      descripcionFisica: '128 p. ; 21 cm',
      idFormato: 1,
      idIdioma: 1,
    },
    {
      id: 8,
      tituloPropio: 'El Aleph',
      autor: 'Jorge Luis Borges',
      editorial: 'Editorial Sudamericana',
      isbnIssn: '978-84-08-89012-3',
      stockDisponible: 7,
      imagenTapaUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop',
      anioPublicacion: 1949,
      lugarPublicacion: 'Buenos Aires',
      numeroEdicion: 'Edición definitiva',
      descripcionFisica: '208 p. ; 20 cm',
      idFormato: 1,
      idIdioma: 1,
    },
  ]

  private itemsMock: Item[] = [
    // Items para El Quijote (id: 1) - 5 disponibles
    { id: 1, idManifestacion: 1, codigoBarras: 'BAR001', numeroInventario: 'INV001', disponiblePrestamo: true },
    { id: 2, idManifestacion: 1, codigoBarras: 'BAR002', numeroInventario: 'INV002', disponiblePrestamo: true },
    { id: 3, idManifestacion: 1, codigoBarras: 'BAR003', numeroInventario: 'INV003', disponiblePrestamo: true },
    { id: 4, idManifestacion: 1, codigoBarras: 'BAR004', numeroInventario: 'INV004', disponiblePrestamo: true },
    { id: 5, idManifestacion: 1, codigoBarras: 'BAR005', numeroInventario: 'INV005', disponiblePrestamo: true },
    // Items para Cien Años de Soledad (id: 2) - 2 disponibles de 3 totales
    { id: 6, idManifestacion: 2, codigoBarras: 'BAR006', numeroInventario: 'INV006', disponiblePrestamo: true },
    { id: 7, idManifestacion: 2, codigoBarras: 'BAR007', numeroInventario: 'INV007', disponiblePrestamo: true },
    { id: 8, idManifestacion: 2, codigoBarras: 'BAR008', numeroInventario: 'INV008', disponiblePrestamo: false },
    // Items para 1984 (id: 3) - 0 disponibles (1 prestado)
    { id: 9, idManifestacion: 3, codigoBarras: 'BAR009', numeroInventario: 'INV009', disponiblePrestamo: false },
    // Items para Rayuela (id: 4) - 1 disponible
    { id: 10, idManifestacion: 4, codigoBarras: 'BAR010', numeroInventario: 'INV010', disponiblePrestamo: true },
    // Items para Ficciones (id: 5) - 2 disponibles
    { id: 11, idManifestacion: 5, codigoBarras: 'BAR011', numeroInventario: 'INV011', disponiblePrestamo: true },
    { id: 12, idManifestacion: 5, codigoBarras: 'BAR012', numeroInventario: 'INV012', disponiblePrestamo: true },
    // Items para La ciudad y los perros (id: 6) - 2 disponibles
    { id: 13, idManifestacion: 6, codigoBarras: 'BAR013', numeroInventario: 'INV013', disponiblePrestamo: true },
    { id: 14, idManifestacion: 6, codigoBarras: 'BAR014', numeroInventario: 'INV014', disponiblePrestamo: true },
    // Items para Pedro Páramo (id: 7) - 5 disponibles
    { id: 15, idManifestacion: 7, codigoBarras: 'BAR015', numeroInventario: 'INV015', disponiblePrestamo: true },
    { id: 16, idManifestacion: 7, codigoBarras: 'BAR016', numeroInventario: 'INV016', disponiblePrestamo: true },
    { id: 17, idManifestacion: 7, codigoBarras: 'BAR017', numeroInventario: 'INV017', disponiblePrestamo: true },
    { id: 18, idManifestacion: 7, codigoBarras: 'BAR018', numeroInventario: 'INV018', disponiblePrestamo: true },
    { id: 19, idManifestacion: 7, codigoBarras: 'BAR019', numeroInventario: 'INV019', disponiblePrestamo: true },
    // Items para El Aleph (id: 8) - 7 disponibles
    { id: 20, idManifestacion: 8, codigoBarras: 'BAR020', numeroInventario: 'INV020', disponiblePrestamo: true },
    { id: 21, idManifestacion: 8, codigoBarras: 'BAR021', numeroInventario: 'INV021', disponiblePrestamo: true },
    { id: 22, idManifestacion: 8, codigoBarras: 'BAR022', numeroInventario: 'INV022', disponiblePrestamo: true },
    { id: 23, idManifestacion: 8, codigoBarras: 'BAR023', numeroInventario: 'INV023', disponiblePrestamo: true },
    { id: 24, idManifestacion: 8, codigoBarras: 'BAR024', numeroInventario: 'INV024', disponiblePrestamo: true },
    { id: 25, idManifestacion: 8, codigoBarras: 'BAR025', numeroInventario: 'INV025', disponiblePrestamo: true },
    { id: 26, idManifestacion: 8, codigoBarras: 'BAR026', numeroInventario: 'INV026', disponiblePrestamo: true },
  ]

  async getManifestaciones(params?: SearchParams) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Actualizar stock disponible para todas las manifestaciones
    this.manifestaciones.forEach((m) => {
      const itemsDisponibles = this.itemsMock.filter(
        (i) => i.idManifestacion === m.id && i.disponiblePrestamo
      )
      m.stockDisponible = itemsDisponibles.length
    })

    console.log('[MockCatalogoService] getManifestaciones - Array ANTES de filtrar:', this.manifestaciones.length, 'libros')
    console.log('[MockCatalogoService] IDs ANTES de filtrar:', this.manifestaciones.map(m => m.id))
    let filtered = [...this.manifestaciones]

    // Aplicar búsqueda
    if (params?.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.tituloPropio.toLowerCase().includes(search) ||
          m.autor?.toLowerCase().includes(search) ||
          m.isbnIssn?.toLowerCase().includes(search)
      )
    }

    // Aplicar filtros
    if (params?.editorial) {
      filtered = filtered.filter((m) => m.editorial === params.editorial)
    }

    // Paginación
    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    console.log('[MockCatalogoService] getManifestaciones - Total en array:', this.manifestaciones.length, 'Filtrados:', filtered.length, 'Paginados:', paginated.length)
    console.log('[MockCatalogoService] IDs de libros en array:', this.manifestaciones.map(m => ({ id: m.id, titulo: m.tituloPropio })))
    
    return {
      data: {
        data: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      } as PaginatedResponse<Manifestacion>,
    }
  }

  async getManifestacion(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const manifestacion = this.manifestaciones.find((m) => m.id === id)
    return { data: manifestacion! }
  }

  async createManifestacion(data: Partial<Manifestacion>) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newId = Math.max(...this.manifestaciones.map((m) => m.id), 0) + 1
    const newManifestacion: Manifestacion = {
      id: newId,
      tituloPropio: data.tituloPropio || '',
      idFormato: data.idFormato || 1,
      idIdioma: data.idIdioma || 1,
      stockDisponible: 0,
      ...data,
    }
    this.manifestaciones.push(newManifestacion)
    return { data: newManifestacion }
  }

  async updateManifestacion(id: number, data: Partial<Manifestacion>) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = this.manifestaciones.findIndex((m) => m.id === id)
    if (index !== -1) {
      this.manifestaciones[index] = { ...this.manifestaciones[index], ...data }
      return { data: this.manifestaciones[index] }
    }
    throw new Error('Manifestación no encontrada')
  }

  async deleteManifestacion(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    this.manifestaciones = this.manifestaciones.filter((m) => m.id !== id)
    return { data: undefined }
  }

  async getItems(manifestacionId: number) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    // Filtrar items por manifestación
    const itemsFiltrados = this.itemsMock.filter((i) => i.idManifestacion === manifestacionId)
    return {
      data: itemsFiltrados,
    }
  }

  async importZ3950(isbn: string) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Base de datos simulada de libros conocidos para importación realista
    const librosConocidos: Record<string, Partial<Manifestacion>> = {
      '9788432210468': {
        tituloPropio: 'Cien años de soledad',
        autor: 'García Márquez, Gabriel',
        editorial: 'Editorial Sudamericana',
        isbnIssn: '978-84-322-1046-8',
        anioPublicacion: 1967,
        lugarPublicacion: 'Buenos Aires',
        numeroEdicion: '1ª edición',
        descripcionFisica: '471 p. ; 23 cm',
        idFormato: 1,
        idIdioma: 1,
        imagenTapaUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      },
      '9788491051884': {
        tituloPropio: 'El Quijote de la Mancha',
        autor: 'Cervantes, Miguel de',
        editorial: 'Editorial Planeta',
        isbnIssn: '978-84-9105-188-4',
        anioPublicacion: 1605,
        lugarPublicacion: 'Madrid',
        numeroEdicion: 'Edición conmemorativa',
        descripcionFisica: '2 v. ; 24 cm',
        idFormato: 1,
        idIdioma: 1,
        imagenTapaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      },
      '9788497592207': {
        tituloPropio: '1984',
        autor: 'Orwell, George',
        editorial: 'Penguin Random House',
        isbnIssn: '978-84-9759-220-7',
        anioPublicacion: 1949,
        lugarPublicacion: 'Londres',
        numeroEdicion: 'Edición definitiva',
        descripcionFisica: '352 p. ; 20 cm',
        idFormato: 1,
        idIdioma: 2,
        imagenTapaUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop',
      },
      '9788432210475': {
        tituloPropio: 'Rayuela',
        autor: 'Cortázar, Julio',
        editorial: 'Editorial Sudamericana',
        isbnIssn: '978-84-322-1047-5',
        anioPublicacion: 1963,
        lugarPublicacion: 'Buenos Aires',
        numeroEdicion: 'Edición especial',
        descripcionFisica: '736 p. ; 23 cm',
        idFormato: 1,
        idIdioma: 1,
        imagenTapaUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
      },
      '9788432210482': {
        tituloPropio: 'Ficciones',
        autor: 'Borges, Jorge Luis',
        editorial: 'Editorial Sudamericana',
        isbnIssn: '978-84-322-1048-2',
        anioPublicacion: 1944,
        lugarPublicacion: 'Buenos Aires',
        numeroEdicion: 'Edición crítica',
        descripcionFisica: '192 p. ; 20 cm',
        idFormato: 1,
        idIdioma: 1,
        imagenTapaUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
      },
    }

    // Limpiar ISBN (quitar guiones y espacios)
    const isbnLimpio = isbn.replace(/[-\s]/g, '')
    
    // Buscar en base de datos conocida
    const libroConocido = librosConocidos[isbnLimpio]
    
    const newId = Math.max(...this.manifestaciones.map((m) => m.id), 0) + 1
    
    let imported: Manifestacion
    
    if (libroConocido) {
      // Usar datos del libro conocido
      imported = {
        id: newId,
        tituloPropio: libroConocido.tituloPropio || `Libro importado - ${isbn}`,
        autor: libroConocido.autor,
        editorial: libroConocido.editorial,
        isbnIssn: libroConocido.isbnIssn || isbn,
        anioPublicacion: libroConocido.anioPublicacion,
        lugarPublicacion: libroConocido.lugarPublicacion,
        numeroEdicion: libroConocido.numeroEdicion,
        descripcionFisica: libroConocido.descripcionFisica,
        idFormato: libroConocido.idFormato || 1,
        idIdioma: libroConocido.idIdioma || 1,
        imagenTapaUrl: libroConocido.imagenTapaUrl,
        stockDisponible: 0,
      }
    } else {
      // Generar datos genéricos para ISBN desconocido
      imported = {
        id: newId,
        tituloPropio: `Libro importado - ${isbn}`,
        isbnIssn: isbn,
        idFormato: 1,
        idIdioma: 1,
        stockDisponible: 0,
        imagenTapaUrl: 'https://via.placeholder.com/200x300?text=Sin+portada',
      }
    }
    
    this.manifestaciones.push(imported)
    console.log('[MockCatalogoService] Libro importado y guardado:', imported.tituloPropio, 'ID:', imported.id, 'Total libros:', this.manifestaciones.length)
    console.log('[MockCatalogoService] Todos los IDs después de importar:', this.manifestaciones.map(m => ({ id: m.id, titulo: m.tituloPropio })))
    return { data: imported } as { data: Manifestacion }
  }

  async getEditoriales() {
    return {
      data: [
        { id: 1, nombre: 'Editorial Planeta' },
        { id: 2, nombre: 'Penguin Random House' },
        { id: 3, nombre: 'Editorial Sudamericana' },
      ],
    }
  }

  async getFormatos() {
    return {
      data: [
        { id: 1, nombre: 'Libro' },
        { id: 2, nombre: 'Revista' },
        { id: 3, nombre: 'DVD' },
        { id: 4, nombre: 'CD' },
      ],
    }
  }

  async getIdiomas() {
    return {
      data: [
        { id: 1, nombre: 'Español' },
        { id: 2, nombre: 'Inglés' },
        { id: 3, nombre: 'Francés' },
      ],
    }
  }
}

// Función helper para obtener instancia del mock service (evita recursión)
// IMPORTANTE: Esta instancia debe ser compartida para que los datos persistan
let mockServiceInstance: MockCatalogoService | null = null
function getMockCatalogoService(): MockCatalogoService {
  if (!mockServiceInstance) {
    console.log('[CatalogoService] Creando nueva instancia de MockCatalogoService')
    mockServiceInstance = new MockCatalogoService()
  } else {
    console.log('[CatalogoService] Reutilizando instancia existente de MockCatalogoService')
  }
  return mockServiceInstance
}

// Crear la instancia del mock service ANTES de decidir cuál usar
// Esto asegura que siempre se use la misma instancia singleton
const mockServiceSingleton = getMockCatalogoService()

// Usar mock service si no hay API_URL configurada o está vacía
const hasApiUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ''
const catalogoServiceInstance = hasApiUrl
  ? new CatalogoService()
  : mockServiceSingleton

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log(`[CatalogoService] Using ${hasApiUrl ? 'API Service' : 'Mock Service'}`)
  if (hasApiUrl) {
    console.log(`[CatalogoService] API URL: ${import.meta.env.VITE_API_URL}`)
  }
}

export const catalogoService = catalogoServiceInstance

