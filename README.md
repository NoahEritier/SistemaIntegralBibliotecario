# Sistema Integral Bibliotecario - Códice

Sistema de gestión bibliotecaria integral que combina catalogación bibliográfica avanzada (FRBR), gestión de archivos históricos (ISAD-G), circulación de materiales, OPAC público y extensión cultural en una plataforma moderna y elegante.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📄 Sobre el Proyecto

Códice es una plataforma integral de servicios bibliotecarios (LSP - Library Services Platform) diseñada para modernizar y centralizar todas las operaciones de una biblioteca. El sistema implementa estándares internacionales de catalogación (FRBR) y descripción archivística (ISAD-G), ofreciendo una solución completa que abarca desde la gestión de catálogos bibliográficos hasta la administración de archivos históricos y eventos culturales.

![Demo de la aplicación]

La plataforma está construida con una arquitectura moderna basada en React y TypeScript, utilizando Prisma como ORM para gestionar una base de datos PostgreSQL robusta y escalable. El diseño sigue una estética "Modern Intellectual" minimalista y sofisticada, priorizando la usabilidad y la experiencia del usuario tanto para el personal bibliotecario como para los usuarios finales.

## ✨ Características Principales

- **📚 Catalogación Bibliográfica Avanzada**: Implementación del modelo FRBR (Functional Requirements for Bibliographic Records) con soporte para Obras, Manifestaciones e Items, incluyendo importación desde servidores Z39.50
- **📁 Gestión de Archivo Histórico**: Sistema de descripción archivística basado en ISAD-G con estructura jerárquica recursiva para fondos documentales
- **🔄 Circulación Inteligente**: Gestión completa de préstamos, renovaciones, reservas y devoluciones con políticas de circulación configurables por categoría de usuario y formato
- **👥 Gestión de Usuarios**: Sistema dual de usuarios (lectores y staff) con roles y permisos granulares, incluyendo gestión de sanciones y multas
- **🔍 OPAC Público**: Catálogo público en línea (OPAC) con búsqueda avanzada y visualización de disponibilidad en tiempo real
- **📊 Dashboard Analítico**: Panel de control con KPIs, gráficos de circulación, mapas de calor de uso y análisis de tendencias
- **📅 Extensión Cultural**: Gestión de eventos culturales con sistema de inscripciones y control de asistencia
- **📸 Digitalización de Documentos**: Sistema de gestión de activos digitales (DAM) con soporte para OCR y almacenamiento de objetos digitales
- **🔐 Sistema de Auditoría**: Registro completo de todas las operaciones realizadas por el personal con logs de auditoría
- **🎨 Interfaz Moderna**: Diseño minimalista y elegante con paleta de colores "Modern Intellectual" y tipografía sofisticada

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2.0** - Biblioteca de UI
- **TypeScript 5.2.2** - Tipado estático
- **Vite 5.0.8** - Build tool y dev server
- **React Router DOM 6.20.0** - Enrutamiento
- **Tailwind CSS 3.3.6** - Framework de estilos
- **Zustand 4.5.7** - Gestión de estado
- **React Hook Form 7.68.0** - Manejo de formularios
- **Recharts 2.10.3** - Visualización de datos
- **Lucide React 0.294.0** - Iconografía

### Backend y Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Prisma 5.22.0** - ORM y generador de cliente
- **@prisma/client 5.22.0** - Cliente de Prisma

### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **TypeScript ESLint** - Reglas de linting para TypeScript
- **tsx 4.21.0** - Ejecutor de TypeScript

## 🚀 Comenzando

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js** v18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **npm** v9.0.0 o superior (incluido con Node.js)
- **PostgreSQL** v14.0 o superior ([Descargar PostgreSQL](https://www.postgresql.org/download/))
- **Git** para clonar el repositorio

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/NoahEritier/SistemaIntegralBibliotecario.git
   cd SistemaIntegralBibliotecario
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura la base de datos**
   
   Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/codice?schema=public"
   ```
   
   Reemplaza `usuario`, `password` y `codice` con tus credenciales y nombre de base de datos.

4. **Genera el cliente de Prisma**
   ```bash
   npm run db:generate
   ```

5. **Crea y aplica las migraciones de base de datos**
   ```bash
   npm run db:migrate
   ```
   
   O si prefieres sincronizar el schema directamente (solo para desarrollo):
   ```bash
   npm run db:push
   ```

6. **Opcional: Ejecuta el seed para datos iniciales**
   ```bash
   npm run db:seed
   ```

## 💻 Uso

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo con hot-reload:

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173` (o el puerto que Vite asigne automáticamente).

### Build para Producción

Para crear una build optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`.

### Preview de la Build

Para previsualizar la build de producción localmente:

```bash
npm run preview
```

### Comandos Adicionales de Base de Datos

- **Abrir Prisma Studio** (GUI para visualizar y editar datos):
  ```bash
  npm run db:studio
  ```

- **Linting del código**:
  ```bash
  npm run lint
  ```

## 📂 Estructura del Proyecto

```
SistemaIntegralBibliotecario/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos (5 módulos)
│   ├── seed.ts                # Script de datos iniciales
│   └── README.md              # Documentación de Prisma
├── src/
│   ├── components/
│   │   ├── archivo/           # Componentes de archivo histórico
│   │   ├── catalogo/          # Componentes de catalogación
│   │   ├── circulacion/       # Componentes de circulación
│   │   ├── configuracion/     # Componentes de configuración
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── eventos/           # Componentes de eventos
│   │   ├── layout/            # Header y Sidebar
│   │   ├── opac/              # Componentes del OPAC público
│   │   ├── socios/            # Gestión de usuarios lectores
│   │   ├── staff/             # Gestión de personal
│   │   ├── ui/                # Componentes UI reutilizables
│   │   └── usuario/           # Componentes de usuario público
│   ├── features/              # Features modulares
│   ├── hooks/                 # Custom hooks (useAuth, useDebounce)
│   ├── layouts/               # Layouts de la aplicación
│   ├── lib/                   # Librerías (prisma.ts)
│   ├── pages/                 # Páginas principales
│   ├── router/                # Configuración de rutas
│   ├── services/              # Servicios API
│   ├── store/                 # Stores de Zustand
│   ├── types/                 # Definiciones de tipos TypeScript
│   ├── utils/                 # Utilidades (cn, helpers)
│   ├── App.tsx                # Componente raíz
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── .env                       # Variables de entorno (crear manualmente)
├── index.html                 # HTML principal
├── package.json               # Dependencias y scripts
├── tailwind.config.js         # Configuración de Tailwind
├── tsconfig.json              # Configuración de TypeScript
├── vite.config.ts             # Configuración de Vite
└── README.md                  # Este archivo
```

### Módulos de la Base de Datos

El esquema de Prisma está organizado en 5 módulos principales:

1. **Módulo 1: Catalogación Bibliográfica (FRBR)**
   - Obra, Manifestacion, Item
   - Autoridades, Materias, Editoriales

2. **Módulo 2: Archivo Histórico (ISAD-G)**
   - UnidadArchivistica (estructura jerárquica)
   - ObjetoDigital (DAM)

3. **Módulo 3: Usuarios y Circulación**
   - UsuarioLector, UsuarioStaff
   - Prestamo, Reserva, Sancion
   - PoliticaCirculacion

4. **Módulo 4: Extensión Cultural**
   - Evento, Inscripcion

5. **Módulo 5: Administración**
   - LogAuditoria, UbicacionFisica
   - Tablas maestras varias

## 👤 Autor

**Mia Denise Eritier (NoahEritier)**

---

> **Nota**: Este proyecto está en desarrollo activo. Algunas funcionalidades pueden requerir configuración adicional o estar en fase de implementación. Para más detalles sobre la configuración específica, consulta los archivos de documentación en las carpetas correspondientes.
