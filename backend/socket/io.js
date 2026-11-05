import { Server } from 'socket.io';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';

let io = null;

export function iniciarSocket(server) {
  io = new Server(server, {
    cors: { origin: env.clientUrl },
  });

  io.use((socket, next) => {
    try {
      const payload = jwt.verify(socket.handshake.auth?.token || '', env.jwtSecret, { algorithms: ['HS256'] });
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('No autorizado'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    socket.join(`usuario:${socket.data.userId}`);
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
}

export function obtenerIO() {
  return io;
}

export function emitirEvento(evento, datos) {
  if (!io || !datos?.propietario) return;
  const { propietario, ...publico } = datos;
  io.to(`usuario:${propietario}`).emit(evento, publico);
}