import { Router } from 'express'
import {
    deleteRol_headers,
    getRol_header,
    getRol_headers,
    postRol_headers
} from '../../Rol/controllers/Rol_headers.controller';

const router = Router()

router.get('/api/header/hi', (req, res) => res.send({ msg: 'si funciona indica que existe una correcta conexion de los routes' }));

router.get('/api/rol/headers',         getRol_headers)
router.get('/api/rol/headers/:id',     getRol_header)
router.post('/api/rol/headers',        postRol_headers)
// Delete header y calendarios con id_header
router.delete('/api/rol/headers/:id',     deleteRol_headers)

export default router;