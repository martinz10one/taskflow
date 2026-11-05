import { CATEGORIAS_VALIDAS, PRIORIDADES_VALIDAS } from '../models/Solicitud.js';

export function validarSolicitud(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un objeto JSON' });
  }
  const { titulo, descripcion, categoria, prioridad } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo titulo es obligatorio' });
  }
  if (titulo.trim().length > 160) {
    return res.status(400).json({ error: 'El título no puede superar los 160 caracteres' });
  }
  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    return res.status(400).json({ error: 'El campo descripcion es obligatorio' });
  }
  if (descripcion.trim().length > 5000) {
    return res.status(400).json({ error: 'La descripción no puede superar los 5000 caracteres' });
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