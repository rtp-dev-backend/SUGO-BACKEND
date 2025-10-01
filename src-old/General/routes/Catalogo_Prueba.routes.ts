import Router from 'express'
import {
    getPrueba,
    getPruebas,
    postPruebas
}
    from '../../General/controllers/Catalogo_Pruebas.controller'


const router = Router();
router.get('/api/pruebap/hi', (req, res) => res.send({ msg: 'Conexion establecida!!!!' }));
router.get('/api/pruebap', getPruebas)
router.get('/api/pruebap/:id', getPrueba)
router.post('/api/pruebap', postPruebas)


export default router;