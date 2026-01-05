// Seed file para poblar la base de datos con datos iniciales
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear roles del sistema
  const rolAdmin = await prisma.rolSistema.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: {
      nombre: 'Administrador',
      permisosJson: {
        all: true
      }
    }
  })

  const rolBibliotecario = await prisma.rolSistema.upsert({
    where: { nombre: 'Bibliotecario' },
    update: {},
    create: {
      nombre: 'Bibliotecario',
      permisosJson: {
        catalogacion: true,
        circulacion: true,
        usuarios: true
      }
    }
  })

  const rolArchivista = await prisma.rolSistema.upsert({
    where: { nombre: 'Archivista' },
    update: {},
    create: {
      nombre: 'Archivista',
      permisosJson: {
        archivo: true,
        catalogacion: true
      }
    }
  })

  // Crear estados de usuario
  await prisma.estadoUsuario.upsert({
    where: { descripcion: 'Activo' },
    update: {},
    create: { descripcion: 'Activo' }
  })

  await prisma.estadoUsuario.upsert({
    where: { descripcion: 'Suspendido' },
    update: {},
    create: { descripcion: 'Suspendido' }
  })

  await prisma.estadoUsuario.upsert({
    where: { descripcion: 'Baja' },
    update: {},
    create: { descripcion: 'Baja' }
  })

  // Crear categorías de usuario
  await prisma.categoriaUsuario.upsert({
    where: { nombre: 'Estudiante' },
    update: {},
    create: { nombre: 'Estudiante' }
  })

  await prisma.categoriaUsuario.upsert({
    where: { nombre: 'Docente' },
    update: {},
    create: { nombre: 'Docente' }
  })

  await prisma.categoriaUsuario.upsert({
    where: { nombre: 'Investigador' },
    update: {},
    create: { nombre: 'Investigador' }
  })

  // Crear formatos de soporte
  await prisma.formatoSoporte.upsert({
    where: { nombre: 'Libro' },
    update: {},
    create: { nombre: 'Libro' }
  })

  await prisma.formatoSoporte.upsert({
    where: { nombre: 'Revista' },
    update: {},
    create: { nombre: 'Revista' }
  })

  await prisma.formatoSoporte.upsert({
    where: { nombre: 'DVD' },
    update: {},
    create: { nombre: 'DVD' }
  })

  await prisma.formatoSoporte.upsert({
    where: { nombre: 'CD' },
    update: {},
    create: { nombre: 'CD' }
  })

  // Crear idiomas
  await prisma.idioma.upsert({
    where: { codigoIso: 'es' },
    update: {},
    create: { codigoIso: 'es', nombre: 'Español' }
  })

  await prisma.idioma.upsert({
    where: { codigoIso: 'en' },
    update: {},
    create: { codigoIso: 'en', nombre: 'Inglés' }
  })

  await prisma.idioma.upsert({
    where: { codigoIso: 'fr' },
    update: {},
    create: { codigoIso: 'fr', nombre: 'Francés' }
  })

  // Crear tipos de rol
  await prisma.tipoRol.upsert({
    where: { descripcion: 'Autor' },
    update: {},
    create: { descripcion: 'Autor' }
  })

  await prisma.tipoRol.upsert({
    where: { descripcion: 'Traductor' },
    update: {},
    create: { descripcion: 'Traductor' }
  })

  await prisma.tipoRol.upsert({
    where: { descripcion: 'Ilustrador' },
    update: {},
    create: { descripcion: 'Ilustrador' }
  })

  await prisma.tipoRol.upsert({
    where: { descripcion: 'Editor' },
    update: {},
    create: { descripcion: 'Editor' }
  })

  // Crear niveles de descripción archivística
  await prisma.nivelDescripcion.upsert({
    where: { nombre: 'Fondo' },
    update: {},
    create: { nombre: 'Fondo' }
  })

  await prisma.nivelDescripcion.upsert({
    where: { nombre: 'Subfondo' },
    update: {},
    create: { nombre: 'Subfondo' }
  })

  await prisma.nivelDescripcion.upsert({
    where: { nombre: 'Serie' },
    update: {},
    create: { nombre: 'Serie' }
  })

  await prisma.nivelDescripcion.upsert({
    where: { nombre: 'Unidad Documental' },
    update: {},
    create: { nombre: 'Unidad Documental' }
  })

  // Crear condiciones de acceso
  await prisma.condicionAcceso.upsert({
    where: { descripcion: 'Público' },
    update: {},
    create: { descripcion: 'Público' }
  })

  await prisma.condicionAcceso.upsert({
    where: { descripcion: 'Reservado' },
    update: {},
    create: { descripcion: 'Reservado' }
  })

  await prisma.condicionAcceso.upsert({
    where: { descripcion: 'Confidencial' },
    update: {},
    create: { descripcion: 'Confidencial' }
  })

  // Crear estados de conservación
  await prisma.estadoConservacion.upsert({
    where: { descripcion: 'Bueno' },
    update: {},
    create: { descripcion: 'Bueno' }
  })

  await prisma.estadoConservacion.upsert({
    where: { descripcion: 'Regular' },
    update: {},
    create: { descripcion: 'Regular' }
  })

  await prisma.estadoConservacion.upsert({
    where: { descripcion: 'Malo' },
    update: {},
    create: { descripcion: 'Malo' }
  })

  await prisma.estadoConservacion.upsert({
    where: { descripcion: 'En Restauración' },
    update: {},
    create: { descripcion: 'En Restauración' }
  })

  // Crear procedencias
  await prisma.procedencia.upsert({
    where: { descripcion: 'Compra' },
    update: {},
    create: { descripcion: 'Compra' }
  })

  await prisma.procedencia.upsert({
    where: { descripcion: 'Donación' },
    update: {},
    create: { descripcion: 'Donación' }
  })

  await prisma.procedencia.upsert({
    where: { descripcion: 'Canje' },
    update: {},
    create: { descripcion: 'Canje' }
  })

  // Crear motivos de sanción
  await prisma.motivoSancion.upsert({
    where: { descripcion: 'Retraso' },
    update: {},
    create: { descripcion: 'Retraso' }
  })

  await prisma.motivoSancion.upsert({
    where: { descripcion: 'Daño' },
    update: {},
    create: { descripcion: 'Daño' }
  })

  await prisma.motivoSancion.upsert({
    where: { descripcion: 'Pérdida' },
    update: {},
    create: { descripcion: 'Pérdida' }
  })

  // Crear tipos de evento
  await prisma.tipoEvento.upsert({
    where: { nombre: 'Taller' },
    update: {},
    create: { nombre: 'Taller' }
  })

  await prisma.tipoEvento.upsert({
    where: { nombre: 'Charla' },
    update: {},
    create: { nombre: 'Charla' }
  })

  await prisma.tipoEvento.upsert({
    where: { nombre: 'Muestra' },
    update: {},
    create: { nombre: 'Muestra' }
  })

  await prisma.tipoEvento.upsert({
    where: { nombre: 'Conferencia' },
    update: {},
    create: { nombre: 'Conferencia' }
  })

  console.log('✅ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })






