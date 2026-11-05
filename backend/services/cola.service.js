import { Queue } from 'bullmq';
import { redisCola } from '../config/redis.js';

export const COLA_SOLICITUDES = 'solicitudes';
export const colaSolicitudes = new Queue(COLA_SOLICITUDES, { connection: redisCola });

export async function encolarSolicitud(id) {
  const idStr = id.toString();
  await colaSolicitudes.add('procesar-solicitud', { id: idStr }, {
    jobId: idStr,
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600, count: 5000 },
  });
  return idStr;
}

export async function cantidadEnCola() {
  const counts = await colaSolicitudes.getJobCounts('waiting', 'active', 'delayed', 'waiting-children');
  return counts.waiting + counts.active + counts.delayed + counts['waiting-children'];
}

export async function cerrarCola() {
  await colaSolicitudes.close();
}
