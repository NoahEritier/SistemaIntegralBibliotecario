import { BookCheck, AlertCircle, UserPlus, Calendar } from 'lucide-react'
import {
  KPICard,
  PrestamosChart,
  AlertasTable,
  TasaCirculacionChart,
  MapaCalorChart,
  Top10Table,
} from '@/components/dashboard'

// Datos mockeados - En producción vendrán de la API
const kpiData = {
  prestamosActivos: 1247,
  mora: 23,
  nuevosSocios: 45,
  asistenciaEventos: 312,
}

const chartData = [
  { mes: 'Ene', prestamos: 1200, devoluciones: 1150 },
  { mes: 'Feb', prestamos: 1350, devoluciones: 1300 },
  { mes: 'Mar', prestamos: 1420, devoluciones: 1380 },
  { mes: 'Abr', prestamos: 1280, devoluciones: 1250 },
  { mes: 'May', prestamos: 1500, devoluciones: 1450 },
  { mes: 'Jun', prestamos: 1650, devoluciones: 1600 },
  { mes: 'Jul', prestamos: 1580, devoluciones: 1550 },
  { mes: 'Ago', prestamos: 1720, devoluciones: 1680 },
  { mes: 'Sep', prestamos: 1680, devoluciones: 1650 },
  { mes: 'Oct', prestamos: 1850, devoluciones: 1800 },
  { mes: 'Nov', prestamos: 1920, devoluciones: 1880 },
  { mes: 'Dic', prestamos: 2100, devoluciones: 2050 },
]

// Datos para Tasa de Circulación
const tasaCirculacionData = [
  { mes: 'Ene', tasa: 85.2, promedio: 82.5 },
  { mes: 'Feb', tasa: 88.7, promedio: 82.5 },
  { mes: 'Mar', tasa: 91.3, promedio: 82.5 },
  { mes: 'Abr', tasa: 87.5, promedio: 82.5 },
  { mes: 'May', tasa: 93.1, promedio: 82.5 },
  { mes: 'Jun', tasa: 95.8, promedio: 82.5 },
  { mes: 'Jul', tasa: 89.4, promedio: 82.5 },
  { mes: 'Ago', tasa: 92.6, promedio: 82.5 },
  { mes: 'Sep', tasa: 90.2, promedio: 82.5 },
  { mes: 'Oct', tasa: 94.5, promedio: 82.5 },
  { mes: 'Nov', tasa: 96.2, promedio: 82.5 },
  { mes: 'Dic', tasa: 98.1, promedio: 82.5 },
]

// Datos para Mapa de Calor (días y horas)
const mapaCalorData = [
  // Lunes
  { dia: 'Lun', hora: '8:00', valor: 12 },
  { dia: 'Lun', hora: '9:00', valor: 45 },
  { dia: 'Lun', hora: '10:00', valor: 78 },
  { dia: 'Lun', hora: '11:00', valor: 92 },
  { dia: 'Lun', hora: '12:00', valor: 65 },
  { dia: 'Lun', hora: '13:00', valor: 58 },
  { dia: 'Lun', hora: '14:00', valor: 85 },
  { dia: 'Lun', hora: '15:00', valor: 95 },
  { dia: 'Lun', hora: '16:00', valor: 88 },
  { dia: 'Lun', hora: '17:00', valor: 72 },
  { dia: 'Lun', hora: '18:00', valor: 35 },
  { dia: 'Lun', hora: '19:00', valor: 15 },
  // Martes
  { dia: 'Mar', hora: '8:00', valor: 15 },
  { dia: 'Mar', hora: '9:00', valor: 52 },
  { dia: 'Mar', hora: '10:00', valor: 82 },
  { dia: 'Mar', hora: '11:00', valor: 98 },
  { dia: 'Mar', hora: '12:00', valor: 72 },
  { dia: 'Mar', hora: '13:00', valor: 65 },
  { dia: 'Mar', hora: '14:00', valor: 88 },
  { dia: 'Mar', hora: '15:00', valor: 102 },
  { dia: 'Mar', hora: '16:00', valor: 95 },
  { dia: 'Mar', hora: '17:00', valor: 78 },
  { dia: 'Mar', hora: '18:00', valor: 42 },
  { dia: 'Mar', hora: '19:00', valor: 18 },
  // Miércoles
  { dia: 'Mié', hora: '8:00', valor: 18 },
  { dia: 'Mié', hora: '9:00', valor: 48 },
  { dia: 'Mié', hora: '10:00', valor: 75 },
  { dia: 'Mié', hora: '11:00', valor: 88 },
  { dia: 'Mié', hora: '12:00', valor: 68 },
  { dia: 'Mié', hora: '13:00', valor: 62 },
  { dia: 'Mié', hora: '14:00', valor: 82 },
  { dia: 'Mié', hora: '15:00', valor: 95 },
  { dia: 'Mié', hora: '16:00', valor: 88 },
  { dia: 'Mié', hora: '17:00', valor: 75 },
  { dia: 'Mié', hora: '18:00', valor: 38 },
  { dia: 'Mié', hora: '19:00', valor: 20 },
  // Jueves
  { dia: 'Jue', hora: '8:00', valor: 20 },
  { dia: 'Jue', hora: '9:00', valor: 55 },
  { dia: 'Jue', hora: '10:00', valor: 85 },
  { dia: 'Jue', hora: '11:00', valor: 95 },
  { dia: 'Jue', hora: '12:00', valor: 75 },
  { dia: 'Jue', hora: '13:00', valor: 68 },
  { dia: 'Jue', hora: '14:00', valor: 88 },
  { dia: 'Jue', hora: '15:00', valor: 98 },
  { dia: 'Jue', hora: '16:00', valor: 92 },
  { dia: 'Jue', hora: '17:00', valor: 82 },
  { dia: 'Jue', hora: '18:00', valor: 45 },
  { dia: 'Jue', hora: '19:00', valor: 22 },
  // Viernes
  { dia: 'Vie', hora: '8:00', valor: 22 },
  { dia: 'Vie', hora: '9:00', valor: 58 },
  { dia: 'Vie', hora: '10:00', valor: 88 },
  { dia: 'Vie', hora: '11:00', valor: 98 },
  { dia: 'Vie', hora: '12:00', valor: 78 },
  { dia: 'Vie', hora: '13:00', valor: 72 },
  { dia: 'Vie', hora: '14:00', valor: 92 },
  { dia: 'Vie', hora: '15:00', valor: 105 },
  { dia: 'Vie', hora: '16:00', valor: 95 },
  { dia: 'Vie', hora: '17:00', valor: 85 },
  { dia: 'Vie', hora: '18:00', valor: 48 },
  { dia: 'Vie', hora: '19:00', valor: 25 },
  // Sábado
  { dia: 'Sáb', hora: '8:00', valor: 8 },
  { dia: 'Sáb', hora: '9:00', valor: 25 },
  { dia: 'Sáb', hora: '10:00', valor: 45 },
  { dia: 'Sáb', hora: '11:00', valor: 58 },
  { dia: 'Sáb', hora: '12:00', valor: 42 },
  { dia: 'Sáb', hora: '13:00', valor: 35 },
  { dia: 'Sáb', hora: '14:00', valor: 48 },
  { dia: 'Sáb', hora: '15:00', valor: 52 },
  { dia: 'Sáb', hora: '16:00', valor: 38 },
  { dia: 'Sáb', hora: '17:00', valor: 28 },
  { dia: 'Sáb', hora: '18:00', valor: 15 },
  { dia: 'Sáb', hora: '19:00', valor: 8 },
  // Domingo
  { dia: 'Dom', hora: '8:00', valor: 5 },
  { dia: 'Dom', hora: '9:00', valor: 15 },
  { dia: 'Dom', hora: '10:00', valor: 28 },
  { dia: 'Dom', hora: '11:00', valor: 35 },
  { dia: 'Dom', hora: '12:00', valor: 25 },
  { dia: 'Dom', hora: '13:00', valor: 22 },
  { dia: 'Dom', hora: '14:00', valor: 32 },
  { dia: 'Dom', hora: '15:00', valor: 38 },
  { dia: 'Dom', hora: '16:00', valor: 28 },
  { dia: 'Dom', hora: '17:00', valor: 18 },
  { dia: 'Dom', hora: '18:00', valor: 12 },
  { dia: 'Dom', hora: '19:00', valor: 5 },
]

// Top 10 Libros más prestados
const top10Libros = [
  { id: '1', nombre: 'El Quijote de la Mancha', cantidad: 245 },
  { id: '2', nombre: 'Cien años de soledad', cantidad: 198 },
  { id: '3', nombre: '1984', cantidad: 187 },
  { id: '4', nombre: 'El Principito', cantidad: 175 },
  { id: '5', nombre: 'Don Juan Tenorio', cantidad: 162 },
  { id: '6', nombre: 'La Odisea', cantidad: 148 },
  { id: '7', nombre: 'Romeo y Julieta', cantidad: 135 },
  { id: '8', nombre: 'El Lazarillo de Tormes', cantidad: 128 },
  { id: '9', nombre: 'La Divina Comedia', cantidad: 115 },
  { id: '10', nombre: 'Hamlet', cantidad: 102 },
]

// Top 10 Términos de búsqueda fallidos
const top10BusquedasFallidas = [
  { id: '1', nombre: 'libros de matematicas avanzadas', cantidad: 89 },
  { id: '2', nombre: 'novelas romanticas juveniles', cantidad: 76 },
  { id: '3', nombre: 'historia de argentina siglo xx', cantidad: 68 },
  { id: '4', nombre: 'programacion python avanzado', cantidad: 62 },
  { id: '5', nombre: 'fisica cuantica para principiantes', cantidad: 55 },
  { id: '6', nombre: 'poesia contemporanea latinoamericana', cantidad: 48 },
  { id: '7', nombre: 'biografias de cientificos famosos', cantidad: 42 },
  { id: '8', nombre: 'arquitectura moderna siglo xxi', cantidad: 38 },
  { id: '9', nombre: 'filosofia existencialista moderna', cantidad: 35 },
  { id: '10', nombre: 'economia conductual y finanzas', cantidad: 32 },
]

const alertas = [
  {
    id: '1',
    tipo: 'warning' as const,
    mensaje: 'Stock de insumos de catalogación bajo (15% restante)',
    fecha: 'Hace 2 horas',
  },
  {
    id: '2',
    tipo: 'error' as const,
    mensaje: '3 sanciones apeladas pendientes de revisión',
    fecha: 'Hace 5 horas',
  },
  {
    id: '3',
    tipo: 'info' as const,
    mensaje: 'Nuevo lote de 50 libros recibido y pendiente de catalogación',
    fecha: 'Hace 1 día',
  },
  {
    id: '4',
    tipo: 'warning' as const,
    mensaje: 'Sistema de respaldo no ejecutado en las últimas 48 horas',
    fecha: 'Hace 2 días',
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Préstamos Activos"
          value={kpiData.prestamosActivos.toLocaleString()}
          icon={BookCheck}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="En Mora"
          value={kpiData.mora}
          icon={AlertCircle}
          trend={{ value: -5, isPositive: true }}
        />
        <KPICard
          title="Nuevos Socios"
          value={kpiData.nuevosSocios}
          icon={UserPlus}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Asistencia Eventos"
          value={kpiData.asistenciaEventos}
          icon={Calendar}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrestamosChart data={chartData} />
        <TasaCirculacionChart data={tasaCirculacionData} />
      </div>

      {/* Mapa de Calor */}
      <MapaCalorChart data={mapaCalorData} />

      {/* Top 10 y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Top10Table
          title="Top 10 Libros Más Prestados"
          items={top10Libros}
          tipo="libros"
        />
        <Top10Table
          title="Top 10 Búsquedas Fallidas"
          items={top10BusquedasFallidas}
          tipo="busquedas"
        />
        <AlertasTable alertas={alertas} autoGenerar={true} />
      </div>
    </div>
  )
}
