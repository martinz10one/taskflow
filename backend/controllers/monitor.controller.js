import mongoose from 'mongoose';
import { redis, CLAVE_LATIDO_WORKER } from '../config/redis.js';
import { cantidadEnCola } from '../services/cola.service.js';
import Solicitud from '../models/Solicitud.js';

export async function obtenerMonitor(req, res) {
  const estadoMongo = mongoose.connection.readyState === 1 ? 'disponible' : 'no-disponible';

  let estadoRedis = 'no-disponible';
  try {
    await redis.ping();
    estadoRedis = 'disponible';
  } catch {
    estadoRedis = 'no-disponible';
  }

  const latido = await redis.get(CLAVE_LATIDO_WORKER);
  const estadoWorker = latido ? 'disponible' : 'no-disponible';

  const enCola = await cantidadEnCola();
  const conteos = await Solicitud.aggregate([
    { $group: { _id: '$estado', total: { $sum: 1 } } },
  ]);

  const porEstado = {};
  for (const c of conteos) {
    porEstado[c._id] = c.total;
  }

  res.json({
    servicios: {
      express: 'disponible',
      mongo: estadoMongo,
      redis: estadoRedis,
      worker: estadoWorker,
    },
    solicitudes: {
      enCola,
      procesando: porEstado.PROCESANDO || 0,
      respondidas: porEstado.RESPONDIDA || 0,
      errores: porEstado.ERROR || 0,
    },
  });
}