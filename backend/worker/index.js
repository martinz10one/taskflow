import { Worker } from 'bullmq';
import { pathToFileURL } from 'node:url';
import { conectarDB } from '../config/db.js';
import { publicarEventoWorker, invalidarCacheSolicitudes, redis, redisCola, CLAVE_LATIDO_WORKER } from '../config/redis.js';
import { colaSolicitudes, encolarSolicitud } from '../services/cola.service.js';
import Solicitud from '../models/Solicitud.js';
import { generarRespuesta } from '../services/respuesta.service.js';

async function procesar(job) {
  const solicitud = await Solicitud.findById(job.data.id);
  if (!solicitud) return { omitida: true };
  if (solicitud.estado === 'RESPONDIDA') return { idempotente: true };

  await Solicitud.findByIdAndUpdate(solicitud._id, {
    estado: 'PROCESANDO',
    fechaProcesamiento: solicitud.fechaProcesamiento || new Date(),
    error: '',
  });
  publicarEventoWorker('solicitud-procesando', {
    id: solicitud._id.toString(), propietario: solicitud.propietario.toString(),
  });

  const respuesta = generarRespuesta(solicitud.categoria);
  await Solicitud.findByIdAndUpdate(solicitud._id, {
    estado: 'RESPONDIDA', respuesta, fechaRespuesta: new Date(), error: '',
  });
  await invalidarCacheSolicitudes();
  publicarEventoWorker('solicitud-respondida', {
    id: solicitud._id.toString(), respuesta, propietario: solicitud.propietario.toString(),
  });
  console.log(`[Worker] Solicitud ${solicitud._id} respondida`);
  return { id: solicitud._id.toString() };
}

export async function iniciarWorker() {
  await conectarDB();

  // Reponer solicitudes que se guardaron en Mongo si la API cayó antes de agregarlas a Redis.
  const pendientes = await Solicitud.find({
    propietario: { $exists: true },
    estado: { $in: ['PENDIENTE', 'EN COLA', 'PROCESANDO'] },
  })
    .select('_id estado');
  for (const solicitud of pendientes) {
    if (solicitud.estado !== 'EN COLA') {
      await Solicitud.updateOne({ _id: solicitud._id }, { $set: { estado: 'EN COLA' } });
    }
    await encolarSolicitud(solicitud._id);
  }

  const worker = new Worker('solicitudes', procesar, {
    connection: redisCola.duplicate(),
    concurrency: 3,
  });
  worker.on('completed', (job) => console.log(`[Worker] Job ${job.id} completado`));
  worker.on('failed', async (job, error) => {
    console.error(`[Worker] Intento ${job?.attemptsMade} de ${job?.opts.attempts} falló:`, error.message);
    if (!job || job.attemptsMade < (job.opts.attempts || 1)) return;
    const solicitud = await Solicitud.findById(job.data.id);
    if (!solicitud || solicitud.estado === 'RESPONDIDA') return;
    await Solicitud.findByIdAndUpdate(job.data.id, { estado: 'ERROR', error: error.message });
    await invalidarCacheSolicitudes();
    publicarEventoWorker('solicitud-error', {
      id: job.data.id, error: error.message, propietario: solicitud.propietario.toString(),
    });
  });
  worker.on('error', (error) => console.error('[Worker] Error de cola:', error.message));

  const actualizarLatido = () => redis.set(CLAVE_LATIDO_WORKER, 'vivo', 'EX', 10);
  await actualizarLatido();
  const latido = setInterval(() => {
    actualizarLatido().catch((error) => console.error('[Worker] No se pudo actualizar el latido:', error.message));
  }, 5000);
  latido.unref();
  worker.on('closed', () => clearInterval(latido));
  console.log(`[Worker] Activo; ${pendientes.length} solicitud(es) conciliada(s)`);
  return worker;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  iniciarWorker().catch((error) => {
    console.error('[Worker] Error fatal:', error);
    process.exitCode = 1;
  });
}
