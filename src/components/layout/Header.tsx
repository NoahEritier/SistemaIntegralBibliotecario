import { useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const sectionTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
  '/catalogo': 'Catálogo',
  '/circulacion': 'Circulación',
  '/usuarios': 'Usuarios',
  '/fondo-documental': 'Fondo Documental',
  '/digitalizacion': 'Digitalización',
  '/mis-prestamos': 'Mis Préstamos',
  '/buscar-libros': 'Buscar Libros',
  '/eventos': 'Eventos',
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const currentSection = sectionTitles[location.pathname] || 'Códice'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 bg-background-secondary border-b border-[#E5E5E5]">
      <div className="flex items-center justify-between px-8 py-4">
        <h2 className="text-xl font-display text-text-primary">{currentSection}</h2>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-text-secondary">{user?.email || ''}</p>
          </div>
          <div className="w-10 h-10 rounded-md border border-accent flex items-center justify-center bg-background-primary">
            <User className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'p-2 rounded-md border border-accent hover:border-accent-active',
              'hover:bg-background-primary transition-colors'
            )}
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}

