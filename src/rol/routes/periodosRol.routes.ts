/**
 * Rutas para PeriodosRol
 *
 * GET /         - Lista todos los periodos de rol
 */
import { Router } from 'express';
import { getPeriodos } from '../controllers/periodosRol.controller';

const router = Router();

router.get('/', getPeriodos);

export default router;