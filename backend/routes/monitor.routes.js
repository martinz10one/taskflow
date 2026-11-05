import { Router } from 'express';
import { obtenerMonitor } from '../controllers/monitor.controller.js';
import { asyncHandler } from '../middlewares/manejoErrores.js';

const router = Router();

router.get('/', asyncHandler(obtenerMonitor));

export default router;