import http from 'http';

import { env } from './config/env.js';
import { conectarDB } from './config/db.js';
import { redis, suscripcionRedis, CANAL_WORKER } from './config/redis.js';
import app from './app.js';
import { iniciarSocket, emitirEvento } from './socket/io.js';

const server = http.createServer(app);

iniciarSocket(server);

suscripcionRedis.subscribe(CANAL_WORKER);
suscripcionRedis.on('message', (canal, mensaje) => {
  const { evento, datos } = JSON.parse(mensaje);
  emitirEvento(evento, datos);
});

await conectarDB();

server.listen(env.port, () => {
  console.log(`API TASKFLOW disponible en http://localhost:${env.port}`);
});