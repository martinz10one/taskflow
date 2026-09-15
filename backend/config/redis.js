import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.redisUrl);
export const suscripcionRedis = redis.duplicate();

redis.on('error', (err) => {
  console.error('Error en Redis:', err.message);
});

export const COLA_SOLICITUDES = 'cola:solicitudes';
export const CACHE_LISTA_SOLICITUDES = 'cache:lista:solicitudes';
export const CANAL_WORKER = 'canal:worker';
export const CLAVE_LATIDO_WORKER = 'worker:latido';

export function publicarEventoWorker(evento, datos) {
  redis.publish(CANAL_WORKER, JSON.stringify({ evento, datos }));
}

export async function invalidarCacheSolicitudes() {
  const claves = await redis.keys(`${CACHE_LISTA_SOLICITUDES}*`);
  if (claves.length > 0) {
    await redis.del(...claves);
  }
}