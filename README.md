# Event Manager

Sistema completo de gestión de eventos con autenticación, base de datos, generación de códigos QR y dashboard administrativo.

## 🚀 Características

- ✅ Autenticación con Clerk (login, registro, logout)
- ✅ Base de datos PostgreSQL con Prisma (Neon)
- ✅ Dashboard con sidebar funcional
- ✅ CRUD completo de eventos
- ✅ Generación automática de códigos QR
- ✅ Validaciones con React Hook Form + Zod
- ✅ Server Actions y API Routes
- ✅ Landing pública
- ✅ Diseño moderno con TailwindCSS

## 📋 Requisitos Previos

- Bun instalado ([https://bun.sh](https://bun.sh))
- Cuenta en [Clerk](https://clerk.com) para autenticación
- Cuenta en [Neon](https://neon.tech) para base de datos PostgreSQL
- (Opcional) Cuenta en [UploadThing](https://uploadthing.com) o [Cloudinary](https://cloudinary.com) para almacenamiento de imágenes

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   bun install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # UploadThing (Opcional)
   UPLOADTHING_SECRET=sk_live_...
   UPLOADTHING_APP_ID=...

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configurar Clerk**

   - Crea una cuenta en [Clerk](https://clerk.com)
   - Crea una nueva aplicación
   - Copia las claves `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` a tu `.env`

5. **Configurar Base de Datos**

   - Crea una cuenta en [Neon](https://neon.tech)
   - Crea un nuevo proyecto PostgreSQL
   - Copia la connection string a `DATABASE_URL` en tu `.env`

6. **Generar cliente de Prisma**
   ```bash
   bun run db:generate
   ```

7. **Ejecutar migraciones**
   ```bash
   bun run db:push
   ```
   O si prefieres usar migraciones:
   ```bash
   bun run db:migrate
   ```

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo
```bash
bun run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
bun run build
bun start
```

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts          # API para crear y listar eventos
│   │       └── [id]/
│   │           └── route.ts      # API para leer, actualizar y eliminar eventos
│   ├── dashboard/
│   │   ├── events/
│   │   │   ├── create/           # Crear evento
│   │   │   ├── [id]/             # Ver evento
│   │   │   └── [id]/edit/        # Editar evento
│   │   ├── layout.tsx            # Layout del dashboard con sidebar
│   │   └── page.tsx              # Página principal del dashboard
│   ├── event/
│   │   └── [id]/
│   │       └── page.tsx          # Vista pública del evento
│   ├── sign-in/                  # Página de login
│   ├── sign-up/                  # Página de registro
│   ├── layout.tsx                # Layout raíz con ClerkProvider
│   ├── page.tsx                  # Landing pública
│   └── globals.css               # Estilos globales
├── components/
│   ├── EventForm.tsx             # Formulario de eventos
│   ├── DeleteEventButton.tsx     # Botón de eliminar evento
│   └── Sidebar.tsx               # Sidebar del dashboard
├── lib/
│   ├── prisma.ts                 # Cliente de Prisma
│   ├── clerk.ts                  # Helpers de Clerk
│   ├── qr.ts                     # Generación de códigos QR
│   └── upload.ts                 # Helpers de upload (UploadThing)
├── prisma/
│   └── schema.prisma             # Schema de Prisma
├── middleware.ts                 # Middleware de Clerk para proteger rutas
└── package.json
```

## 🔐 Rutas Protegidas

Todas las rutas dentro de `/dashboard` están protegidas por middleware de Clerk. Los usuarios deben estar autenticados para acceder.

## 📝 Modelo de Datos

El modelo `Event` incluye:
- Información básica (título, descripción, ubicación, ciudad, fecha, horas)
- Código QR generado automáticamente
- Auditoría (usuario creador, fechas de creación/actualización)

## 🎨 Funcionalidades

### Dashboard
- Vista de todos los eventos del usuario
- Acceso rápido a crear, editar y eliminar eventos
- Información del usuario autenticado

### CRUD de Eventos
- **Crear**: Formulario completo con validaciones
- **Leer**: Vista detallada con información completa y QR
- **Actualizar**: Edición de todos los campos
- **Eliminar**: Eliminación con confirmación

### Códigos QR
- Generación automática al crear un evento
- URL pública del evento: `https://midominio.com/event/{id}`
- Opción de descarga del QR
- Visualización en vista pública y privada

## 🔧 Scripts Disponibles

- `bun run dev` - Inicia el servidor de desarrollo
- `bun run build` - Construye la aplicación para producción
- `bun start` - Inicia el servidor de producción
- `bun run db:push` - Sincroniza el schema con la base de datos
- `bun run db:migrate` - Crea una nueva migración
- `bun run db:generate` - Genera el cliente de Prisma
- `bun run db:studio` - Abre Prisma Studio

## 📦 Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Clerk** - Autenticación
- **Prisma** - ORM para base de datos
- **PostgreSQL (Neon)** - Base de datos
- **TailwindCSS** - Estilos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **qrcode** - Generación de códigos QR
- **date-fns** - Manejo de fechas

## 🚧 Notas Importantes

1. **Códigos QR**: Actualmente se guardan como data URLs. Para producción, se recomienda subirlos a UploadThing o Cloudinary.

2. **Variables de Entorno**: Asegúrate de configurar todas las variables necesarias antes de ejecutar el proyecto.

3. **Base de Datos**: El proyecto usa Prisma con PostgreSQL. Asegúrate de tener la conexión configurada correctamente.

4. **Clerk**: Configura las URLs de redirección en el dashboard de Clerk para que coincidan con tu aplicación.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.

---

Desarrollado con ❤️ usando Next.js y Clerk

