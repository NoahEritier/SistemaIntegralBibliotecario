// Tipos globales de la aplicación

export type UserRole = 'director' | 'bibliotecario' | 'archivista' | 'usuario'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}






