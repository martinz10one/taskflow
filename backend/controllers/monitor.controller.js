import { redis, CLAVE_LATIDO_WORKER } from '../config/redis.js';
import { cantidadEnCola } from '../services/cola.service.js';
import Solicitud from '../models/Solicitud.js';
import mongoose from 'mongoose';

export async function obtenerMonitor(req, res) {
  let estadoMongo = mongoose.connection.readyState === 1 ? 'disponible' : 'no-disponible';

  let estadoRedis = 'no-disponible';
  let estadoWorker = 'no-disponible';
  let enCola = 0;
  try {
    await redis.ping();
    estadoRedis = 'disponible';
    const latido = await redis.get(CLAVE_LATIDO_WORKER);
    estadoWorker = latido ? 'disponible' : 'no-disponible';
    enCola = await cantidadEnCola();
  } catch {
    estadoRedis = 'no-disponible';
  }

  const porEstado = {};
  if (estadoMongo === 'disponible') {
    try {
      const conteos = await Solicitud.aggregate([
        { $match: { propietario: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$estado', total: { $sum: 1 } } },
      ]);
      for (const c of conteos) {
        porEstado[c._id] = c.total;
      }
    } catch {
      estadoMongo = 'no-disponible';
    }
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