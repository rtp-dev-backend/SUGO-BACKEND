import { Router } from "express";
import { ModulosController } from "../controllers/modulos.controllers";

const router = Router();
router.get("/", ModulosController);
export default router;

// integrar en app.ts
