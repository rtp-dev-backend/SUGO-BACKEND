import { Router } from 'express';
import { turnos  } from '../controllers/turnos.controller';

const router = Router();

// Obtener todas las rutas
router.post('/', turnos);

export default router;
