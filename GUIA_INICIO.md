# Guía de Inicio - Sistema Integral Bibliotecario

## 📋 Requisitos Previos

1. **Node.js** ✅ (Ya instalado - versión 10.8.3)
2. **PostgreSQL** ⚠️ (Necesitas instalarlo)
3. **npm** ✅ (Ya disponible)

## 🚀 Pasos para Ejecutar la Aplicación

### Paso 1: Instalar PostgreSQL

**Opción A: Instalación Local**
1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instala PostgreSQL (anota el usuario y contraseña del superusuario)
3. Asegúrate de que el servicio PostgreSQL esté corriendo

**Opción B: Usar Docker (Recomendado)**
```bash
docker run --name codice-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=codice -p 5432:5432 -d postgres:15
```

### Paso 2: Crear el archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
# Base de datos PostgreSQL
# Ajusta usuario, contraseña y puerto según tu configuración
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/codice?schema=public"

# URL del API Backend
VITE_API_URL=http://localhost:3000/api
```

**⚠️ IMPORTANTE:** Ajusta los valores de `DATABASE_URL`:
- `postgres` (primer valor): usuario de PostgreSQL
- `postgres` (segundo valor): contraseña de PostgreSQL
- `5432`: puerto (por defecto es 5432)
- `codice`: nombre de la base de datos

### Paso 3: Crear la Base de Datos

**Si instalaste PostgreSQL localmente:**
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE codice;

# Salir
\q
```

**Si usas Docker:**
La base de datos se crea automáticamente con el comando docker run.

### Paso 4: Generar el Cliente de Prisma

```bash
npm run db:generate
```

### Paso 5: Aplicar el Schema a la Base de Datos

```bash
npm run db:push
```

Este comando creará todas las tablas en la base de datos según el schema de Prisma.

### Paso 6: Poblar Datos Iniciales (Opcional pero Recomendado)

```bash
npm run db:seed
```

Este comando creará los datos maestros iniciales (roles, estados, categorías, etc.)

### Paso 7: Verificar la Base de Datos (Opcional)

```bash
npm run db:studio
```

Esto abrirá Prisma Studio, una interfaz gráfica para ver y editar los datos.

### Paso 8: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173` (o el puerto que Vite asigne)

## ⚠️ Nota Importante sobre el Backend

El frontend está configurado para conectarse a un backend API en `http://localhost:3000/api`. 

**Actualmente no hay backend implementado**, por lo que:
- El frontend se ejecutará correctamente
- Las llamadas a la API fallarán hasta que implementes el backend
- Puedes ver la interfaz y navegar, pero las funcionalidades que requieren datos del servidor no funcionarán

## 🔧 Comandos Útiles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run db:generate` - Regenerar cliente Prisma
- `npm run db:push` - Sincronizar schema con BD (desarrollo)
- `npm run db:migrate` - Crear migración (producción)
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Ejecutar seed

## 📝 Resumen Rápido

```bash
# 1. Crear .env (manual)
# 2. Instalar/Configurar PostgreSQL
# 3. Crear base de datos
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

