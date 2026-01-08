import { Request, Response } from "express";
import { obtenerMotivos } from "../Services/catalogos_motivos.services";

export const Motivos = async (req: Request, res: Response) => {
  try {
    const motivos = await obtenerMotivos();
    res.status(200).json(motivos);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
