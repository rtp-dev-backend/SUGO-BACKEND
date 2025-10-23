import { Router } from 'express';
import { descargarPlantilla } from '../controllers/descargarPlantilla.controller';

const router = Router();

// Ruta compatible con el frontend
router.get('/plantilla', descargarPlantilla);

export default router;
