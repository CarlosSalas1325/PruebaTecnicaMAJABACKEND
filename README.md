# PT-Maja - Plataforma de Blog

Aplicacion fullstack de blog con gestion de publicaciones, categorias, comentarios y autenticacion basada en JWT. Desarrollada como prueba tecnica.

---

## Stack tecnologico

| Capa | Tecnologia |
| --- | --- |
| Backend | Node.js 20, Express 4, TypeScript 5 |
| ORM | TypeORM 0.3 |
| Base de datos | PostgreSQL 16 |
| Validacion | Zod |
| Autenticacion | JWT + bcryptjs |
| Frontend | Angular 18 (standalone components) |
| Contenedores | Docker + Docker Compose |

---

## Requisitos previos

- **Docker** y **Docker Compose** instalados
- Puertos disponibles: `3000` (API), `4200` (Frontend), `5432` (PostgreSQL)

---

## Inicio rapido

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd PT-Maja
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env.example` trae valores por defecto funcionales. Solo es necesario modificar `JWT_SECRET` en produccion.

### 3. Levantar los servicios

```bash
docker compose up --build
```

Esto levanta tres contenedores:

| Servicio | Puerto | Descripcion |
| --- | --- | --- |
| `ptmaja-db` | 5432 | PostgreSQL 16 |
| `ptmaja-api` | 3000 | API REST (Express) |
| `ptmaja-web` | 4200 | Frontend (Angular) |

Al iniciar, el backend automaticamente:
1. Instala dependencias
2. Ejecuta migraciones de base de datos
3. Carga datos semilla (seed)
4. Arranca el servidor en modo desarrollo (hot reload)

### 4. Acceder

- **Frontend:** http://localhost:4200
- **API:** http://localhost:3000/api
- **Health check:** http://localhost:3000/api/health
- **Swagger (documentacion API):** http://localhost:3000/api/docs

---

## Datos semilla

Al ejecutarse el seed se crean automaticamente:

| Recurso | Datos |
| --- | --- |
| Usuario admin | email: `admin@blog.local`, password: `Admin123!`, rol: `admin` |
| Categorias | Tecnologia, Backend, Frontend |
| Post de ejemplo | "Bienvenido al Blog" (publicado) |

---

## Estructura del proyecto

```
PT-Maja/
├── backend/
│   └── src/
│       ├── app.ts                  # Entry point del servidor Express
│       ├── config/
│       │   ├── data-source.ts      # Configuracion TypeORM
│       │   └── env.ts              # Variables de entorno
│       ├── docs/
│       │   └── swagger.ts          # Configuracion OpenAPI/Swagger
│       ├── middlewares/
│       │   ├── auth.middleware.ts   # Autenticacion JWT + autorizacion admin
│       │   └── error.middleware.ts  # Manejo global de errores
│       ├── migrations/             # Migracion del esquema de BD
│       ├── modules/
│       │   ├── auth/               # Registro y login
│       │   ├── categories/         # CRUD de categorias
│       │   ├── comments/           # CRUD de comentarios
│       │   ├── posts/              # CRUD de posts con filtros
│       │   └── users/              # Perfil del usuario
│       ├── seeds/
│       │   └── seed.ts             # Datos iniciales
│       ├── types/                  # Tipos de TypeScript
│       └── utils/                  # Utilidades (JWT, errores, validacion)
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── guards/         # Guard de autenticacion
│       │   │   ├── interceptors/   # Interceptor HTTP (Bearer token)
│       │   │   └── services/       # Servicios (auth, posts, categorias, comentarios)
│       │   └── features/
│       │       ├── auth/           # Login y registro
│       │       ├── categories/     # Administracion de categorias
│       │       ├── comments/       # Formulario de comentarios
│       │       └── posts/          # Listado, detalle y formulario de posts
│       └── environments/           # Configuracion de entorno
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Endpoints de la API

### Autenticacion

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Registrar usuario nuevo |
| POST | `/api/auth/login` | No | Iniciar sesion |

**Body de registro:**
```json
{
  "name": "Juan Perez",
  "email": "juan@mail.com",
  "password": "miPassword123"
}
```

**Body de login:**
```json
{
  "email": "admin@blog.local",
  "password": "Admin123!"
}
```

**Respuesta (ambos):**
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "uuid", "name": "Admin", "email": "admin@blog.local", "role": "admin" }
}
```

### Usuarios

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/users/me` | Si | Perfil del usuario autenticado |

### Posts

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/posts` | No | Listar posts (paginacion + filtros) |
| GET | `/api/posts/:id` | No | Detalle de un post con comentarios |
| POST | `/api/posts` | Si | Crear post |
| PATCH | `/api/posts/:id` | Si (autor/admin) | Actualizar post |
| DELETE | `/api/posts/:id` | Si (autor/admin) | Eliminar post |

**Parametros de filtrado en GET `/api/posts`:**

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `search` | string | Busqueda por titulo (ILIKE) |
| `status` | string | Filtro por estado: `draft` o `published` |
| `authorId` | UUID | Filtro por autor |
| `categoryId` | UUID | Filtro por categoria |
| `from` | date | Fecha minima de creacion |
| `to` | date | Fecha maxima de creacion |
| `order` | string | Orden: `ASC` o `DESC` (default: `DESC`) |
| `page` | number | Pagina (default: 1) |
| `limit` | number | Items por pagina (default: 10) |

**Body para crear post:**
```json
{
  "title": "Mi primer post",
  "content": "Contenido del post con al menos 20 caracteres...",
  "status": "published",
  "categoryIds": ["uuid-categoria-1", "uuid-categoria-2"]
}
```

### Categorias

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/categories` | No | Listar categorias |
| POST | `/api/categories` | Si (admin) | Crear categoria |
| PATCH | `/api/categories/:id` | Si (admin) | Actualizar categoria |
| DELETE | `/api/categories/:id` | Si (admin) | Eliminar categoria |

### Comentarios

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/posts/:postId/comments` | No | Listar comentarios de un post |
| POST | `/api/posts/:postId/comments` | Si | Crear comentario |
| PATCH | `/api/posts/:postId/comments/:commentId` | Si (autor/admin) | Actualizar comentario |
| DELETE | `/api/posts/:postId/comments/:commentId` | Si (autor/admin) | Eliminar comentario |

---

## Autenticacion y autorizacion

- La autenticacion se maneja con **JWT** (JSON Web Tokens)
- El token se envia en el header: `Authorization: Bearer <token>`
- Existen **dos roles**: `admin` y `author`
- Los usuarios registrados via `/api/auth/register` reciben el rol `author` por defecto

### Permisos por rol

| Accion | author | admin |
| --- | --- | --- |
| Ver posts y comentarios | Si | Si |
| Crear posts y comentarios | Si | Si |
| Editar/eliminar sus propios posts | Si | Si |
| Editar/eliminar posts de otros | No | Si |
| CRUD de categorias | No | Si |

---

## Modelo de datos

```
┌──────────┐       ┌──────────────────┐       ┌────────────┐
│  users   │       │      posts       │       │ categories │
├──────────┤       ├──────────────────┤       ├────────────┤
│ id (PK)  │──┐    │ id (PK)          │    ┌──│ id (PK)    │
│ name     │  │    │ title            │    │  │ name       │
│ email    │  └───>│ author_id (FK)   │    │  │ description│
│ password │       │ content          │    │  └────────────┘
│ role     │       │ status           │    │
└──────────┘       └──────────────────┘    │
     │                    │                │
     │                    │  posts_categories (N:M)
     │                    │────────────────┘
     │             ┌──────────────┐
     │             │   comments   │
     │             ├──────────────┤
     └────────────>│ author_id(FK)│
                   │ post_id (FK) │
                   │ content      │
                   └──────────────┘
```

- **users** <-> **posts**: 1:N (un usuario puede tener muchos posts)
- **posts** <-> **categories**: N:M (tabla intermedia `posts_categories`)
- **posts** <-> **comments**: 1:N
- **users** <-> **comments**: 1:N
- Eliminacion en cascada: al eliminar un usuario se eliminan sus posts y comentarios

---

## Desarrollo local sin Docker

### Backend

```bash
cd backend
npm install
```

Asegurate de tener PostgreSQL corriendo y configurar `DB_HOST=localhost` en el `.env`:

```bash
npm run migration:run    # Crea las tablas
npm run seed             # Carga datos iniciales
npm run dev              # Inicia con hot reload (puerto 3000)
```

### Frontend

```bash
cd frontend
npm install
npm start                # Inicia en http://localhost:4200
```

---

## Scripts disponibles

### Backend (`/backend`)

| Script | Comando | Descripcion |
| --- | --- | --- |
| `dev` | `npm run dev` | Servidor con hot reload (ts-node-dev) |
| `build` | `npm run build` | Compila TypeScript a JavaScript |
| `start` | `npm start` | Ejecuta la version compilada |
| `migration:run` | `npm run migration:run` | Ejecuta migraciones pendientes |
| `seed` | `npm run seed` | Carga datos iniciales |
| `test` | `npm test` | Ejecuta tests con Jest |

### Frontend (`/frontend`)

| Script | Comando | Descripcion |
| --- | --- | --- |
| `start` | `npm start` | Servidor de desarrollo Angular |
| `build` | `npm run build` | Build de produccion |
| `test` | `npm test` | Ejecuta tests con Karma |

---

## Variables de entorno

| Variable | Default | Descripcion |
| --- | --- | --- |
| `POSTGRES_DB` | `blogdb` | Nombre de la base de datos |
| `POSTGRES_USER` | `bloguser` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `blogpass` | Password de PostgreSQL |
| `POSTGRES_PORT` | `5432` | Puerto expuesto de PostgreSQL |
| `API_PORT` | `3000` | Puerto del backend |
| `JWT_SECRET` | `super-secret-jwt-change-me` | Secreto para firmar tokens JWT |
| `JWT_EXPIRES_IN` | `24h` | Duracion del token |
| `DB_HOST` | `db` (Docker) / `localhost` | Host de la base de datos |
| `CORS_ORIGIN` | `http://localhost:4200` | Origen permitido para CORS |
| `FRONTEND_PORT` | `4200` | Puerto del frontend |

---

## Decisiones tecnicas

- **Standalone components (Angular 18):** sin NgModules, cada componente declara sus propias dependencias
- **Migraciones manuales:** `synchronize: false` en TypeORM para control total del esquema
- **Validacion con Zod:** esquemas reutilizables en cada modulo del backend
- **UUIDs como primary keys:** evita IDs secuenciales predecibles
- **Indices en BD:** sobre `posts.created_at`, `posts.title` y `posts.author_id` para optimizar consultas frecuentes
- **Paginacion y filtros compuestos:** evitan cargas completas de datos al listar posts
- **Arquitectura modular:** cada dominio (auth, posts, categories, comments, users) tiene su propio directorio con entity, controller, routes y schemas
- **Seguridad:** Helmet para headers HTTP seguros, CORS configurado, passwords hasheados con bcrypt (salt rounds: 10)
