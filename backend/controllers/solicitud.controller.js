import * as solicitudService from '../services/solicitud.service.js';

function serializar(solicitud) {
  if (!solicitud) return null;
  const doc = solicitud.toObject ? solicitud.toObject() : solicitud;
  return { ...doc, id: doc._id.toString(), _id: undefined };
}

function serializarLista(lista) {
  return lista.map(serializar);
}

export async function listar(req, res) {
  const solicitudes = await solicitudService.listarSolicitudes(req.query);
  res.json(serializarLista(solicitudes));
}

export async function obtener(req, res) {
  const solicitud = await solicitudService.obtenerSolicitudPorId(req.params.id);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json(serializar(solicitud));
}

export async function crear(req, res) {
  const solicitud = await solicitudService.crearSolicitud(req.body);
  res.status(201).json(serializar(solicitud));
}

export async function actualizar(req, res) {
  const solicitud = await solicitudService.actualizarSolicitud(req.params.id, req.body);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json(serializar(solicitud));
}

export async function eliminar(req, res) {
  const solicitud = await solicitudService.eliminarSolicitud(req.params.id);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json({ mensaje: 'Solicitud eliminada' });
}