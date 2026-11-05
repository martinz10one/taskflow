import { Router } from 'express';
import * as solicitudController from '../controllers/solicitud.controller.js';
import { validarSolicitud } from '../middlewares/validarSolicitud.js';
import { asyncHandler } from '../middlewares/manejoErrores.js';

const router = Router();

router.get('/', asyncHandler(solicitudController.listar));
router.get('/:id', asyncHandler(solicitudController.obtener));
router.post('/', validarSolicitud, asyncHandler(solicitudController.crear));
router.put('/:id', validarSolicitud, asyncHandler(solicitudController.actualizar));
router.delete('/:id', asyncHandler(solicitudController.eliminar));

export default router;