import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  BookOpen, 
  RotateCcw, 
  Users,
  Archive,
  Scan,
  BookCheck,
  Search,
  Calendar,
  type LucideIcon
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/store/authStore'
import { cn } from '@/utils/cn'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  roles: UserRole[]
}

const navItems: NavItem[] = [
  // Director
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['DIRECTOR'] },
  { path: '/reportes', label: 'Reportes', icon: FileText, roles: ['DIRECTOR'] },
  { path: '/configuracion', label: 'Configuración', icon: Settings, roles: ['DIRECTOR'] },
  
  // Bibliotecario
  { path: '/catalogo', label: 'Catálogo', icon: BookOpen, roles: ['BIBLIOTECARIO'] },
  { path: '/circulacion', label: 'Circulación', icon: RotateCcw, roles: ['BIBLIOTECARIO'] },
  { path: '/usuarios', label: 'Socios', icon: Users, roles: ['BIBLIOTECARIO'] },
  { path: '/eventos', label: 'Eventos', icon: Calendar, roles: ['BIBLIOTECARIO'] },
  
  // Archivista
  { path: '/fondo-documental', label: 'Fondo Documental', icon: Archive, roles: ['ARCHIVISTA'] },
  { path: '/digitalizacion', label: 'Digitalización', icon: Scan, roles: ['ARCHIVISTA'] },
  
  // Usuario
  { path: '/mis-prestamos', label: 'Mis Préstamos', icon: BookCheck, roles: ['USUARIO'] },
  { path: '/buscar-libros', label: 'Buscar Libros', icon: Search, roles: ['USUARIO'] },
  { path: '/eventos', label: 'Eventos', icon: Calendar, roles: ['USUARIO'] },
]

export function Sidebar() {
  const { role } = useAuth()

  if (!role) return null

  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background-secondary border-r border-[#E5E5E5] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E5E5E5]">
        <h1 className="text-2xl font-display text-[#2C1E1A]">Códice</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary transition-colors relative',
                      'hover:bg-background-primary hover:text-accent-active',
                      isActive && 'text-accent-active bg-background-primary'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-active rounded-r" />
                      )}
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

