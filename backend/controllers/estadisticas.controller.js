import Solicitud from '../models/Solicitud.js';
import mongoose from 'mongoose';

export async function obtenerEstadisticas(req, res) {
  const conteos = await Solicitud.aggregate([
    { $match: { propietario: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$estado', total: { $sum: 1 } } },
  ]);

  const estadisticas = {
    total: 0,
    pendientes: 0,
    enCola: 0,
    procesando: 0,
    respondidas: 0,
    errores: 0,
  };

  for (const c of conteos) {
    switch (c._id) {
      case 'PENDIENTE':
        estadisticas.pendientes = c.total;
        break;
      case 'EN COLA':
        estadisticas.enCola = c.total;
        break;
      case 'PROCESANDO':
        estadisticas.procesando = c.total;
        break;
      case 'RESPONDIDA':
        estadisticas.respondidas = c.total;
        break;
      case 'ERROR':
        estadisticas.errores = c.total;
        break;
    }
    estadisticas.total += c.total;
  }

  res.json(estadisticas);
}