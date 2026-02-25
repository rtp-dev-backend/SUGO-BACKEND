import Router from "express";
import { crearEstadoPrueba } from "../controllers/pvEstadosPrueba.controllers";

const router = Router();

router.post("/pv-estados/prueba", crearEstadoPrueba);

export default router;
