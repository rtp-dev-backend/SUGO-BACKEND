import { Request, Response } from "express";
import { pv_estados } from "../../Caseta/Models/pv_estados.model";

export const crearEstadoPrueba = async (req: Request, res: Response) => {
  try {
    const datosPrueba = {
      eco: 1710,
      momento: new Date().toISOString(),
      tipo: 1,
      motivo_id: 2,
      modulo: 1,
      ruta: "RUTA 1",
      ruta_modalidad: "MODALIDAD 1",
      op_cred: 12728,
      op_turno: 1,
      extintor: 1,
      estatus: 1,
      modulo_puerta: "Modulo 1",
      eco_estatus: 1,
      createdBy: 1,
      createdBy_modulo: 1,
      // Agrega los campos que necesites según tu modelo
    };
    const nuevo = await pv_estados.create(datosPrueba);
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
