import { Modalidades } from "../models/modalidades.models";

export async function obtenerModalidades() {
  return await Modalidades.findAll();
}

