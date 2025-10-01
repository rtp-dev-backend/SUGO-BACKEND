import Router from 'express'

import {
    deletemodalidad_autorizada,
    getmodalidad_autorizada,
    getmodalidades_autorizada,
    postModalidades,
    postmodalidad_autorizada,
    putmodalidad_autorizada
}
    from '../controllers/modalidad_autorizada.controller';



const router = Router();


router.get('/hi/autorizado', (req, res) => res.send({ msg: 'Conexion establecida!!!!' }));

router.get('/api/modalidad', getmodalidad_autorizada);
router.get('/api/modalidad/:id', getmodalidades_autorizada);
router.post('/api/modalidad', postmodalidad_autorizada);
router.post('/api/modalidadAll', postModalidades);
router.put('/api/modalidad/:id', putmodalidad_autorizada);
router.delete('/api/modalidad/:id', deletemodalidad_autorizada);


export default router;

