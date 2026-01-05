import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserRole = 'DIRECTOR' | 'BIBLIOTECARIO' | 'ARCHIVISTA' | 'USUARIO'

interface AuthState {
  isAuthenticated: boolean
  role: UserRole | null
  user: {
    name: string
    email: string
  } | null
  login: (role: UserRole, user?: { name: string; email: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      user: null,
      login: (role, user) =>
        set({
          isAuthenticated: true,
          role,
          user: user || {
            name: role === 'DIRECTOR' ? 'Director' : role === 'BIBLIOTECARIO' ? 'Bibliotecario' : role === 'ARCHIVISTA' ? 'Archivista' : 'Usuario',
            email: `${role.toLowerCase()}@codice.local`,
          },
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          role: null,
          user: null,
        }),
    }),
    {
      name: 'codice-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)



