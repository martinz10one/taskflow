import express from 'express';
import cors from 'cors';

import { env } from './config/env.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import { manejoErrores, rutaNoEncontrada } from './middlewares/manejoErrores.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'ok', servicio: 'taskflow-backend' });
});

app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/monitor', monitorRoutes);

app.use(rutaNoEncontrada);
app.use(manejoErrores);

export default app;