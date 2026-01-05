import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ReportesPage } from '@/pages/ReportesPage'
import { ConfiguracionPage } from '@/pages/ConfiguracionPage'
import { CatalogoPage } from '@/pages/CatalogoPage'
import { CirculacionPage } from '@/pages/CirculacionPage'
import { UsuariosPage } from '@/pages/UsuariosPage'
import { FondoDocumentalPage } from '@/pages/FondoDocumentalPage'
import { DigitalizacionPage } from '@/pages/DigitalizacionPage'
import { MisPrestamosPage } from '@/pages/MisPrestamosPage'
import { BuscarLibrosPage } from '@/pages/BuscarLibrosPage'
import { EventosPage } from '@/pages/EventosPage'
import { RegistroPage } from '@/pages/RegistroPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="circulacion" element={<CirculacionPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="fondo-documental" element={<FondoDocumentalPage />} />
        <Route path="digitalizacion" element={<DigitalizacionPage />} />
        <Route path="mis-prestamos" element={<MisPrestamosPage />} />
        <Route path="buscar-libros" element={<BuscarLibrosPage />} />
        <Route path="eventos" element={<EventosPage />} />
      </Route>
    </Routes>
  )
}

