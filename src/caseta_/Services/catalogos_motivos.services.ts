import { Motivos } from "../Models/Catalogos_motivos.models";

export async function obtenerMotivos() {
  return await Motivos.findAll({
    where: {
      tipo: 1, // Solo obtener motivos de tipo 1
    },
  });
}
