import { Roles } from '../models/roles.model';
import { Servicios } from '../models/servicios.model';
import { OperadoresServicio } from '../models/operadoresServicio.model';
import { Horarios } from '../models/horarios.model';
import { Cubredescansos } from '../models/cubredescansos.model';
import { CubredescansosTurnos } from '../models/cubredescansosTurnos.model';
import { JornadasExcepcionales } from '../models/jornadasExcepcionales.model';
import { CargasArchivosRol } from '../models/cargasArchivosRol.model';
import { Rutas } from '../../General/models/rutas.model';

export async function obtenerRolesPorPeriodo(periodoId: number) {
  if (periodoId === undefined || periodoId === null || Number.isNaN(Number(periodoId))) {
    throw new Error('periodoId inválido');
  }

  const roles = await Roles.findAll({
    where: { periodo: periodoId },
    include: [
      { model: CargasArchivosRol, required: false },
      { model: Rutas, required: false },
      {
        model: Servicios,
        required: false,
        include: [
          { model: OperadoresServicio, required: false },
          { model: Horarios, required: false },
        ],
      },
      {
        model: Cubredescansos,
        required: false,
        include: [
          { model: CubredescansosTurnos, required: false },
        ],
      },
      { model: JornadasExcepcionales, required: false },
    ],
    order: [['id', 'ASC']],
  });

  return roles;
}
