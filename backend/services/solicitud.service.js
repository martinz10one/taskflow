import Solicitud from '../models/Solicitud.js';

export async function listarSolicitudes(filtros = {}) {
  const query = {};
  const { categoria, prioridad, estado, busqueda } = filtros;

  if (categoria) query.categoria = categoria;
  if (prioridad) query.prioridad = prioridad;
  if (estado) query.estado = estado;
  if (busqueda) {
    query.$or = [
      { titulo: { $regex: busqueda, $options: 'i' } },
      { descripcion: { $regex: busqueda, $options: 'i' } },
    ];
  }

  return Solicitud.find(query).sort({ fechaCreacion: -1 });
}

export async function obtenerSolicitudPorId(id) {
  return Solicitud.findById(id);
}

export async function crearSolicitud(datos) {
  const solicitud = new Solicitud(datos);
  return solicitud.save();
}

export async function actualizarSolicitud(id, cambios) {
  return Solicitud.findByIdAndUpdate(id, cambios, { new: true, runValidators: true });
}

export async function eliminarSolicitud(id) {
  return Solicitud.findByIdAndDelete(id);
}