import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('[Socket] conectado:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket] desconectado');
});

export default socket;
