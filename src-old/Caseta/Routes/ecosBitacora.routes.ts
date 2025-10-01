import Router from 'express'
import { getEcosBitacora, postEcoRecepcion, postEcoDespacho, getEcosBitacoraMotivos } from '../Controllers/ecosBitacora.controllers';
import validatorHandler from '../../middleware/validatorHandleJoi.middleware';
import { ValidarEcoBitacoraIn, ValidarEcoBitacoraOut, ValidarGetSince } from '../Middleware/ecoBitacora_POST.joi';

const router = Router();


router.get('/api/caseta/ecosBitacora',      
    // validatorHandler(ValidarGetSince, 'query'), 
    getEcosBitacora 
);
router.get('/api/caseta/ecosBitacora/motivos',      getEcosBitacoraMotivos);   
router.post('/api/caseta/ecosBitacora/out', validatorHandler(ValidarEcoBitacoraOut, 'body'), postEcoDespacho );
router.post('/api/caseta/ecosBitacora/in',  validatorHandler(ValidarEcoBitacoraIn, 'body'), postEcoRecepcion );



export default router;