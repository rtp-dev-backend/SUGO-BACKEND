import { Router } from 'express';
import { getCumpli, getCumpliOp } from '../controllers/Rol_modulo.controller';
import validatorHandler from '../../middleware/validatorHandleJoi.middleware';
import { ValidarOpCreds, ValidarTarjetaOp } from '../middleware/rol_cumpli_POST.joi';


const router = Router();


router.get( "/api/cumpli/rol/hi",        (req, res)=> res.send({msg: 'Hiiii'}) );


router.post("/api/cumpli/rol",          validatorHandler(ValidarTarjetaOp, 'body'), getCumpli);
router.post("/api/cumpli/op",           validatorHandler(ValidarOpCreds, 'body'),   getCumpliOp);



export default router;