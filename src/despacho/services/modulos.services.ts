import { Modulos } from "../models/modulos.models";

export async function obtenerModulos() {
  return await Modulos.findAll();
}
