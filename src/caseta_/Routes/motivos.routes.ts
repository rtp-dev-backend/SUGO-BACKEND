import { Router } from "express";
import { Motivos } from "../Controllers/Catalogo_motivos.controller";

const router = Router();

router.get("/", Motivos);
router.post("/", Motivos);

export default router;
