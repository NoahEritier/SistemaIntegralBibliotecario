import { useAuthStore, UserRole } from '@/store/authStore'

export function useAuth() {
  const { isAuthenticated, role, user, login, logout } = useAuthStore()

  return {
    isAuthenticated,
    role,
    user,
    login: (role: UserRole) => {
      login(role)
    },
    logout,
  }
}






