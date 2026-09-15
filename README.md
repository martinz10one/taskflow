# TASKFLOW

Sistema Full Stack para la gestión y procesamiento de solicitudes.

**Stack:** Vue 3 (frontend) · Node.js + Express (backend) · MongoDB · Redis · Worker Node.js · Docker

## Equipo (2 personas)

- **Persona A — Frontend:** Vue 3 (views, components, store, services, composables)
- **Persona B — Backend:** Express + MongoDB + Redis + Worker

## Flujo de trabajo Git (2 personas)

Ramas base:
- `main` — producción, siempre estable. Solo se recibe por merge de `develop` (revisado).
- `develop` — integración del trabajo de ambos.

Ramas de trabajo:
- `feature/frontend-<tarea>` — trabajo de Persona A
- `feature/backend-<tarea>` — trabajo de Persona B

Reglas:
1. Trabajar siempre desde una rama `feature/*` creada desde `develop`.
2. Al terminar, hacer pull de `develop`, resolver conflictos y abrir Pull Request a `develop`.
3. La otra persona revisa el PR (código) antes de hacer merge.
4. Nunca commitear directo a `main` ni a `develop`.

## Documentación

- `ARQUITECTURA_TASKFLOW.md` — arquitectura completa del proyecto
- `Taller TaskFlow.docx` — enunciado del taller