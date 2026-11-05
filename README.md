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

```powershell
docker compose up -d --build
```

| Servicio | Página |
|---|---|
| Frontend | http://localhost:8082 |
| API | http://localhost:3000/api |
| Monitor | http://localhost:3000/api/monitor |

Servicios: `frontend`, `backend`, `worker`, `mongoserver` (MongoDB), `redisserver` (Redis). Mongo y Redis se comunican por nombre de servicio y persisten en el volumen `mongo-data`.

La aplicación permite registrar cuentas; las solicitudes quedan separadas por usuario. API y Socket.IO requieren JWT. Usa contraseñas de al menos 12 caracteres y no compartas el secreto JWT de producción.

Compose espera a que MongoDB y Redis pasen sus healthchecks antes de arrancar la API/worker; MongoDB y Redis persisten en volúmenes separados. Los puertos de bases de datos y API solo se publican en el equipo local.

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

## Despliegue en un único servicio de Render

El Blueprint crea un solo servicio web Docker. El `Dockerfile` de la raíz compila Vue y copia el frontend al backend; Express sirve la interfaz, la API y Socket.IO desde el mismo dominio. No hace falta desplegar el frontend en Vercel ni configurar variables `VITE_*`.

1. Crea una base MongoDB en MongoDB Atlas y una base Redis compatible con Redis en un proveedor externo (por ejemplo, Upstash). El Blueprint no aprovisiona estas bases.
2. Sube el repositorio a GitHub y, en Render, crea un Blueprint usando `render.yaml`.
3. Configura `MONGO_URI` y `REDIS_URL` cuando Render lo solicite. `JWT_SECRET` se genera automáticamente.
4. Espera a que termine el despliegue. Abre la URL de Render para la aplicación; verifica también `/health` y `/ready`.

El Blueprint activa el worker dentro del mismo servicio (`RUN_WORKER_IN_API=true`). API y worker comparten el ciclo de vida, y Render puede suspender servicios gratuitos inactivos. Esta configuración sirve para una demo de bajo tráfico; para producción conviene separar el worker y preparar backups. Configura el acceso de red de Atlas para permitir conexiones desde Render y no publiques credenciales.

En despliegues Docker locales, Compose sigue levantando el frontend y el backend en contenedores separados. La imagen raíz se utiliza para el despliegue unificado en Render.

### Comprobación local y pruebas

- Ejecuta `docker compose ps` y confirma que los cinco servicios estén `running` o `healthy`.
- Abre `http://localhost:8082`, crea una cuenta con contraseña de al menos 12 caracteres, inicia sesión y crea una solicitud. El worker debe procesarla; revisa el Dashboard y Monitor.
- Comprueba `http://localhost:3000/health` (proceso activo) y `http://localhost:3000/ready` (MongoDB y Redis disponibles). Los endpoints de solicitudes ahora requieren autenticación.
- Para ver los registros usa `docker compose logs -f backend worker`; para detener el stack `docker compose down`. Los datos sobreviven al apagado en volúmenes. **No ejecutes `docker compose down -v` salvo que quieras borrar MongoDB y Redis.**
- Corre `npm test` desde `backend/` para los tests de autenticación, y `npm run build` desde `frontend/` para verificar el bundle.

La base Mongo previa a esta versión puede tener solicitudes sin propietario; no se mostrarán en cuentas nuevas. Exporta/respáldala antes de migrar o empezar con una base limpia. En despliegues reales guarda secretos solo en Render, usa backups de MongoDB y monitorea Redis.