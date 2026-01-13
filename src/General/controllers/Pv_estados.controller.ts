import { Request, Response } from "express";
import { obtenerPvEstados } from "../services/pvestados.service.js";

export const pv_estados = async (req: Request, res: Response) => {
  try {
    const estados = await obtenerPvEstados();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
