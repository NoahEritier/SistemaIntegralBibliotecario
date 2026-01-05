import { create } from 'zustand'

export type Permiso = 
  | 'borrar_libros'
  | 'condonar_multas'
  | 'crear_usuarios'
  | 'editar_catalogo'
  | 'ver_reportes'
  | 'gestionar_staff'
  | 'configurar_politicas'
  | 'ver_auditoria'

export interface UsuarioStaff {
  id: string
  username: string
  nombreCompleto: string
  email: string
  rol: string
  permisos: Permiso[]
  activo: boolean
  fechaCreacion: string
}

export interface StaffState {
  staff: UsuarioStaff[]
  addStaff: (staff: Omit<UsuarioStaff, 'id' | 'fechaCreacion'>) => void
  updateStaff: (id: string, updates: Partial<UsuarioStaff>) => void
  deleteStaff: (id: string) => void
  getStaff: (id: string) => UsuarioStaff | undefined
}

// Datos mock iniciales
const staffInicial: UsuarioStaff[] = [
  {
    id: '1',
    username: 'admin',
    nombreCompleto: 'Administrador Principal',
    email: 'admin@biblioteca.edu',
    rol: 'Director',
    permisos: [
      'borrar_libros',
      'condonar_multas',
      'crear_usuarios',
      'editar_catalogo',
      'ver_reportes',
      'gestionar_staff',
      'configurar_politicas',
      'ver_auditoria',
    ],
    activo: true,
    fechaCreacion: '2024-01-15',
  },
  {
    id: '2',
    username: 'maria.garcia',
    nombreCompleto: 'María García',
    email: 'maria.garcia@biblioteca.edu',
    rol: 'Bibliotecario',
    permisos: ['editar_catalogo', 'ver_reportes'],
    activo: true,
    fechaCreacion: '2024-02-20',
  },
  {
    id: '3',
    username: 'juan.perez',
    nombreCompleto: 'Juan Pérez',
    email: 'juan.perez@biblioteca.edu',
    rol: 'Bibliotecario',
    permisos: ['editar_catalogo', 'condonar_multas'],
    activo: true,
    fechaCreacion: '2024-03-10',
  },
]

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: staffInicial,
  addStaff: (newStaff) => {
    const staff: UsuarioStaff = {
      ...newStaff,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
    }
    set((state) => ({
      staff: [...state.staff, staff],
    }))
  },
  updateStaff: (id, updates) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  },
  deleteStaff: (id) => {
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    }))
  },
  getStaff: (id) => {
    return get().staff.find((s) => s.id === id)
  },
}))




