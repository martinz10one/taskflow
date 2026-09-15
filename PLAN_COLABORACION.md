# TASKFLOW — Plan de trabajo en equipo

**Equipo:** Martin (backend) · Santiago (frontend)
**Repo:** https://github.com/martinz10one/taskflow
**Arquitectura de referencia:** `ARQUITECTURA_TASKFLOW.md`

---

## 1. Reparto de responsabilidades

| Área | Responsable | Qué construye |
|---|---|---|
| **Frontend (todo)** | Santiago | Proyecto Vue 3 completo: views, components, router, store, services, Axios, Socket.IO, estilos |
| **Backend (todo)** | Martin | API Express, MongoDB, Redis (caché + cola), Worker Node.js, Docker Compose |

> Regla clave: el frontend **nunca** se conecta directo a MongoDB ni Redis.
> Todo pasa por la API: `Vue → Express → MongoDB/Redis`.

---

## 2. Trabajo en Git

Ramas base (ya creadas en el repo):

```text
main     → producción (estable, no se commitea directo)
develop  → integración del trabajo de los dos
```

Ramas de trabajo — cada uno crea la suya desde `develop`:

```bash
# Santiago (frontend)
git clone https://github.com/martinz10one/taskflow.git
git checkout develop
git checkout -b feature/frontend-base

# Martin (backend)
git checkout develop
git checkout -b feature/backend-base
```

Reglas:

1. Trabajar siempre en la rama `feature/*` propia.
2. Al terminar una tarea completa: `git add . && git commit -m "..."` y `git push -u origin feature/<rama>`.
3. Abrir Pull Request a `develop`; **la otra persona revisa** el código antes del merge.
4. Antes de seguir: `git checkout develop && git pull` y actualizar tu rama (`git merge develop`).
5. No commitear directo a `main` ni `develop`.

---

## 3. Contrato de la API (acuerdo entre ambos)

Este es el punto de contacto entre frontend y backend. Se define **una sola vez** y ambos lo respetan.

### 3.1 Endpoints REST

URL base: `http://localhost:3000/api`

| Método | Endpoint | Función | Quién usa |
|---|---|---|---|
| GET | `/solicitudes` | Listar solicitudes (soporta filtros y búsqueda) | Listado, Dashboard |
| GET | `/solicitudes/:id` | Obtener detalle de una solicitud | Detalle |
| POST | `/solicitudes` | Registrar una nueva solicitud | Nueva solicitud |
| PUT | `/solicitudes/:id` | Actualizar una solicitud | (interna/backup) |
| DELETE | `/solicitudes/:id` | Eliminar una solicitud | (interna/backup) |
| GET | `/estadisticas` | Contadores por estado para el Dashboard | Dashboard |
| GET | `/monitor` | Estado de servicios (Express, MongoDB, Redis, Worker) y conteos | Monitor |

### 3.2 Formato de una solicitud (JSON)

```json
{
  "id": "64a1...",
  "titulo": "Solicitud de certificado",
  "descripcion": "Necesito mi certificado de estudios",
  "categoria": "Documento",
  "prioridad": "Alta",
  "estado": "EN COLA",
  "respuesta": "",
  "error": "",
  "fechaCreacion": "2026-09-14T19:00:00.000Z",
  "fechaProcesamiento": "2026-09-14T19:00:05.000Z",
  "fechaRespuesta": "2026-09-14T19:00:08.000Z"
}
```

### 3.3 Valores permitidos (el backend los valida)

- **Categoría:** `Informacion` | `Soporte` | `Documento` | `Consulta` | `Actualizacion`
- **Prioridad:** `Alta` | `Media` | `Baja`
- **Estado:** `PENDIENTE` | `EN COLA` | `PROCESANDO` | `RESPONDIDA` | `ERROR`

### 3.4 Respuestas del backend

- Éxito: devuelve JSON directo (objeto o arreglo) con código 200/201.
- Error: `{ "error": "mensaje descriptivo" }` con código 400/404/500.
- Para listar, responder un arreglo de solicitudes (o un objeto `{ solicitudes: [...] }` si se agregan filtros con paginación). **Definir de antemano uno de los dos formatos.**

---

## 4. Eventos Socket.IO (tiempo real)

El backend **emite** estos eventos y el frontend **escucha** para actualizar la interfaz sin refrescar:

| Evento | Cuándo se emite | Efecto en frontend |
|---|---|---|
| `solicitud-creada` | Se creó una solicitud | Refrescar listado/dashboard |
| `solicitud-encolada` | Entró a la cola de Redis | Actualizar estado a "EN COLA" |
| `solicitud-procesando` | El Worker comenzó | Actualizar estado a "PROCESANDO" |
| `solicitud-respondida` | Hay respuesta lista | Mostrar respuesta del detalle |
| `solicitud-error` | Falló el procesamiento | Mostrar estado ERROR + mensaje |
| `cola-actualizada` | Cambió la cola | Actualizar contadores |
| `monitor-actualizado` | Cambió el monitor | Actualizar monitor en vivo |

Eventos definidos en la arquitectura (sección 21.3). Martin implementa la emisión; Santiago escucha.

---

## 5. Estructura del proyecto (a crear)

```text
taskflow/
├── frontend/               ← Santiago (Vue 3)
│   └── src/
│       ├── assets/
│       ├── components/     (Botones, Tablas, StatCard, RequestCard, RequestForm, ...)
│       ├── views/          DashboardView, NewRequestView, RequestsView,
│       │                   RequestDetailView, MonitorView
│       ├── composables/    useRequests.js, useFetch.js, useSocket.js
│       ├── store/          requestStore.js (Pinia)
│       ├── router/         index.js
│       ├── services/       requestService.js (Axios)
│       ├── layouts/        MainLayout.vue
│       ├── styles/         variables.scss, main.scss
│       ├── plugins/        axios.js, socket.js
│       ├── utils/          formatDate.js, validateRequest.js
│       ├── App.vue
│       └── main.js
│
└── backend/                ← Martin (Node.js + Express)
    ├── routes/             solicitudes.routes.js, estadisticas.routes.js, monitor.routes.js
    ├── controllers/
    ├── services/
    ├── models/             requestModel.js (Mongoose)
    ├── middlewares/        validarSolicitud.js, manejoErrores.js
    ├── config/             db.js, redis.js, env.js
    ├── worker/             worker.js (procesador de cola)
    ├── socket/             io.js (emisión de eventos)
    ├── app.js
    └── index.js
```

**Docker Compose** (`docker-compose.yml`) — responsabilidad de Martin:

```text
services:
  frontend     → puerto publicado 8080
  backend      → puerto publicado 3000
  worker
  mongoserver  → 27017 (interno), volumen mongo-data
  redisserver  → 6379 (interno)
```

Comunicación entre contenedores por nombre de servicio (**no usar localhost** dentro de Docker): `mongoserver:27017`, `redisserver:6379`.

---

## 6. Pantallas y su API (lo que conecta Santiago con Martin)

| Pantalla | Operación API | Eventos Socket que escucha |
|---|---|---|
| Dashboard | `GET /estadisticas`, `GET /solicitudes` (recientes) | `cola-actualizada`, `solicitud-*` |
| Nueva solicitud | `POST /solicitudes` | `solicitud-creada`, `solicitud-encolada` |
| Listado | `GET /solicitudes` (filtros, búsqueda) | `solicitud-*`, `cola-actualizada` |
| Detalle | `GET /solicitudes/:id` | `solicitud-procesando`, `solicitud-respondida`, `solicitud-error` |
| Monitor | `GET /monitor` | `monitor-actualizado`, `cola-actualizada` |

---

## 7. Orden sugerido de trabajo

**Martin (backend):**
1. Estructura base, `docker-compose.yml` con MongoDB y Redis.
2. Modelo de solicitud + conexión MongoDB.
3. CRUD de solicitudes (`GET`, `POST`).
4. Cola en Redis + Worker que cambia estados y genera respuesta por categoría.
5. Caché en Redis para el listado.
6. Endpoints `/estadisticas` y `/monitor`.
7. Socket.IO con los 7 eventos.

**Santiago (frontend):**
1. Estructura base Vue 3 + router + layout.
2. Pantalla "Nueva solicitud" (formulario → `POST /solicitudes`).
3. Listado de solicitudes (→ `GET /solicitudes`).
4. Detalle de solicitud (→ `GET /solicitudes/:id`).
5. Dashboard con tarjetas (→ `GET /estadisticas`).
6. Monitor (→ `GET /monitor`).
7. Socket.IO (`~/plugins/socket.js`, `useSocket.js`) para actualizaciones en tiempo real.

> Mientras Martin no tenga API lista, Santiago puede probar con datos de prueba (mock) que sigan el JSON del contrato. Eso los desbloquea para trabajar en paralelo.

---

## 8. Validación de respuestas (Worker — base lógica)

El Worker genera la respuesta con reglas por categoría (no se usa IA):

| Categoría | Respuesta esperada (ejemplo) |
|---|---|
| `Informacion` | "Aquí tienes la información solicitada: ..." |
| `Soporte` | "Hemos registrado tu problema de soporte y será resuelto por nuestro equipo técnico." |
| `Documento` | "Tu solicitud de documento está en proceso. Será emitido en los próximos días." |
| `Consulta` | "El estado de tu consulta es: ..." |
| `Actualizacion` | "Tu solicitud de actualización fue recibida y será aplicada." |
| (otra) | Respuesta genérica para categorías sin regla. |

Esto lo define Martin; solo lo documentamos para que el formato de `respuesta` quede claro en la UI.

---

## 9. Estados de una solicitud (flujo del ciclo de vida)

```text
PENDIENTE → EN COLA → PROCESANDO → RESPONDIDA
                 ↘          ↘
                  ERROR (si falla el Worker)
```

El frontend debe saber mostrarlos y colorearlos (ej. RESPONDIDA verde, ERROR rojo).

---

## 10. Checklist de entrega (resultado esperado del taller)

- [ ] Registrar solicitudes desde Vue
- [ ] Almacenar en MongoDB
- [ ] Enviar a Redis y procesar con Worker
- [ ] Generar respuestas por categoría
- [ ] Actualizar estados y mostrarlos en la UI
- [ ] Consultar solicitudes desde Vue (listado + detalle)
- [ ] Caché con Redis
- [ ] Monitor con estado de servicios
- [ ] Actualización en tiempo real (Socket.IO)
- [ ] Todo corre con Docker Compose
- [ ] Persistencia con volumen Docker
- [ ] Documentación y control de versiones en GitHub