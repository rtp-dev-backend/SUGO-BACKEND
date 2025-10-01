import Router from 'express'
import { getTrabInfo } from '../controllers/view_trabajador.controller';


const router = Router();
// router.get('/api/rutas',     getTrabs);
router.get('/api/trab/:cred',   getTrabInfo);

export default router;