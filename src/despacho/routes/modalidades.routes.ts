import { Router } from "express";
import { ModalidadesController } from "../controllers/modalidades.controllers";

const router = Router();
router.get("/", ModalidadesController);
export default router;
