import { Server } from 'socket.io';
import { env } from '../config/env.js';

let io = null;

export function iniciarSocket(server) {
  io = new Server(server, {
    cors: { origin: env.clientUrl },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
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
  if (io) {
    io.emit(evento, datos);
  }
}