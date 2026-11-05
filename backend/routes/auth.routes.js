import { Router } from 'express';
import { iniciarSesion, registrar } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/manejoErrores.js';

const router = Router();
router.post('/registro', asyncHandler(registrar));
router.post('/login', asyncHandler(iniciarSesion));

export default router;