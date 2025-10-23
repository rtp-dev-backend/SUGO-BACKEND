import { Router } from 'express';
import { cargarRolCompleto } from '../controllers/guardarRolCompleto.controller';

const router = Router();

// Ruta para carga completa de roles
router.post('/carga-completa', cargarRolCompleto);

export default router;
