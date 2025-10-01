import { Router } from 'express'
import { 
    getRol_jornada, 
    getRol_jornadas, 
    postRol_jornada, 
    post_manyRol_jornadas
} from '../controllers/Rol_jornadas.controller';


const router = Router()

router.get('/api/jornadas/hi', (req, res) => res.send({ msg: 'si funciona /api/jornadas indica que existe una correcta conexion de los routes' }));

router.get('/api/rol/jornadas',     getRol_jornadas)
router.get('/api/rol/jornadas/:id', getRol_jornada)
router.post('/api/rol/jornadas',    postRol_jornada)
router.post('/api/rol/manyjornadas',post_manyRol_jornadas)

export default router;