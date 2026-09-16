import { CATEGORIAS_VALIDAS, PRIORIDADES_VALIDAS } from '../models/Solicitud.js';

export function validarSolicitud(req, res, next) {
  const { titulo, descripcion, categoria, prioridad } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo titulo es obligatorio' });
  }
  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }
  if (!categoria || !CATEGORIAS_VALIDAS.includes(categoria)) {
    return res.status(400).json({
      error: `Categoria invalida. Permitidas: ${CATEGORIAS_VALIDAS.join(', ')}`,
    });
  }
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({
      error: `Prioridad invalida. Permitidas: ${PRIORIDADES_VALIDAS.join(', ')}`,
    });
  }

  next();
}