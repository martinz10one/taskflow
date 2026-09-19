import api from '@/plugins/axios';

export function listarSolicitudes(filtros = {}) {
  return api.get('/solicitudes', { params: filtros }).then((r) => r.data);
}

export function obtenerSolicitud(id) {
  return api.get(`/solicitudes/${id}`).then((r) => r.data);
}

export function crearSolicitud(datos) {
  return api.post('/solicitudes', datos).then((r) => r.data);
}

export function actualizarSolicitud(id, cambios) {
  return api.put(`/solicitudes/${id}`, cambios).then((r) => r.data);
}

export function eliminarSolicitud(id) {
  return api.delete(`/solicitudes/${id}`).then((r) => r.data);
}

export function obtenerEstadisticas() {
  return api.get('/estadisticas').then((r) => r.data);
}

export function obtenerMonitor() {
  return api.get('/monitor').then((r) => r.data);
}
