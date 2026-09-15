import { redis, COLA_SOLICITUDES } from '../config/redis.js';

export async function encolarSolicitud(id) {
  const idStr = id.toString();
  await redis.rpush(COLA_SOLICITUDES, idStr);
  return idStr;
}

export async function sacarSolicitudDeCola() {
  const resultado = await redis.blpop(COLA_SOLICITUDES, 0);
  return resultado ? resultado[1] : null;
}

export async function cantidadEnCola() {
  return redis.llen(COLA_SOLICITUDES);
}