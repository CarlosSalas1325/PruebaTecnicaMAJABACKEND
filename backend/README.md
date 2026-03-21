# PT-Maja Backend — API REST

API REST del blog PT-Maja construida con Express, TypeORM y PostgreSQL.

## Configuracion del archivo `.env`

Antes de levantar cualquier servicio crea el archivo `.env` en este directorio con el siguiente contenido:

```env
# PostgreSQL
POSTGRES_DB=blogdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_PORT=5433

# Backend
NODE_ENV=development
PORT=3000
API_PORT=3000
JWT_SECRET=super-secret-jwt-change-me
JWT_EXPIRES_IN=24h
DB_HOST=db
DB_PORT=5432
DB_NAME=blogdb
DB_USER=postgres
DB_PASSWORD=1234
CORS_ORIGIN=http://localhost:4200

# Cloudinary (opcional, necesario para subir imagenes)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

O copia el archivo de ejemplo y edita los valores:

```bash
cp .env.example .env
```

> **Nota:** Los valores de Cloudinary son opcionales si no vas a usar la subida de imagenes.

## Stack

| Tecnologia | Version |
| --- | --- |
| Node.js | 20 |
| Express | 4 |
| TypeScript | 5 |
| TypeORM | 0.3 |
| PostgreSQL | 16 |
| Zod | Validacion |
| JWT + bcryptjs | Autenticacion |
| Cloudinary | Almacenamiento de imagenes |
| Swagger | Documentacion de API |

## Requisitos

- **Docker** y **Docker Compose** instalados
- Puerto `3000` (API) y `5432` (PostgreSQL) disponibles

## Inicio rapido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` segun tu configuracion. Las variables principales son:

| Variable | Descripcion | Default |
| --- | --- | --- |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `super-secret-jwt-change-me` |
| `JWT_EXPIRES_IN` | Duracion del token | `24h` |
| `POSTGRES_DB` | Nombre de la base de datos | `blogdb` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contrasena de PostgreSQL | `1234` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:4200` |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary | — |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | — |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary | — |

### 2. Levantar los servicios

```bash
docker compose up --build
```

Esto levanta dos contenedores:

| Servicio | Puerto | Descripcion |
| --- | --- | --- |
| `ptmaja-db` | 5432 | PostgreSQL 16 |
| `ptmaja-api` | 3000 | API REST (Express) |

Al iniciar, el backend automaticamente:
1. Instala dependencias
2. Ejecuta migraciones de base de datos
3. Carga datos semilla (seed)
4. Arranca el servidor en modo desarrollo (hot reload)

### 3. Acceder

- **API:** http://localhost:3000/api
- **Health check:** http://localhost:3000/api/health
- **Swagger:** http://localhost:3000/api/docs

## Endpoints de la API

### Autenticacion

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | No | Iniciar sesion (devuelve JWT) |

### Posts

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/posts` | No | Listar posts (soporta filtros y paginacion) |
| `GET` | `/api/posts/:id` | No | Obtener un post por ID |
| `POST` | `/api/posts` | Si | Crear un nuevo post |
| `PATCH` | `/api/posts/:id` | Si | Actualizar un post |
| `DELETE` | `/api/posts/:id` | Si | Eliminar un post |

### Comentarios

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/posts/:postId/comments` | No | Listar comentarios de un post |
| `POST` | `/api/posts/:postId/comments` | Si | Crear un comentario |
| `PATCH` | `/api/posts/:postId/comments/:commentId` | Si | Actualizar un comentario |
| `DELETE` | `/api/posts/:postId/comments/:commentId` | Si | Eliminar un comentario |

### Categorias

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | No | Listar categorias |
| `POST` | `/api/categories` | Admin | Crear una categoria |
| `PATCH` | `/api/categories/:id` | Admin | Actualizar una categoria |
| `DELETE` | `/api/categories/:id` | Admin | Eliminar una categoria |

### Usuarios

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | Si | Obtener perfil del usuario autenticado |

### Uploads

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/api/uploads` | Si | Subir imagen (max 5MB, solo imagenes) |

> Los endpoints marcados con **Auth** requieren el header `Authorization: Bearer <token>`.
> Los endpoints marcados con **Admin** requieren ademas que el usuario tenga rol `admin`.

## Datos semilla

| Recurso | Datos |
| --- | --- |
| Usuario admin | email: `admin@blog.local`, password: `Admin123!`, rol: `admin` |

## Estructura del proyecto

```
src/
  app.ts                    # Punto de entrada, configuracion de Express
  config/
    data-source.ts          # Configuracion de TypeORM
    env.ts                  # Variables de entorno
  docs/
    swagger.ts              # Configuracion de Swagger
  middlewares/
    auth.middleware.ts       # Autenticacion JWT y verificacion de rol
    error.middleware.ts      # Manejo centralizado de errores
  migrations/
    1710000000000-InitSchema.ts
  modules/
    auth/                   # Registro e inicio de sesion
    categories/             # CRUD de categorias (admin)
    comments/               # CRUD de comentarios
    posts/                  # CRUD de posts
    users/                  # Perfil de usuario
  seeds/
    seed.ts                 # Datos iniciales
  utils/
    http-error.ts           # Clase HttpError
    jwt.ts                  # Generacion y verificacion de JWT
    validation.ts           # Validacion con Zod
```

## Desarrollo local (sin Docker)

```bash
npm install
npm run migration:run
npm run seed
npm run dev
```

Asegurate de tener PostgreSQL corriendo y configurado en `.env` con `DB_HOST=localhost`.

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Inicia en modo desarrollo con hot reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta la version compilada |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run seed` | Carga datos semilla |
| `npm test` | Ejecuta tests |
