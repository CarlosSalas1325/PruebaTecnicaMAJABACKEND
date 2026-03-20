# PT-Maja Backend — API REST

API REST del blog PT-Maja con Express, TypeORM y PostgreSQL.

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

## Requisitos

- **Docker** y **Docker Compose** instalados
- Puerto `3000` (API) y `5432` (PostgreSQL) disponibles

## Inicio rapido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` segun tu configuracion. Solo es necesario modificar `JWT_SECRET` en produccion.

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

## Datos semilla

| Recurso | Datos |
| --- | --- |
| Usuario admin | email: `admin@blog.local`, password: `Admin123!`, rol: `admin` |

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
