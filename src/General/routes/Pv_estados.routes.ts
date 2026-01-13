import { Router } from "express";
import { pv_estados } from "../controllers/Pv_estados.controller.js";

const router = Router();

// Obtener todas las rutas
router.get("/", pv_estados);

export default router;
