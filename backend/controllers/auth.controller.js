import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { env } from '../config/env.js';

function emitirToken(usuario) {
  return jwt.sign({ email: usuario.email }, env.jwtSecret, {
    subject: usuario._id.toString(),
    algorithm: 'HS256',
    expiresIn: '12h',
  });
}

function responderConSesion(res, usuario, codigo = 200) {
  const token = emitirToken(usuario);
  return res.status(codigo).json({ token, usuario: { email: usuario.email } });
}

export async function registrar(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Ingresa un correo válido' });
  }
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return res.status(400).json({ error: 'La contraseña debe tener entre 12 y 128 caracteres' });
  }

  const existente = await Usuario.exists({ email });
  if (existente) return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });

  const usuario = await Usuario.create({ email, passwordHash: await bcrypt.hash(password, 12) });
    return responderConSesion(res, usuario, 201);
}

export async function iniciarSesion(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body.password;
  const usuario = await Usuario.findOne({ email }).select('+passwordHash');
  if (!usuario || typeof password !== 'string' || !(await bcrypt.compare(password, usuario.passwordHash))) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }
    return responderConSesion(res, usuario);
}

