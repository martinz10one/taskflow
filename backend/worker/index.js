import { conectarDB } from '../config/db.js';
import {
  publicarEventoWorker,
  invalidarCacheSolicitudes,
  redis,
  COLA_SOLICITUDES,
  CLAVE_LATIDO_WORKER,
} from '../config/redis.js';
import Solicitud from '../models/Solicitud.js';
import { generarRespuesta } from '../services/respuesta.service.js';

const redisBloqueante = redis.duplicate();

async function sacarSolicitudDeCola() {
  const resultado = await redisBloqueante.blpop(COLA_SOLICITUDES, 0);
  return resultado ? resultado[1] : null;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function procesarSolicitud(idStr) {
  console.log(`[Worker] Procesando solicitud ${idStr}`);

  await Solicitud.findByIdAndUpdate(idStr, {
    estado: 'PROCESANDO',
    fechaProcesamiento: new Date(),
  });
  publicarEventoWorker('solicitud-procesando', { id: idStr });

  await delay(2000);

  const solicitud = await Solicitud.findById(idStr);
  if (!solicitud) {
    console.error(`[Worker] Solicitud ${idStr} no encontrada`);
    return;
  }

  try {
    const respuesta = generarRespuesta(solicitud.categoria);
    await Solicitud.findByIdAndUpdate(idStr, {
      estado: 'RESPONDIDA',
      respuesta,
      fechaRespuesta: new Date(),
    });
    await invalidarCacheSolicitudes();
    publicarEventoWorker('solicitud-respondida', { id: idStr, respuesta });
    console.log(`[Worker] Solicitud ${idStr} respondida`);
  } catch (error) {
    await Solicitud.findByIdAndUpdate(idStr, {
      estado: 'ERROR',
      error: error.message,
    });
    publicarEventoWorker('solicitud-error', { id: idStr, error: error.message });
    console.error(`[Worker] Error procesando ${idStr}:`, error.message);
  }
}

async function iniciarWorker() {
  await conectarDB();
  console.log('[Worker] Escuchando la cola de solicitudes...');

  setInterval(async () => {
    await redis.set(CLAVE_LATIDO_WORKER, 'vivo', 'EX', 10);
  }, 5000);

  while (true) {
    const idStr = await sacarSolicitudDeCola();
    await procesarSolicitud(idStr);
  }
}

iniciarWorker();