# Prisma - Base de Datos Códice

Este directorio contiene el esquema de Prisma para la base de datos PostgreSQL de Códice.

## Estructura del Schema

El `schema.prisma` está organizado en 5 módulos principales:

### Módulo 1: Catálogo Bibliográfico (FRBR)
- **Obra**: Nivel abstracto de la obra
- **Manifestacion**: Edición específica (ISBN, editorial, etc.)
- **Item**: Ejemplar físico en el estante
- Tablas maestras: Editorial, Autoridad, Materia, Idioma, País, Formato

### Módulo 2: Archivo Histórico (ISAD-G)
- **UnidadArchivistica**: Estructura recursiva (Fondos, Series, etc.)
- **ObjetoDigital**: Gestión de activos digitales (DAM)
- Tablas maestras: NivelDescripcion, CondicionAcceso

### Módulo 3: Usuarios y Circulación
- **UsuarioLector**: Usuarios del sistema
- **Prestamo**: Préstamos de materiales
- **Reserva**: Reservas de materiales
- **Sancion**: Sanciones a usuarios
- **PoliticaCirculacion**: Reglas de negocio parametrizables
- Tablas maestras: CategoriaUsuario, EstadoUsuario, MotivoSancion

### Módulo 4: Extensión Cultural
- **Evento**: Eventos culturales
- **Inscripcion**: Inscripciones a eventos
- Tablas maestras: TipoEvento, EspacioFisico

### Módulo 5: Administración
- **UsuarioStaff**: Personal del sistema
- **LogAuditoria**: Registro de cambios
- **UbicacionFisica**: Ubicación de materiales
- Tablas maestras: RolSistema, EstadoConservacion, Procedencia

## Comandos Prisma

### Generar el cliente de Prisma
```bash
npm run db:generate
```

### Crear y aplicar migraciones
```bash
npm run db:migrate
```

### Sincronizar schema con la base de datos (desarrollo)
```bash
npm run db:push
```

### Abrir Prisma Studio (GUI)
```bash
npm run db:studio
```

### Ejecutar seed (datos iniciales)
```bash
npm run db:seed
```

## Configuración

1. Crear archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/codice?schema=public"
```

2. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE codice;
```

3. Ejecutar migraciones:
```bash
npm run db:migrate
```

4. Poblar datos iniciales:
```bash
npm run db:seed
```

## Notas Importantes

- El modelo FRBR está implementado con las tres entidades: Obra → Manifestacion → Item
- La estructura archivística es recursiva mediante `idPadre` en `UnidadArchivistica`
- Las políticas de circulación son parametrizables por categoría de usuario y formato
- El sistema de auditoría registra todos los cambios en `LogAuditoria`
- Los objetos digitales pueden asociarse tanto a unidades archivísticas como a manifestaciones






