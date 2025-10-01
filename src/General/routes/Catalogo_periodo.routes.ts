import Router from 'express'
import {
    getPeriodo,
    postPerido,
    deletePerido,
    getPeriodos,
    postPeriodosAll,
    getPerido,
}
from '../../General/controllers/Catalo_periodo.controller'
import { validarPeriodo } from '../Middlewares/Catalogo_periodo.middleware';


const router = Router();
router.get('/hi/ruta/perido', (req, res) => res.send({ msg: 'Conexion establecida!!!!' }));

router.get('/api/periodos',         getPeriodos)
router.get('/api/peridos',          getPerido)
router.get('/api/periodos/:id',     getPeriodo)
router.post('/api/periodos',        validarPeriodo, postPerido)
router.post('/api/periodosAll',     postPeriodosAll)

// router.put('/api/modulo',     )
router.delete('/api/periodos/:id', deletePerido)



export default router;