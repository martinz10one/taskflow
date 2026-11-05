import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function autenticar(req, res, next) {
  const encabezado = req.get('authorization') || '';
  const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión' });

  try {
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ error: 'La sesión no es válida o expiró' });
  }
}