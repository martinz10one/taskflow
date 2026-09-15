import { Router } from 'express';
import { obtenerMonitor } from '../controllers/monitor.controller.js';

const router = Router();

router.get('/', obtenerMonitor);

export default router;