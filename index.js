import http from 'http';

import { env } from './config/env.js';
import { conectarDB } from './config/db.js';
import app from './app.js';
import { iniciarSocket } from './socket/io.js';

const server = http.createServer(app);

iniciarSocket(server);

await conectarDB();

server.listen(env.port, () => {
  console.log(`API TASKFLOW disponible en http://localhost:${env.port}`);
});