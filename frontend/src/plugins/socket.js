import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (callback) => callback({ token: localStorage.getItem('taskflow-token') }),
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
