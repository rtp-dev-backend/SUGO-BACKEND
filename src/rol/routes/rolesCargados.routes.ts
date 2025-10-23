import { Router } from 'express';
import { rolesPorPeriodo } from '../controllers/roles.controller';

const router = Router();

// POST /roles -> recibe { periodoId } y devuelve roles
router.post('/roles', rolesPorPeriodo);

export default router;
