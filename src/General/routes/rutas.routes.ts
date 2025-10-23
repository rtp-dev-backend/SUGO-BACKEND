import { Router } from 'express';
import { getAllRutas, getRutaByString } from '../controllers/rutas.controller';

const router = Router();

// Obtener todas las rutas
router.get('/', getAllRutas);

// Buscar una ruta por su nombre (string)
router.get('/Rutas/:ruta', getRutaByString);

export default router;
