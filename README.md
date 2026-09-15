# TASKFLOW — Frontend

Interfaz web de TASKFLOW para la gestión y procesamiento de solicitudes.

**Stack:** Vue 3 (Vite) · Pinia · Vue Router · Axios · Socket.IO

> El repositorio del **backend** vive aparte: [martinz10one/taskflow-backend](https://github.com/martinz10one/taskflow-backend). No se conecta directamente a MongoDB ni Redis; consume la API a través de `/api`.

## Documentación del proyecto

- `ARQUITECTURA_TASKFLOW.md` — arquitectura completa (frontend, backend, Docker, Socket.IO)
- `PLAN_COLABORACION.md` — reparto de trabajo, contrato de API y reglas de equipo
- `Taller TaskFlow.docx` — enunciado del taller

## Estructura Vue 3 (a crear en `src/`)

```text
src/
├── assets/        imágenes, iconos, fuentes
├── components/    botones, tablas, tarjetas, formularios reutilizables
├── views/         DashboardView · NewRequestView · RequestsView
│                  RequestDetailView · MonitorView
├── composables/   useRequests · useFetch · useSocket
├── store/         requestStore (Pinia)
├── router/        rutas de la aplicación
├── services/      requestService (comunicación con la API)
├── layouts/       MainLayout
├── styles/        variables y estilos globales
├── plugins/       axios.js · socket.js
└── utils/         formatDate · validateRequest
```

## API de referencia

URL base: `http://localhost:3000/api` — el contrato detallado está en `PLAN_COLABORACION.md` (sección 3).