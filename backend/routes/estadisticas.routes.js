import { Router } from 'express';
import { obtenerEstadisticas } from '../controllers/estadisticas.controller.js';
import { asyncHandler } from '../middlewares/manejoErrores.js';

const router = Router();

router.get('/', asyncHandler(obtenerEstadisticas));

export default router;