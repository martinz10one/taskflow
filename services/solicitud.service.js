import Solicitud from '../models/Solicitud.js';
import { redis, CACHE_LISTA_SOLICITUDES, invalidarCacheSolicitudes } from '../config/redis.js';

const TTL_CACHE = 30;

function claveCacheLista(filtros) {
  return CACHE_LISTA_SOLICITUDES + ':' + JSON.stringify(filtros);
}

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

  const clave = claveCacheLista(filtros);
  const desdeCache = await redis.get(clave);
  if (desdeCache) {
    return JSON.parse(desdeCache);
  }

  const solicitudes = await Solicitud.find(query).sort({ fechaCreacion: -1 });

  await redis.set(clave, JSON.stringify(solicitudes), 'EX', TTL_CACHE);
  return solicitudes;
}

export async function obtenerSolicitudPorId(id) {
  return Solicitud.findById(id);
}

export async function crearSolicitud(datos) {
  const solicitud = new Solicitud({ ...datos, estado: 'EN COLA' });
  const guardada = await solicitud.save();
  await invalidarCacheSolicitudes();
  return guardada;
}

export async function actualizarSolicitud(id, cambios) {
  const solicitud = await Solicitud.findByIdAndUpdate(id, cambios, {
    new: true,
    runValidators: true,
  });
  await invalidarCacheSolicitudes();
  return solicitud;
}

export async function eliminarSolicitud(id) {
  const solicitud = await Solicitud.findByIdAndDelete(id);
  await invalidarCacheSolicitudes();
  return solicitud;
}