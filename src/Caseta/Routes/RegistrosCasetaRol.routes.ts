import { Router } from "express";
import { getCasetaRegistros } from "../Controllers/CasetaRol.controller";

const router = Router();

// Endpoint para consultar registros de caseta por rango de fechas, eco y operador
router.post("/registros", getCasetaRegistros);

export default router;
