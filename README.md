# TASKFLOW — Backend

API REST de TASKFLOW para la gestión y procesamiento de solicitudes.

**Stack:** Node.js · Express · MongoDB · Redis · Worker · Docker

## Cómo ejecutar (local)

**Requisitos:** MongoDB y Redis corriendo en `localhost`.

```bash
npm install
npm run dev        # API en http://localhost:3000
npm run worker     # Procesador de solicitudes (proceso aparte)
```

## Scripts

| Comando | Función |
|---|---|
| `npm start` | Ejecuta la API una vez |
| `npm run dev` | API con recarga automática (nodemon) |
| `npm run worker` | Worker de procesamiento de la cola |

## Pipeline de procesamiento

```text
POST /api/solicitudes → estado EN COLA → Redis (cola) → Worker
   → PROCESANDO → genera respuesta → RESPONDIDA → Socket.IO → Frontend
```

## Estructura

```text
config/        variables de entorno, conexión MongoDB y Redis
models/        modelo de Solicitud (Mongoose)
routes/        URLs de la API
controllers/   reciben las peticiones
services/      lógica de negocio (solicitudes, cola, respuestas)
middlewares/   validaciones y manejo de errores
socket/        canal Socket.IO (tiempo real)
worker/        proceso independiente que procesa la cola
```

## API

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/solicitudes` | Listar (filtros, búsqueda, caché Redis) |
| GET | `/api/solicitudes/:id` | Detalle |
| POST | `/api/solicitudes` | Crear y encolar |
| PUT | `/api/solicitudes/:id` | Actualizar |
| DELETE | `/api/solicitudes/:id` | Eliminar |
| GET | `/api/estadisticas` | Conteos para el Dashboard |
| GET | `/api/monitor` | Estado de servicios (Express, Mongo, Redis, Worker) |

Documentación de arquitectura y contrato de la API: `ARQUITECTURA_TASKFLOW.md` y `PLAN_COLABORACION.md`.