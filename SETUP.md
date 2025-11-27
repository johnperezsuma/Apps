# Guía de Configuración Detallada

## 📋 Pasos de Instalación

### 1. Instalar Dependencias

```bash
bun install
```

### 2. Configurar Clerk

1. Ve a [https://clerk.com](https://clerk.com) y crea una cuenta
2. Crea una nueva aplicación
3. En el dashboard de Clerk, ve a "API Keys"
4. Copia las siguientes claves:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. Configura las URLs de redirección:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 3. Configurar Base de Datos (Neon)

1. Ve a [https://neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto PostgreSQL
3. Copia la connection string (debe verse así: `postgresql://user:password@host:5432/database?sslmode=require`)
4. Pégala en tu archivo `.env` como `DATABASE_URL`

### 4. Configurar Prisma

```bash
# Generar el cliente de Prisma
bun run db:generate

# Sincronizar el schema con la base de datos
bun run db:push
```

O si prefieres usar migraciones:

```bash
bun run db:migrate
```

### 5. Configurar UploadThing (Opcional)

Si quieres subir los códigos QR a UploadThing en lugar de usar data URLs:

1. Ve a [https://uploadthing.com](https://uploadthing.com) y crea una cuenta
2. Crea una nueva aplicación
3. Copia las siguientes claves:
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
4. Actualiza el código en `app/api/events/route.ts` para subir el QR a UploadThing

**Nota:** Por defecto, el proyecto usa data URLs para los códigos QR, que funcionan sin configuración adicional.

### 6. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

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

### 7. Ejecutar el Proyecto

```bash
bun run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Solución de Problemas

### Error: "Prisma Client hasn't been generated"
```bash
bun run db:generate
```

### Error: "Database connection failed"
- Verifica que tu `DATABASE_URL` sea correcta
- Asegúrate de que tu base de datos Neon esté activa
- Verifica que el SSL esté habilitado (`sslmode=require`)

### Error: "Clerk authentication failed"
- Verifica que las claves de Clerk estén correctas
- Asegúrate de que las URLs de redirección en Clerk coincidan con tu aplicación

### Los códigos QR no se muestran
- Los QR se generan como data URLs por defecto
- Si usas Next.js Image, asegúrate de que el dominio esté configurado en `next.config.js`
- Para data URLs, el componente Image de Next.js debería funcionar automáticamente

## 📝 Notas Adicionales

- El proyecto usa data URLs para los códigos QR por defecto, lo que no requiere configuración adicional
- Para producción, considera subir los QR a UploadThing o Cloudinary para mejor rendimiento
- Asegúrate de actualizar `NEXT_PUBLIC_APP_URL` con tu dominio real en producción

