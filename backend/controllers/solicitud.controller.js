import * as solicitudService from '../services/solicitud.service.js';
import { encolarSolicitud } from '../services/cola.service.js';
import { emitirEvento } from '../socket/io.js';
import { CATEGORIAS_VALIDAS, ESTADOS_VALIDOS, PRIORIDADES_VALIDAS } from '../models/Solicitud.js';

function serializar(solicitud) {
  if (!solicitud) return null;
  const doc = solicitud.toObject ? solicitud.toObject() : solicitud;
  const { propietario, ...publico } = doc;
  return { ...publico, id: doc._id.toString(), _id: undefined };
}

function serializarLista(lista) {
  return lista.map(serializar);
}

export async function listar(req, res) {
  for (const campo of ['categoria', 'prioridad', 'estado', 'busqueda']) {
    if (req.query[campo] !== undefined && typeof req.query[campo] !== 'string') {
      return res.status(400).json({ error: `El filtro ${campo} debe ser texto` });
    }
  }
  if (req.query.categoria && !CATEGORIAS_VALIDAS.includes(req.query.categoria)) {
    return res.status(400).json({ error: 'Categoría de filtro no válida' });
  }
  if (req.query.prioridad && !PRIORIDADES_VALIDAS.includes(req.query.prioridad)) {
    return res.status(400).json({ error: 'Prioridad de filtro no válida' });
  }
  if (req.query.estado && !ESTADOS_VALIDOS.includes(req.query.estado)) {
    return res.status(400).json({ error: 'Estado de filtro no válido' });
  }
  if (typeof req.query.busqueda === 'string' && req.query.busqueda.length > 100) {
    return res.status(400).json({ error: 'La búsqueda no puede superar los 100 caracteres' });
  }
  const solicitudes = await solicitudService.listarSolicitudes(req.user.id, req.query);
  res.json(serializarLista(solicitudes));
}

export async function obtener(req, res) {
  const solicitud = await solicitudService.obtenerSolicitudPorId(req.params.id, req.user.id);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json(serializar(solicitud));
}

export async function crear(req, res) {
  const solicitud = await solicitudService.crearSolicitud(req.body, req.user.id);
  const id = solicitud._id.toString();

  try {
    await encolarSolicitud(id);
  } catch (error) {
    await solicitudService.eliminarSolicitud(id, req.user.id);
    throw error;
  }
  emitirEvento('solicitud-creada', { ...serializar(solicitud), propietario: req.user.id });
  emitirEvento('solicitud-encolada', { id, estado: 'EN COLA', propietario: req.user.id });

  res.status(201).json(serializar(solicitud));
}

export async function actualizar(req, res) {
  const { titulo, descripcion, categoria, prioridad } = req.body;
  const cambios = Object.fromEntries(
    Object.entries({ titulo, descripcion, categoria, prioridad }).filter(([, valor]) => valor !== undefined),
  );
  const solicitud = await solicitudService.actualizarSolicitud(req.params.id, req.user.id, cambios);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json(serializar(solicitud));
}

export async function eliminar(req, res) {
  const solicitud = await solicitudService.eliminarSolicitud(req.params.id, req.user.id);
  if (!solicitud) {
    return res.status(404).json({ error: 'Solicitud no encontrada' });
  }
  res.json({ mensaje: 'Solicitud eliminada' });
}