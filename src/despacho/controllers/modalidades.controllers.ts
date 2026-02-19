import { Request, Response } from "express";
import { obtenerModalidades } from "../services/modalidades.services";

export const ModalidadesController = async (req: Request, res: Response) => {
  try {
    const modalidades = await obtenerModalidades();
    res.status(200).json(modalidades);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
