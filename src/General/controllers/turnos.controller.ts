import { Request, Response } from "express";
import { obtenerTurnos } from "../services/turnos.sevice";

export const turnos = async (req: Request, res: Response) => {
  try {
    const turnos = await obtenerTurnos();
    res.status(200).json(turnos);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
