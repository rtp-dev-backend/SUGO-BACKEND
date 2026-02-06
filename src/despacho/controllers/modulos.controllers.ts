import { Request, Response } from "express";
import { obtenerModulos } from "../services/modulos.services";

export const ModulosController = async (req: Request, res: Response) => {
  try {
    const modulos = await obtenerModulos();
    res.status(200).json(modulos);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
