# TASKFLOW

Sistema Full Stack para la gestión y procesamiento de solicitudes.

**Stack:** Vue 3 (frontend) · Node.js + Express (backend) · MongoDB · Redis · Worker · Docker

## Repositorio único

Todo el proyecto vive en este repositorio:

```text
taskflow/
├── docker-compose.yml    orquesta los 5 contenedores
├── backend/              API Express + MongoDB + Redis + Worker (Node.js)
├── frontend/             aplicación Vue 3 (Vite)
├── ARQUITECTURA_TASKFLOW.md
├── PLAN_COLABORACION.md
└── Taller TaskFlow.docx
```

## Cómo ejecutar (Docker Compose — 5 contenedores)

```bash
docker compose up -d --build
```

| Servicio | Página |
|---|---|
| Frontend | http://localhost:8080 |
| API | http://localhost:3000/api |
| Monitor | http://localhost:3000/api/monitor |

Servicios: `frontend`, `backend`, `worker`, `mongoserver` (MongoDB), `redisserver` (Redis). Mongo y Redis se comunican por nombre de servicio y persisten en el volumen `mongo-data`.

## Ejecución local (sin Docker)

```bash
# Backend (backend/)
npm install
npm run dev      # API en http://localhost:3000
npm run worker   # procesador de solicitudes

# Frontend (frontend/)
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Documentación

- `ARQUITECTURA_TASKFLOW.md` — arquitectura completa
- `PLAN_COLABORACION.md` — reparto de trabajo y contrato de API