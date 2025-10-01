import Router from 'express'
import validatorHandler from '../../middleware/validatorHandleJoi.middleware';
import { createNewEstadoForEco, getEstadoDelPV, } from '../Controllers/pvEstado.controllers';
import { ValidarnewEcoEstado } from '../Middleware/newEstadoForEco_POST.joi';
import { createMotivo, createNewEstado, createNewTopEstado, deleteEstado, deleteMotivo, getEstados, getModulosSWAP, getMotivos, viewPVController } from '../Controllers/pvEstados.controllers';
import { ValidarEliminarRegistro, ValidarNewEstado, ValidarNewMotivo, ValidarViewPV } from '../Middleware/pvEstados.joi';

const router = Router();


router.get('/pv-estados/hi',              (req, res)=> { res.send({ msg: 'updated 08/05/2024 15:55' }) });

router.get('/pv-estados/motivos',         getMotivos);
router.post('/pv-estados/motivos',        validatorHandler(ValidarNewMotivo, 'body'), createMotivo);
router.delete('/pv-estados/motivos/:id',  validatorHandler(ValidarEliminarRegistro, 'query'), deleteMotivo);
// ToDo:  router.patch('/pv-estados/motivos/:id',   validatorHandler(ValidarNewMotivo, 'body'), createMotivo);

router.get('/pv-estados/modulos',   getModulosSWAP); 

router.get('/pv-estados',           getEstados);
router.delete('/pv-estados/:id',    validatorHandler(ValidarEliminarRegistro, 'query'), deleteEstado);
router.post('/pv-estados',          validatorHandler(ValidarNewEstado, 'body'), createNewEstado);
router.post('/pv-estados/viewPV', validatorHandler(ValidarViewPV, 'body'), viewPVController); // Nueva ruta para consultar el Parque Vehicular

// Old
router.get('/pv-estado/modulos',    getModulosSWAP);   
router.get('/pv-estado',            getEstadoDelPV);   
router.post('/pv-estado',     
    validatorHandler(ValidarnewEcoEstado, 'body'), 
    createNewEstadoForEco
);


export default router;