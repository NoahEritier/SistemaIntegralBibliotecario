import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { UserRole } from '@/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const { setUsuarioActual } = useUsuarioPublicoStore()

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleLogin = (role: UserRole) => {
    login(role)
    
    // Si es usuario público, inicializar datos del usuario
    if (role === 'USUARIO') {
      setUsuarioActual({
        id: 1,
        legajoDni: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@example.com',
        categoriaUsuario: 'Estudiante',
      })
      navigate('/buscar-libros', { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-background-secondary border border-accent rounded-md p-8">
          <h1 className="text-3xl font-display text-text-primary mb-2">Códice</h1>
          <p className="text-text-secondary mb-8">Plataforma de Servicios Bibliotecarios</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleLogin('DIRECTOR')}
              className="w-full border border-accent rounded-md p-4 text-left hover:border-accent-active transition-colors"
            >
              <span className="block font-medium text-text-primary">Director</span>
              <span className="text-sm text-text-secondary">Dashboard, Reportes, Administración</span>
            </button>
            
            <button 
              onClick={() => handleLogin('BIBLIOTECARIO')}
              className="w-full border border-accent rounded-md p-4 text-left hover:border-accent-active transition-colors"
            >
              <span className="block font-medium text-text-primary">Bibliotecario</span>
              <span className="text-sm text-text-secondary">Catálogo, Circulación, Usuarios</span>
            </button>
            
            <button 
              onClick={() => handleLogin('ARCHIVISTA')}
              className="w-full border border-accent rounded-md p-4 text-left hover:border-accent-active transition-colors"
            >
              <span className="block font-medium text-text-primary">Archivista</span>
              <span className="text-sm text-text-secondary">Archivo Histórico, Dashboard</span>
            </button>
            
            <button 
              onClick={() => handleLogin('USUARIO')}
              className="w-full border border-accent rounded-md p-4 text-left hover:border-accent-active transition-colors"
            >
              <span className="block font-medium text-text-primary">Usuario/Lector</span>
              <span className="text-sm text-text-secondary">OPAC, Mis Préstamos, Eventos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

