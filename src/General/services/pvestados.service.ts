import { Pv_estados } from "../models/Pv_estados.model.js";

export async function obtenerPvEstados() {
  return await Pv_estados.findAll({
    where: { op_turno: 1 },
    order: [["momento", "DESC"]],
    limit: 100,
  });
}
