import Router from 'express'
import { getEcosStatus } from "../controllers/economicos.controllers"
import { getTrabajadores, getTrabajadoresConIncapacidad } from '../controllers/trabajadores.controllers';
import { getConsultaRuta, getModalidades } from '../controllers/Consultas_rutas.controllers';
// import {  GetTarjeta_operador } from '../controllers/tarjeta_operador.controllers';
import { ValidarTarjeta_Oper, } from '../../PetecionesSwap/middlewares/Tarjeta_Operador/valtarjetas_operador.middlewares';

const router = Router();

router.get('/hi/swap', (req, res)=> res.send({msg: 'Si funciona!!!!'}) );
router.get('/api/swap/ecos/estado',     getEcosStatus );
router.get('/api/swap/operadores',       getTrabajadores );
router.get('/api/swap/incapacidad',     getTrabajadoresConIncapacidad );
router.get('/api/swap/rutas',           getConsultaRuta);
router.get('/api/swap/modalidades',           getModalidades);
// router.get('/api/swap/tarjeta_operador' ,ValidarTarjeta_Oper, GetTarjeta_operador)



export default router;