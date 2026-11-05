import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import authRoutes from './routes/auth.routes.js';
import { autenticar } from './middlewares/autenticar.js';
import { manejoErrores, rutaNoEncontrada } from './middlewares/manejoErrores.js';

const app = express();
const frontendDist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');

if (env.trustProxy) app.set('trust proxy', 1);
app.use(cors({ origin: env.clientUrl }));
app.use(helmet());
app.use(express.json());
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'ok', servicio: 'taskflow-backend' });
});

app.get('/ready', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState !== 1) throw new Error('MongoDB no está conectado');
    const { redis } = await import('./config/redis.js');
    await redis.ping();
    if (env.runWorkerInApi) {
      const { CLAVE_LATIDO_WORKER } = await import('./config/redis.js');
      if (!(await redis.get(CLAVE_LATIDO_WORKER))) throw new Error('El worker no está disponible');
    }
    res.json({ estado: 'listo' });
  } catch {
    res.status(503).json({ estado: 'no-listo' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', autenticar, solicitudesRoutes);
app.use('/api/estadisticas', autenticar, estadisticasRoutes);
app.use('/api/monitor', autenticar, monitorRoutes);

app.use(express.static(frontendDist));
app.get(/^(?!\/api(?:\/|$)|\/socket\.io(?:\/|$)).*/, (req, res, next) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) next();
  });
});

app.use(rutaNoEncontrada);
app.use(manejoErrores);

export default app;