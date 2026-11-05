import Solicitud from '../models/Solicitud.js';
import { redis, CACHE_LISTA_SOLICITUDES, invalidarCacheSolicitudes } from '../config/redis.js';

const TTL_CACHE = 30;

function claveCacheLista(propietario, filtros) {
  return CACHE_LISTA_SOLICITUDES + ':' + propietario + ':' + JSON.stringify(filtros);
}

export async function listarSolicitudes(propietario, filtros = {}) {
  const query = { propietario };
  const { categoria, prioridad, estado, busqueda } = filtros;

  if (categoria) query.categoria = categoria;
  if (prioridad) query.prioridad = prioridad;
  if (estado) query.estado = estado;
  if (busqueda) {
    const busquedaSegura = busqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { titulo: { $regex: busquedaSegura, $options: 'i' } },
      { descripcion: { $regex: busquedaSegura, $options: 'i' } },
    ];
  }

  const clave = claveCacheLista(propietario, filtros);
  const desdeCache = await redis.get(clave);
  if (desdeCache) {
    return JSON.parse(desdeCache);
  }

  const solicitudes = await Solicitud.find(query).sort({ fechaCreacion: -1 }).limit(500);

  await redis.set(clave, JSON.stringify(solicitudes), 'EX', TTL_CACHE);
  return solicitudes;
}

export async function obtenerSolicitudPorId(id, propietario) {
  return Solicitud.findOne({ _id: id, propietario });
}

export async function crearSolicitud(datos, propietario) {
  const { titulo, descripcion, categoria, prioridad } = datos;
  const solicitud = new Solicitud({ titulo, descripcion, categoria, prioridad, propietario, estado: 'EN COLA' });
  const guardada = await solicitud.save();
  await invalidarCacheSolicitudes();
  return guardada;
}

export async function actualizarSolicitud(id, propietario, cambios) {
  const solicitud = await Solicitud.findOneAndUpdate(
    { _id: id, propietario, estado: { $in: ['PENDIENTE', 'EN COLA'] } },
    cambios,
    {
    new: true,
    runValidators: true,
    },
  );
  await invalidarCacheSolicitudes();
  return solicitud;
}

export async function eliminarSolicitud(id, propietario) {
  const solicitud = await Solicitud.findOneAndDelete({ _id: id, propietario });
  await invalidarCacheSolicitudes();
  return solicitud;
}