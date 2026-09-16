import { Router } from 'express';
import * as solicitudController from '../controllers/solicitud.controller.js';
import { validarSolicitud } from '../middlewares/validarSolicitud.js';

const router = Router();

router.get('/', solicitudController.listar);
router.get('/:id', solicitudController.obtener);
router.post('/', validarSolicitud, solicitudController.crear);
router.put('/:id', validarSolicitud, solicitudController.actualizar);
router.delete('/:id', solicitudController.eliminar);

export default router;