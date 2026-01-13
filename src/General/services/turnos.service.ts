import { Turno } from "../models/turnos.model";

export async function obtenerTurnos() {
  return await Turno.findAll();
}
