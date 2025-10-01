import Router from 'express'

import{ 
    deleteModulo, 
    getModulo, 
    getModulos, 
    postModulo, 
    putModulo 
} from '../controllers/Catalogo_Modulos.controller.js'
import { validtMod } from '../Middlewares/Catalogo_modulos.middleware.js';
const router = Router();

router.get('/api/modulos',       getModulos)
router.get('/api/modulos/:id',   getModulo)
router.post('/api/modulos',      validtMod, postModulo)
router.put('/api/modulos',       putModulo)
router.delete('/api/modulos/:id',deleteModulo)


export default router;