import Router from 'express'

import {
    Ruta_modalidad,
    deleteRuta_autorizada,
    getRuta_autorizada,
    getRutas_autorizadas,
    postRutas,
} from '../controllers/rutas_autorizadas.controller';
import validatorHandler from '../../middleware/validatorHandleJoi.middleware';
import { schemaPostRutas } from '../Middlewares/rutas.joi';




const router = Router();

router.get('/api/hi', (req, res) => res.send({ msg: 'Conexion establecida!' }));

router.get('/api/rutas',            getRutas_autorizadas);
router.get('/api/rutas/:id',        getRuta_autorizada);
router.post('/api/rutasAll',        validatorHandler( schemaPostRutas, 'body' ), postRutas);
router.delete('/api/rutas/:id',     deleteRuta_autorizada);
router.post('/api/rutas',           Ruta_modalidad);


export default router;