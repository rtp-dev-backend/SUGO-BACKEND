import { Motivos } from "../Models/Catalogos_motivos.models";

export async function obtenerMotivos() {
  return await Motivos.findAll();
}
